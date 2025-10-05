# SkinRhythm - Personalized Acne Skincare Application

## Overview

SkinRhythm is a personalized acne skincare application that helps users discover customized skincare routines through an interactive quiz system. The application analyzes user skin type, Fitzpatrick type, acne concerns, and pregnancy status to recommend appropriate morning and evening skincare products across different price tiers (budget, standard, premium). Users can authenticate via Replit Auth, save their routines, and access product recommendations with affiliate links.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: shadcn/ui with Radix UI primitives providing accessible, unstyled components that are customized with Tailwind CSS. The design follows a "New York" style variant with clinical healthcare aesthetics inspired by Curology, Hims & Hers, and Headspace.

**Styling**: Tailwind CSS with custom design tokens supporting both light and dark modes. Color palette emphasizes clinical trust (medical blue primary) combined with calming wellness tones (teal accents). Typography uses Inter font family for professional, medical-grade appearance.

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. Authentication state is managed through a custom `useAuth` hook that queries the `/api/auth/user` endpoint.

**Routing**: Wouter for lightweight client-side routing with conditional rendering based on authentication status (authenticated users see HomePage, unauthenticated see Landing).

**Theme System**: Custom ThemeProvider context with localStorage persistence supporting light/dark mode toggling.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**Authentication**: OpenID Connect (OIDC) integration with Replit Auth using Passport.js strategy. Session management via express-session with PostgreSQL session store (connect-pg-simple).

**API Design**: RESTful endpoints including:
- `/api/auth/user` - Get authenticated user profile
- `/api/quiz/submit` - Submit quiz answers and receive routine recommendations
- `/api/routines/save` - Persist user routines (authenticated only)

**Business Logic**: Excel-based product recommendation engine (`parseExcel.ts`) that loads skincare routine data from an XLSX file containing 60+ product combinations. Matching algorithm considers skin type, Fitzpatrick type, acne types array, and pregnancy/nursing status to return appropriate morning/evening product sets.

**Development Tools**: Vite middleware integration for HMR in development, separate production build pipeline using esbuild for server bundle.

### Data Storage

**Database**: PostgreSQL accessed via Neon serverless driver with WebSocket support

**ORM**: Drizzle ORM for type-safe database operations with schema-first approach

**Schema Design**:
- `sessions` table - Session storage for Replit Auth (sid, sess jsonb, expire timestamp)
- `users` table - User profiles (id, email, firstName, lastName, profileImageUrl, isPremium flag, timestamps)
- `routines` table - Saved user routines (id, userId foreign key, demographic data, routineData jsonb containing full product recommendations)

**Migration Strategy**: Drizzle Kit for schema migrations with configuration pointing to `./migrations` output directory

### External Dependencies

**Authentication Service**: Replit OIDC provider for user authentication with configurable issuer URL

**Database Service**: Neon serverless PostgreSQL with connection pooling

**Product Data Source**: Excel file (`Acne_Assist_Routines_60_With_Alternatives_1759622368076.xlsx`) containing curated skincare product recommendations parsed via SheetJS (XLSX library)

**UI Component Library**: Radix UI primitives (@radix-ui/*) for accessible components including dialogs, dropdowns, tooltips, radio groups, checkboxes, progress bars, and more

**Form Management**: React Hook Form with Zod resolver for type-safe form validation

**Google Fonts**: Inter and Playfair Display fonts loaded via Google Fonts CDN

**Development Integrations**: Replit-specific plugins for Vite including runtime error overlay, cartographer, and dev banner (development environment only)