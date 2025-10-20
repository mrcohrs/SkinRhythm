# AcneAgent - Personalized Acne Skincare Application

## Overview
AcneAgent is a personalized acne skincare application designed to provide users with customized skincare routines. It analyzes user skin type, Fitzpatrick type, acne concerns, and pregnancy status through an interactive quiz to recommend morning and evening skincare products across budget, standard, and premium price tiers. Users can authenticate, save their routines, and access a personalized dashboard with product recommendations and detailed treatment plans. The application aims to offer a clinical yet elegant user experience, guiding users towards effective acne management.

### Two-Step Fitzpatrick Determination
The quiz uses an intuitive two-step visual flow to determine Fitzpatrick type:
1. **Visual Skin Tone Selection**: Users select from 6 skin tone options displayed as face images in a 2x3 grid (Very Fair, Fair Light, Light Medium, Tan Olive, Medium Brown, Deep Brown)
2. **Conditional Sun Reaction Question**: Only shown for Light Medium and Tan Olive skin tones (tones 3-4)
   - Tones 1-2 (Very Fair, Fair Light) → Automatically assigned Fitz 1-3
   - Tones 5-6 (Medium Brown, Deep Brown) → Automatically assigned Fitz 4+
   - Tones 3-4 → Ask sun reaction:
     - Burns/tans minimally (A/B) → Fitz 1-3
     - Tans easily (C) → Fitz 4+

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript (Vite).
- **UI**: shadcn/ui with Radix UI primitives and Tailwind CSS, following a "New York" style variant with clinical aesthetics (Curology, Hims & Hers inspiration). Supports light/dark modes.
- **State Management**: TanStack Query for server state; custom `useAuth` hook for authentication.
- **Routing**: Wouter for lightweight client-side routing, managing authenticated/unauthenticated user flows and quiz redirection.
- **Theming**: Custom ThemeProvider with localStorage persistence for light/dark mode.
- **Dashboard**: Provides authenticated users a personalized view of saved routines, detailed treatment plans (premium), and a routine library. Features include routine switching, retake quiz flow, and current routine management.
- **Ingredient Checker**: Allows authenticated users to paste ingredient lists to identify 348 known acne-causing ingredients using word-boundary matching.
- **Routine Display**: Features eyebrow-style badge tags showing skin characteristics (skin type, acne types, severity, pregnancy/nursing status) with outline-only borders and black text for clean visual hierarchy. Includes conditional CTA for beauty products (makeup or skin tints) based on quiz answers.
- **Quiz Flow**: 9-step questionnaire with conditional logic and accurate progress tracking:
  - Steps: Name → Age → Skin Type → Skin Tone (visual) → Sun Reaction (conditional) → Acne Types → Severity → Beauty Products (optional) → Pregnancy
  - Progress bar calculation uses `getVisibleStepNumber()` to accurately reflect visible steps (8 or 9 depending on skip logic)
  - All mandatory questions are answered before completion
  - Beauty products question determines CTA display for acne-safe makeup/skin tints
- **Post-Quiz Navigation**: Non-authenticated users see navigation header with logo (home link), retake quiz button, create account button, theme toggle, and mailing list signup section.
- **Ice Globes Upsells**: Strategic product recommendations for ice globes tool displayed across three locations for inflamed routine types only:
  - Quiz results page (RoutineDisplay): Shows compact upsell card after morning routine
  - Dashboard My Products tab: Shows compact upsell card between morning and evening routines
  - Routine Coach: Shows compact upsell card before week-by-week schedule
  - All upsells pull from centralized product library and include affiliate links
- **Beauty Products Page**: Placeholder page at `/beauty-products` for future acne-safe makeup and skin tint recommendations. Accessed via conditional CTA in routine display based on user's beauty product usage (makeup vs tinted moisturizer/SPF).
- **Affiliate Disclosure**: Dedicated disclosure page at `/affiliate-disclosure` with FTC-compliant language. Disclosure notice banner appears at top of product recommendation pages, with footer links on all major pages.
- **Privacy Policy**: Dedicated privacy policy page at `/privacy-policy` explaining data collection practices, third-party services, and contact information. Accessible via footer on all major pages (Landing, Dashboard, RoutineDisplay, AffiliateDisclosure, PrivacyPolicy).

### Backend
- **Server**: Express.js with TypeScript (Node.js).
- **Authentication**: OpenID Connect (OIDC) via Replit Auth and Passport.js, using `express-session` with a PostgreSQL store.
- **API**: RESTful endpoints for authentication, quiz submission, routine saving/retrieval, and current routine management.
- **Business Logic**: CSV-based product recommendation engine. Matches skin type, Fitzpatrick type, acne types, age (mature status), and pregnancy status to recommend product sets. Extracts real product names from URLs, filtering out IDs and converting to Title Case. Supports premium product alternatives.
- **Affiliate Links System**: Integrated affiliate link mapping system (37 affiliate links) that automatically uses affiliate URLs for shop/buy CTAs when available, while maintaining original product links for name extraction. Falls back to original links when no affiliate mapping exists.
  - **Runtime Transformation**: `server/routineTransformer.ts` provides backwards compatibility by transforming old routine data to include affiliate links at runtime
  - **Dashboard Integration**: Both `/api/routines/current` and `/api/routines` endpoints transform routine data to ensure Dashboard displays affiliate links for all saved routines
- **Premium Features**: 6-week progressive treatment routines (Inflamed, Non-inflamed Mild/Moderate/Severe, Rosacea) for premium users, detailing step-by-step AM/PM routines, product mappings, and treatment notes.

### Data Storage
- **Database**: PostgreSQL (Neon serverless driver).
- **ORM**: Drizzle ORM for type-safe operations.
- **Schema**: 
  - `sessions` (Replit Auth)
  - `users` (profiles, membership tracking, consent fields)
    - `membershipTier` (free/premium/premium_plus) - source of truth for access control
    - `membershipExpiresAt` - validates active subscriptions
    - `isFoundingMember` - tracks early adopters
    - `scanCount` - tracks free tier scan usage
    - `isPremium` - legacy field synced with membershipTier for backward compatibility
  - `routines` (user-specific routines including demographic and product data)
  - `purchases` (one-time purchases: PDFs, scan packs, unlimited scanner addon)
    - Indexed on userId for efficient entitlement lookups
- **Migrations**: Drizzle Kit.

### Monetization Infrastructure
- **Membership Tiers**: Three-tier system (free, premium, premium_plus)
  - Free: 3 ingredient scans, basic routine access
  - Premium ($2.99-$5.99/month): Unlimited scans, Product Alternatives, Routine Coach, Routine Library
  - Premium Plus: Enhanced features (future expansion)
- **Scan Tracking System**: 
  - API endpoint `/api/user/scan` enforces free tier limit (3 scans)
  - Frontend displays real-time scan counter for free users
  - Scan button disabled when exhausted with upgrade prompt
  - Proper error handling clears stale results on limit reached
- **Entitlements System** (`shared/entitlements.ts`):
  - `getUserEntitlements()` - Single source of truth for feature access
  - Validates membership expiry for both tiers and addon purchases
  - Returns typed entitlements object with feature flags and scan counts
- **Feature Gating**:
  - Ingredient Scanner: Free users get 3 scans, premium unlimited
  - Product Alternatives: Premium-only "Explore Options" button
  - Routine Coach: Premium-only 6-week treatment schedules
  - Routine Library: Premium-only saved routines management
- **Planned Features** (not yet implemented):
  - Scan packs (5 for $1.99, 20 for $3.99) - requires scan balance tracking
  - Unlimited scanner addon ($3.49/month) - subscription tracking
  - One-time PDF purchases ($9.99) - detailed treatment guides
  - PricingModal component for upgrade flows
  - Founding member pricing ($2.99 vs $5.99 standard)

### Consent & Privacy Infrastructure
- **User Consent System**: Comprehensive consent management for data collection and AI training
  - `dataCollectionConsent`: Boolean flag for storing user skincare data
  - `aiTrainingConsent`: Boolean flag for using anonymized data in AI model training
  - `consentDate`: Timestamp of when consent was provided
  - `consentVersion`: Tracks consent version for future policy updates (currently "1.0")
- **Consent Modal**: Shown to authenticated users when they have a routine but haven't provided consent preferences
  - Clear explanations of data usage for personalization and AI training
  - Optional checkboxes for both consent types
  - Links to Privacy Policy for full details
  - Can be skipped or completed at user's discretion
- **API Endpoints**: 
  - `POST /api/user/consent` - Record user consent preferences
  - `GET /api/user/consent` - Retrieve current consent status
- **Privacy Policy**: Comprehensive privacy policy at `/privacy-policy` detailing:
  - Data collection practices (quiz responses, routines, usage data)
  - AI training data usage and anonymization practices
  - Third-party services and affiliate link tracking
  - User rights (access, deletion, consent withdrawal, data export)
  - GDPR and CCPA compliance

### Future AI Training Architecture
**North Star Vision**: Build an AI recommendation engine that learns from real user results to provide increasingly accurate skincare recommendations.

**Data Pipeline (Future Implementation)**:
1. **Photo Analysis**: Users upload skin photos for AI-powered acne assessment
   - Track pustule count, severity, affected areas
   - Store before/after comparison data
2. **Product Correlation**: Link skin improvement data to specific product usage
   - Track which products user was using between photo analyses
   - Measure time intervals and usage patterns
   - Correlate product combinations with skin improvements
3. **Model Training**: Feed anonymized data into AI model
   - Input: Skin type, Fitzpatrick type, acne concerns, product usage, demographics
   - Output: Treatment effectiveness scores, product recommendations
   - Continuous improvement as more user data is collected
4. **Expansion**: Extend beyond acne to address aging concerns with acne-safe products

**Current Foundation (Implemented)**:
- Consent infrastructure to legally collect and use anonymized data
- Database schema supports user routine history
- Privacy policy establishes transparency and user rights
- All routines are saved per user, creating historical data for future analysis

## External Dependencies
- **Authentication**: Replit OIDC provider.
- **Database**: Neon serverless PostgreSQL.
- **Product Data**: 
  - Product links CSV (`Product Links for Acne Agent Routine Product Options.xlsx - Alternatives (1)_1760657834377.csv`) for product recommendations
  - Affiliate links CSV (`Affiliate Links - Sheet1_1760657834370.csv`) for affiliate link mappings (38 total)
  - Routine logic CSV (`Acne Agent Routine Logic.xlsx - Noninflamed (12)_1760647720504.csv`) for matching logic
  - Centralized product library (`shared/productLibrary.ts`) with 21 products across 8 categories including new Tool category
- **UI Components**: Radix UI primitives (`@radix-ui/*`).
- **Form Management**: React Hook Form with Zod resolver.
- **Fonts**: Inter and Playfair Display from Google Fonts CDN.
- **Branding**: Custom AcneAgent logo and favicon.