# SkinRhythm - Personalized Acne Skincare Application

## Overview
SkinRhythm is a personalized acne skincare application that provides customized skincare routines. It analyzes user skin type, Fitzpatrick type, acne concerns, and pregnancy status through an interactive quiz to recommend morning and evening skincare products across budget, standard, and premium price tiers. The application supports user authentication, routine saving, and offers a personalized dashboard with product recommendations and detailed treatment plans. Its purpose is to deliver a clinical yet elegant user experience, guiding users towards effective acne management with a vision to build an AI recommendation engine that learns from real user results for increasingly accurate skincare advice. Analytics are tracked via Google Analytics 4 (G-D7MPP707ZJ).

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The frontend is built with React and TypeScript, utilizing `shadcn/ui` with Radix UI primitives and Tailwind CSS, adhering to a "New York" style variant inspired by clinical aesthetics (e.g., Curology, Hims & Hers). It supports both light and dark modes. The routine display uses eyebrow-style badge tags for skin characteristics with outline-only borders and black text for clear visual hierarchy. The Dashboard mobile navigation features a carousel-style tab selector with left/right chevron arrows for quick navigation, swipe gesture support for natural mobile interaction, and a center tap-to-dropdown for direct tab access.

### Technical Implementations
- **Frontend**: React with TypeScript (Vite), Wouter for routing, TanStack Query for server state, and a custom `useAuth` hook.
- **Backend**: Express.js with TypeScript (Node.js), using custom email/password authentication via Passport.js local strategy with bcrypt password hashing, backed by `express-session` with a PostgreSQL store.
- **Authentication Flow**: Custom LoginModal component handles user authentication across Landing, Marketplace, and Pricing pages. Users sign up/login via email and password (no Replit branding in production).
- **Database**: PostgreSQL (Neon serverless driver) managed with Drizzle ORM and Drizzle Kit for migrations.
- **Core Features**:
    - **Quiz Flow**: A 9-step questionnaire with conditional logic, including a two-step Fitzpatrick determination process (visual skin tone selection followed by a conditional sun reaction question).
    - **Routine Generation**: A CSV-based product recommendation engine matches user profiles (skin type, Fitzpatrick type, acne types, age, pregnancy status) to recommend product sets, supporting premium product alternatives and a multi-level specificity scoring system.
    - **Product Images**: SKU-based product image system displays specific product photos for default products (19 SKU-named images: AC-1, B1-1, B2-1, B5-1, CC-3, CS-1, ES-1, GC-2, HM-1, HS-1, LM-1, MS-1, MSFS-2, MT-2, RET-1, RS-1, RT-2, ST-1, VS-1) with graceful fallback to category-based images for non-default products. Centralized helper function in `productImages.ts` ensures consistent image resolution across all product card components.
    - **Dashboard**: Authenticated users access a personalized view of saved routines, detailed premium treatment plans, and routine management features.
    - **Ingredient Checker**: Allows authenticated users to identify 348 acne-causing ingredients using word-boundary matching. Features contextual scanner pack upsells when users have 0 scans (prominent card) or fewer than 3 scans remaining (bottom card).
    - **Monetization**: Implements a three-tier membership system (free, premium, premium_plus) with feature gating for ingredient scans, product alternatives, and routine coaching. Includes an entitlements system for managing feature access and tracking scan usage.
    - **Consent System**: Comprehensive user consent management for data collection and AI training, featuring a consent modal and API endpoints for recording and retrieving preferences.
    - **MVP Card & Banner System**: Context-aware information cards and weekly rotating promotional banners with intelligent visibility rules, tracking, and suppression logic.
    - **Affiliate Links System**: Integrates 37 affiliate links, dynamically transforming product links for shop/buy CTAs and ensuring backwards compatibility for existing routines.
    - **Ice Globes Upsells**: Strategic product recommendations for ice globes displayed across multiple locations for users with inflamed routine types.

### System Design Choices
The application is designed for scalability and maintainability, emphasizing a clear separation of concerns between frontend and backend. Data storage includes sessions, users, routine data, purchase records, and interaction tracking for cards and banners. Consent infrastructure is a foundational element, ensuring legal compliance for data collection and future AI model training. The system is built to support a future AI recommendation engine that learns from user data to refine product recommendations.

## External Dependencies
- **Authentication**: Custom email/password authentication with bcrypt password hashing and Passport.js local strategy.
- **Database**: Neon serverless PostgreSQL.
- **Product Data**: CSV file (`AcneSafe_Products_Combined`) with SKU field for product recommendations, affiliate link mappings (38 links), and routine logic. A centralized `productLibrary.ts` holds 21 products across 8 categories with SKU-based image mapping.
- **UI Components**: Radix UI primitives (`@radix-ui/*`).
- **Form Management**: React Hook Form with Zod resolver.
- **Fonts**: Inter and Playfair Display from Google Fonts CDN.
- **Branding**: Custom SkinRhythm logo and favicon.