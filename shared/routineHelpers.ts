import { getProductById } from './productLibrary';

export interface AMPMProducts {
  morning: string[];
  evening: string[];
}

/**
 * Splits a flat array of product IDs into AM and PM routines based on product categories.
 * 
 * Rules:
 * - AM routine: All products EXCEPT Spot Treatment → uses SPF instead
 * - PM routine: All products EXCEPT SPF → uses Spot Treatment instead
 * - Shared products (Cleanser, Toner, Serum, Hydrator, Moisturizer) appear in both
 */
export function splitProductsIntoAMPM(productIds: string[]): AMPMProducts {
  const morning: string[] = [];
  const evening: string[] = [];

  for (const productId of productIds) {
    const product = getProductById(productId);
    
    if (!product) {
      console.warn(`Product not found in library: ${productId}`);
      continue;
    }

    // SPF is AM-only
    if (product.category === 'SPF') {
      morning.push(productId);
      continue;
    }

    // Spot Treatment is PM-only
    if (product.category === 'Spot Treatment') {
      evening.push(productId);
      continue;
    }

    // All other products (Cleanser, Toner, Serum, Hydrator, Moisturizer) 
    // are used in both AM and PM
    morning.push(productId);
    evening.push(productId);
  }

  return { morning, evening };
}
