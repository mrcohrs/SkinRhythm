// Stripe Price IDs Configuration
export const STRIPE_PRICE_IDS = {
  PREMIUM_FOUNDING: 'price_1SLDhT03lUrD9KcrUSBaz576',
  PREMIUM_STANDARD: 'price_1SLDin03lUrD9KcrcAqNi7mJ',
  DETAILED_PDF: 'price_1SLDjr03lUrD9KcrpIOhf0Gm',
  PREMIUM_ROUTINE_ACCESS: 'price_1SLDlc03lUrD9Kcrty8k3YYO',
  SCAN_PACK_5: 'price_1SLDpg03lUrD9KcrZ1ViD7oK',
  SCAN_PACK_20: 'price_1SLDqL03lUrD9KcruPVIh5Qz',
  UNLIMITED_SCANNER: 'price_1SLDqm03lUrD9KcrO4G8cL3g',
} as const;

// Product metadata
export const PRODUCT_DETAILS = {
  [STRIPE_PRICE_IDS.PREMIUM_FOUNDING]: {
    type: 'premium_subscription',
    amount: 2.99,
    isSubscription: true,
    isFoundingRate: true,
    scansGranted: 0,
  },
  [STRIPE_PRICE_IDS.PREMIUM_STANDARD]: {
    type: 'premium_subscription',
    amount: 5.99,
    isSubscription: true,
    isFoundingRate: false,
    scansGranted: 0,
  },
  [STRIPE_PRICE_IDS.DETAILED_PDF]: {
    type: 'detailed_pdf',
    amount: 9.99,
    isSubscription: false,
    isFoundingRate: false,
    scansGranted: 0,
  },
  [STRIPE_PRICE_IDS.PREMIUM_ROUTINE_ACCESS]: {
    type: 'premium_routine_access',
    amount: 9.99,
    isSubscription: false,
    isFoundingRate: false,
    scansGranted: 0,
  },
  [STRIPE_PRICE_IDS.SCAN_PACK_5]: {
    type: 'scan_pack_5',
    amount: 1.99,
    isSubscription: false,
    isFoundingRate: false,
    scansGranted: 5,
  },
  [STRIPE_PRICE_IDS.SCAN_PACK_20]: {
    type: 'scan_pack_20',
    amount: 3.99,
    isSubscription: false,
    isFoundingRate: false,
    scansGranted: 20,
  },
  [STRIPE_PRICE_IDS.UNLIMITED_SCANNER]: {
    type: 'unlimited_scanner',
    amount: 3.49,
    isSubscription: true,
    isFoundingRate: false,
    scansGranted: 0,
  },
} as const;
