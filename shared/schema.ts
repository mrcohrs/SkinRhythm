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
  // Ingredient scanner tracking (for free users only - premium gets unlimited)
  scanCount: integer("scan_count").default(0), // Incremented on each scan for free users
  // Consent fields for AI training and data collection
  dataCollectionConsent: boolean("data_collection_consent").default(false),
  aiTrainingConsent: boolean("ai_training_consent").default(false),
  consentDate: timestamp("consent_date"),
  consentVersion: varchar("consent_version"), // Track consent version for future policy updates
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Purchases table - Track one-time purchases
export const purchases = pgTable("purchases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  productType: varchar("product_type").notNull(), // detailed_pdf, scan_pack_5, scan_pack_20, unlimited_scanner
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  scansGranted: integer("scans_granted").default(0), // For scan packs (added to user balance)
  isRecurring: boolean("is_recurring").default(false), // True for unlimited_scanner addon subscription
  expiresAt: timestamp("expires_at"), // For recurring purchases like unlimited_scanner
  stripePaymentId: varchar("stripe_payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("IDX_purchases_user_id").on(table.userId) // Index for efficient user purchase lookups
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
