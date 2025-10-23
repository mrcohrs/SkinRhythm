import {
  users,
  routines,
  cardInteractions,
  bannerState,
  productSelections,
  purchases,
  foundingRateCounter,
  type User,
  type UpsertUser,
  type Routine,
  type InsertRoutine,
  type CardInteraction,
  type InsertCardInteraction,
  type BannerState,
  type InsertBannerState,
  type ProductSelection,
  type InsertProductSelection,
  type Purchase,
  type InsertPurchase,
  type FoundingRateCounter,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql as drizzleSql } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUserWithPassword(email: string, passwordHash: string, firstName?: string): Promise<User>;
  updateUserConsent(userId: string, dataCollectionConsent: boolean, aiTrainingConsent: boolean, consentVersion: string): Promise<User>;
  updateRoutineMode(userId: string, routineMode: string): Promise<User>;
  incrementScanCount(userId: string): Promise<User>;
  
  saveRoutine(routine: InsertRoutine): Promise<Routine>;
  getUserRoutines(userId: string): Promise<Routine[]>;
  getCurrentRoutine(userId: string): Promise<Routine | undefined>;
  getRoutineById(userId: string, routineId: string): Promise<Routine | undefined>;
  setCurrentRoutine(userId: string, routineId: string): Promise<Routine>;
  setCurrentProduct(userId: string, routineId: string, category: string, productName: string): Promise<Routine>;
  addRoutineNote(userId: string, routineId: string, text: string): Promise<Routine>;
  deleteRoutineNote(userId: string, routineId: string, noteId: string): Promise<Routine>;
  
  // Card interactions
  recordCardInteraction(interaction: InsertCardInteraction): Promise<CardInteraction>;
  getUserCardInteractions(userId: string): Promise<CardInteraction[]>;
  getCardInteraction(userId: string, cardId: string): Promise<CardInteraction | undefined>;
  
  // Banner state
  getUserBannerState(userId: string): Promise<BannerState | undefined>;
  upsertBannerState(state: InsertBannerState): Promise<BannerState>;
  dismissBanner(userId: string, bannerId: string, suppressDays: number): Promise<BannerState>;
  trackBannerClick(userId: string, bannerId: string): Promise<BannerState>;
  trackBannerView(userId: string, bannerId: string): Promise<BannerState>;
  
  // Product selections
  getUserProductSelections(userId: string): Promise<ProductSelection[]>;
  getUserProductSelection(userId: string, productId: string): Promise<ProductSelection | undefined>;
  setUserProductSelection(userId: string, productId: string, productName: string): Promise<ProductSelection>;
  
  // Payment and subscription management
  updateStripeCustomer(userId: string, stripeCustomerId: string): Promise<User>;
  updateStripeSubscription(userId: string, stripeSubscriptionId: string): Promise<User>;
  recordPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getUserPurchases(userId: string): Promise<Purchase[]>;
  getActiveSubscription(userId: string): Promise<Purchase | undefined>;
  
  // Scan credits management
  addScanCredits(userId: string, credits: number): Promise<User>;
  useScanCredit(userId: string): Promise<User>;
  setUnlimitedScans(userId: string, expiresAt: Date | null): Promise<User>;
  
  // One-time purchase access
  grantPremiumRoutineAccess(userId: string, routineId: string): Promise<User>;
  grantDetailedPdfAccess(userId: string): Promise<User>;
  
  // Membership management
  updateMembership(userId: string, tier: string, expiresAt: Date | null, isFoundingMember: boolean): Promise<User>;
  
  // Founding rate counter
  getFoundingRateCounter(): Promise<FoundingRateCounter | undefined>;
  incrementFoundingRateCounter(): Promise<FoundingRateCounter>;
  isFoundingRateActive(): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUserWithPassword(email: string, passwordHash: string, firstName?: string): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        firstName,
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // OIDC always provides an ID (sub claim), but check anyway
    if (userData.id) {
      // First try to find existing user by ID
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.id, userData.id))
        .limit(1);

      if (existing.length > 0) {
        // Update existing user
        const [user] = await db
          .update(users)
          .set({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userData.id))
          .returning();
        return user;
      }
    }

    // Check if email exists (handles test scenarios where email exists with different ID)
    if (userData.email) {
      const emailExists = await db
        .select()
        .from(users)
        .where(eq(users.email, userData.email))
        .limit(1);

      if (emailExists.length > 0) {
        // Update existing user (but NEVER update ID - it's immutable due to foreign key constraints)
        const [user] = await db
          .update(users)
          .set({
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.email, userData.email))
          .returning();
        return user;
      }
    }

    // Insert new user
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async saveRoutine(routine: InsertRoutine): Promise<Routine> {
    // Set all existing routines to not current
    await db
      .update(routines)
      .set({ isCurrent: false })
      .where(eq(routines.userId, routine.userId));

    // Insert new routine as current
    const [savedRoutine] = await db
      .insert(routines)
      .values({ ...routine, isCurrent: true })
      .returning();
    return savedRoutine;
  }

  async getUserRoutines(userId: string): Promise<Routine[]> {
    return await db
      .select()
      .from(routines)
      .where(eq(routines.userId, userId))
      .orderBy(desc(routines.createdAt));
  }

  async getCurrentRoutine(userId: string): Promise<Routine | undefined> {
    const [routine] = await db
      .select()
      .from(routines)
      .where(and(eq(routines.userId, userId), eq(routines.isCurrent, true)));
    return routine;
  }

  async getRoutineById(userId: string, routineId: string): Promise<Routine | undefined> {
    const [routine] = await db
      .select()
      .from(routines)
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)));
    return routine;
  }

  async setCurrentRoutine(userId: string, routineId: string): Promise<Routine> {
    // First verify the routine belongs to the user
    const [routine] = await db
      .select()
      .from(routines)
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)));

    if (!routine) {
      throw new Error("Routine not found or access denied");
    }

    // Set all user's routines to not current
    await db
      .update(routines)
      .set({ isCurrent: false })
      .where(eq(routines.userId, userId));

    // Set specified routine as current
    const [updatedRoutine] = await db
      .update(routines)
      .set({ isCurrent: true })
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)))
      .returning();

    return updatedRoutine;
  }

  async setCurrentProduct(
    userId: string, 
    routineId: string, 
    category: string, 
    productName: string
  ): Promise<Routine> {
    // First verify the routine belongs to the user
    const [routine] = await db
      .select()
      .from(routines)
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)));

    if (!routine) {
      throw new Error("Routine not found or access denied");
    }

    // Get current product selections or initialize empty object
    const currentSelections = (routine.currentProductSelections as Record<string, string>) || {};
    
    // Update the selection for this category
    const updatedSelections = {
      ...currentSelections,
      [category]: productName
    };

    // Update the routine with new selections
    const [updatedRoutine] = await db
      .update(routines)
      .set({ currentProductSelections: updatedSelections })
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)))
      .returning();

    return updatedRoutine;
  }

  async updateUserConsent(
    userId: string,
    dataCollectionConsent: boolean,
    aiTrainingConsent: boolean,
    consentVersion: string
  ): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        dataCollectionConsent,
        aiTrainingConsent,
        consentDate: new Date(),
        consentVersion,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  async incrementScanCount(userId: string): Promise<User> {
    const user = await this.getUser(userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({
        scanCount: (user.scanCount || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async updateRoutineMode(userId: string, routineMode: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        routineMode,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    // Clear saved product selections from current routine so new mode takes effect
    await db
      .update(routines)
      .set({ currentProductSelections: {} })
      .where(and(eq(routines.userId, userId), eq(routines.isCurrent, true)));
    
    console.log(`[Storage] Cleared product selections for user ${userId} after switching to ${routineMode} mode`);
    
    return updatedUser;
  }

  async addRoutineNote(
    userId: string,
    routineId: string,
    text: string
  ): Promise<Routine> {
    // First verify the routine belongs to the user
    const [routine] = await db
      .select()
      .from(routines)
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)));

    if (!routine) {
      throw new Error("Routine not found or access denied");
    }

    // Get current notes or initialize empty array
    const currentNotes = (routine.notes as Array<{id: string, date: string, text: string}>) || [];
    
    // Create new note
    const newNote = {
      id: randomUUID(),
      date: new Date().toISOString(),
      text
    };

    // Add new note to the beginning of the array (most recent first)
    const updatedNotes = [newNote, ...currentNotes];

    // Update the routine with new notes
    const [updatedRoutine] = await db
      .update(routines)
      .set({ notes: updatedNotes })
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)))
      .returning();

    return updatedRoutine;
  }

  async deleteRoutineNote(
    userId: string,
    routineId: string,
    noteId: string
  ): Promise<Routine> {
    // First verify the routine belongs to the user
    const [routine] = await db
      .select()
      .from(routines)
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)));

    if (!routine) {
      throw new Error("Routine not found or access denied");
    }

    // Get current notes or initialize empty array
    const currentNotes = (routine.notes as Array<{id: string, date: string, text: string}>) || [];
    
    // Remove note with matching ID
    const updatedNotes = currentNotes.filter(note => note.id !== noteId);

    // Update the routine with filtered notes
    const [updatedRoutine] = await db
      .update(routines)
      .set({ notes: updatedNotes })
      .where(and(eq(routines.id, routineId), eq(routines.userId, userId)))
      .returning();

    return updatedRoutine;
  }

  // Card interaction methods
  async recordCardInteraction(interaction: InsertCardInteraction): Promise<CardInteraction> {
    const [savedInteraction] = await db
      .insert(cardInteractions)
      .values(interaction)
      .returning();
    return savedInteraction;
  }

  async getUserCardInteractions(userId: string): Promise<CardInteraction[]> {
    return await db
      .select()
      .from(cardInteractions)
      .where(eq(cardInteractions.userId, userId))
      .orderBy(desc(cardInteractions.timestamp));
  }

  async getCardInteraction(userId: string, cardId: string): Promise<CardInteraction | undefined> {
    const [interaction] = await db
      .select()
      .from(cardInteractions)
      .where(and(
        eq(cardInteractions.userId, userId),
        eq(cardInteractions.cardId, cardId)
      ))
      .orderBy(desc(cardInteractions.timestamp))
      .limit(1);
    return interaction;
  }

  // Banner state methods
  async getUserBannerState(userId: string): Promise<BannerState | undefined> {
    const [state] = await db
      .select()
      .from(bannerState)
      .where(eq(bannerState.userId, userId));
    return state;
  }

  async upsertBannerState(state: InsertBannerState): Promise<BannerState> {
    const existing = await this.getUserBannerState(state.userId);
    
    if (existing) {
      const [updated] = await db
        .update(bannerState)
        .set({
          ...state,
          updatedAt: new Date(),
        })
        .where(eq(bannerState.userId, state.userId))
        .returning();
      return updated;
    }
    
    const [inserted] = await db
      .insert(bannerState)
      .values(state)
      .returning();
    return inserted;
  }

  async dismissBanner(userId: string, bannerId: string, suppressDays: number): Promise<BannerState> {
    const existing = await this.getUserBannerState(userId);
    
    const suppressUntil = new Date();
    suppressUntil.setDate(suppressUntil.getDate() + suppressDays);
    
    const suppressMap = (existing?.bannerSuppressUntil as Record<string, string>) || {};
    suppressMap[bannerId] = suppressUntil.toISOString();
    
    const dismissedBanners = existing?.dismissedBanners || [];
    if (!dismissedBanners.includes(bannerId)) {
      dismissedBanners.push(bannerId);
    }
    
    return await this.upsertBannerState({
      userId,
      dismissedBanners,
      bannerSuppressUntil: suppressMap,
      lastRotationDate: existing?.lastRotationDate || new Date(),
    });
  }

  async trackBannerClick(userId: string, bannerId: string): Promise<BannerState> {
    const existing = await this.getUserBannerState(userId);
    
    const clicksMap = (existing?.bannerClicks as Record<string, number>) || {};
    clicksMap[bannerId] = (clicksMap[bannerId] || 0) + 1;
    
    return await this.upsertBannerState({
      userId,
      dismissedBanners: existing?.dismissedBanners || [],
      bannerSuppressUntil: existing?.bannerSuppressUntil || {},
      bannerClicks: clicksMap,
      bannerViews: existing?.bannerViews || {},
      lastRotationDate: existing?.lastRotationDate || new Date(),
    });
  }

  async trackBannerView(userId: string, bannerId: string): Promise<BannerState> {
    const existing = await this.getUserBannerState(userId);
    
    const viewsMap = (existing?.bannerViews as Record<string, number>) || {};
    viewsMap[bannerId] = (viewsMap[bannerId] || 0) + 1;
    
    return await this.upsertBannerState({
      userId,
      dismissedBanners: existing?.dismissedBanners || [],
      bannerSuppressUntil: existing?.bannerSuppressUntil || {},
      bannerClicks: existing?.bannerClicks || {},
      bannerViews: viewsMap,
      lastRotationDate: existing?.lastRotationDate || new Date(),
    });
  }

  async getUserProductSelections(userId: string): Promise<ProductSelection[]> {
    return await db
      .select()
      .from(productSelections)
      .where(eq(productSelections.userId, userId));
  }

  async getUserProductSelection(userId: string, productId: string): Promise<ProductSelection | undefined> {
    const [selection] = await db
      .select()
      .from(productSelections)
      .where(
        and(
          eq(productSelections.userId, userId),
          eq(productSelections.productId, productId)
        )
      );
    return selection;
  }

  async setUserProductSelection(userId: string, productId: string, productName: string): Promise<ProductSelection> {
    const existing = await this.getUserProductSelection(userId, productId);
    
    if (existing) {
      const [updated] = await db
        .update(productSelections)
        .set({
          specificProductName: productName,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(productSelections.userId, userId),
            eq(productSelections.productId, productId)
          )
        )
        .returning();
      return updated;
    }
    
    const [inserted] = await db
      .insert(productSelections)
      .values({
        userId,
        productId,
        specificProductName: productName,
      })
      .returning();
    return inserted;
  }

  // Payment and subscription management
  async updateStripeCustomer(userId: string, stripeCustomerId: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        stripeCustomerId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  async updateStripeSubscription(userId: string, stripeSubscriptionId: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  async recordPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const [savedPurchase] = await db
      .insert(purchases)
      .values(purchase)
      .returning();
    return savedPurchase;
  }

  async getUserPurchases(userId: string): Promise<Purchase[]> {
    return await db
      .select()
      .from(purchases)
      .where(eq(purchases.userId, userId))
      .orderBy(desc(purchases.createdAt));
  }

  async getActiveSubscription(userId: string): Promise<Purchase | undefined> {
    const [subscription] = await db
      .select()
      .from(purchases)
      .where(
        and(
          eq(purchases.userId, userId),
          eq(purchases.isSubscription, true),
          eq(purchases.status, "completed")
        )
      )
      .orderBy(desc(purchases.createdAt))
      .limit(1);
    return subscription;
  }

  // Scan credits management
  async addScanCredits(userId: string, credits: number): Promise<User> {
    const user = await this.getUser(userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({
        scanCredits: (user.scanCredits || 0) + credits,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async useScanCredit(userId: string): Promise<User> {
    const user = await this.getUser(userId);
    
    if (!user) {
      throw new Error("User not found");
    }
    
    const currentCredits = user.scanCredits || 0;
    if (currentCredits <= 0) {
      throw new Error("Insufficient scan credits");
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({
        scanCredits: currentCredits - 1,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async setUnlimitedScans(userId: string, expiresAt: Date | null): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        hasUnlimitedScans: true,
        unlimitedScannerExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  // One-time purchase access
  async grantPremiumRoutineAccess(userId: string, routineId: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        hasPremiumRoutineAccess: true,
        premiumRoutineAccessRoutineId: routineId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  async grantDetailedPdfAccess(userId: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        hasDetailedPdfAccess: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  // Membership management
  async updateMembership(userId: string, tier: string, expiresAt: Date | null, isFoundingMember: boolean): Promise<User> {
    const isPremium = tier === "premium" || tier === "premium_plus";
    // Automatically set routineMode to match tier: "premium" for premium tiers, "basic" for free tier
    const routineMode = isPremium ? "premium" : "basic";
    
    const [updatedUser] = await db
      .update(users)
      .set({
        membershipTier: tier,
        membershipExpiresAt: expiresAt,
        isFoundingMember,
        isPremium,
        routineMode,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    
    return updatedUser;
  }

  // Founding rate counter
  async getFoundingRateCounter(): Promise<FoundingRateCounter | undefined> {
    const [counter] = await db
      .select()
      .from(foundingRateCounter)
      .where(eq(foundingRateCounter.id, "singleton"));
    return counter;
  }

  async incrementFoundingRateCounter(): Promise<FoundingRateCounter> {
    const existing = await this.getFoundingRateCounter();
    
    if (!existing) {
      const [inserted] = await db
        .insert(foundingRateCounter)
        .values({
          id: "singleton",
          premiumFoundingPurchases: 1,
          foundingRateActive: true,
          foundingRateLimit: 500,
        })
        .returning();
      return inserted;
    }
    
    const newCount = (existing.premiumFoundingPurchases || 0) + 1;
    const limit = existing.foundingRateLimit || 500;
    const shouldDeactivate = newCount >= limit;
    
    const [updated] = await db
      .update(foundingRateCounter)
      .set({
        premiumFoundingPurchases: newCount,
        foundingRateActive: !shouldDeactivate,
        updatedAt: new Date(),
      })
      .where(eq(foundingRateCounter.id, "singleton"))
      .returning();
    
    return updated;
  }

  async isFoundingRateActive(): Promise<boolean> {
    const counter = await this.getFoundingRateCounter();
    return counter?.foundingRateActive ?? true;
  }
}

export const storage = new DatabaseStorage();
