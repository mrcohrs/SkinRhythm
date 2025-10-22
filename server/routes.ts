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

parseExcelFile();

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
          isPremiumUser = user?.isPremium || false;
          console.log(`[Quiz Submit] User ${req.user.claims.sub} - isPremium: ${user?.isPremium}, will get premiumOptions: ${isPremiumUser}`);
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
        isPremiumUser = user?.isPremium || false;
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
      
      // Get user's premium status
      let isPremiumUser = false;
      try {
        const user = await storage.getUser(userId);
        isPremiumUser = user?.isPremium || false;
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

  app.post('/api/routines/:id/set-product', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { category, productName } = req.body;
      
      if (!category || !productName) {
        return res.status(400).json({ message: "Category and productName are required" });
      }
      
      const updatedRoutine = await storage.setCurrentProduct(userId, id, category, productName);
      
      // Get user's premium status for proper resolution
      let isPremiumUser = false;
      try {
        const user = await storage.getUser(userId);
        isPremiumUser = user?.isPremium || false;
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
      const currentScans = user.scanCount || 0;
      
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
        isPremiumUser = user?.isPremium || false;
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

  const httpServer = createServer(app);
  return httpServer;
}
