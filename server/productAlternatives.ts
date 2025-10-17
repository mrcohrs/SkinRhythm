import fs from 'fs';
import path from 'path';
import { getAffiliateLink } from './affiliateLinks';
import { PRODUCT_LIBRARY, getProductByCsvKey } from '@shared/productLibrary';

// Extract product name from URL
function extractProductNameFromURL(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Extract from path (e.g., /products/vanicream-facial-cleanser)
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    // Find the best product name segment (skip numeric-only and common path prefixes)
    const skipPrefixes = ['product', 'products', 'p', 's', 'dp', 'ip'];
    const productIdPatterns = /^(pimprod|sku|pid|item|id|ref)-?\d+$/i; // Product ID patterns
    let productSlug = '';
    
    for (let i = pathParts.length - 1; i >= 0; i--) {
      const part = pathParts[i];
      // Skip if it's a file extension, numeric-only, or common prefix
      const cleanPart = part.split('.')[0].split('?')[0].split('#')[0]; // Remove extensions, query params, anchors
      
      if (cleanPart === '-' || cleanPart.length < 2) continue; // Skip dashes and very short segments
      
      const isNumericOnly = /^\d+$/.test(cleanPart);
      const isShortPrefix = skipPrefixes.includes(cleanPart.toLowerCase());
      const isSingleChar = cleanPart.length === 1;
      const isProductId = productIdPatterns.test(cleanPart);
      
      // Test what the final product name would be after filtering product IDs and numeric parts
      const testWords = cleanPart.split('-')
        .filter(word => {
          // Filter out: product ID patterns, pure numbers (except short ones like version numbers)
          if (productIdPatterns.test(word)) return false;
          if (/^\d+$/.test(word) && word.length > 2) return false;
          return word.length > 0;
        });
      
      const finalProductName = testWords.join(' ').trim();
      const isSubstantial = finalProductName.length > 3 && testWords.length > 1; // Need at least 2 words and 4+ chars
      
      if (!isNumericOnly && !isShortPrefix && !isSingleChar && !isProductId && isSubstantial) {
        productSlug = cleanPart;
        break;
      }
    }
    
    if (!productSlug) {
      return 'Product';
    }
    
    // Convert kebab-case to Title Case
    // Also handle cases like "retinol-05" -> "Retinol 05" or "100440" at end -> removed
    const productIdPatterns2 = /^(pimprod|sku|pid|item|id|ref)\d*$/i;
    const words = productSlug.split('-')
      .filter(word => {
        // Filter out product ID patterns and long numbers
        if (productIdPatterns2.test(word)) return false;
        if (/^\d+$/.test(word) && word.length > 2) return false;
        return word.length > 0;
      })
      .map(word => {
        // Handle numeric words specially
        if (/^\d/.test(word)) {
          return word; // Keep as-is for version numbers like "05"
        }
        // Title Case: capitalize first letter, lowercase the rest
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ')
      .trim();
    
    return words || 'Product';
  } catch (e) {
    return 'Product';
  }
}

export function enrichProductLibraryFromCSV() {
  const csvPath = path.join(process.cwd(), 'attached_assets', 'Product Links for Acne Agent Routine Product Options.xlsx - Alternatives (1)_1760657834377.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('Product alternatives CSV not found at:', csvPath);
    return;
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  
  let enrichedCount = 0;
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line (handling commas in URLs)
    const columns: string[] = [];
    let currentColumn = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        columns.push(currentColumn.trim());
        currentColumn = '';
      } else {
        currentColumn += char;
      }
    }
    columns.push(currentColumn.trim()); // Add last column
    
    if (columns.length < 3) continue;
    
    const csvProductName = columns[0];
    const defaultProductLink = columns[2];
    
    // Find product in library by CSV name
    const csvKey = csvProductName.toUpperCase().trim();
    const product = getProductByCsvKey(csvKey);
    
    if (!product) {
      console.warn(`Product not found in library: ${csvProductName}`);
      continue;
    }
    
    // Extract product name from default product URL
    const defaultProductName = extractProductNameFromURL(defaultProductLink);
    
    // Get affiliate link for default product (falls back to original if not found)
    const affiliateLink = getAffiliateLink(defaultProductLink);
    
    // Collect premium options (columns 3-7, may have empty values)
    const premiumOptions: Array<{
      originalLink: string;
      affiliateLink: string;
      productName: string;
    }> = [];
    
    for (let j = 3; j < Math.min(8, columns.length); j++) {
      const link = columns[j]?.trim();
      if (link && link.startsWith('http')) {
        premiumOptions.push({
          originalLink: link,
          affiliateLink: getAffiliateLink(link),
          productName: extractProductNameFromURL(link)
        });
      }
    }
    
    // Enrich the product library entry
    product.defaultProductLink = defaultProductLink;
    product.defaultProductName = defaultProductName;
    product.affiliateLink = affiliateLink;
    product.premiumOptions = premiumOptions;
    
    enrichedCount++;
  }
  
  console.log(`Enriched ${enrichedCount} products in library with URLs and affiliate links`);
}

// Backward compatibility function for existing code
export function getProductAlternative(productName: string) {
  const csvKey = productName.toUpperCase().trim();
  const product = getProductByCsvKey(csvKey);
  
  if (!product) {
    return null;
  }
  
  return {
    acneAgentProduct: productName,
    category: product.category,
    defaultProductLink: product.defaultProductLink || '',
    defaultProductName: product.defaultProductName || '',
    affiliateLink: product.affiliateLink || '',
    premiumOptions: product.premiumOptions || []
  };
}

// Enrich library on module load
enrichProductLibraryFromCSV();
