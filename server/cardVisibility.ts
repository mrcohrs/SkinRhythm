import { storage } from "./storage";
import type { User, CardInteraction } from "@shared/schema";
import { getUserEntitlements } from "@shared/entitlements";

export type CardId = 
  | "how-it-works" 
  | "budgeting" 
  | "scanner-access" 
  | "makeup-reminder" 
  | "contact-us";

export type BannerId = "consistency" | "barrier-first" | "ingredient-check";

export interface CardMetadata {
  cardId: CardId;
  title: string;
  body: string;
  primaryCTA: string;
  secondaryCTA?: string;
  priority: number;
  page: "quiz-results" | "my-products" | "scanner";
}

export interface BannerMetadata {
  bannerId: BannerId;
  message: string;
}

const CARD_DEFINITIONS: Record<CardId, Omit<CardMetadata, "priority">> = {
  "how-it-works": {
    cardId: "how-it-works",
    title: "Your personalized AcneAgent routine.",
    body: "Every product we recommend has been rigorously analyzed to ensure it's an acne-safe, high-quality formulation that complements the other products in your custom regimen.",
    primaryCTA: "View My Routine",
    page: "quiz-results",
  },
  "budgeting": {
    cardId: "budgeting",
    title: "AcneAgent Works with Your Budget",
    body: "By default, AcneAgent recommends the least expensive products that meet your unique skin's requirements. If you can't get your entire routine, begin with your cleanser, moisturizer, and SPF (max subtotal about $60). These help keep your skin balanced and healthy until you are able to introduce the actives.",
    primaryCTA: "View Full Routine",
    secondaryCTA: "View Core Routine",
    page: "quiz-results",
  },
  "scanner-access": {
    cardId: "scanner-access",
    title: "Check if non-routine products are acne-safe.",
    body: "When you create a free account, you receive 1-week access to an AcneAgent Premium Feature for free: the Ingredient Scanner. Copy & paste any product ingredient list and the tool quickly flags any acne-causing ingredients. Remember, a product is only acne-safe if every single ingredient in it is.",
    primaryCTA: "Open Ingredient Scanner →",
    page: "my-products",
  },
  "makeup-reminder": {
    cardId: "makeup-reminder",
    title: "Makeup isn't the enemy",
    body: "Just run your product list through the Ingredient Checker, or explore our curated acne-friendly beauty picks.",
    primaryCTA: "Explore acne-safe beauty →",
    page: "my-products",
  },
  "contact-us": {
    cardId: "contact-us",
    title: "We're here to help",
    body: "We love to help users find what works for them, whether it's deciding on alternative product options or making adjustments for different budgets. Our mission is to make clear skin accessible to everyone.",
    primaryCTA: "Contact us →",
    page: "my-products",
  },
};

const BANNER_DEFINITIONS: Record<BannerId, BannerMetadata> = {
  "consistency": {
    bannerId: "consistency",
    message: "Consistency builds confidence — stay with your AcneAgent routine and check all new products for acne-safe ingredients.",
  },
  "barrier-first": {
    bannerId: "barrier-first",
    message: "Barrier first. New breakouts later. Stick with the products in your plan.",
  },
  "ingredient-check": {
    bannerId: "ingredient-check",
    message: "Not sure if a product fits your routine? Use the Ingredient Checker before you add it in.",
  },
};

const BANNER_ROTATION: BannerId[] = ["consistency", "barrier-first", "ingredient-check"];

/**
 * Determines if a card is currently suppressed for a user
 */
async function isCardSuppressed(userId: string, cardId: CardId): Promise<boolean> {
  const interaction = await storage.getCardInteraction(userId, cardId);
  
  if (!interaction || !interaction.suppressUntil) {
    return false;
  }
  
  return new Date(interaction.suppressUntil) > new Date();
}

/**
 * Determines if user is within 7-day scanner trial window
 */
function isWithinScannerTrial(user: User): boolean {
  if (!user.createdAt) return false;
  
  const createdDate = new Date(user.createdAt);
  const now = new Date();
  const daysSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return daysSinceCreation <= 7;
}

/**
 * Gets days remaining in scanner trial
 */
function getDaysRemainingInTrial(user: User): number {
  if (!user.createdAt) return 0;
  
  const createdDate = new Date(user.createdAt);
  const now = new Date();
  const daysSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return Math.max(0, Math.ceil(7 - daysSinceCreation));
}

/**
 * Gets visible cards for Quiz Results page
 */
export async function getQuizResultsCards(userId: string | null): Promise<CardMetadata[]> {
  if (!userId) return [];
  
  const cards: CardMetadata[] = [];
  
  // Card 1: How it Works
  const howItWorksSuppressed = await isCardSuppressed(userId, "how-it-works");
  if (!howItWorksSuppressed) {
    cards.push({ ...CARD_DEFINITIONS["how-it-works"], priority: 1 });
  }
  
  // Card 2: Budgeting
  const budgetingSuppressed = await isCardSuppressed(userId, "budgeting");
  if (!budgetingSuppressed) {
    cards.push({ ...CARD_DEFINITIONS["budgeting"], priority: 2 });
  }
  
  return cards;
}

/**
 * Gets visible cards for My Products tab (Dashboard)
 */
export async function getMyProductsCards(userId: string): Promise<CardMetadata[]> {
  const user = await storage.getUser(userId);
  if (!user) return [];
  
  const entitlements = await getUserEntitlements(user);
  const cards: CardMetadata[] = [];
  
  // Card 4: Scanner Access (Free trial) - Highest priority
  const scannerSuppressed = await isCardSuppressed(userId, "scanner-access");
  const withinTrial = isWithinScannerTrial(user);
  const hasScansLeft = (user.scanCount || 0) < 3;
  
  if (!entitlements.hasUnlimitedScans && !scannerSuppressed && withinTrial && hasScansLeft) {
    const daysRemaining = getDaysRemainingInTrial(user);
    let body = CARD_DEFINITIONS["scanner-access"].body;
    
    // Add reminder chip if within last 2 days
    if (daysRemaining <= 2) {
      body += ` ${daysRemaining} days left.`;
    }
    
    cards.push({ 
      ...CARD_DEFINITIONS["scanner-access"], 
      body,
      priority: 1 
    });
  }
  
  // Card 5: Makeup Reminder
  const makeupSuppressed = await isCardSuppressed(userId, "makeup-reminder");
  if (!makeupSuppressed) {
    cards.push({ ...CARD_DEFINITIONS["makeup-reminder"], priority: 4 });
  }
  
  // Card 3: Contact Us (last)
  const contactSuppressed = await isCardSuppressed(userId, "contact-us");
  if (!contactSuppressed) {
    cards.push({ ...CARD_DEFINITIONS["contact-us"], priority: 5 });
  }
  
  // Sort by priority and limit to max 2 cards
  cards.sort((a, b) => a.priority - b.priority);
  return cards.slice(0, 2);
}

/**
 * Gets the current banner for Premium users
 */
export async function getCurrentBanner(userId: string): Promise<BannerMetadata | null> {
  const user = await storage.getUser(userId);
  if (!user) return null;
  
  const entitlements = getUserEntitlements(user);
  
  // Only show banners to Premium users
  if (entitlements.tier === "free") {
    return null;
  }
  
  const bannerStateRecord = await storage.getUserBannerState(userId);
  
  // Determine which banner should be shown this week
  const now = new Date();
  const startDate = bannerStateRecord?.lastRotationDate ? new Date(bannerStateRecord.lastRotationDate) : new Date(user.createdAt || now);
  const weeksSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
  const currentBannerIndex = weeksSinceStart % BANNER_ROTATION.length;
  const currentBannerId = BANNER_ROTATION[currentBannerIndex];
  
  // Check if current banner is suppressed
  if (bannerStateRecord?.bannerSuppressUntil) {
    const suppressMap = bannerStateRecord.bannerSuppressUntil as Record<string, string>;
    const suppressUntil = suppressMap[currentBannerId];
    
    if (suppressUntil && new Date(suppressUntil) > now) {
      // Banner is suppressed, try next in rotation
      const nextIndex = (currentBannerIndex + 1) % BANNER_ROTATION.length;
      const nextBannerId = BANNER_ROTATION[nextIndex];
      const nextSuppressUntil = suppressMap[nextBannerId];
      
      if (nextSuppressUntil && new Date(nextSuppressUntil) > now) {
        return null; // Both are suppressed
      }
      
      return BANNER_DEFINITIONS[nextBannerId];
    }
  }
  
  return BANNER_DEFINITIONS[currentBannerId];
}

/**
 * Records a card interaction (view, click, dismiss)
 */
export async function recordCardAction(
  userId: string,
  cardId: CardId,
  action: "viewed" | "clicked" | "dismissed"
): Promise<void> {
  let suppressUntil: Date | null = null;
  
  // Set suppression period based on action and card
  if (action === "viewed" || action === "clicked") {
    suppressUntil = new Date();
    suppressUntil.setDate(suppressUntil.getDate() + 7); // 7 days default
    
    // Special cases
    if (cardId === "budgeting" && action === "clicked") {
      // If user clicks budgeting, suppress for 30 days
      suppressUntil.setDate(new Date().getDate() + 30);
    }
    if (cardId === "makeup-reminder" && action === "clicked") {
      // If user visits makeup collection, suppress for 14 days
      suppressUntil.setDate(new Date().getDate() + 14);
    }
  } else if (action === "dismissed") {
    suppressUntil = new Date();
    suppressUntil.setDate(suppressUntil.getDate() + 7); // 7 days for dismissal
  }
  
  await storage.recordCardInteraction({
    userId,
    cardId,
    action,
    suppressUntil: suppressUntil || undefined,
  });
}
