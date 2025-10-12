# AcneAgent Design Guidelines

## Design Approach: Reference-Based (Skincare & Health Tech)
**Primary References:** Curology, Hims & Hers, Headspace (for quiz flow)
**Rationale:** Healthcare context demands trust and professionalism while skincare requires visual appeal and personalization. Drawing from telehealth and wellness apps that balance clinical credibility with modern, approachable aesthetics.

## Core Design Principles
1. **Clinical Trust:** Clean, professional interface that inspires confidence in medical recommendations
2. **Personal Connection:** Warm, approachable design that makes skincare feel accessible
3. **Progressive Disclosure:** Guide users smoothly from landing → quiz → account → results
4. **Visual Clarity:** Clear hierarchy and generous whitespace for information-dense content

## Color Palette

### Light Mode
- **Primary Brand:** 215 75% 45% (Trustworthy medical blue)
- **Secondary/Accent:** 165 55% 50% (Calming teal for wellness)
- **Success/Progress:** 145 60% 45% (Natural green)
- **Background:** 0 0% 98% (Soft off-white)
- **Surface:** 0 0% 100% (Pure white cards)
- **Text Primary:** 220 15% 20% (Deep charcoal)
- **Text Secondary:** 220 10% 45% (Muted gray)

### Dark Mode
- **Primary Brand:** 215 65% 65% (Lighter blue for visibility)
- **Secondary/Accent:** 165 45% 60% (Softer teal)
- **Success/Progress:** 145 50% 55%
- **Background:** 220 15% 12% (Deep navy-black)
- **Surface:** 220 12% 16% (Elevated cards)
- **Text Primary:** 0 0% 95% (Near white)
- **Text Secondary:** 220 8% 65%

## Typography
- **Primary Font:** 'Inter' (Google Fonts) - Clean, medical professionalism
- **Accent Font:** 'Cabinet Grotesk' or 'Inter Display' - Headlines only
- **Hierarchy:**
  - H1: 48px/56px, weight 700 (landing hero)
  - H2: 36px/44px, weight 600 (section headers)
  - H3: 24px/32px, weight 600 (quiz questions, card titles)
  - Body Large: 18px/28px, weight 400 (quiz descriptions)
  - Body: 16px/24px, weight 400 (general content)
  - Small: 14px/20px, weight 400 (metadata, labels)

## Layout System
**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16, 24
- Page padding: px-4 md:px-8 lg:px-16
- Section spacing: py-16 md:py-24 lg:py-32
- Card padding: p-6 md:p-8
- Element gaps: gap-4 to gap-8
- Max content width: max-w-7xl for full sections, max-w-3xl for forms/quiz

## Component Library

### Landing Page
- **Hero Section:** Full-width with gradient overlay (80vh), centered content, hero image showing clear skin transformation or diverse skin types
- **Trust Indicators:** Logo bar of dermatologist partnerships or certifications below hero
- **How It Works:** 3-column grid (stacks mobile) with icons, numbers, and descriptions
- **Before/After Gallery:** Masonry grid or carousel showing realistic results
- **Pricing Preview:** 2-column comparison (Free vs Premium) with clear differentiation
- **Social Proof:** Testimonial cards with user photos, skin type badges
- **CTA Sections:** Prominent "Start Your Quiz" buttons with supporting text

### Quiz Flow
- **Progress Bar:** Fixed top, gradient fill showing completion (0-100%)
- **Question Cards:** Centered, max-w-2xl, elevated surface with subtle shadow
- **Input Types:**
  - Text inputs: Rounded borders, focus ring in primary color
  - Radio buttons: Custom styled with checkmarks in brand color
  - Checkboxes: Rounded squares for multi-select acne types
  - Large touch targets (min 44px height) for mobile
- **Navigation:** Previous/Next buttons, "Skip" for optional questions
- **Visual Feedback:** Smooth slide transitions between questions

### Account Creation Modal
- **Trigger:** After quiz completion, before results
- **Design:** Centered overlay with backdrop blur
- **Content:** Replit Auth integration, benefit callouts ("Save your routine"), social login options
- **Layout:** Single column, max-w-md, p-8

### Results/Routine Page
- **Header:** Personalized greeting with user name, summary of their profile
- **Routine Timeline:** Vertical or horizontal flow showing AM/PM steps
- **Product Cards:** Grid layout (2-3 columns), featuring:
  - Product image (square aspect ratio)
  - Product name and brand
  - Price tier badge (Budget/Standard/Premium - color coded)
  - Key benefits (bullets)
  - Affiliate CTA button
- **Price Tier Selector:** Tab or toggle interface above products
- **Premium Upsell Banner:** Sticky or embedded showing locked features with visual indicators

### Premium Features (Locked State)
- **Progress Tracking:** Greyscale mockup with blur + lock icon overlay
- **Alternative Products:** Cards with "Premium Only" badge
- **Updated Recommendations:** Grayed out with upgrade prompt
- **Visual Treatment:** Consistent lock icon, muted colors, clear upgrade CTA

### Navigation
- **Header:** Fixed top, logo left, auth buttons right, transparent over hero → solid on scroll
- **Mobile:** Hamburger menu with slide-out drawer
- **Account Menu:** Dropdown with avatar, tier badge, settings, logout

### Forms & Inputs
- **Consistency:** All inputs use primary brand color for focus states
- **Error States:** Red (0 65% 50%) underline + message
- **Success States:** Green checkmark animation
- **Dark Mode:** Inputs with subtle borders, elevated backgrounds

## Images
**Hero Image:** Large, professional photography showing diverse individuals with clear, healthy skin. Gradient overlay (primary brand color at 40% opacity) ensures text readability. Position: Full-width background, 80vh height.

**Product Images:** Square aspect ratio thumbnails in routine cards, sourced from affiliate programs.

**Before/After Gallery:** User-submitted results (if available) or stock medical imagery showing acne treatment progression.

**Quiz Illustrations:** Subtle iconography or simplified illustrations for skin types/conditions (optional, use sparingly).

## Animations
**Minimal approach:**
- Quiz transitions: Smooth slide (300ms ease-in-out)
- Button hovers: Scale 1.02, lift shadow
- Modal entrance: Fade + scale from 0.95 to 1
- Progress bar: Smooth width transition
- Avoid: Gratuitous scroll animations, heavy parallax

## Accessibility & Interaction
- Focus indicators: 2px primary color ring with 2px offset
- Touch targets: Minimum 44x44px for all interactive elements
- Contrast ratios: WCAG AA minimum (4.5:1 for body text)
- Dark mode: Maintain contrast standards with adjusted colors
- Keyboard navigation: Full support for quiz flow and modals

## Tier Differentiation Visual Strategy
- **Free Tier:** Standard color scheme, basic routine display
- **Premium Badge:** Gradient badge (primary → accent) on user avatar/header
- **Locked Features:** Grayscale + blur effect with lock icon overlay
- **Upgrade CTAs:** Use accent color (teal) to stand out from primary brand color