# AcneAgent Pricing & Gating Requirements (User Stories + Acceptance Criteria)

## 🧭 Business Context
AcneAgent offers personalized acne-safe skincare routines powered by AI.  
The **free tier** provides a basic routine; **Premium** unlocks the full guided experience.  
**One-time purchases** (Detailed Routine PDF, Premium Routine/Alternatives Access, Routine Coach, or Ingredient Scans) let users engage without subscriptions while offering natural upgrade paths.

---

## 1. Premium Membership
### Description
- Founding Rate: **$2.99/month** (limited-time)  
- Standard Rate: **$5.99/month**  
- Includes access to Routine Coach, routine **product alternatives** for deeper personalization, and **unlimited ingredient scanning.**  
- Premium is the central recurring product for users who want complete access.

### User Stories
- As a free user, I want to see clear benefits of upgrading to Premium so I understand what extra value I get.  
- As a Premium user, I want full access to my personalized routine with step-by-step guidance and ingredient safety checks so I can follow it confidently without extra purchases.

### Acceptance Criteria
- Premium unlocks:  
  - Multi-option product recommendations per step  
  - Unlimited ingredient scanning  
  - Routine Coach (digital guidance, ramping instructions, reminders)  
  - Routine Library (track progress, notes, reinstate past routines)  
- Premium replaces need for separate Routine Coach or Unlimited Scanner purchases.  
- **Upsell prompts for Premium** appear:  
  - After quiz completion → “See your full guided routine with Premium.”  
  - On dashboard (limited routine view) → “Unlock your complete routine + Routine Coach for $2.99/month (founding offer).”  
  - After 4th ingredient scan → “You’ve reached your free scan limit — get unlimited scans with Premium.”  
  - After purchasing a Detailed Routine PDF → “Get interactive guidance with Routine Coach included in Premium.”  
- Premium labels in UI must show: “Includes Routine Coach + Unlimited Ingredient Scans.”  
- Founding price auto-applies while founding flag active.

---

## 2. Detailed Routine (One-Time Download)
### Description
- Price: **$9.99 one-time**  
- PDF-only version of user’s current personalized routine.  
- Includes instructions, actives ramping, and insider tips.  
- Does **not** include alternatives, ongoing updates, or Routine Coach.

### User Story
As a free user, I want to buy a one-time detailed version of my routine so I can follow it correctly without subscribing.

### Acceptance Criteria
- Purchase generates downloadable PDF of user’s current routine.  
- PDF includes:  
  - Full product list  
  - AM/PM order (first 6 weeks)  
  - Timed actives ramp plan  
  - Insider tips and optional substitutions  
- **Upsell prompts:**  
  - Routine page banner: “Get full instructions and tips — $9.99 one-time download.”  
  - Checkout success: “Add Routine Coach with Premium for $2.99/month.”  
  - Dashboard revisit (PDF purchased, not Premium): “Want reminders and guidance? Routine Coach is included in Premium.”

---

## 3. Premium Routine / Product Alternatives Access (NEW One-Time Unlock)
### Description
- Price: **$9.99 one-time**  
- One-time lifetime unlock for **this user’s current routine** to view all **product alternatives** (budget, mid-range, and luxury) and AcneAgent’s **highest-match selections**.  
- Does **not** include Routine Coach, updates across future routines, or ingredient scanning.  
- Ideal for users who want a one-time upgrade without a subscription.

### User Stories
- As a free user, I want to see the best product matches for my routine without committing to a subscription.  
- As a returning user, I want lifetime access to all product options for my current routine even if I don’t subscribe.

### Acceptance Criteria
- Purchase unlocks:  
  - All product alternatives for current routine steps  
  - Highest-match product recommendations  
  - “Compare options” view for each step (budget, mid, luxury)  
- Unlock persists indefinitely for that routine profile.  
- Premium Routine Access can be repurchased for new routines generated later.  
- **Upsell prompts:**  
  - Routine overview: “Unlock full product alternatives and top matches — $9.99 one-time.”  
  - Free routine step (blurred): “View all your options with one-time Premium Routine access.”  
  - After viewing Detailed Routine PDF preview: “Want all product options and matches? Unlock full access for $9.99.”  
  - Post-purchase upsell: “Add unlimited scanning and Routine Coach with Premium for just $2.99/month.”

---

## 4. Routine Coach (Included with Premium)
### Description
- Digital guidance experience included with Premium.  
- Offers in-app usage guidance, timing, ramp-up tracking, notes, and motivational messages.  
- Access retained only while Premium active.

### User Stories
- As a Premium user, I want reminders and step-by-step usage guidance to stay consistent.  
- As a free user, I want to see what Routine Coach does so I can decide to upgrade.

### Acceptance Criteria
- Routine Coach visible but locked (blurred preview) for free users.  
- Upsell modal: “Get guided support and reminders with Routine Coach.”  
- If Premium lapses → lock with banner: “Your Routine Coach access is paused. Reactivate Premium to continue your progress.”

---

## 5. Ingredient Scanner Packs
### Description
- Ingredient Scanner is free-limited and unlimited with Premium.  
- Free users can buy small scan packs or a discounted Unlimited Scanner add-on.  
- Unlimited add-on must always cost **less than Premium.**

### Pricing
- 5 Scans — **$1.99**  
- 20 Scans — **$3.99** (best value)  
- Unlimited Scanner Add-On — **$3.49/month**

### User Stories
- As a free user, I want small scan packs to check ingredients without subscribing.  
- As a frequent scanner, I want an affordable unlimited option.

### Acceptance Criteria
- 3 free scans → paywall modal appears:  
  - **Tab 1:** Premium ($2.99–$5.99/mo) — “Unlimited scans + full guided routine + product alternatives.”  
  - **Tab 2:** Unlimited Scanner ($3.49/mo) — “Unlimited scans only” + upsell: “Get Premium for just $X more.”  
  - **Tab 3:** Packs — “5 for $1.99” or “20 for $3.99.”  
- Packs never expire.  
- Unlimited Scanner disables if user upgrades to Premium.  
- Upsell shown on:  
  - Scan results page (“Tired of limits? Get Unlimited or Premium”).  
  - Zero-balance page (“Upgrade for Unlimited”).  
- Once Premium purchased → all scan gating removed.

---

## 6. Future Premium+ (Coming Soon)
### Description
- AI-driven version of Premium with smart progress tracking, adaptive routine adjustments, and conversational guidance.  
- Not available at launch.

### Pricing (future)
- Founding: **$7.99/mo**  
- Standard: **$9.99/mo**

### Acceptance Criteria
- Appears in pricing tables but labeled “Coming Soon.”  
- Clicking shows modal: “We’re training your future skin coach! Get early access when it launches.”

---

## 7. Feature Access Summary

| Feature | Free | Detailed Routine (PDF) | Premium Routine (One-Time) | Premium | Premium+ (Future) |
|----------|------|------------------------|-----------------------------|----------|-------------------|
| Basic routine | ✅ | ✅ | ✅ | ✅ | ✅ |
| Multiple product options | ❌ | ❌ | ✅ (this routine only) | ✅ | ✅ |
| Highest-match picks | ❌ | ❌ | ✅ | ✅ | ✅ |
| Routine Coach | ❌ | ❌ | ❌ | ✅ | ✅ |
| Ingredient Scanner | 3 scans | Paid packs | Paid packs | Unlimited | Unlimited |
| Routine PDF | $9.99 | ✅ | ❌ | ✅ | ✅ |
| Progress tracking | ❌ | ❌ | ❌ | ❌ | ✅ |
| AI adaptive routine | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 8. Cross-Sell & Upsell Timing

| Event | User Status | Upsell Trigger |
|-------|--------------|----------------|
| Completing quiz | Free | Offer Premium (“Unlock your guided routine + coach for $2.99/month”) |
| Viewing routine page | Free | Banner for Premium or $9.99 one-time Premium Routine Access |
| Viewing blurred product step | Free | Inline CTA: “Unlock all product alternatives and best matches — $9.99 one-time” |
| Attempting 4th scan | Free | Ingredient Scanner modal (Premium / Unlimited / Packs) |
| Purchasing Detailed Routine PDF | Free | Post-purchase: “Add Routine Coach with Premium for $2.99/month” |
| Viewing locked Routine Coach | Free | Modal explaining Premium benefits |
| Scanner balance = 0 | Free | CTA: “Upgrade to Premium or Unlimited for $3.49/month” |
| Dashboard view | Free | Periodic banner: “Get faster results with Routine Coach — included in Premium.” |
| Premium expiring | Premium | Email + in-app banner to renew at founding rate if active |

---

## 9. Business Goals
- Drive initial conversions via $2.99 founding Premium rate.  
- Use Ingredient Scanner engagement and blurred alternatives to funnel free users into paid tiers.  
- Introduce low-friction one-time unlocks (PDF, Premium Routine) to capture hesitant users.  
- Encourage Premium upgrades through contextual, helpful upsells.  
- Retain Premium users with Routine Coach and progress tracking.  
- Maintain compliant copy (no “treatment” or “prescription” terms).
