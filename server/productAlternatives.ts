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
    let words = productSlug.split('-')
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
      });
    
    // Handle case where there's only one long word (no hyphens in URL)
    if (words.length === 1 && words[0].length > 15) {
      const singleWord = words[0].toLowerCase();
      
      // Dictionary of common skincare keywords to use for segmentation
      const keywords = [
        // Brand names (common in URLs)
        'toleriane', 'cerave', 'laroche', 'posay', 'vanicream', 'neutrogena',
        'skinceuticals', 'drunk', 'elephant', 'tatcha', 'olehenriksen',
        'paulas', 'choice', 'supergoop', 'elta', 'dermalogica',
        'mario', 'badescu', 'kiehl', 'origins', 'fresh', 'clinique',
        'estee', 'lauder', 'shiseido', 'sk-ii', 'biore', 'hada', 'labo',
        'panoxyl', 'differin', 'acne', 'free', 'clean', 'clear',
        'aveeno', 'eucerin', 'aquaphor', 'bioderma', 'vichy', 'sophie', 'pavitt', 'dr', 'song', 
        // Product types
        'cleanser', 'cleansing', 'clean', 'wash', 'facial', 'face',
        'toner', 'serum', 'cream', 'lotion', 'gel', 'oil', 'balm',
        'treatment', 'sunscreen', 'spf', 'essence', 'mask', 'peel',
        'scrub', 'exfoliant', 'polish', 'pads', 'wipes',
        'moisturizer', 'moisturizing', 'moisture', 'hydrator', 'hydrating', 'hydrate',
        'retinol', 'vitamin', 'acid', 'glycolic', 'salicylic', 'hyaluronic',
        'niacinamide', 'ceramide', 'peptide', 'antioxidant',
        // Descriptors and adjectives
        'gentle', 'soothing', 'calming', 'nourishing', 'repairing', 'repair',
        'foaming', 'micellar', 'water', 'milk', 'mist', 'spray', 'foam',
        'daily', 'night', 'day', 'morning', 'evening', 'pm', 'am',
        'ultra', 'super', 'extra', 'intensive', 'advanced', 'professional',
        'sensitive', 'delicate', 'irritated', 'reactive',
        'oily', 'dry', 'combination', 'normal', 'acne', 'prone',
        'chemical', 'mineral', 'physical', 'hybrid',
        'brightening', 'clearing', 'purifying', 'detox', 'renewing', 'revitalizing',
        'anti', 'aging', 'wrinkle', 'fine', 'lines', 'firming', 'lifting',
        'pore', 'minimizing', 'refining', 'tightening',
        'oil', 'absorbing', 'controlling', 'free', 'barrier',
        'spot', 'blemish', 'acne', 'breakout', 'clarifying',
        'invisible', 'sheer', 'tinted', 'untinted', 'clear',
        'broad', 'spectrum', 'protection', 'shield', 'defense',
        'lightweight', 'rich', 'thick', 'thin', 'silky', 'smooth',
        'skin', 'complexion', 'tone', 'texture', 'surface'
      ].sort((a, b) => b.length - a.length); // Sort by length descending to match longest first
      
      // Try to segment by finding keyword boundaries
      let segmented = singleWord;
      const foundWords: string[] = [];
      let remaining = singleWord;
      
      while (remaining.length > 0) {
        let matched = false;
        
        // Try to find a keyword at the start of the remaining string
        for (const keyword of keywords) {
          if (remaining.startsWith(keyword)) {
            foundWords.push(keyword);
            remaining = remaining.slice(keyword.length);
            matched = true;
            break;
          }
        }
        
        // If no keyword matched, take the first character and continue
        if (!matched) {
          // Look for the next keyword in the string
          let nextKeywordPos = remaining.length;
          let nextKeyword = '';
          
          for (const keyword of keywords) {
            const pos = remaining.indexOf(keyword, 1); // Start from position 1
            if (pos > 0 && pos < nextKeywordPos) {
              nextKeywordPos = pos;
              nextKeyword = keyword;
            }
          }
          
          if (nextKeywordPos < remaining.length) {
            // Found a keyword later in the string
            foundWords.push(remaining.slice(0, nextKeywordPos));
            remaining = remaining.slice(nextKeywordPos);
          } else {
            // No more keywords found, push remaining as-is
            foundWords.push(remaining);
            remaining = '';
          }
        }
      }
      
      // Convert to Title Case
      const productWords = foundWords
        .filter(w => w.length > 0)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      
      return productWords.join(' ').trim() || 'Product';
    }
    
    return words.join(' ').trim() || 'Product';
  } catch (e) {
    return 'Product';
  }
}

export function enrichProductLibraryFromCSV() {
  const csvPath = path.join(process.cwd(), 'attached_assets', 'AcneAgent_Products_Combined.xlsx - Routine Products (1)_1761112317036.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('Combined products CSV not found at:', csvPath);
    return;
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  
  if (lines.length < 2) {
    console.error('CSV file is empty or has no data rows');
    return;
  }
  
  // Parse CSV header to get column indices
  const header = lines[0].split(',').map(h => h.trim());
  const colIndexes = {
    specificProductName: header.indexOf('Specific Product Name'),
    brand: header.indexOf('Brand'),
    priceRange: header.indexOf('Price Range'),
    generalProductName: header.indexOf('General Product Name (productId)'),
    productCategory: header.indexOf('Product Category'),
    productLink: header.indexOf('Product Link'),
    affiliateLink: header.indexOf('Affiliate Link'),
    isDefault: header.indexOf('isDefault?'),
    isAlt: header.indexOf('isAlt?'),
    isRecommended: header.indexOf('isRecommended?')
  };
  
  // Clear all existing products arrays to prevent duplication on hot reload
  Object.values(PRODUCT_LIBRARY).forEach(product => {
    if (product.products) {
      product.products = [];
    }
  });
  
  let enrichedProducts = 0;
  
  // Skip header row, process data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line (handling commas in URLs and quoted fields)
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
    
    if (columns.length < 10) {
      console.warn(`Row ${i + 1} has insufficient columns, skipping`);
      continue;
    }
    
    const generalProductName = columns[colIndexes.generalProductName];
    const csvKey = generalProductName.toUpperCase().trim();
    const product = getProductByCsvKey(csvKey);
    
    if (!product) {
      console.warn(`Product not found in library for: ${generalProductName}`);
      continue;
    }
    
    // Initialize products array if not exists
    if (!product.products) {
      product.products = [];
    }
    
    // Parse boolean values (TRUE/FALSE strings)
    const parseBool = (val: string) => val.toUpperCase() === 'TRUE';
    
    // Add this specific product variant
    product.products.push({
      specificProductName: columns[colIndexes.specificProductName],
      brand: columns[colIndexes.brand],
      priceRange: columns[colIndexes.priceRange],
      productLink: columns[colIndexes.productLink],
      affiliateLink: columns[colIndexes.affiliateLink] || columns[colIndexes.productLink], // Fallback to product link if no affiliate
      isDefault: parseBool(columns[colIndexes.isDefault]),
      isAlt: parseBool(columns[colIndexes.isAlt]),
      isRecommended: parseBool(columns[colIndexes.isRecommended])
    });
    
    enrichedProducts++;
  }
  
  console.log(`Loaded ${enrichedProducts} specific product variants from CSV`);
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
