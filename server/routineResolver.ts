import { PRODUCT_LIBRARY, getProductById } from '@shared/productLibrary';
import type { RoutineRecommendation } from './parseExcel';

// Resolve product IDs to full product objects for backward compatibility
export function resolveRoutineProducts(routine: RoutineRecommendation, isPremiumUser: boolean = false): RoutineRecommendation {
  console.log('[Resolver] Resolving product IDs:', routine.productIds);
  
  const morningProducts = routine.productIds.morning
    .map(id => {
      const product = getProductById(id);
      if (!product) {
        console.error(`Product not found for ID: ${id}`);
        return null;
      }
      
      console.log(`[Resolver] Resolved ${id} -> ${product.defaultProductName || product.generalName}`);
      
      return {
        name: product.defaultProductName || product.generalName,
        brand: '',
        category: product.category,
        priceTier: product.priceTier,
        priceRange: product.priceRange,
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
        priceRange: product.priceRange,
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

// Resolve saved routine data to use centralized product library
export function resolveSavedRoutineProducts(routineData: any, isPremiumUser: boolean = false): any {
  if (!routineData || !routineData.products) {
    return routineData;
  }

  const resolveProduct = (oldProduct: any) => {
    if (!oldProduct) return oldProduct;

    // Find matching product in library by affiliate link or product link
    const savedLink = oldProduct.affiliateLink || oldProduct.originalLink || oldProduct.link;
    
    const libraryProduct = Object.values(PRODUCT_LIBRARY).find(p => {
      // Match by affiliate link or default product link
      return p.affiliateLink === savedLink || p.defaultProductLink === savedLink;
    });
    
    if (!libraryProduct) {
      console.warn(`No library product found for link: ${savedLink}`);
      return oldProduct;
    }

    // Use centralized product data
    return {
      name: libraryProduct.defaultProductName || libraryProduct.generalName,
      brand: '',
      category: libraryProduct.category,
      priceTier: libraryProduct.priceTier,
      priceRange: libraryProduct.priceRange,
      price: 0,
      benefits: ['Recommended for your skin type'],
      affiliateLink: libraryProduct.affiliateLink || '',
      originalLink: libraryProduct.defaultProductLink,
      premiumOptions: isPremiumUser ? libraryProduct.premiumOptions : undefined,
    };
  };

  return {
    ...routineData,
    products: {
      morning: (routineData.products.morning || []).map(resolveProduct),
      evening: (routineData.products.evening || []).map(resolveProduct),
    },
  };
}
