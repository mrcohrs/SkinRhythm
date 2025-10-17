# AcneAgent - Personalized Acne Skincare Application

## Overview
AcneAgent is a personalized acne skincare application designed to provide users with customized skincare routines. It analyzes user skin type, Fitzpatrick type, acne concerns, and pregnancy status through an interactive quiz to recommend morning and evening skincare products across budget, standard, and premium price tiers. Users can authenticate, save their routines, and access a personalized dashboard with product recommendations and detailed treatment plans. The application aims to offer a clinical yet elegant user experience, guiding users towards effective acne management.

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
- **Schema**: `sessions` (Replit Auth), `users` (profiles, `isPremium` flag), `routines` (user-specific routines including demographic and product data).
- **Migrations**: Drizzle Kit.

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