import { getAffiliateLink } from "./affiliateLinks";

/**
 * Transforms old routine data to include affiliate links
 * This handles backwards compatibility for routines saved before affiliate links were added
 */
export function transformRoutineWithAffiliateLinks(routineData: any): any {
  if (!routineData || !routineData.products) {
    return routineData;
  }

  const transformProduct = (product: any) => {
    if (!product) return product;

    // If product already has affiliateLink, it's already in the new format
    if (product.affiliateLink !== undefined) {
      return product;
    }

    // Transform old format to new format
    const originalLink = product.link;
    const affiliateLink = getAffiliateLink(originalLink);

    const transformedProduct = {
      ...product,
      originalLink,
      affiliateLink,
    };

    // Transform premium options if they exist
    if (product.premiumOptions && Array.isArray(product.premiumOptions)) {
      transformedProduct.premiumOptions = product.premiumOptions.map((option: any) => {
        // If option is already an object with affiliateLink, keep it
        if (typeof option === 'object' && option.affiliateLink !== undefined) {
          return option;
        }

        // If option is a string (old format), transform it
        if (typeof option === 'string') {
          return {
            originalLink: option,
            affiliateLink: getAffiliateLink(option),
            productName: '', // Will be extracted by frontend
          };
        }

        // If option is an object without affiliateLink, add it
        if (typeof option === 'object' && option.link) {
          return {
            originalLink: option.link,
            affiliateLink: getAffiliateLink(option.link),
            productName: option.name || '',
          };
        }

        return option;
      });
    }

    return transformedProduct;
  };

  return {
    ...routineData,
    products: {
      morning: (routineData.products.morning || []).map(transformProduct),
      evening: (routineData.products.evening || []).map(transformProduct),
    },
  };
}
