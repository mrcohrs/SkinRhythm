import { PRODUCT_LIBRARY, getProductById } from '@shared/productLibrary';
import type { RoutineRecommendation } from './parseExcel';

// Resolve product IDs to full product objects for backward compatibility
export function resolveRoutineProducts(routine: RoutineRecommendation, isPremiumUser: boolean = false): RoutineRecommendation {
  const morningProducts = routine.productIds.morning
    .map(id => {
      const product = getProductById(id);
      if (!product) {
        console.error(`Product not found for ID: ${id}`);
        return null;
      }
      
      return {
        name: product.defaultProductName || product.generalName,
        brand: '',
        category: product.category,
        priceTier: product.priceTier,
        price: 0,
        benefits: ['Recommended for your skin type'],
        affiliateLink: product.affiliateLink || '',
        originalLink: product.defaultProductLink,
        premiumOptions: isPremiumUser ? product.premiumOptions : undefined,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const eveningProducts = routine.productIds.evening
    .map(id => {
      const product = getProductById(id);
      if (!product) {
        console.error(`Product not found for ID: ${id}`);
        return null;
      }
      
      return {
        name: product.defaultProductName || product.generalName,
        brand: '',
        category: product.category,
        priceTier: product.priceTier,
        price: 0,
        benefits: ['Recommended for your skin type'],
        affiliateLink: product.affiliateLink || '',
        originalLink: product.defaultProductLink,
        premiumOptions: isPremiumUser ? product.premiumOptions : undefined,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return {
    ...routine,
    products: {
      morning: morningProducts as any,
      evening: eveningProducts as any,
    },
  };
}
