/**
 * Google Analytics 4 Event Tracking
 * 
 * This utility provides type-safe event tracking for all key business events
 * in SkinRhythm. Events are automatically sent to GA4 for funnel analysis,
 * revenue tracking, and user behavior insights.
 */

// Extend window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      eventNameOrConfig: string,
      eventParams?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Helper function to safely call gtag
 */
function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log('[Analytics]', eventName, eventParams);
  } else {
    console.warn('[Analytics] gtag not available');
  }
}

// ============================================================================
// CONVERSION EVENTS
// ============================================================================

/**
 * Track when user starts the quiz
 */
export function trackQuizStarted() {
  trackEvent('quiz_started', {
    event_category: 'conversion',
    event_label: 'Quiz Flow'
  });
}

/**
 * Track quiz completion with user answers
 */
export function trackQuizCompleted(answers: {
  skinType: string;
  fitzpatrickType: string;
  acneTypes: string[];
  acneSeverity: string;
  isPregnantOrNursing: boolean;
}) {
  trackEvent('quiz_completed', {
    event_category: 'conversion',
    skin_type: answers.skinType,
    fitzpatrick_type: answers.fitzpatrickType,
    acne_types: answers.acneTypes.join(','),
    acne_severity: answers.acneSeverity,
    is_pregnant: answers.isPregnantOrNursing
  });
}

/**
 * Track routine generation after quiz
 */
export function trackRoutineGenerated(routineData: {
  routineType: string;
  skinType: string;
  fitzpatrickType: string;
  productCount: number;
}) {
  trackEvent('routine_generated', {
    event_category: 'conversion',
    routine_type: routineData.routineType,
    skin_type: routineData.skinType,
    fitzpatrick_type: routineData.fitzpatrickType,
    product_count: routineData.productCount
  });
}

// ============================================================================
// AUTHENTICATION EVENTS
// ============================================================================

/**
 * Track user signup
 */
export function trackSignup(method: 'email' = 'email') {
  trackEvent('sign_up', {
    event_category: 'authentication',
    method
  });
}

/**
 * Track user login
 */
export function trackLogin(method: 'email' = 'email') {
  trackEvent('login', {
    event_category: 'authentication',
    method
  });
}

// ============================================================================
// PURCHASE EVENTS (Revenue Tracking)
// ============================================================================

/**
 * Track when user initiates checkout
 */
export function trackCheckoutInitiated(product: {
  productType: string;
  amount: number;
  currency?: string;
}) {
  trackEvent('begin_checkout', {
    event_category: 'ecommerce',
    currency: product.currency || 'USD',
    value: product.amount,
    items: [{
      item_id: product.productType,
      item_name: formatProductName(product.productType),
      price: product.amount,
      quantity: 1
    }]
  });
}

/**
 * Track completed purchase (CRITICAL for revenue tracking)
 */
export function trackPurchase(purchase: {
  productType: string;
  amount: number;
  currency?: string;
  transactionId?: string;
  isFoundingRate?: boolean;
}) {
  trackEvent('purchase', {
    event_category: 'ecommerce',
    transaction_id: purchase.transactionId || generateTransactionId(),
    currency: purchase.currency || 'USD',
    value: purchase.amount,
    is_founding_rate: purchase.isFoundingRate || false,
    items: [{
      item_id: purchase.productType,
      item_name: formatProductName(purchase.productType),
      price: purchase.amount,
      quantity: 1
    }]
  });
}

// ============================================================================
// INGREDIENT SCAN EVENTS
// ============================================================================

/**
 * Track ingredient scan usage
 */
export function trackIngredientScan(scanData: {
  ingredientsFound: number;
  isClean: boolean;
  scansRemaining: number | 'unlimited';
}) {
  trackEvent('ingredient_scan', {
    event_category: 'engagement',
    ingredients_found: scanData.ingredientsFound,
    is_clean: scanData.isClean,
    scans_remaining: scanData.scansRemaining === 'unlimited' ? 'unlimited' : scanData.scansRemaining
  });
}

/**
 * Track when user hits scan limit (paywall trigger)
 */
export function trackScanLimitReached() {
  trackEvent('scan_limit_reached', {
    event_category: 'conversion',
    event_label: 'Scan Paywall'
  });
}

/**
 * Track scan pack purchase view
 */
export function trackScanPackViewed(packSize: 5 | 20 | 'unlimited') {
  trackEvent('scan_pack_viewed', {
    event_category: 'ecommerce',
    pack_size: packSize
  });
}

// ============================================================================
// AFFILIATE LINK TRACKING (Revenue Attribution)
// ============================================================================

/**
 * Track affiliate link clicks for product attribution
 */
export function trackAffiliateClick(product: {
  category: string;
  productName: string;
  brand?: string;
  link: string;
  isRecommended?: boolean;
}) {
  trackEvent('affiliate_click', {
    event_category: 'engagement',
    product_category: product.category,
    product_name: product.productName,
    product_brand: product.brand || 'Unknown',
    is_recommended: product.isRecommended || false,
    outbound_url: product.link
  });
}

// ============================================================================
// PRODUCT & ROUTINE EVENTS
// ============================================================================

/**
 * Track when user selects a product alternative
 */
export function trackProductAlternativeSelected(selection: {
  category: string;
  originalProduct: string;
  newProduct: string;
}) {
  trackEvent('product_alternative_selected', {
    event_category: 'engagement',
    product_category: selection.category,
    original_product: selection.originalProduct,
    new_product: selection.newProduct
  });
}

/**
 * Track routine mode change (basic vs premium)
 */
export function trackRoutineModeChanged(mode: 'basic' | 'premium') {
  trackEvent('routine_mode_changed', {
    event_category: 'engagement',
    routine_mode: mode
  });
}

/**
 * Track when user views Routine Coach
 */
export function trackRoutineCoachViewed() {
  trackEvent('routine_coach_viewed', {
    event_category: 'engagement',
    event_label: 'Premium Feature'
  });
}

/**
 * Track PDF download
 */
export function trackPdfDownload(routineType: string) {
  trackEvent('pdf_download', {
    event_category: 'engagement',
    routine_type: routineType
  });
}

// ============================================================================
// MARKETPLACE EVENTS
// ============================================================================

/**
 * Track marketplace visit (Premium feature)
 */
export function trackMarketplaceVisit() {
  trackEvent('marketplace_visit', {
    event_category: 'engagement',
    event_label: 'Premium Feature'
  });
}

/**
 * Track marketplace product filter usage
 */
export function trackMarketplaceFilter(filterType: 'category' | 'price' | 'brand', filterValue: string) {
  trackEvent('marketplace_filter', {
    event_category: 'engagement',
    filter_type: filterType,
    filter_value: filterValue
  });
}

/**
 * Track marketplace search
 */
export function trackMarketplaceSearch(searchTerm: string) {
  trackEvent('marketplace_search', {
    event_category: 'engagement',
    search_term: searchTerm
  });
}

// ============================================================================
// CARD & BANNER EVENTS
// ============================================================================

/**
 * Track card interaction (view, click, dismiss)
 */
export function trackCardInteraction(card: {
  cardId: string;
  action: 'viewed' | 'clicked' | 'dismissed';
  page: string;
}) {
  trackEvent('card_interaction', {
    event_category: 'engagement',
    card_id: card.cardId,
    card_action: card.action,
    page: card.page
  });
}

/**
 * Track banner interaction
 */
export function trackBannerInteraction(banner: {
  bannerId: string;
  action: 'viewed' | 'clicked' | 'dismissed';
}) {
  trackEvent('banner_interaction', {
    event_category: 'engagement',
    banner_id: banner.bannerId,
    banner_action: banner.action
  });
}

// ============================================================================
// CONSENT EVENTS
// ============================================================================

/**
 * Track consent submission
 */
export function trackConsentSubmitted(consent: {
  dataCollection: boolean;
  aiTraining: boolean;
}) {
  trackEvent('consent_submitted', {
    event_category: 'compliance',
    data_collection_consent: consent.dataCollection,
    ai_training_consent: consent.aiTraining
  });
}

// ============================================================================
// PAGE VIEW TRACKING
// ============================================================================

/**
 * Track custom page view (useful for SPA navigation)
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-D7MPP707ZJ', {
      page_path: pagePath,
      page_title: pageTitle || document.title
    });
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format product type for display
 */
function formatProductName(productType: string): string {
  const nameMap: Record<string, string> = {
    'premium_subscription': 'Premium Membership',
    'detailed_pdf': 'Detailed Routine PDF',
    'premium_routine_access': 'Premium Routine Access',
    'scan_pack_5': '5 Scan Pack',
    'scan_pack_20': '20 Scan Pack',
    'unlimited_scanner': 'Unlimited Scanner'
  };
  return nameMap[productType] || productType;
}

/**
 * Generate unique transaction ID
 */
function generateTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Set user properties (call after login/signup)
 */
export function setUserProperties(properties: {
  userId?: string;
  membershipTier?: string;
  isFoundingMember?: boolean;
}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', {
      membership_tier: properties.membershipTier || 'free',
      is_founding_member: properties.isFoundingMember || false
    });
    
    if (properties.userId) {
      window.gtag('config', 'G-D7MPP707ZJ', {
        user_id: properties.userId
      });
    }
  }
}
