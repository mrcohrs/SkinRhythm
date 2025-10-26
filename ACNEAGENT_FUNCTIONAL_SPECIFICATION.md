# AcneAgent - Functional Specification
**Version:** 1.0  
**Last Updated:** October 26, 2025

---

## Table of Contents
1. [User Tiers & Entitlements](#user-tiers--entitlements)
2. [Purchase Options & Pricing](#purchase-options--pricing)
3. [Ingredient Scan System](#ingredient-scan-system)
4. [Quiz Flow & Logic](#quiz-flow--logic)
5. [Routine Generation & Matching](#routine-generation--matching)
6. [Dashboard Features](#dashboard-features)
7. [Marketplace Access](#marketplace-access)
8. [Ingredient Checker](#ingredient-checker)
9. [Card System](#card-system)
10. [Banner System](#banner-system)
11. [Consent System](#consent-system)
12. [Affiliate Links](#affiliate-links)
13. [Ice Globes Upsells](#ice-globes-upsells)
14. [Routine Modes](#routine-modes)
15. [Routine Library & Product Alternatives](#routine-library--product-alternatives)

---

## User Tiers & Entitlements

### Tier Definitions
AcneAgent has **3 membership tiers** stored in the `membershipTier` field:
- **free** - Default tier for all users
- **premium** - Paid subscription ($2.99/mo founding or $5.99/mo standard)
- **premium_plus** - Future tier (not currently available)

### Entitlements Structure
The `getUserEntitlements()` function in `shared/entitlements.ts` calculates all feature access permissions:

```typescript
interface UserEntitlements {
  tier: MembershipTier;
  isPremium: boolean;
  isFoundingMember: boolean;
  hasUnlimitedScans: boolean;
  hasRoutineCoach: boolean;
  hasProductAlternatives: boolean;
  hasRoutineLibrary: boolean;
  scansRemaining: number | "unlimited";
  canScan: boolean;
}
```

### Free Tier
**What users get:**
- ✅ Complete personalized quiz
- ✅ Basic routine with budget-friendly products
- ✅ 3 total ingredient scans (lifetime)
- ✅ Product cards with single default product per category
- ✅ Ability to save one routine
- ❌ No product alternatives
- ❌ No Routine Coach
- ❌ No Routine Library
- ❌ No Marketplace access

**Calculated Entitlements:**
```typescript
{
  tier: "free",
  isPremium: false,
  isFoundingMember: false,
  hasUnlimitedScans: false,
  hasRoutineCoach: false,
  hasProductAlternatives: false,
  hasRoutineLibrary: false,
  scansRemaining: 3 - scanCredits,
  canScan: scanCredits < 3
}
```

### Premium Tier
**What users get:**
- ✅ All free tier features
- ✅ **Unlimited ingredient scans**
- ✅ **Routine Coach** - Weekly AM/PM schedules with ramping instructions
- ✅ **Product Alternatives** - Multiple product options per category with ability to switch
- ✅ **Routine Library** - Save unlimited routines, switch between them, add notes
- ✅ **Marketplace Access** - Browse all 56+ product variants across 8 categories
- ✅ **Routine Mode Toggle** - Switch between basic (default/budget) and premium (recommended) products

**Calculated Entitlements:**
```typescript
{
  tier: "premium",
  isPremium: true,
  isFoundingMember: user.isFoundingMember,
  hasUnlimitedScans: true,
  hasRoutineCoach: true,
  hasProductAlternatives: true,
  hasRoutineLibrary: true,
  scansRemaining: "unlimited",
  canScan: true
}
```

### One-Time Purchases (Standalone Features)
Users can purchase specific features without Premium subscription:

#### Premium Routine Access ($9.99 one-time)
- Unlocks product alternatives for **current routine only**
- Stored in `hasPremiumRoutineAccess` boolean + `premiumRoutineAccessRoutineId`
- Does NOT include Routine Coach or unlimited scans
- Does NOT carry over to new routines (tied to specific routine ID)

#### Detailed PDF ($9.99 one-time)
- Downloadable PDF of current routine
- Includes AM/PM schedule, ramping instructions, insider tips
- Stored in `hasDetailedPdfAccess` boolean
- Does NOT include product alternatives or Routine Coach

---

## Purchase Options & Pricing

### Stripe Price IDs
All product prices are defined in `client/src/lib/stripe.ts` and `server/stripe-config.ts`:

```typescript
STRIPE_PRICE_IDS = {
  PREMIUM_FOUNDING: 'price_1SLDhT03lUrD9KcrUSBaz576',    // $2.99/mo
  PREMIUM_STANDARD: 'price_1SLDin03lUrD9KcrcAqNi7mJ',    // $5.99/mo
  DETAILED_PDF: 'price_1SLDjr03lUrD9KcrpIOhf0Gm',        // $9.99 one-time
  PREMIUM_ROUTINE_ACCESS: 'price_1SLDlc03lUrD9Kcrty8k3YYO', // $9.99 one-time
  SCAN_PACK_5: 'price_1SLDpg03lUrD9KcrZ1ViD7oK',         // $1.99 one-time
  SCAN_PACK_20: 'price_1SLDqL03lUrD9KcruPVIh5Qz',        // $3.99 one-time
  UNLIMITED_SCANNER: 'price_1SLDqm03lUrD9KcrO4G8cL3g',   // $3.49/mo
}
```

### Founding Rate System
- **Limit:** 500 founding memberships
- **Price:** $2.99/month (vs $5.99/month standard)
- **Tracking:** `foundingRateCounter` table with singleton row
- **Auto-disable:** When `premiumFoundingPurchases >= foundingRateLimit`
- **Rate Lock:** Founding members keep $2.99/month rate forever (`isFoundingMember` flag)

**Founding Rate Banner Logic:**
- Shown on Pricing page when `foundingRateActive === true`
- Displays remaining spots: `foundingRateLimit - premiumFoundingPurchases`
- Featured badge on Premium subscription card

### Purchase Tracking
All purchases are recorded in `purchases` table:

```typescript
{
  userId: string,
  productType: 'premium_subscription' | 'detailed_pdf' | 'premium_routine_access' | 
               'scan_pack_5' | 'scan_pack_20' | 'unlimited_scanner',
  amount: number,
  scansGranted: number,           // 5 or 20 for scan packs, 0 otherwise
  isSubscription: boolean,         // true for Premium and Unlimited Scanner
  isFoundingRate: boolean,         // true if purchased at founding rate
  status: 'completed' | 'pending' | 'failed' | 'refunded',
  stripePaymentIntentId: string,
  stripeSubscriptionId: string     // for subscriptions only
}
```

---

## Ingredient Scan System

### Scan Credits & Limits

#### Free Tier Users
- **Total Scans:** 3 (lifetime)
- **Tracking:** `scanCredits` field increments on each scan
- **Formula:** `scansRemaining = 3 - scanCredits`
- **Exhausted State:** When `scanCredits >= 3`, user cannot scan

#### Premium/Unlimited Scanner Users
- **Scans:** Unlimited
- **Tracking:** `hasUnlimitedScans = true`
- **No Decrement:** Scan credit counter is not incremented

#### Scan Pack Purchases
- **5 Scans:** $1.99 (adds 5 to user's balance)
- **20 Scans:** $3.99 (adds 20 to user's balance, best value)
- **Credits Added:** Purchase adds `scansGranted` to user's available scan count
- **Calculation:** Free users can have scans > 3 after purchase

### Scan Usage Flow

**API Endpoint:** `POST /api/scans/use-credit`

**Logic:**
```typescript
if (user.hasUnlimitedScans) {
  // No credit deduction, allow scan
  return { unlimited: true }
} else {
  // Free user or scan pack user
  const remaining = 3 - user.scanCredits + purchasedScans
  if (remaining <= 0) {
    throw new Error("No scans remaining")
  }
  // Increment scanCredits
  user.scanCredits += 1
  return { scansRemaining: remaining - 1 }
}
```

### Ingredient Database
- **Total Ingredients:** 348 acne-causing ingredients
- **Matching:** Word-boundary matching (`\b${ingredient}\b` regex)
- **Case-Insensitive:** All matches ignore case
- **Location:** `shared/acneCausingIngredients.ts`

### Scan Paywall Modal
Triggered when `canScan === false`:

**Display Logic:**
- Shows if user has 0 scans remaining OR `hasUnlimitedScans === false` and tries to scan
- **Two Tabs:**
  1. Premium Membership (featured)
  2. Scan Packs (5 scans or 20 scans)

**Upsell Triggers:**
- After 3rd scan for free users (last free scan used)
- Immediate on 4th scan attempt (paywall blocks scan)

---

## Quiz Flow & Logic

### Quiz Steps (9 Total)
The quiz has **9 steps**, but some are conditionally shown:

| Step # | Field | Type | Always Shown? | Notes |
|--------|-------|------|--------------|-------|
| 0 | name | text | ✅ Yes | User's first name |
| 1 | age | number | ✅ Yes | Used for maturity calculation (age >= 45) |
| 2 | skinType | select | ✅ Yes | 'dry', 'normal', 'oily' |
| 3 | skinTone | visual | ✅ Yes | 6 options (1-6) |
| 4 | sunReaction | select | ❌ Conditional | Only if skinTone === 3 or 4 |
| 5 | acneTypes | multiselect | ✅ Yes | 'inflamed', 'noninflamed', 'acne-rosacea' |
| 6 | acneSeverity | select | ✅ Yes | 'mild', 'moderate', 'severe' |
| 7 | beautyProducts | multiselect | ❌ HIDDEN | Step exists but not shown to user |
| 8 | isPregnantOrNursing | boolean | ✅ Yes | 'yes' or 'no' |

### Conditional Logic

#### Sun Reaction Step (Step 4)
**Shown only when:** `skinTone === 3 OR skinTone === 4`

**Options:**
- **A:** "My skin never burns and always tans"
- **B:** "My skin sometimes burns, but usually tans"
- **C:** "My skin always burns, almost never tans"

#### Fitzpatrick Type Calculation
```typescript
// If skinTone is 1 or 2
fitzpatrickType = '1-3'

// If skinTone is 5 or 6
fitzpatrickType = '4+'

// If skinTone is 3 or 4 (conditional sun reaction step)
if (sunReaction === 'A' || sunReaction === 'B') {
  fitzpatrickType = '4+'
} else {
  fitzpatrickType = '1-3'
}
```

### Progress Bar Display
- Total visible steps: 8 (step 7 hidden)
- Progress calculation accounts for conditional sun reaction step
- Formula: `visibleStepNumber / totalVisibleSteps`

---

## Routine Generation & Matching

### Routine Type Determination
Based on quiz answers, routines are categorized into **4 types**:

```typescript
type RoutineType = 'inflamed' | 'noninflamed-mild' | 
                   'noninflamed-moderate-severe' | 'rosacea'
```

**Logic (from `determineRoutineType`):**
```typescript
const hasRosacea = acneTypes.includes('acne-rosacea')
const hasInflamed = acneTypes.includes('inflamed')

if (hasRosacea) return 'rosacea'
if (hasInflamed) return 'inflamed'

// Non-inflamed acne
if (acneSeverity === 'mild') return 'noninflamed-mild'
return 'noninflamed-moderate-severe'
```

### CSV Matching Algorithm
**Source:** `server/parseExcel.ts` - `getRoutineForAnswers()`

**Input Profile:**
```typescript
{
  skinType: 'dry' | 'normal' | 'oily',
  fitzpatrickType: '1-3' | '4+',
  acneTypes: string[],
  acneSeverity: 'mild' | 'moderate' | 'severe',
  isPregnantOrNursing: 'yes' | 'no',
  age: string,
  isPremiumUser: boolean
}
```

**Matching Process:**
1. **Filter CSV rows** that match pregnancy status and primary acne type
2. **Calculate specificity score** for each matching row:
   - **Exact Matches** (+1000 points each):
     - Mature status matches (`age >= 45` vs row.mature)
     - Fitzpatrick type exact match
     - Skin type exact match (single value)
     - Severity exact match (single value)
   - **Partial Matches** (+100 points each):
     - Multi-value skin type includes user's type
     - Multi-value severity includes user's severity
   - **Wildcards** (+1 point each):
     - Row has 'All' for mature, fitzpatrick, skin type, or severity

3. **Sort by specificity score** (highest first)
4. **Return top match** with product IDs

**Example Specificity Calculation:**
```typescript
// User: Normal skin, Fitz 1-3, Moderate severity, Not mature
// Row A: Normal, 1-3, Moderate, No -> Score: 4000 (4 exact matches)
// Row B: Normal/Oily, 1-3, All, No -> Score: 2101 (2 exact, 1 partial, 1 wildcard)
// Row C: All, All, All, All -> Score: 4 (4 wildcards)
// Winner: Row A (most specific)
```

### Product Resolution
**After matching, resolve product IDs to actual products:**

```typescript
// From CSV row, get product IDs like:
productIds = [
  'gel-cleanser',
  'soothing-toner',
  'mandelic-serum-full',
  'hydrating-serum',
  'light-moisturizer',
  'mineral-spf',
  'bpo-2-5'
]
```

**For each product ID:**
1. Look up in `PRODUCT_LIBRARY` (21 products defined)
2. Get all specific product variants from CSV
3. Determine which variant to show:
   - **Free users:** Show `isDefault = true` product
   - **Premium users (basic mode):** Show `isDefault = true` product
   - **Premium users (premium mode):** Show `isRecommended = true` product

### Routine Data Structure
```typescript
{
  skinType: string,
  fitzpatrickType: string,
  acneTypes: string[],
  isPregnantOrNursing: boolean,
  routineType: RoutineType,
  productIds: string[],
  products: {
    morning: Product[],
    evening: Product[]
  }
}
```

### AM/PM Product Split
**Rules:**
- **SPF:** AM only
- **Spot Treatment:** PM only
- **All others:** Both AM and PM (Cleanser, Toner, Serum, Hydrator, Moisturizer)

---

## Dashboard Features

### Feature Access by Tier

| Feature | Free | Premium | Premium Routine Access | Detailed PDF |
|---------|------|---------|----------------------|--------------|
| View Current Routine | ✅ | ✅ | ✅ | ✅ |
| Routine Coach (Weekly Schedule) | ❌ | ✅ | ❌ | ❌ |
| Product Alternatives | ❌ | ✅ | ✅ (current routine only) | ❌ |
| Routine Library | ❌ | ✅ | ❌ | ❌ |
| Download PDF | ❌ | ❌ | ❌ | ✅ |
| Routine Notes | ❌ | ✅ | ❌ | ❌ |
| Switch Products | ❌ | ✅ | ✅ (current routine only) | ❌ |
| Save Multiple Routines | ❌ | ✅ | ❌ | ❌ |
| Ingredient Checker | 3 scans | Unlimited | 3 scans | 3 scans |
| Marketplace | ❌ | ✅ | ❌ | ❌ |

### Routine Display Modes

#### Standard View (Free & Basic)
```typescript
// Each product card shows:
{
  name: "Product Name",
  brand: "Brand Name",
  category: "Cleanser",
  price: 15.99,
  benefits: ["Gentle", "Hydrating"],
  affiliateLink: "https://...",
  premiumOptions: undefined  // Hidden for free users
}
```

#### Premium View (with Alternatives)
```typescript
{
  name: "Product Name",
  brand: "Brand Name",
  category: "Cleanser",
  price: 15.99,
  benefits: ["Gentle", "Hydrating"],
  affiliateLink: "https://...",
  isRecommended: true,
  premiumOptions: [
    {
      productName: "Alternative 1",
      priceRange: "$10-$15",
      affiliateLink: "https://...",
      isCurrent: false
    },
    {
      productName: "Alternative 2",
      priceRange: "$20-$25",
      affiliateLink: "https://...",
      isCurrent: false
    }
  ]
}
```

### Product Selection & Persistence
**API:** `POST /api/routines/:routineId/set-product`

**Flow:**
1. User clicks "Use This" button on alternative product
2. Request sent with `{ category, productName }`
3. Backend updates `currentProductSelections` JSONB field
4. Frontend invalidates routine cache
5. Product card shows "Current" badge on selected product

**Storage:**
```typescript
routine.currentProductSelections = {
  "Cleanser": "La Roche-Posay Toleriane Hydrating Gentle Cleanser",
  "Toner": "Paula's Choice Enriched Calming Toner",
  // ... other categories
}
```

---

## Marketplace Access

### Access Control
**Requirements:** Premium membership ONLY

**Gating Logic:**
```typescript
const isPremium = (user.membershipTier === "premium" || 
                   user.membershipTier === "premium_plus") && 
                  (!user.membershipExpiresAt || 
                   new Date(user.membershipExpiresAt) > new Date())

if (!isPremium) {
  return res.status(403).json({ 
    message: "Premium membership required to access marketplace"
  })
}
```

### Product Catalog
**Source:** All products from `PRODUCT_LIBRARY` in `shared/productLibrary.ts`

**Categories (8 total):**
- Cleanser
- Toner
- Serum
- Hydrator
- Moisturizer
- SPF
- Treatment
- Tool

**Products:** 21 general products with 56+ specific variants loaded from CSV

### Filtering & Search

#### Category Filter
- Dropdown: "All Categories" or specific category
- Filters products to show only matching category

#### Price Tier Filter
- Options: "All Prices", "Budget", "Standard", "Premium"
- Filters by `priceTier` field

#### Brand Filter
- Dropdown populated from unique brands in product variants
- Filters specific products by brand name

#### Search
- Searches across:
  - Product name
  - Brand name
  - General product name
- Case-insensitive substring matching

### Product Display
Each product card shows:
- General product name
- Category badge
- Price tier badge
- All specific product variants with:
  - Brand
  - Product name
  - Price range
  - Affiliate "Shop" link
  - Default/Recommended badges

---

## Ingredient Checker

### Access & Limits
- **Page:** `/ingredient-checker`
- **Authentication:** Required (redirects to login if not authenticated)
- **Scan Limits:**
  - Free: 3 total scans
  - Premium/Unlimited Scanner: Unlimited

### Ingredient Detection
**Database:** 348 acne-causing ingredients in `shared/acneCausingIngredients.ts`

**Matching Algorithm:**
```typescript
function checkIngredients(inputText: string): {
  found: string[],
  total: number,
  isClean: boolean
} {
  const found = []
  for (const ingredient of acneCausingIngredients) {
    // Word-boundary regex for accurate matching
    const regex = new RegExp(`\\b${escapeRegex(ingredient)}\\b`, 'i')
    if (regex.test(inputText)) {
      found.push(ingredient)
    }
  }
  return {
    found,
    total: found.length,
    isClean: found.length === 0
  }
}
```

### Results Display
**Clean Product:**
```
✅ Acne-Safe
No acne-causing ingredients detected
```

**Problematic Product:**
```
⚠️ 3 Acne-Causing Ingredients Found:
- Cetearyl Alcohol
- Isopropyl Myristate
- Coconut Oil
```

### Scan Pack Upsell Cards

#### Zero Scans Remaining
**Card Position:** Prominent above input (replaces main UI)

**Trigger:** `scansRemaining === 0 && !hasUnlimitedScans`

**Content:**
```
🔒 Out of Scans
You've used all 3 free scans.
[Upgrade to Premium] [Buy Scan Pack]
```

#### Low Scans Warning
**Card Position:** Bottom of page

**Trigger:** `scansRemaining < 3 && scansRemaining > 0`

**Content:**
```
ℹ️ Running Low
You have 1 scan remaining.
[Get More Scans]
```

---

## Card System

### Card Definitions
**Source:** `server/cardVisibility.ts`

**5 Cards Total:**

#### 1. "how-it-works" Card
- **Page:** quiz-results
- **Title:** "Your personalized AcneAgent routine."
- **Body:** Explanation of product analysis
- **CTA:** "View My Routine"
- **Priority:** High

#### 2. "budgeting" Card
- **Page:** quiz-results
- **Title:** "AcneAgent Works with Your Budget"
- **Body:** Core routine recommendation (cleanser, moisturizer, SPF ~$60)
- **Primary CTA:** "View Full Routine"
- **Secondary CTA:** "View Core Routine"
- **Suppression:** 30 days after click

#### 3. "scanner-access" Card
- **Page:** my-products
- **Title:** "Check if non-routine products are acne-safe."
- **Body:** 1-week free Premium trial for ingredient scanner
- **CTA:** "Open Ingredient Scanner →"
- **Priority:** Highest (shown first)

#### 4. "makeup-reminder" Card
- **Page:** my-products
- **Title:** "Makeup isn't the enemy"
- **Body:** Check makeup with ingredient checker
- **CTA:** "Explore acne-safe beauty →"
- **Suppression:** 14 days after click

#### 5. "contact-us" Card
- **Page:** my-products
- **Title:** "We're here to help"
- **Body:** Assistance with alternatives and budget
- **CTA:** "Contact us →"
- **Priority:** Lowest

### Interaction Tracking
**Table:** `card_interactions`

```typescript
{
  userId: string,
  cardId: CardId,
  action: 'viewed' | 'clicked' | 'dismissed',
  timestamp: Date,
  suppressUntil: Date | null
}
```

### Suppression Logic
**Triggered by:**
- **Click:** Different suppression per card (7-30 days)
- **Dismiss:** 7 days for all cards

**Suppression Rules:**
```typescript
const SUPPRESSION_DAYS = {
  'how-it-works': { click: 14, dismiss: 7 },
  'budgeting': { click: 30, dismiss: 7 },
  'scanner-access': { click: 14, dismiss: 7 },
  'makeup-reminder': { click: 14, dismiss: 7 },
  'contact-us': { click: 7, dismiss: 7 }
}
```

### Card Display Rules

#### Quiz Results Page
- Show up to 2 cards
- Priority order: "how-it-works" (always first), "budgeting"
- Filter out suppressed cards

#### My Products Tab (Dashboard)
- Show up to 2 cards
- Priority order:
  1. "scanner-access" (highest priority)
  2. "makeup-reminder"
  3. "contact-us"
- If 2+ cards available, show highest priority 2
- Filter out suppressed cards

---

## Banner System

### Banner Definitions
**Source:** `server/cardVisibility.ts`

**2 Banners Total:**

#### 1. "consistency" Banner
- **Message:** "Consistency is key! Clear skin takes 6-12 weeks. Stick with your routine and track your progress."
- **Rotation:** Week A (odd weeks)

#### 2. "sunscreen" Banner
- **Message:** "Don't skip sunscreen! UV exposure worsens acne scarring and hyperpigmentation. Your SPF is essential."
- **Rotation:** Week B (even weeks)

### Display Rules
**Shown To:** Premium users only

**Rotation Logic:**
```typescript
// Calculate weeks since subscription/account creation
const weeksElapsed = Math.floor(
  (now - subscriptionDate) / (7 * 24 * 60 * 60 * 1000)
)

// Week A (odd): consistency
// Week B (even): sunscreen
const currentBanner = weeksElapsed % 2 === 0 ? 'consistency' : 'sunscreen'
```

### Interaction Tracking
**Table:** `bannerState`

```typescript
{
  userId: string,
  dismissedBanners: string[],           // Array of dismissed banner IDs
  bannerSuppressUntil: Record<string, string>, // bannerId -> ISO timestamp
  bannerClicks: Record<string, number>,  // bannerId -> click count
  bannerViews: Record<string, number>,   // bannerId -> view count
  lastRotationDate: Date
}
```

### Suppression Logic
**Dismissed Banner:**
- Suppress for 30 days
- Rotate to next banner in sequence
- If both suppressed, show nothing

**API Endpoint:** `POST /api/banners/interact`
```typescript
{
  bannerId: string,
  action: 'view' | 'click' | 'dismiss'
}
```

---

## Consent System

### Consent Types
**Two independent consent flags:**

#### 1. Data Collection Consent
- **Field:** `dataCollectionConsent` (boolean)
- **Purpose:** Allow AcneAgent to collect routine data and results
- **Required:** Yes (shown in consent modal after quiz)
- **Default:** `false`

#### 2. AI Training Consent
- **Field:** `aiTrainingConsent` (boolean)
- **Purpose:** Allow data to train future AI recommendation engine
- **Required:** No (optional checkbox)
- **Default:** `false`

### Consent Modal
**Trigger:** Shown when user has no consent recorded (`consentDate === null`)

**Location:** Dashboard, after first login

**Options:**
- "I agree to data collection" (required checkbox)
- "I agree to AI training" (optional checkbox)
- Submit button (disabled until data collection checked)

**Storage:**
```typescript
{
  dataCollectionConsent: boolean,
  aiTrainingConsent: boolean,
  consentDate: Date,
  consentVersion: string    // "1.0" for tracking policy updates
}
```

### Consent Retrieval
**API:** `GET /api/user/consent`

**Response:**
```json
{
  "dataCollectionConsent": true,
  "aiTrainingConsent": false,
  "consentDate": "2025-10-26T12:34:56.789Z",
  "consentVersion": "1.0"
}
```

---

## Affiliate Links

### System Overview
Transforms original product links into affiliate links for monetization.

### CSV Source
**File:** `attached_assets/Affiliate Links - Sheet1_1760657834370.csv`

**Structure:**
```csv
Original Link, Affiliate Link
https://example.com/product1, https://amzn.to/xyz123
https://example.com/product2, https://amzn.to/abc456
```

**Total Links:** 38 affiliate link mappings

### Link Transformation

#### Parsing (Server Startup)
```typescript
// Parse CSV and build map
const affiliateLinkMap = new Map<string, string>()

// Normalize URLs for matching
function normalizeUrl(url: string): string {
  // Remove trailing slashes, ignore query params
  return `${protocol}//${hostname}${pathname}`.toLowerCase()
}
```

#### Link Resolution
```typescript
function getAffiliateLink(originalLink: string): string {
  const normalized = normalizeUrl(originalLink)
  return affiliateLinkMap.get(normalized) || originalLink
}
```

### Usage in Routine Data

#### Product Structure (New Format)
```typescript
{
  name: "Product Name",
  originalLink: "https://example.com/product",
  affiliateLink: "https://amzn.to/xyz123",  // or originalLink if no mapping
  premiumOptions: [
    {
      productName: "Alternative 1",
      originalLink: "https://...",
      affiliateLink: "https://amzn.to/..."
    }
  ]
}
```

#### Backwards Compatibility
**Routine Transformer** (`server/routineTransformer.ts`):
- Checks if routine has `affiliateLink` field
- If missing, generates from `originalLink`
- Ensures all old routines work with new affiliate system

### CTA Link Usage
**Shop/Buy Buttons:**
- Always use `affiliateLink` for href
- Fallback to `originalLink` if no affiliate mapping

**Example:**
```tsx
<Button asChild>
  <a href={product.affiliateLink} target="_blank">
    Shop Now
  </a>
</Button>
```

---

## Ice Globes Upsells

### Product Definition
```typescript
{
  id: 'ice-globes',
  generalName: 'Ice Globes',
  category: 'Tool',
  priceTier: 'budget',
  priceRange: '$10-$15',
  defaultProductLink: 'https://www.amazon.com/...',
  affiliateLink: 'https://amzn.to/3JlYlo9'
}
```

### Display Locations

#### 1. Routine Coach (Premium Only)
**Trigger:** When `routineType === 'inflamed'` AND Ice step exists in routine

**Position:** Inline with routine steps that include "Ice"

**Content:**
```
🧊 Ice Globes Recommended
Reduce inflammation with gentle ice massage
[$10-$15] [Shop Ice Globes →]
```

#### 2. Product Card (Dashboard)
**Trigger:** `routineType === 'inflamed'` AND viewing inflamed routine

**Position:** Separate card in product grid for "Tool" category

**Card Type:** Standard ProductCard component

### Targeting Rules
```typescript
const shouldShowIceGlobes = (
  routineType === 'inflamed' || 
  routine.products.some(p => p.category === 'Tool' && p.id === 'ice-globes')
)
```

### Weekly Routine Integration
**Inflamed Routine Steps:**
```typescript
weeklyRoutines.inflamed = [
  {
    weekRange: 'Weeks 1–2',
    amRoutine: ['Cleanser', 'Ice (see notes)', 'Toner', ...],
    pmRoutine: ['Cleanser', 'Ice (see notes)', 'BPO Mask', ...],
    notes: 'Ice globes help reduce inflammation...'
  },
  // ... weeks 3-6 also include Ice
]
```

---

## Routine Modes

### Mode Options
**Field:** `user.routineMode` (varchar, default: "basic")

**Values:**
- **"basic"** - Shows default/budget-friendly products
- **"premium"** - Shows recommended products (curated for effectiveness)

### Access Control
- **Free Users:** Always use "basic" mode (no toggle available)
- **Premium Users:** Can toggle between "basic" and "premium" modes

### Product Selection Logic
```typescript
function getCurrentProduct(productId: string, userMode: string) {
  const allVariants = getAllProductVariants(productId)
  
  if (userMode === 'basic') {
    return allVariants.find(p => p.isDefault === true)
  } else {
    return allVariants.find(p => p.isRecommended === true)
  }
}
```

### Mode Toggle (Premium Only)
**API:** `POST /api/user/routine-mode`

**Request:**
```json
{
  "routineMode": "premium"
}
```

**Side Effects:**
- Updates `user.routineMode`
- Clears `currentProductSelections` for current routine
- Forces re-resolution of products based on new mode

### UI Display
**Dashboard Header (Premium Only):**
```
Routine Mode: ⚪ Basic  ⚫ Premium
(Toggle switches products from default to recommended)
```

---

## Routine Library & Product Alternatives

### Routine Library (Premium Only)

#### Features
- ✅ Save unlimited routines
- ✅ Switch between routines
- ✅ Mark one routine as "current"
- ✅ Add notes to any routine
- ✅ View routine history

#### Routine Storage
```typescript
{
  id: string,
  userId: string,
  name: string,                    // Optional custom name
  age: string,
  skinType: string,
  fitzpatrickType: string,
  acneTypes: string[],
  acneSeverity: string,
  isPregnantOrNursing: boolean,
  routineData: JSONB,              // Full routine with products
  currentProductSelections: JSONB, // User's product choices
  notes: JSONB,                    // Array of note objects
  isCurrent: boolean,              // Only one routine can be current
  createdAt: Date
}
```

#### Set Current Routine
**API:** `POST /api/routines/:routineId/set-current`

**Logic:**
1. Set `isCurrent = false` for all user's routines
2. Set `isCurrent = true` for selected routine
3. Return updated routine

#### Routine Notes
**API:** `POST /api/routines/:routineId/notes`

**Structure:**
```typescript
{
  notes: [
    {
      id: "uuid",
      date: "2025-10-26T12:00:00Z",
      text: "Skin looking clearer after week 2!"
    }
  ]
}
```

### Product Alternatives

#### Access Control
**Who gets product alternatives:**
1. Premium users (unlimited, all routines)
2. Premium Routine Access purchasers (specific routine only)

**Gating Logic:**
```typescript
const hasAlternatives = 
  entitlements.isPremium || 
  (entitlements.hasPremiumRoutineAccess && 
   routine.id === user.premiumRoutineAccessRoutineId)
```

#### Alternative Display
Each product card shows:
- **Main Product:** Default (basic mode) or Recommended (premium mode)
- **"Best for Your Skin" badge** on recommended product
- **All Alternatives List:**
  - Product name
  - Brand
  - Price range
  - "Current" badge if user selected this variant
  - "Use This" button to switch

#### Alternative Selection
**Flow:**
1. User clicks "Use This" on alternative
2. API call: `POST /api/routines/:routineId/set-product`
3. Update `currentProductSelections[category]` with selected product name
4. Frontend shows "Current" badge on new selection

**Persistence:**
```typescript
routine.currentProductSelections = {
  "Cleanser": "User's Selected Product Name",
  "Moisturizer": "Different Product Name",
  // ...
}
```

---

## Summary of Access Control

### Feature Matrix

| Feature | Free | Premium Routine Access | Detailed PDF | Premium | Notes |
|---------|------|----------------------|--------------|---------|-------|
| **Core Features** | | | | | |
| Quiz & Basic Routine | ✅ | ✅ | ✅ | ✅ | Everyone |
| Routine Coach | ❌ | ❌ | ❌ | ✅ | Premium only |
| Product Alternatives | ❌ | ✅ | ❌ | ✅ | Purchase or Premium |
| Routine Mode Toggle | ❌ | ❌ | ❌ | ✅ | Premium only |
| Download PDF | ❌ | ❌ | ✅ | ❌ | One-time purchase |
| **Scanning** | | | | | |
| Ingredient Scans | 3 total | 3 total | 3 total | Unlimited | Can purchase scan packs |
| Scan Pack Purchase | ✅ | ✅ | ✅ | N/A | Adds to balance |
| **Library** | | | | | |
| Save Routines | 1 | 1 | 1 | Unlimited | Premium only |
| Routine Notes | ❌ | ❌ | ❌ | ✅ | Premium only |
| **Shopping** | | | | | |
| Marketplace | ❌ | ❌ | ❌ | ✅ | Premium only |
| Affiliate Links | ✅ | ✅ | ✅ | ✅ | All shop CTAs |
| **Upsells** | | | | | |
| Cards | ✅ | ✅ | ✅ | ✅ | Context-aware |
| Banners | ❌ | ❌ | ❌ | ✅ | Premium only |
| Ice Globes | Varies | Varies | Varies | Varies | If inflamed routine |

---

## Database Schema Reference

### Key Tables

#### users
- Membership tier, expiration, founding member status
- Scan credits and unlimited scan status
- One-time purchase flags (PDF, Premium Routine Access)
- Consent flags and dates
- Routine mode preference
- Stripe customer and subscription IDs

#### routines
- User ID, routine data (JSONB)
- Current product selections (JSONB)
- Notes (JSONB array)
- isCurrent flag (boolean)

#### purchases
- Product type, amount, currency
- Scans granted (for scan packs)
- Subscription and founding rate flags
- Stripe payment/subscription IDs
- Status tracking

#### cardInteractions
- User ID, card ID, action type
- Timestamp, suppress until date

#### bannerState
- User ID (unique)
- Dismissed banners array
- Suppression map (bannerId -> timestamp)
- Click and view counters
- Last rotation date

#### pdfPurchases
- User ID, purchase ID reference
- Routine snapshot at time of purchase
- Full routine data for PDF generation

#### foundingRateCounter
- Singleton row tracking founding memberships
- Purchase count, active flag, limit

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Email/password login
- `GET /api/auth/logout` - Logout
- `GET /api/auth/user` - Get current user

### Quiz & Routines
- `POST /api/quiz/submit` - Submit quiz answers, get routine
- `POST /api/routines/save` - Save routine
- `GET /api/routines` - Get all user routines
- `GET /api/routines/current` - Get current routine
- `POST /api/routines/:id/set-current` - Set routine as current
- `POST /api/routines/:id/set-product` - Update product selection
- `POST /api/routines/:id/notes` - Add note
- `DELETE /api/routines/:id/notes/:noteId` - Delete note

### Scans
- `POST /api/scans/use-credit` - Consume scan credit
- `GET /api/user/scans` - Get scan balance

### Entitlements
- `GET /api/user/entitlements` - Get user entitlements

### Marketplace
- `GET /api/marketplace` - Get all products (Premium only)

### Consent
- `POST /api/user/consent` - Record consent
- `GET /api/user/consent` - Get consent status

### Cards & Banners
- `GET /api/cards/:page` - Get visible cards for page
- `POST /api/cards/interact` - Record card interaction
- `GET /api/banners/current` - Get current banner (Premium only)
- `POST /api/banners/interact` - Record banner interaction

### Stripe
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/stripe-webhook` - Handle Stripe webhooks

### User Settings
- `POST /api/user/routine-mode` - Update routine mode

---

## Future Enhancements (Premium Plus)

### Planned Features
- **AI Progress Tracking:** Photo analysis and skin improvement monitoring
- **Adaptive Routines:** AI-driven routine adjustments based on results
- **Conversational Guidance:** Chat-based skin coach
- **Advanced Analytics:** Detailed progress reports and insights

### Pricing (Not Yet Available)
- Founding: $7.99/month
- Standard: $9.99/month

### Implementation Status
- Appears in pricing tables with "Coming Soon" label
- Modal on click: "We're training your future skin coach!"

---

*End of Functional Specification*
