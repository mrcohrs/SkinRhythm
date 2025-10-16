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
- **Affiliate Disclosure**: Dedicated disclosure page at `/affiliate-disclosure` with FTC-compliant language. Disclosure notice banner appears at top of product recommendation pages, with footer links on all major pages (Landing, Dashboard, RoutineDisplay, AffiliateDisclosure).

### Backend
- **Server**: Express.js with TypeScript (Node.js).
- **Authentication**: OpenID Connect (OIDC) via Replit Auth and Passport.js, using `express-session` with a PostgreSQL store.
- **API**: RESTful endpoints for authentication, quiz submission, routine saving/retrieval, and current routine management.
- **Business Logic**: CSV-based product recommendation engine. Matches skin type, Fitzpatrick type, acne types, age (mature status), and pregnancy status to recommend product sets. Extracts real product names from URLs, filtering out IDs and converting to Title Case. Supports premium product alternatives.
- **Premium Features**: 6-week progressive treatment routines (Inflamed, Non-inflamed Mild/Moderate/Severe, Rosacea) for premium users, detailing step-by-step AM/PM routines, product mappings, and treatment notes.

### Data Storage
- **Database**: PostgreSQL (Neon serverless driver).
- **ORM**: Drizzle ORM for type-safe operations.
- **Schema**: `sessions` (Replit Auth), `users` (profiles, `isPremium` flag), `routines` (user-specific routines including demographic and product data).
- **Migrations**: Drizzle Kit.

## External Dependencies
- **Authentication**: Replit OIDC provider.
- **Database**: Neon serverless PostgreSQL.
- **Product Data**: Excel file (`Acne_Assist_Routines_60_With_Alternatives_1759622368076.xlsx`) parsed via SheetJS for product recommendations.
- **UI Components**: Radix UI primitives (`@radix-ui/*`).
- **Form Management**: React Hook Form with Zod resolver.
- **Fonts**: Inter and Playfair Display from Google Fonts CDN.
- **Branding**: Custom AcneAgent logo and favicon.