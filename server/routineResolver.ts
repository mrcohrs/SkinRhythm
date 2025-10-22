import { PRODUCT_LIBRARY, getProductById, getSpecificProduct, getProductAlternatives } from '@shared/productLibrary';
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
        
        // Get the specific product based on premium status
        const specificProduct = getSpecificProduct(id, isPremiumUser);
        
        if (!specificProduct) {
          // Fallback to legacy fields for products like ice-globes that aren't in CSV
          console.log(`[Resolver] Using legacy fields for ${id} -> ${product.generalName}`);
          return {
            name: product.defaultProductName || product.generalName,
            brand: '',
            category: product.category,
            priceTier: product.priceTier,
            priceRange: product.priceRange || '',
            price: 0,
            benefits: ['Recommended for your skin type'],
            affiliateLink: product.affiliateLink || '',
            originalLink: product.defaultProductLink || '',
            isRecommended: false,
            premiumOptions: undefined,
          };
        }
        
        console.log(`[Resolver] Resolved ${id} -> ${specificProduct.specificProductName} (recommended: ${specificProduct.isRecommended})`);
        
        // Get alternatives for premium users
        const alternatives = isPremiumUser ? getProductAlternatives(id) : [];
        
        return {
          name: specificProduct.specificProductName,
          brand: specificProduct.brand,
          category: product.category,
          priceTier: product.priceTier,
          priceRange: specificProduct.priceRange,
          price: 0,
          benefits: ['Recommended for your skin type'],
          affiliateLink: specificProduct.affiliateLink,
          originalLink: specificProduct.productLink,
          isRecommended: specificProduct.isRecommended,
          premiumOptions: alternatives.length > 0 ? alternatives.map(alt => ({
            originalLink: alt.productLink,
            affiliateLink: alt.affiliateLink,
            productName: alt.specificProductName
          })) : undefined,
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
        
        // Get the specific product based on premium status
        const specificProduct = getSpecificProduct(id, isPremiumUser);
        
        if (!specificProduct) {
          // Fallback to legacy fields
          return {
            name: product.defaultProductName || product.generalName,
            brand: '',
            category: product.category,
            priceTier: product.priceTier,
            priceRange: product.priceRange || '',
            price: 0,
            benefits: ['Recommended for your skin type'],
            affiliateLink: product.affiliateLink || '',
            originalLink: product.defaultProductLink || '',
            isRecommended: false,
            premiumOptions: undefined,
          };
        }
        
        // Get alternatives for premium users
        const alternatives = isPremiumUser ? getProductAlternatives(id) : [];
        
        return {
          name: specificProduct.specificProductName,
          brand: specificProduct.brand,
          category: product.category,
          priceTier: product.priceTier,
          priceRange: specificProduct.priceRange,
          price: 0,
          benefits: ['Recommended for your skin type'],
          affiliateLink: specificProduct.affiliateLink,
          originalLink: specificProduct.productLink,
          isRecommended: specificProduct.isRecommended,
          premiumOptions: alternatives.length > 0 ? alternatives.map(alt => ({
            originalLink: alt.productLink,
            affiliateLink: alt.affiliateLink,
            productName: alt.specificProductName
          })) : undefined,
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

      // Try to find matching product in library
      // First try matching by defaultProductName, generalName, or specific product names in CSV
      let libraryProduct = Object.values(PRODUCT_LIBRARY).find(p => {
        // Match by old fields OR by specific product names in CSV
        if (p.defaultProductName === oldProduct.name || p.generalName === oldProduct.name) {
          return true;
        }
        // Also try matching against specific product names from CSV
        if (p.products) {
          return p.products.some(sp => sp.specificProductName === oldProduct.name);
        }
        return false;
      });
      
      if (!libraryProduct) {
        // If we still can't find it, just keep the old product data
        return oldProduct;
      }

      // Get the specific product for this user
      const specificProduct = getSpecificProduct(libraryProduct.id, isPremiumUser);
      
      if (!specificProduct) {
        // Fallback to legacy fields
        return {
          name: libraryProduct.defaultProductName || libraryProduct.generalName,
          brand: '',
          category: libraryProduct.category,
          priceTier: libraryProduct.priceTier,
          priceRange: libraryProduct.priceRange || '',
          price: 0,
          benefits: ['Recommended for your skin type'],
          affiliateLink: libraryProduct.affiliateLink || '',
          originalLink: libraryProduct.defaultProductLink || '',
          isRecommended: false,
          premiumOptions: undefined,
        };
      }

      // Get alternatives for premium users
      const alternatives = isPremiumUser ? getProductAlternatives(libraryProduct.id) : [];

      // Use centralized product data
      return {
        name: specificProduct.specificProductName,
        brand: specificProduct.brand,
        category: libraryProduct.category,
        priceTier: libraryProduct.priceTier,
        priceRange: specificProduct.priceRange,
        price: 0,
        benefits: ['Recommended for your skin type'],
        affiliateLink: specificProduct.affiliateLink,
        originalLink: specificProduct.productLink,
        isRecommended: specificProduct.isRecommended,
        premiumOptions: alternatives.length > 0 ? alternatives.map(alt => ({
          originalLink: alt.productLink,
          affiliateLink: alt.affiliateLink,
          productName: alt.specificProductName
        })) : undefined,
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
