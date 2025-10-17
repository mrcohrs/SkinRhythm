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
- **Quiz Flow**: 8-step questionnaire with conditional logic and accurate progress tracking:
  - Steps: Name → Age → Skin Type → Skin Tone (visual) → Sun Reaction (conditional) → Acne Types → Severity → Pregnancy
  - Progress bar calculation uses `getVisibleStepNumber()` to accurately reflect visible steps (7 or 8 depending on skip logic)
  - All mandatory questions are answered before completion
- **Post-Quiz Navigation**: Non-authenticated users see navigation header with logo (home link), retake quiz button, create account button, theme toggle, and mailing list signup section.
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
  - `users` (profiles, `isPremium` flag, consent fields)
  - `routines` (user-specific routines including demographic and product data)
- **Migrations**: Drizzle Kit.

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
  - Affiliate links CSV (`Affiliate Links - Sheet1_1760657834370.csv`) for affiliate link mappings
  - Routine logic CSV (`Acne Agent Routine Logic.xlsx - Noninflamed (12)_1760647720504.csv`) for matching logic
- **UI Components**: Radix UI primitives (`@radix-ui/*`).
- **Form Management**: React Hook Form with Zod resolver.
- **Fonts**: Inter and Playfair Display from Google Fonts CDN.
- **Branding**: Custom AcneAgent logo and favicon.