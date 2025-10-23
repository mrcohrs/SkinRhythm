import { loadStripe } from '@stripe/stripe-js';

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  console.error('VITE_STRIPE_PUBLIC_KEY is not defined in environment variables');
}

export const stripePromise = loadStripe(stripePublicKey || '');

export const STRIPE_PRICE_IDS = {
  PREMIUM_FOUNDING: 'price_1SLDhT03lUrD9KcrUSBaz576',
  PREMIUM_STANDARD: 'price_1SLDin03lUrD9KcrcAqNi7mJ',
  DETAILED_PDF: 'price_1SLDjr03lUrD9KcrpIOhf0Gm',
  PREMIUM_ROUTINE_ACCESS: 'price_1SLDlc03lUrD9Kcrty8k3YYO',
  SCAN_PACK_5: 'price_1SLDpg03lUrD9KcrZ1ViD7oK',
  SCAN_PACK_20: 'price_1SLDqL03lUrD9KcruPVIh5Qz',
  UNLIMITED_SCANNER: 'price_1SLDqm03lUrD9KcrO4G8cL3g',
} as const;

export const PRODUCT_PRICES = {
  PREMIUM_FOUNDING: 2.99,
  PREMIUM_STANDARD: 5.99,
  DETAILED_PDF: 9.99,
  PREMIUM_ROUTINE_ACCESS: 9.99,
  SCAN_PACK_5: 1.99,
  SCAN_PACK_20: 3.99,
  UNLIMITED_SCANNER: 3.49,
} as const;
