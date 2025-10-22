export interface SpecificProduct {
  specificProductName: string;
  brand: string;
  priceRange: string;
  productLink: string;
  affiliateLink: string;
  isDefault: boolean;
  isRecommended: boolean;
}

export interface ProductDefinition {
  id: string;
  generalName: string;
  category: 'Cleanser' | 'Toner' | 'Serum' | 'Hydrator' | 'Moisturizer' | 'SPF' | 'Spot Treatment' | 'Tool';
  csvKey: string;
  priceTier: 'budget' | 'standard' | 'premium';
  priceRange?: string;
  // New structure: store all specific product variants
  products?: SpecificProduct[];
  // Legacy fields for backward compatibility
  defaultProductLink?: string;
  defaultProductName?: string;
  affiliateLink?: string;
  premiumOptions?: Array<{
    originalLink: string;
    affiliateLink: string;
    productName: string;
  }>;
}

export const PRODUCT_LIBRARY: Record<string, ProductDefinition> = {
  'creamy-cleanser': {
    id: 'creamy-cleanser',
    generalName: 'Creamy Cleanser',
    category: 'Cleanser',
    csvKey: 'CREAMY CLEANSER',
    priceTier: 'standard',
  },
  
  'gel-cleanser': {
    id: 'gel-cleanser',
    generalName: 'Gel Cleanser',
    category: 'Cleanser',
    csvKey: 'GEL CLEANSER',
    priceTier: 'standard',
  },
  
  'active-cleanser': {
    id: 'active-cleanser',
    generalName: 'Active Cleanser',
    category: 'Cleanser',
    csvKey: 'ACTIVE CLEANSER',
    priceTier: 'standard',
  },
  
  'vitamin-scrub': {
    id: 'vitamin-scrub',
    generalName: 'Vitamin Scrub',
    category: 'Cleanser',
    csvKey: 'VITAMIN SCRUB',
    priceTier: 'standard',
  },
  
  'exfoliating-scrub': {
    id: 'exfoliating-scrub',
    generalName: 'Exfoliating Scrub',
    category: 'Cleanser',
    csvKey: 'EXFOLIATING SCRUB',
    priceTier: 'standard',
  },
  
  'moisturizing-toner': {
    id: 'moisturizing-toner',
    generalName: 'Moisturizing Toner',
    category: 'Toner',
    csvKey: 'MOISTURIZING TONER',
    priceTier: 'standard',
  },
  
  'soothing-toner': {
    id: 'soothing-toner',
    generalName: 'Soothing Toner',
    category: 'Toner',
    csvKey: 'SOOTHING TONER',
    priceTier: 'standard',
  },
  
  'resurfacing-toner': {
    id: 'resurfacing-toner',
    generalName: 'Resurfacing Toner',
    category: 'Toner',
    csvKey: 'RESURFACING TONER',
    priceTier: 'standard',
  },
  
  'retinol-serum': {
    id: 'retinol-serum',
    generalName: 'Retinol Serum',
    category: 'Serum',
    csvKey: 'RETINOL SERUM',
    priceTier: 'budget',
  },
  
  'mandelic-serum-gentle': {
    id: 'mandelic-serum-gentle',
    generalName: 'Mandelic Serum (Gentle)',
    category: 'Serum',
    csvKey: 'MANDELIC SERUM (GENTLE)',
    priceTier: 'standard',
  },
  
  'mandelic-serum-full': {
    id: 'mandelic-serum-full',
    generalName: 'Mandelic Serum (Full Strength)',
    category: 'Serum',
    csvKey: 'MANDELIC SERUM (FULL STRENGTH)',
    priceTier: 'budget',
  },
  
  'resurfacing-serum': {
    id: 'resurfacing-serum',
    generalName: 'Resurfacing Serum',
    category: 'Serum',
    csvKey: 'RESURFACING SERUM',
    priceTier: 'standard',
  },
  
  'hydrating-serum': {
    id: 'hydrating-serum',
    generalName: 'Hydrating Serum',
    category: 'Hydrator',
    csvKey: 'HYDRATING SERUM',
    priceTier: 'budget',
  },
  
  'heavy-moisturizer': {
    id: 'heavy-moisturizer',
    generalName: 'Heavy Moisturizer',
    category: 'Moisturizer',
    csvKey: 'HEAVY MOISTURIZER',
    priceTier: 'standard',
  },
  
  'light-moisturizer': {
    id: 'light-moisturizer',
    generalName: 'Light Moisturizer',
    category: 'Moisturizer',
    csvKey: 'LIGHT MOISTURIZER',
    priceTier: 'standard',
  },
  
  'chemical-spf': {
    id: 'chemical-spf',
    generalName: 'Chemical SPF',
    category: 'SPF',
    csvKey: 'CHEMICAL SPF',
    priceTier: 'standard',
  },
  
  'mineral-spf': {
    id: 'mineral-spf',
    generalName: 'Mineral SPF',
    category: 'SPF',
    csvKey: 'MINERAL SPF',
    priceTier: 'standard',
  },
  
  'bpo-2-5': {
    id: 'bpo-2-5',
    generalName: 'Benzoyl Peroxide 2.5%',
    category: 'Spot Treatment',
    csvKey: 'BPO 2.5%',
    priceTier: 'standard',
  },
  
  'bpo-5': {
    id: 'bpo-5',
    generalName: 'Benzoyl Peroxide 5%',
    category: 'Spot Treatment',
    csvKey: 'BPO 5%',
    priceTier: 'standard',
  },
  
  'bpo-10': {
    id: 'bpo-10',
    generalName: 'Benzoyl Peroxide 10%',
    category: 'Spot Treatment',
    csvKey: 'BPO 10%',
    priceTier: 'standard',
  },
  
  'ice-globes': {
    id: 'ice-globes',
    generalName: 'Ice Globes',
    category: 'Tool',
    csvKey: 'ICE GLOBES',
    priceTier: 'budget',
    priceRange: '$10-$15',
    defaultProductLink: 'https://www.amazon.com/Unbreakable-Massager-Puffiness-Wrinkles-Production/dp/B082S42J2D',
    defaultProductName: 'Unbreakable Ice Globes',
    affiliateLink: 'https://amzn.to/3JlYlo9',
  },
};

// Reverse lookup: CSV key to product ID (uppercase keys for case-insensitive lookup)
export const CSV_KEY_TO_PRODUCT_ID: Record<string, string> = Object.values(PRODUCT_LIBRARY).reduce((acc, product) => {
  acc[product.csvKey.toUpperCase()] = product.id;
  return acc;
}, {} as Record<string, string>);

// Helper to get product by CSV key
export function getProductByCsvKey(csvKey: string): ProductDefinition | undefined {
  const productId = CSV_KEY_TO_PRODUCT_ID[csvKey];
  return productId ? PRODUCT_LIBRARY[productId] : undefined;
}

// Helper to get product by ID
export function getProductById(id: string): ProductDefinition | undefined {
  return PRODUCT_LIBRARY[id];
}

// Get the appropriate specific product based on premium status
export function getSpecificProduct(productId: string, isPremium: boolean): SpecificProduct | null {
  const product = getProductById(productId);
  if (!product || !product.products || product.products.length === 0) {
    return null;
  }
  
  // For premium users: prioritize isRecommended, fallback to isDefault
  if (isPremium) {
    const recommended = product.products.find(p => p.isRecommended);
    if (recommended) return recommended;
  }
  
  // For free users or if no recommended found: use isDefault
  const defaultProduct = product.products.find(p => p.isDefault);
  if (defaultProduct) return defaultProduct;
  
  // Fallback to first product if neither isRecommended nor isDefault found
  return product.products[0];
}

// Get all product variants for a given productId
// This returns ALL specific products - the caller determines which is current based on user state
export function getAllProductVariants(productId: string): SpecificProduct[] {
  const product = getProductById(productId);
  if (!product || !product.products) {
    return [];
  }
  return product.products;
}
