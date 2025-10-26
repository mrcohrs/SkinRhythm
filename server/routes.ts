import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { setupLocalAuth } from "./localAuth";
import { parseExcelFile, getRoutineForAnswers } from "./parseExcel";
import { resolveRoutineProducts, resolveSavedRoutineProducts } from "./routineResolver";
import { quizAnswersSchema } from "@shared/schema";
import "./productAlternatives"; // Load product alternatives CSV
import { 
  getQuizResultsCards, 
  getMyProductsCards, 
  getCurrentBanner, 
  recordCardAction,
  type CardId,
  type BannerId 
} from "./cardVisibility";
import Stripe from 'stripe';
import { STRIPE_PRICE_IDS, PRODUCT_DETAILS } from './stripe-config';
import express from 'express';
import { generateRoutinePDF } from './pdfGenerator';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-11-20.acacia' as any });

parseExcelFile();

// Export webhook handler to be registered BEFORE express.json()
export function registerWebhook(app: Express): void {
  // Stripe Webhook Handler - MUST be registered before express.json()
  app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req: any, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return res.status(500).json({ message: "Webhook secret not configured" });
    }
    
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed:`, err.message);
      return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }
    
    try {
      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const productType = session.metadata?.productType;
          const isFoundingRate = session.metadata?.isFoundingRate === 'true';
          
          if (!userId || !productType) {
            console.error("Missing metadata in checkout session:", session.id);
            break;
          }
          
          // Check for founding rate idempotency BEFORE recording purchase
          let shouldIncrementFoundingCounter = false;
          if (isFoundingRate && productType === 'premium_subscription') {
            const existingPurchases = await storage.getUserPurchases(userId);
            const hasExistingFoundingPurchase = existingPurchases.some(p => p.isFoundingRate === true);
            shouldIncrementFoundingCounter = !hasExistingFoundingPurchase;
          }
          
          // Record purchase
          const purchase = await storage.recordPurchase({
            userId,
            productType,
            stripePaymentIntentId: session.payment_intent as string || session.id,
            amount: ((session.amount_total || 0) / 100).toString(),
            isFoundingRate,
          });
          
          // Grant access based on product type
          if (productType === 'premium_subscription') {
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);
            await storage.updateMembership(userId, 'premium', expiresAt, isFoundingRate);
            if (session.subscription) {
              await storage.updateStripeSubscription(userId, session.subscription as string);
            }
            if (shouldIncrementFoundingCounter) {
              await storage.incrementFoundingRateCounter();
            }
          } else if (productType === 'scan_pack_5') {
            await storage.addScanCredits(userId, 5);
          } else if (productType === 'scan_pack_20') {
            await storage.addScanCredits(userId, 20);
          } else if (productType === 'unlimited_scanner') {
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1);
            await storage.setUnlimitedScans(userId, expiresAt);
            if (session.subscription) {
              await storage.updateStripeSubscription(userId, session.subscription as string);
            }
          } else if (productType === 'premium_routine_access') {
            let currentRoutineId: string | null = null;
            try {
              const userRoutines = await storage.getUserRoutines(userId);
              currentRoutineId = userRoutines.find(r => r.isCurrent)?.id || null;
            } catch (error) {
              console.log(`[Webhook] Could not fetch user routines for premium access grant, proceeding with null routineId:`, error);
            }
            await storage.grantPremiumRoutineAccess(userId, currentRoutineId);
          } else if (productType === 'detailed_pdf') {
            await storage.grantDetailedPdfAccess(userId);
            
            // Save routine snapshot with PDF purchase
            try {
              const currentRoutine = await storage.getCurrentRoutine(userId);
              if (currentRoutine) {
                await storage.savePdfPurchase({
                  userId,
                  purchaseId: purchase.id,
                  skinType: currentRoutine.skinType,
                  fitzpatrickType: currentRoutine.fitzpatrickType,
                  acneTypes: currentRoutine.acneTypes,
                  acneSeverity: currentRoutine.acneSeverity,
                  isPregnantOrNursing: currentRoutine.isPregnantOrNursing,
                  routineData: currentRoutine.routineData,
                });
                console.log(`[Webhook] Saved PDF purchase snapshot for user ${userId}`);
              } else {
                console.log(`[Webhook] No current routine found for PDF purchase snapshot for user ${userId}`);
              }
            } catch (error) {
              console.error(`[Webhook] Error saving PDF purchase snapshot:`, error);
            }
          }
          
          console.log(`[Webhook] Successfully processed checkout.session.completed for user ${userId}, product ${productType}`);
          break;
        }
        
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          const customer = subscription.customer as string;
          console.log(`[Webhook] Subscription updated for customer ${customer}:`, subscription.status);
          
          // Handle subscription status changes
          const user = await storage.getUserByStripeCustomerId(customer);
          if (user && (subscription.status === 'canceled' || subscription.status === 'unpaid' || subscription.status === 'incomplete_expired')) {
            // Revoke membership access when subscription becomes inactive
            await storage.revokeMembership(user.id);
            console.log(`[Webhook] Revoked membership for user ${user.id} due to subscription status: ${subscription.status}`);
          }
          break;
        }
        
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const customer = subscription.customer as string;
          console.log(`[Webhook] Subscription deleted for customer ${customer}`);
          
          // Revoke membership access
          const user = await storage.getUserByStripeCustomerId(customer);
          if (user) {
            await storage.revokeMembership(user.id);
            console.log(`[Webhook] Revoked membership for user ${user.id} on subscription deletion`);
          }
          break;
        }
        
        default:
          console.log(`[Webhook] Unhandled event type: ${event.type}`);
      }
      
      res.json({ received: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);
  setupLocalAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/quiz/submit', async (req: any, res) => {
    try {
      const validatedAnswers = quizAnswersSchema.parse(req.body);
      
      // Check if user is authenticated and premium
      let isPremiumUser = false;
      if (req.user && req.user.claims && req.user.claims.sub) {
        try {
          const user = await storage.getUser(req.user.claims.sub);
          isPremiumUser = user?.isPremium || user?.hasPremiumRoutineAccess || false;
          console.log(`[Quiz Submit] User ${req.user.claims.sub} - isPremium: ${user?.isPremium}, hasPremiumRoutineAccess: ${user?.hasPremiumRoutineAccess}, will get premiumOptions: ${isPremiumUser}`);
        } catch (e) {
          console.log(`[Quiz Submit] Error getting user, treating as non-premium:`, e);
        }
      } else {
        console.log(`[Quiz Submit] No authenticated user, treating as non-premium`);
      }
      
      const routine = getRoutineForAnswers({
        skinType: validatedAnswers.skinType,
        fitzpatrickType: validatedAnswers.fitzpatrickType,
        acneTypes: validatedAnswers.acneTypes,
        acneSeverity: validatedAnswers.acneSeverity,
        isPregnantOrNursing: validatedAnswers.isPregnantOrNursing,
        age: validatedAnswers.age,
        isPremiumUser,
      });

      if (!routine) {
        return res.status(404).json({ message: "No routine found for your answers" });
      }

      // Resolve product IDs to full product objects
      const userId = req.user?.claims?.sub;
      const resolvedRoutine = await resolveRoutineProducts(routine, isPremiumUser, userId);

      // Log if premiumOptions are in the response
      const hasPremiumOptions = resolvedRoutine.products!.morning.some((p: any) => p.premiumOptions?.length > 0) || 
                                resolvedRoutine.products!.evening.some((p: any) => p.premiumOptions?.length > 0);
      console.log(`[Quiz Submit] Routine has premiumOptions: ${hasPremiumOptions}`);
      console.log(`[Quiz Submit] Resolved routine has routineType: ${resolvedRoutine.routineType}`);

      res.json({
        routine: resolvedRoutine,
        answers: validatedAnswers,
      });
    } catch (error) {
      console.error("Quiz submission error:", error);
      res.status(400).json({ message: "Invalid quiz answers" });
    }
  });

  app.post('/api/routines/save', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { name, age, skinType, fitzpatrickType, acneTypes, acneSeverity, isPregnantOrNursing, routineData } = req.body;

      console.log(`[Save Routine] Received routineData has routineType: ${routineData?.routineType}`);
      console.log(`[Save Routine] routineData keys:`, Object.keys(routineData || {}));

      // Normalize productIds to flat array if it's in legacy {morning, evening} structure
      let normalizedRoutineData = routineData;
      if (routineData?.productIds && typeof routineData.productIds === 'object' && 'morning' in routineData.productIds) {
        const morningIds = routineData.productIds.morning || [];
        const eveningIds = routineData.productIds.evening || [];
        const flatProductIds = Array.from(new Set([...morningIds, ...eveningIds]));
        normalizedRoutineData = {
          ...routineData,
          productIds: flatProductIds,
        };
        console.log(`[Save Routine] Normalized legacy productIds to flat array:`, flatProductIds);
      }

      const savedRoutine = await storage.saveRoutine({
        userId,
        name,
        age,
        skinType,
        fitzpatrickType,
        acneTypes,
        acneSeverity,
        isPregnantOrNursing,
        routineData: normalizedRoutineData,
      });

      res.json(savedRoutine);
    } catch (error) {
      console.error("Error saving routine:", error);
      res.status(500).json({ message: "Failed to save routine" });
    }
  });

  app.get('/api/routines', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userRoutines = await storage.getUserRoutines(userId);
      
      // Get user's premium status
      let isPremiumUser = false;
      try {
        const user = await storage.getUser(userId);
        isPremiumUser = user?.isPremium || user?.hasPremiumRoutineAccess || false;
      } catch (e) {
        console.log(`[Routines] Error getting user, treating as non-premium:`, e);
      }
      
      // Resolve all products from centralized library and recalculate routineType
      const resolvedRoutines = await Promise.all(userRoutines.map(async routine => ({
        ...routine,
        routineData: await resolveSavedRoutineProducts(
          routine.routineData, 
          isPremiumUser,
          routine.acneTypes,
          routine.acneSeverity,
          userId
        ),
      })));
      
      res.json(resolvedRoutines);
    } catch (error) {
      console.error("Error fetching routines:", error);
      res.status(500).json({ message: "Failed to fetch routines" });
    }
  });

  app.get('/api/routines/current', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentRoutine = await storage.getCurrentRoutine(userId);
      if (!currentRoutine) {
        return res.status(404).json({ message: "No current routine found" });
      }
      
      // Get user's premium status (includes one-time premium routine access)
      let isPremiumUser = false;
      try {
        const user = await storage.getUser(userId);
        isPremiumUser = user?.isPremium || user?.hasPremiumRoutineAccess || false;
      } catch (e) {
        console.log(`[Current Routine] Error getting user, treating as non-premium:`, e);
      }
      
      // Resolve all products from centralized library and recalculate routineType
      const resolvedRoutine = {
        ...currentRoutine,
        routineData: await resolveSavedRoutineProducts(
          currentRoutine.routineData, 
          isPremiumUser,
          currentRoutine.acneTypes,
          currentRoutine.acneSeverity,
          userId
        ),
      };
      
      res.json(resolvedRoutine);
    } catch (error) {
      console.error("Error fetching current routine:", error);
      res.status(500).json({ message: "Failed to fetch current routine" });
    }
  });

  app.get('/api/routines/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const routine = await storage.getRoutineById(userId, id);
      
      if (!routine) {
        return res.status(404).json({ message: "Routine not found" });
      }
      
      // Get user's premium status (includes one-time premium routine access)
      let isPremiumUser = false;
      try {
        const user = await storage.getUser(userId);
        isPremiumUser = user?.isPremium || user?.hasPremiumRoutineAccess || false;
      } catch (e) {
        console.log(`[Get Routine] Error getting user, treating as non-premium:`, e);
      }
      
      // Resolve all products from centralized library with current routineMode
      const resolvedRoutine = {
        ...routine,
        routineData: await resolveSavedRoutineProducts(
          routine.routineData, 
          isPremiumUser,
          routine.acneTypes,
          routine.acneSeverity,
          userId
        ),
      };
      
      res.json(resolvedRoutine);
    } catch (error) {
      console.error("Error fetching routine:", error);
      res.status(500).json({ message: "Failed to fetch routine" });
    }
  });

  app.post('/api/routines/:id/set-current', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const updatedRoutine = await storage.setCurrentRoutine(userId, id);
      res.json(updatedRoutine);
    } catch (error: any) {
      console.error("Error setting current routine:", error);
      if (error.message === "Routine not found or access denied") {
        return res.status(404).json({ message: "Routine not found" });
      }
      res.status(500).json({ message: "Failed to set current routine" });
    }
  });

  app.get('/api/routines/pdf/download', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Check if user has access to detailed PDF
      const hasAccess = user?.isPremium || user?.hasDetailedPdfAccess || false;
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Purchase the Detailed Routine PDF to download" });
      }
      
      // Get current routine
      const currentRoutine = await storage.getCurrentRoutine(userId);
      if (!currentRoutine) {
        return res.status(404).json({ message: "No current routine found" });
      }
      
      // Resolve products for the PDF - check both full premium AND one-time premium routine access
      const isPremiumUser = user?.isPremium || user?.hasPremiumRoutineAccess || false;
      const resolvedRoutine = {
        ...currentRoutine,
        routineData: await resolveSavedRoutineProducts(
          currentRoutine.routineData, 
          isPremiumUser,
          currentRoutine.acneTypes,
          currentRoutine.acneSeverity,
          userId
        ),
      };
      
      // Generate PDF
      const doc = generateRoutinePDF({
        routine: resolvedRoutine,
        userFirstName: user?.firstName || 'User'
      });
      
      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="AcneAgent-Routine-${Date.now()}.pdf"`);
      
      // Pipe the PDF to the response
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  app.post('/api/routines/:id/set-product', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { category, productName } = req.body;
      
      if (!category || !productName) {
        return res.status(400).json({ message: "Category and productName are required" });
      }
      
      const updatedRoutine = await storage.setCurrentProduct(userId, id, category, productName);
      
      // Get user's premium status for proper resolution (includes one-time premium routine access)
      let isPremiumUser = false;
      try {
        const user = await storage.getUser(userId);
        isPremiumUser = user?.isPremium || user?.hasPremiumRoutineAccess || false;
      } catch (e) {
        console.log(`[Set Product] Error getting user, treating as non-premium:`, e);
      }
      
      // Resolve all products from centralized library
      const resolvedRoutine = {
        ...updatedRoutine,
        routineData: await resolveSavedRoutineProducts(
          updatedRoutine.routineData, 
          isPremiumUser,
          updatedRoutine.acneTypes,
          updatedRoutine.acneSeverity,
          userId
        ),
      };
      
      res.json(resolvedRoutine);
    } catch (error: any) {
      console.error("Error setting current product:", error);
      if (error.message === "Routine not found or access denied") {
        return res.status(404).json({ message: "Routine not found" });
      }
      res.status(500).json({ message: "Failed to set current product" });
    }
  });

  app.post('/api/routines/:id/add-note', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { text } = req.body;
      
      if (!text || !text.trim()) {
        return res.status(400).json({ message: "Note text is required" });
      }
      
      const updatedRoutine = await storage.addRoutineNote(userId, id, text.trim());
      res.json(updatedRoutine);
    } catch (error: any) {
      console.error("Error adding note:", error);
      if (error.message === "Routine not found or access denied") {
        return res.status(404).json({ message: "Routine not found" });
      }
      res.status(500).json({ message: "Failed to add note" });
    }
  });

  app.delete('/api/routines/:id/notes/:noteId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id, noteId } = req.params;
      
      const updatedRoutine = await storage.deleteRoutineNote(userId, id, noteId);
      res.json(updatedRoutine);
    } catch (error: any) {
      console.error("Error deleting note:", error);
      if (error.message === "Routine not found or access denied") {
        return res.status(404).json({ message: "Routine not found" });
      }
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Product selection endpoints
  app.get('/api/product-selections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const selections = await storage.getUserProductSelections(userId);
      res.json(selections);
    } catch (error) {
      console.error("Error fetching product selections:", error);
      res.status(500).json({ message: "Failed to fetch product selections" });
    }
  });

  app.post('/api/product-selections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { productId, productName } = req.body;
      
      if (!productId || !productName) {
        return res.status(400).json({ message: "productId and productName are required" });
      }
      
      const selection = await storage.setUserProductSelection(userId, productId, productName);
      res.json(selection);
    } catch (error) {
      console.error("Error setting product selection:", error);
      res.status(500).json({ message: "Failed to set product selection" });
    }
  });

  // Consent endpoints
  app.post('/api/user/consent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { dataCollectionConsent, aiTrainingConsent } = req.body;
      
      const consentVersion = "1.0"; // Track consent version for future updates
      
      const updatedUser = await storage.updateUserConsent(
        userId,
        dataCollectionConsent,
        aiTrainingConsent,
        consentVersion
      );
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating consent:", error);
      res.status(500).json({ message: "Failed to update consent" });
    }
  });

  app.get('/api/user/consent', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        dataCollectionConsent: user.dataCollectionConsent,
        aiTrainingConsent: user.aiTrainingConsent,
        consentDate: user.consentDate,
        consentVersion: user.consentVersion,
      });
    } catch (error) {
      console.error("Error fetching consent:", error);
      res.status(500).json({ message: "Failed to fetch consent" });
    }
  });

  // Routine mode preference endpoint
  app.post('/api/user/routine-mode', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { routineMode } = req.body;
      
      if (!routineMode || !['basic', 'premium'].includes(routineMode)) {
        return res.status(400).json({ message: "Invalid routine mode. Must be 'basic' or 'premium'" });
      }
      
      await storage.updateRoutineMode(userId, routineMode);
      
      // Return sanitized response (no sensitive data)
      res.json({ 
        success: true, 
        routineMode 
      });
    } catch (error) {
      console.error("Error updating routine mode:", error);
      res.status(500).json({ message: "Failed to update routine mode" });
    }
  });

  // Scan tracking endpoint
  app.post('/api/user/scan', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user is premium or has unlimited scans
      const membershipActive = !user.membershipExpiresAt || new Date(user.membershipExpiresAt) > new Date();
      const isPremium = (user.membershipTier === "premium" || user.membershipTier === "premium_plus") && membershipActive;
      
      if (isPremium) {
        // Premium users have unlimited scans, no need to track
        return res.json({ 
          success: true, 
          scansRemaining: "unlimited" 
        });
      }
      
      // Check if free user has scans remaining
      const FREE_TIER_SCANS = 3;
      const currentScans = user.scanCredits || 0;
      
      if (currentScans >= FREE_TIER_SCANS) {
        return res.status(403).json({ 
          message: "No scans remaining. Upgrade to Premium for unlimited scans.",
          scansRemaining: 0
        });
      }
      
      // Increment scan count
      await storage.incrementScanCount(userId);
      const scansRemaining = FREE_TIER_SCANS - (currentScans + 1);
      
      res.json({ 
        success: true, 
        scansRemaining 
      });
    } catch (error) {
      console.error("Error tracking scan:", error);
      res.status(500).json({ message: "Failed to track scan" });
    }
  });

  // Card visibility endpoints
  app.get('/api/cards/quiz-results', async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || null;
      const cards = await getQuizResultsCards(userId);
      res.json(cards);
    } catch (error) {
      console.error("Error fetching quiz results cards:", error);
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  app.get('/api/cards/my-products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cards = await getMyProductsCards(userId);
      res.json(cards);
    } catch (error) {
      console.error("Error fetching my products cards:", error);
      res.status(500).json({ message: "Failed to fetch cards" });
    }
  });

  app.post('/api/cards/interact', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { cardId, action } = req.body as { cardId: CardId; action: "viewed" | "clicked" | "dismissed" };
      
      if (!cardId || !action) {
        return res.status(400).json({ message: "Missing cardId or action" });
      }
      
      await recordCardAction(userId, cardId, action);
      res.json({ success: true });
    } catch (error) {
      console.error("Error recording card interaction:", error);
      res.status(500).json({ message: "Failed to record interaction" });
    }
  });

  // Product alternatives endpoint
  app.get('/api/products/alternatives/:category', isAuthenticated, async (req: any, res) => {
    try {
      const { category } = req.params;
      const userId = req.user.claims.sub;
      
      // Import product library dynamically
      const { PRODUCT_LIBRARY } = await import('@shared/productLibrary');
      
      // Get user's premium status
      let isPremiumUser = false;
      try {
        const user = await storage.getUser(userId);
        isPremiumUser = user?.isPremium || user?.hasPremiumRoutineAccess || false;
      } catch (e) {
        console.log(`[Product Alternatives] Error getting user, treating as non-premium:`, e);
      }
      
      // Filter products by category and include only those with alternatives
      const categoryProducts = Object.values(PRODUCT_LIBRARY)
        .filter(product => product.category === category)
        .filter(product => product.defaultProductLink && product.defaultProductName)
        .map(product => ({
          id: product.id,
          generalName: product.generalName,
          category: product.category,
          priceTier: product.priceTier,
          priceRange: product.priceRange,
          defaultProductLink: product.defaultProductLink,
          defaultProductName: product.defaultProductName,
          affiliateLink: product.affiliateLink,
          premiumOptions: isPremiumUser ? product.premiumOptions : undefined,
        }));
      
      res.json(categoryProducts);
    } catch (error) {
      console.error("Error fetching product alternatives:", error);
      res.status(500).json({ message: "Failed to fetch product alternatives" });
    }
  });

  // Banner endpoints
  app.get('/api/banners/current', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const banner = await getCurrentBanner(userId);
      res.json(banner);
    } catch (error) {
      console.error("Error fetching current banner:", error);
      res.status(500).json({ message: "Failed to fetch banner" });
    }
  });

  app.post('/api/banners/interact', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { bannerId, action } = req.body as { bannerId: BannerId; action: "viewed" | "clicked" | "dismissed" };
      
      if (!bannerId || !action) {
        return res.status(400).json({ message: "Missing bannerId or action" });
      }
      
      if (action === 'dismissed') {
        // Dismiss for 14 days as per requirements
        await storage.dismissBanner(userId, bannerId, 14);
      } else if (action === 'clicked') {
        // Track banner clicks
        await storage.trackBannerClick(userId, bannerId);
      } else if (action === 'viewed') {
        // Track banner views
        await storage.trackBannerView(userId, bannerId);
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error recording banner interaction:", error);
      res.status(500).json({ message: "Failed to record interaction" });
    }
  });

  // Stripe Payment Endpoints
  
  // 1. Create Checkout Session
  app.post('/api/payments/create-checkout', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { priceId, successUrl, cancelUrl } = req.body;
      
      if (!priceId) {
        return res.status(400).json({ message: "priceId is required" });
      }
      
      // Get price details from configuration
      const productDetails = PRODUCT_DETAILS[priceId as keyof typeof PRODUCT_DETAILS];
      
      if (!productDetails) {
        return res.status(400).json({ message: "Invalid priceId" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Determine actual price to use
      let finalPriceId = priceId;
      let isFoundingRate = false;
      
      // Check if this is a premium subscription and founding rate is active
      if (productDetails.type === 'premium_subscription' && !productDetails.isFoundingRate) {
        const foundingActive = await storage.isFoundingRateActive();
        if (foundingActive) {
          // Use founding rate price instead
          finalPriceId = STRIPE_PRICE_IDS.PREMIUM_FOUNDING;
          isFoundingRate = true;
        }
      }
      
      // Create or get Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          metadata: {
            userId: userId,
          },
        });
        stripeCustomerId = customer.id;
        await storage.updateStripeCustomer(userId, stripeCustomerId);
      }
      
      // Construct base URL for redirects
      // REPLIT_DOMAINS contains the public domain (may have multiple comma-separated)
      const replitDomain = process.env.REPLIT_DOMAINS?.split(',')[0]?.trim();
      const baseUrl = replitDomain
        ? `https://${replitDomain}`
        : 'http://localhost:5000';
      
      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        mode: productDetails.isSubscription ? 'subscription' : 'payment',
        line_items: [
          {
            price: finalPriceId,
            quantity: 1,
          },
        ],
        success_url: successUrl || `${baseUrl}/dashboard?payment=success`,
        cancel_url: cancelUrl || `${baseUrl}/pricing?payment=cancelled`,
        metadata: {
          userId: userId,
          productType: productDetails.type,
          isFoundingRate: isFoundingRate.toString(),
        },
      });
      
      res.json({
        sessionId: session.id,
        url: session.url,
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });
  
  // Note: Webhook handler is registered separately in index.ts before express.json()
  
  // Get Founding Rate Status
  app.get('/api/payments/founding-rate-status', async (req: any, res) => {
    try {
      const counter = await storage.getFoundingRateCounter();
      const FOUNDING_RATE_LIMIT = counter?.foundingRateLimit || 500;
      
      const purchaseCount = counter?.premiumFoundingPurchases || 0;
      const active = purchaseCount < FOUNDING_RATE_LIMIT;
      const purchasesRemaining = Math.max(0, FOUNDING_RATE_LIMIT - purchaseCount);
      
      res.json({
        active,
        purchasesRemaining,
      });
    } catch (error) {
      console.error("Error fetching founding rate status:", error);
      res.status(500).json({ message: "Failed to fetch founding rate status" });
    }
  });
  
  // 4. Get User Entitlements
  app.get('/api/user/entitlements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check membership status
      const membershipActive = !user.membershipExpiresAt || new Date(user.membershipExpiresAt) > new Date();
      const isPremium = (user.membershipTier === "premium" || user.membershipTier === "premium_plus") && membershipActive;
      
      // Check unlimited scans
      const unlimitedScansActive = user.unlimitedScannerExpiresAt && new Date(user.unlimitedScannerExpiresAt) > new Date();
      const hasUnlimitedScans = isPremium || unlimitedScansActive || false;
      
      // Get scan credits
      const scanCredits = user.scanCredits || 0;
      
      // Check premium routine access
      const hasPremiumRoutineAccess = user.hasPremiumRoutineAccess || false;
      const premiumRoutineAccessRoutineId = user.premiumRoutineAccessRoutineId || null;
      
      // Check detailed PDF access
      const hasDetailedPdfAccess = user.hasDetailedPdfAccess || false;
      
      // Get all purchased PDFs with their routine snapshots
      const pdfPurchases = await storage.getUserPdfPurchases(userId);
      
      res.json({
        isPremium,
        hasUnlimitedScans,
        scanCredits,
        hasPremiumRoutineAccess,
        premiumRoutineAccessRoutineId,
        hasDetailedPdfAccess,
        pdfPurchases: pdfPurchases.map(pdf => ({
          id: pdf.id,
          createdAt: pdf.createdAt,
          skinType: pdf.skinType,
          fitzpatrickType: pdf.fitzpatrickType,
          acneTypes: pdf.acneTypes,
          acneSeverity: pdf.acneSeverity,
          isPregnantOrNursing: pdf.isPregnantOrNursing,
          routineData: pdf.routineData,
        })),
        membershipTier: user.membershipTier,
        membershipExpiresAt: user.membershipExpiresAt,
        unlimitedScannerExpiresAt: user.unlimitedScannerExpiresAt,
        isFoundingMember: user.isFoundingMember || false,
      });
    } catch (error) {
      console.error("Error fetching user entitlements:", error);
      res.status(500).json({ message: "Failed to fetch entitlements" });
    }
  });

  // 5. Use a Scan Credit
  app.post('/api/scans/use-credit', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user has unlimited scans
      const unlimitedScansActive = user.unlimitedScannerExpiresAt && new Date(user.unlimitedScannerExpiresAt) > new Date();
      const isPremium = (user.membershipTier === "premium" || user.membershipTier === "premium_plus") && 
                       (!user.membershipExpiresAt || new Date(user.membershipExpiresAt) > new Date());
      const hasUnlimitedScans = isPremium || unlimitedScansActive;
      
      if (hasUnlimitedScans) {
        // Don't decrement credits for unlimited users
        return res.json({ success: true, unlimited: true });
      }
      
      // Use one scan credit
      const updatedUser = await storage.useScanCredit(userId);
      
      res.json({
        success: true,
        unlimited: false,
        remainingScans: updatedUser.scanCredits,
      });
    } catch (error: any) {
      console.error("Error using scan credit:", error);
      res.status(400).json({ message: error.message || "Failed to use scan credit" });
    }
  });

  // 6. Marketplace - Get all products with variants
  app.get('/api/marketplace', async (_req, res) => {
    try {
      const { PRODUCT_LIBRARY } = await import('@shared/productLibrary');
      
      // Convert product library to array and include all product data
      const products = Object.values(PRODUCT_LIBRARY).map(product => ({
        id: product.id,
        generalName: product.generalName,
        category: product.category,
        priceTier: product.priceTier,
        priceRange: product.priceRange,
        products: product.products || [],
      }));
      
      res.json({ products });
    } catch (error) {
      console.error("Error fetching marketplace products:", error);
      res.status(500).json({ message: "Failed to fetch marketplace products" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
