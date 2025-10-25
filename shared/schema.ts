import { sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  numeric,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table - Supports both Replit Auth and local email/password
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  passwordHash: varchar("password_hash"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isPremium: boolean("is_premium").default(false), // Legacy field - kept for backward compatibility, synced with membershipTier
  // Membership tier and tracking (source of truth for access control)
  membershipTier: varchar("membership_tier").default("free"), // free, premium, premium_plus
  membershipExpiresAt: timestamp("membership_expires_at"),
  isFoundingMember: boolean("is_founding_member").default(false),
  // Stripe integration fields
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  // Ingredient scanner tracking
  scanCredits: integer("scan_credits").default(0), // Tracks number of scans used (free users get 3 total)
  hasUnlimitedScans: boolean("has_unlimited_scans").default(false), // True for Premium or Unlimited Scanner addon
  unlimitedScannerExpiresAt: timestamp("unlimited_scanner_expires_at"), // For standalone unlimited scanner addon
  // One-time purchase tracking
  hasPremiumRoutineAccess: boolean("has_premium_routine_access").default(false), // $9.99 one-time unlock for product alternatives
  premiumRoutineAccessRoutineId: varchar("premium_routine_access_routine_id"), // Which routine the access is for
  hasDetailedPdfAccess: boolean("has_detailed_pdf_access").default(false), // $9.99 one-time PDF purchase
  // Consent fields for AI training and data collection
  dataCollectionConsent: boolean("data_collection_consent").default(false),
  aiTrainingConsent: boolean("ai_training_consent").default(false),
  consentDate: timestamp("consent_date"),
  consentVersion: varchar("consent_version"), // Track consent version for future policy updates
  // Routine display preference for premium users
  routineMode: varchar("routine_mode").default("basic"), // "basic" (budget/isDefault) or "premium" (recommended/isRecommended)
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Purchases table - Track all purchases (one-time and subscriptions)
export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  productType: varchar("product_type").notNull(), // premium_subscription, detailed_pdf, premium_routine_access, scan_pack_5, scan_pack_20, unlimited_scanner
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("usd"),
  scansGranted: integer("scans_granted").default(0), // For scan packs (added to user balance)
  isSubscription: boolean("is_subscription").default(false), // True for Premium, Unlimited Scanner
  isFoundingRate: boolean("is_founding_rate").default(false), // Track if purchased at founding rate
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  status: varchar("status").default("completed"), // completed, pending, failed, refunded
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_purchases_user_id").on(table.userId),
  index("IDX_purchases_stripe_subscription").on(table.stripeSubscriptionId)
]);

export const insertPurchaseSchema = createInsertSchema(purchases).omit({
  id: true,
  createdAt: true,
});

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

// Saved routines table
export const routines = pgTable("routines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name"),
  age: text("age"),
  skinType: varchar("skin_type").notNull(),
  fitzpatrickType: varchar("fitzpatrick_type").notNull(),
  acneTypes: text("acne_types").array().notNull(),
  acneSeverity: varchar("acne_severity").notNull(),
  beautyProducts: text("beauty_products").array().default(sql`ARRAY[]::text[]`),
  isPregnantOrNursing: boolean("is_pregnant_or_nursing").notNull(),
  routineData: jsonb("routine_data").notNull(),
  currentProductSelections: jsonb("current_product_selections"), // Maps category -> product name (e.g., {"Cleanser": "La Roche-Posay..."})
  notes: jsonb("notes"), // Array of note objects: [{id: string, date: ISO string, text: string}]
  isCurrent: boolean("is_current").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRoutineSchema = createInsertSchema(routines).omit({
  id: true,
  createdAt: true,
});

export type InsertRoutine = z.infer<typeof insertRoutineSchema>;
export type Routine = typeof routines.$inferSelect;

// Card and banner interactions table - Track user interactions for visibility logic
export const cardInteractions = pgTable("card_interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  cardId: varchar("card_id").notNull(), // how-it-works, budgeting, scanner-access, makeup-reminder, contact-us
  action: varchar("action").notNull(), // viewed, clicked, dismissed
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  suppressUntil: timestamp("suppress_until"), // When card can be shown again
}, (table) => [
  index("IDX_card_interactions_user_card").on(table.userId, table.cardId)
]);

export const insertCardInteractionSchema = createInsertSchema(cardInteractions).omit({
  id: true,
  timestamp: true,
});

export type InsertCardInteraction = z.infer<typeof insertCardInteractionSchema>;
export type CardInteraction = typeof cardInteractions.$inferSelect;

// Banner state for Premium users - Track weekly rotation and dismissals
export const bannerState = pgTable("banner_state", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id),
  dismissedBanners: text("dismissed_banners").array().default(sql`ARRAY[]::text[]`), // Array of dismissed banner IDs
  bannerSuppressUntil: jsonb("banner_suppress_until"), // Map of bannerId -> suppress timestamp
  bannerClicks: jsonb("banner_clicks"), // Map of bannerId -> click count
  bannerViews: jsonb("banner_views"), // Map of bannerId -> view count
  lastRotationDate: timestamp("last_rotation_date").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_banner_state_user_id").on(table.userId)
]);

export const insertBannerStateSchema = createInsertSchema(bannerState).omit({
  id: true,
  updatedAt: true,
});

export type InsertBannerState = z.infer<typeof insertBannerStateSchema>;
export type BannerState = typeof bannerState.$inferSelect;

// Product selections table - Tracks which specific product variant a user is currently using for each productId
export const productSelections = pgTable("product_selections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  productId: varchar("product_id").notNull(), // e.g., 'creamy-cleanser', 'retinol-serum'
  specificProductName: text("specific_product_name").notNull(), // e.g., 'Vanicream Facial Cleanser'
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("IDX_product_selections_user").on(table.userId),
  index("IDX_product_selections_user_product").on(table.userId, table.productId)
]);

export const insertProductSelectionSchema = createInsertSchema(productSelections).omit({
  id: true,
  updatedAt: true,
});

export type InsertProductSelection = z.infer<typeof insertProductSelectionSchema>;
export type ProductSelection = typeof productSelections.$inferSelect;

// Founding rate counter - Global state tracking
export const foundingRateCounter = pgTable("founding_rate_counter", {
  id: varchar("id").primaryKey().default("singleton"), // Only one row
  premiumFoundingPurchases: integer("premium_founding_purchases").default(0), // Count of Premium subscriptions at founding rate
  foundingRateActive: boolean("founding_rate_active").default(true), // Auto-disable after 500
  foundingRateLimit: integer("founding_rate_limit").default(500), // Configurable limit
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type FoundingRateCounter = typeof foundingRateCounter.$inferSelect;

// PDF purchases table - Track purchased PDFs with routine snapshots
export const pdfPurchases = pgTable("pdf_purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  purchaseId: varchar("purchase_id").notNull().references(() => purchases.id),
  // Routine snapshot at time of purchase
  skinType: varchar("skin_type").notNull(),
  fitzpatrickType: varchar("fitzpatrick_type").notNull(),
  acneTypes: text("acne_types").array().notNull(),
  acneSeverity: varchar("acne_severity").notNull(),
  isPregnantOrNursing: boolean("is_pregnant_or_nursing").notNull(),
  routineData: jsonb("routine_data").notNull(), // Full routine data for PDF generation
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_pdf_purchases_user_id").on(table.userId)
]);

export const insertPdfPurchaseSchema = createInsertSchema(pdfPurchases).omit({
  id: true,
  createdAt: true,
});

export type InsertPdfPurchase = z.infer<typeof insertPdfPurchaseSchema>;
export type PdfPurchase = typeof pdfPurchases.$inferSelect;

// Quiz answers schema
export const quizAnswersSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.string().min(1, "Age is required"),
  skinType: z.enum(["dry", "normal", "oily"]),
  fitzpatrickType: z.enum(["1-3", "4+"]),
  acneTypes: z.array(z.enum(["inflamed", "noninflamed", "acne-rosacea"])).min(1, "Select at least one acne type"),
  acneSeverity: z.enum(["mild", "moderate", "severe"]),
  beautyProducts: z.array(z.enum(["tinted-moisturizer", "tinted-spf", "makeup"])),
  isPregnantOrNursing: z.enum(["yes", "no"]),
});

export type QuizAnswers = z.infer<typeof quizAnswersSchema>;
