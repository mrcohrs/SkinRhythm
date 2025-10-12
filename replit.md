# SkinRhythm - Personalized Acne Skincare Application

## Overview

SkinRhythm is a personalized acne skincare application that helps users discover customized skincare routines through an interactive quiz system. The application analyzes user skin type, Fitzpatrick type, acne concerns, and pregnancy status to recommend appropriate morning and evening skincare products across different price tiers (budget, standard, premium). Users can authenticate via Replit Auth, save their routines, and access their personalized dashboard with product recommendations and detailed treatment plans.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: shadcn/ui with Radix UI primitives providing accessible, unstyled components that are customized with Tailwind CSS. The design follows a "New York" style variant with clinical healthcare aesthetics inspired by Curology, Hims & Hers, and Headspace.

**Styling**: Tailwind CSS with custom design tokens supporting both light and dark modes. Color palette uses dark forest green (#006652) primary color with warm beige backgrounds and yellow accents for a minimal, elegant aesthetic. Typography uses Playfair Display serif for headings and Inter for body text.

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. Authentication state is managed through a custom `useAuth` hook that queries the `/api/auth/user` endpoint.

**Routing**: Wouter for lightweight client-side routing with conditional rendering based on authentication status:
- Unauthenticated users see Landing page
- Authenticated users without saved routines see HomePage (landing with quiz option)
- Authenticated users with saved routines are automatically redirected to Dashboard
- Query parameter `?retake=true` bypasses dashboard redirect to allow quiz retaking

**Theme System**: Custom ThemeProvider context with localStorage persistence supporting light/dark mode toggling.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**Authentication**: OpenID Connect (OIDC) integration with Replit Auth using Passport.js strategy. Session management via express-session with PostgreSQL session store (connect-pg-simple).

**API Design**: RESTful endpoints including:
- `/api/auth/user` - Get authenticated user profile (requires authentication)
- `/api/login` - Initiates Replit Auth login flow
- `/api/logout` - Logs out user
- `/api/callback` - OAuth callback after successful login
- `/api/quiz/submit` - Submit quiz answers and receive routine recommendations (no auth required for free tier)
- `/api/routines/save` - Persist user routines (authenticated only)
- `/api/routines` - Get user's saved routines (authenticated only)

**Business Logic**: Excel-based product recommendation engine (`parseExcel.ts`) that loads skincare routine data from an XLSX file containing 60+ product combinations. Matching algorithm considers skin type, Fitzpatrick type, acne types array, age (mature status for 45+), and pregnancy/nursing status to return appropriate morning/evening product sets. **XLSX Parsing**: Uses `raw: true` with `defval: ''` to preserve Fitzpatrick values like "1-3" as text (prevents auto-conversion to dates "1/3/01"). All fields are normalized with `String().trim()` for consistent matching.

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

### Premium User Dashboard

**Purpose**: Provide authenticated users with a personalized dashboard to view their saved skincare routine, access premium treatment plans, and manage their account.

**Access**: Available at `/dashboard` route for authenticated users with saved routines. Users are automatically redirected from `/` to `/dashboard` when they have saved routines.

**Dashboard Components**:
- **Header**: "free skin" branding, ingredient checker link, logout button
- **User Info Section**: Displays "Your Routine, {name}" with skin type, acne severity, and premium badge (if applicable)
- **Action Buttons**: 
  - "Retake Quiz": Navigates to `/?retake=true` to bypass dashboard redirect and allow quiz retaking
  - "Refer a Friend": Copies site URL to clipboard for sharing
- **Tabbed Interface**:
  - "My Products" tab (default): Shows morning and evening routine products in order
  - "Detailed Treatment Plan" tab: Premium-only access to WeeklyRoutine component

**My Products Tab**:
- Morning Routine card: Ordered list of AM products with step numbers
- Evening Routine card: Ordered list of PM products with step numbers
- Each product displays: name, category, tier badge (budget/midrange/luxury), "Buy Now" button with affiliate link
- Premium upsell card for non-premium users at bottom

**Detailed Treatment Plan Tab**:
- Disabled for non-premium users (shows "Treatment Plan (Premium)" label)
- Premium users see WeeklyRoutine component with 3 cards (Weeks 1-2, 3-4, 5-6)
- Displays step-by-step AM/PM routines with product mappings and treatment notes

**Retake Quiz Flow**:
- Dashboard "Retake Quiz" button navigates to `/?retake=true`
- HomePage checks for `retake` query parameter
- If present, skips automatic dashboard redirect and shows landing page content
- User can then click "free skin quiz" button to start new quiz

### Ingredient Checker Feature

**Purpose**: Allow authenticated users to paste product ingredient lists and check for acne-causing ingredients from a database of 348 known comedogenic substances.

**Access**: Available to all authenticated users via flask icon button in header (route: `/ingredient-checker`)

**Matching Algorithm**: 
- Word-boundary matching using exact word equality
- Normalizes ingredients by converting to lowercase and removing special characters
- Checks if all words from an acne-causing ingredient appear as complete words in the input
- Example: "Coconut Oil" input matches "Coconut" in database; "Cyclopentasiloxane" does NOT match "SLO"

**Design Limitations**:
- Designed for standard ingredient list formats (one ingredient per line from product labels)
- Does NOT handle complex marketing language like "paraben-free formula" or "free of coconut oil"
- Users should enter only ingredient names from product labels, not marketing descriptions
- Edge cases with mixed marketing/ingredient text may produce unexpected results

**Data Source**: `shared/acneCausingIngredients.ts` containing 348 acne-causing ingredients with normalization and checking logic

### Premium 6-Week Treatment Routines

**Purpose**: Provide premium users with detailed week-by-week treatment schedules based on their specific acne type, offering progressive skincare guidance over the first 6 weeks of treatment.

**Access**: Exclusive to premium users (isPremium=true), displayed above product recommendations on routine results page

**Routine Types** (applies to both pregnant/nursing and non-pregnant users):
- **Inflamed**: For users with cystic, nodular, papular, or pustular acne. Includes ice therapy and timed acne med (Week 1=15min, Week 2=30min, Week 3=60min, Week 4+=overnight)
- **Non-inflamed Mild**: For mild comedonal acne (whiteheads/blackheads). No ice therapy, no acne med, focuses on chemical exfoliation only
- **Non-inflamed Moderate/Severe**: For moderate-severe comedonal acne. No ice therapy, includes timed acne med (Week 1=15min, Week 2=30min, Week 3=60min, Week 4+=overnight)
- **Rosacea**: For acne rosacea. No ice therapy, includes gentle timed acne med (Week 1=15min, Week 2=30min, Week 3=60min, Week 4+=overnight)

**Product Categories**: Products are mapped to specific routine steps - Cleanser, Toner, Serum (actives), Hydrator (hyaluronic/peptide serums), Moisturizer, Sunscreen (SPF), Acne Med (benzoyl peroxide treatments)

**Price Tiers**: All products are categorized as budget (<$25), midrange/standard ($25-50), or luxury (>$50) based on actual retail pricing

**Weekly Schedule Structure**:
- Weeks 1-2: Introduction phase with every-other-day AM serums, ice therapy (inflamed only), timed acne med in PM (Week 1=15min rinse, Week 2=30min rinse per CSV notes)
- Weeks 3-4: Daily AM serums, ice therapy continues (inflamed only), transition to overnight acne med in PM with no moisturizer
- Weeks 5-6: Daily AM serums, PM serums added, ice therapy continues (inflamed only), overnight acne med with no moisturizer

**Routine Determination Logic**: Algorithm in `determineRoutineType()` analyzes user's acne types and severity:
- Rosacea mentioned → 'rosacea' routine
- Cysts/nodules/papules/pustules → 'inflamed' routine  
- Otherwise with mild severity → 'noninflamed-mild' routine
- Otherwise → 'noninflamed-moderate-severe' routine

**Implementation**: `WeeklyRoutine` component displays 3 cards (Weeks 1-2, 3-4, 5-6) with morning/evening routines, step-by-step badges, product mappings, and treatment notes. Component only renders when user has premium status and routine type is provided by backend.

**Premium CTAs for Non-Premium Users**: 
- Displayed at the end of both morning and evening routine product sections
- Morning CTA: "Get Your Detailed 6-Week Treatment Plan" - emphasizes step-by-step guidance for ramping up on actives
- Evening CTA: "Unlock Your Progressive Treatment Schedule" - highlights the timing and tolerance-building approach
- CTAs use the `PremiumUpsell` component with custom title and description props