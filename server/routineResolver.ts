import { PRODUCT_LIBRARY, getProductById } from '@shared/productLibrary';
import { determineRoutineType } from '@shared/weeklyRoutines';
import type { RoutineRecommendation } from './parseExcel';

// Resolve product IDs to full product objects for backward compatibility
export function resolveRoutineProducts(routine: RoutineRecommendation, isPremiumUser: boolean = false): RoutineRecommendation {
  console.log('[Resolver] Input routine has routineType:', routine.routineType);
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
export function resolveSavedRoutineProducts(
  routineData: any, 
  isPremiumUser: boolean = false,
  acneTypes?: string[],
  acneSeverity?: string
): any {
  if (!routineData || !routineData.products) {
    return routineData;
  }

  const resolveProduct = (oldProduct: any) => {
    if (!oldProduct) return oldProduct;

    // Find matching product in library by product name or general name
    const libraryProduct = Object.values(PRODUCT_LIBRARY).find(p => {
      // Match by actual product name OR by general name
      return p.defaultProductName === oldProduct.name || p.generalName === oldProduct.name;
    });
    
    if (!libraryProduct) {
      console.warn(`No library product found for product name: ${oldProduct.name}`);
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

  // Recalculate routineType if not present or if we have the data to recalculate
  let routineType = routineData.routineType;
  if (acneTypes && acneSeverity) {
    const recalculatedType = determineRoutineType(acneTypes, acneSeverity);
    console.log(`[Resolver] Original routineType: ${routineType}, Recalculated from acneTypes ${JSON.stringify(acneTypes)} and severity ${acneSeverity}: ${recalculatedType}`);
    routineType = recalculatedType;
  }

  return {
    ...routineData,
    routineType,
    products: {
      morning: (routineData.products.morning || []).map(resolveProduct),
      evening: (routineData.products.evening || []).map(resolveProduct),
    },
  };
}
