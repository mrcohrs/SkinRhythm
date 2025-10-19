import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
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
  isPremium: boolean("is_premium").default(false),
  // Consent fields for AI training and data collection
  dataCollectionConsent: boolean("data_collection_consent").default(false),
  aiTrainingConsent: boolean("ai_training_consent").default(false),
  consentDate: timestamp("consent_date"),
  consentVersion: varchar("consent_version"), // Track consent version for future updates
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

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
