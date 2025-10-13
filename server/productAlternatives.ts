import fs from 'fs';
import path from 'path';

interface ProductAlternative {
  acneAgentProduct: string;
  category: string;
  defaultProductLink: string;
  defaultProductName: string; // Extracted product name from URL
  premiumOptions: string[];
}

let productAlternativesMap: Map<string, ProductAlternative> = new Map();

// Extract product name from URL
function extractProductNameFromURL(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Extract from path (e.g., /products/vanicream-facial-cleanser)
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    // Find the best product name segment (skip numeric-only and common path prefixes)
    const skipPrefixes = ['product', 'products', 'p', 's', 'dp', 'ip'];
    let productSlug = '';
    
    for (let i = pathParts.length - 1; i >= 0; i--) {
      const part = pathParts[i];
      // Skip if it's a file extension, numeric-only, or common prefix
      const cleanPart = part.split('.')[0].split('?')[0].split('#')[0]; // Remove extensions, query params, anchors
      
      if (cleanPart === '-' || cleanPart.length < 2) continue; // Skip dashes and very short segments
      
      const isNumericOnly = /^\d+$/.test(cleanPart);
      const isShortPrefix = skipPrefixes.includes(cleanPart.toLowerCase());
      const isSingleChar = cleanPart.length === 1;
      
      // Test what the final product name would be after filtering numeric parts
      const testWords = cleanPart.split('-')
        .filter(word => !/^\d+$/.test(word) || word.length <= 2)
        .filter(word => word.length > 0);
      
      const finalProductName = testWords.join(' ').trim();
      const isSubstantial = finalProductName.length > 3 && testWords.length > 1; // Need at least 2 words and 4+ chars
      
      if (!isNumericOnly && !isShortPrefix && !isSingleChar && isSubstantial) {
        productSlug = cleanPart;
        break;
      }
    }
    
    if (!productSlug) {
      return 'Product';
    }
    
    // Convert kebab-case to Title Case
    // Also handle cases like "retinol-05" -> "Retinol 05" or "100440" at end -> removed
    const words = productSlug.split('-')
      .filter(word => !/^\d+$/.test(word) || word.length <= 2) // Keep numbers only if short (like "05", "2")
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

export function parseProductAlternativesCSV() {
  const csvPath = path.join(process.cwd(), 'attached_assets', 'Face Reality Product Replacements.xlsx - Alternatives (1)_1760303030045.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('Product alternatives CSV not found');
    return;
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  
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
    
    const acneAgentProduct = columns[0];
    const category = columns[1];
    const defaultProductLink = columns[2];
    
    // Extract product name from default product URL
    const defaultProductName = extractProductNameFromURL(defaultProductLink);
    
    // Collect premium options (columns 3-7, may have empty values)
    const premiumOptions: string[] = [];
    for (let j = 3; j < Math.min(8, columns.length); j++) {
      const link = columns[j]?.trim();
      if (link && link.startsWith('http')) {
        premiumOptions.push(link);
      }
    }
    
    // Store in map using normalized key
    const key = acneAgentProduct.toUpperCase().trim();
    productAlternativesMap.set(key, {
      acneAgentProduct,
      category,
      defaultProductLink,
      defaultProductName,
      premiumOptions
    });
  }
  
  console.log(`Loaded ${productAlternativesMap.size} product alternatives`);
}

export function getProductAlternative(productName: string): ProductAlternative | null {
  const key = productName.toUpperCase().trim();
  return productAlternativesMap.get(key) || null;
}

// Parse on module load
parseProductAlternativesCSV();
