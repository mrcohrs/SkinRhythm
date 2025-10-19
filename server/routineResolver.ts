import { PRODUCT_LIBRARY, getProductById } from '@shared/productLibrary';
import { determineRoutineType } from '@shared/weeklyRoutines';
import { splitProductsIntoAMPM } from '@shared/routineHelpers';
import type { RoutineRecommendation } from './parseExcel';

// Resolve product IDs to full product objects for backward compatibility
export function resolveRoutineProducts(routine: RoutineRecommendation | any, isPremiumUser: boolean = false): any {
  console.log('[Resolver] Input routine has routineType:', routine.routineType);
  console.log('[Resolver] Resolving product IDs:', routine.productIds);
  
  // Normalize productIds to flat array (handle legacy {morning, evening} structure)
  let productIds: string[];
  if (Array.isArray(routine.productIds)) {
    // New structure: flat array
    productIds = routine.productIds;
  } else if (routine.productIds && typeof routine.productIds === 'object' && 'morning' in routine.productIds) {
    // Legacy structure: {morning: [], evening: []}
    // Merge and deduplicate
    const morningIds = routine.productIds.morning || [];
    const eveningIds = routine.productIds.evening || [];
    productIds = Array.from(new Set([...morningIds, ...eveningIds]));
    console.log('[Resolver] Normalized legacy productIds structure to flat array:', productIds);
  } else {
    console.error('[Resolver] Invalid productIds structure:', routine.productIds);
    productIds = [];
  }
  
  // Split flat product array into AM/PM based on category rules
  const { morning: morningIds, evening: eveningIds } = splitProductsIntoAMPM(productIds);
  
  const resolveProductIds = (productIds: string[]) => {
    return productIds
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
  };

  const morningProducts = resolveProductIds(morningIds);
  const eveningProducts = resolveProductIds(eveningIds);

  return {
    ...routine,
    products: {
      morning: morningProducts,
      evening: eveningProducts,
    },
  };
}

// Resolve saved routine data to use centralized product library
// Handles backward compatibility with old routines that have morning/evening product arrays
export function resolveSavedRoutineProducts(
  routineData: any, 
  isPremiumUser: boolean = false,
  acneTypes?: string[],
  acneSeverity?: string
): any {
  if (!routineData) {
    return routineData;
  }

  // Recalculate routineType if not present or if we have the data to recalculate
  let routineType = routineData.routineType;
  if (acneTypes && acneSeverity) {
    const recalculatedType = determineRoutineType(acneTypes, acneSeverity);
    console.log(`[Resolver] Original routineType: ${routineType}, Recalculated from acneTypes ${JSON.stringify(acneTypes)} and severity ${acneSeverity}: ${recalculatedType}`);
    routineType = recalculatedType;
  }

  // If products are missing but productIds exist, rebuild products from productIds
  if (!routineData.products && routineData.productIds) {
    console.log('[Resolver] No products found, rebuilding from productIds');
    // Normalize productIds to flat array
    let productIds: string[];
    if (Array.isArray(routineData.productIds)) {
      productIds = routineData.productIds;
    } else if (typeof routineData.productIds === 'object' && 'morning' in routineData.productIds) {
      const morningIds = routineData.productIds.morning || [];
      const eveningIds = routineData.productIds.evening || [];
      productIds = Array.from(new Set([...morningIds, ...eveningIds]));
      console.log('[Resolver] Normalized legacy productIds to flat array');
    } else {
      productIds = [];
    }

    // Split into AM/PM and resolve
    const { morning: morningIds, evening: eveningIds } = splitProductsIntoAMPM(productIds);
    
    const resolveProductIds = (ids: string[]) => {
      return ids.map(id => {
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
      }).filter((p): p is NonNullable<typeof p> => p !== null);
    };

    return {
      ...routineData,
      routineType,
      products: {
        morning: resolveProductIds(morningIds),
        evening: resolveProductIds(eveningIds),
      },
    };
  }

  // If products exist, resolve them from the library
  if (routineData.products) {
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

    return {
      ...routineData,
      routineType,
      products: {
        morning: (routineData.products.morning || []).map(resolveProduct),
        evening: (routineData.products.evening || []).map(resolveProduct),
      },
    };
  }

  // No products or productIds - return as-is with updated routineType
  return {
    ...routineData,
    routineType,
  };
}
