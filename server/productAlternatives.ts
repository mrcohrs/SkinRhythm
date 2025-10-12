import fs from 'fs';
import path from 'path';

interface ProductAlternative {
  faceRealityProduct: string;
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
    const lastPart = pathParts[pathParts.length - 1];
    
    // Convert kebab-case to Title Case
    const productSlug = lastPart.split('?')[0]; // Remove query params
    const words = productSlug.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return words;
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
    
    const faceRealityProduct = columns[0];
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
    const key = faceRealityProduct.toUpperCase().trim();
    productAlternativesMap.set(key, {
      faceRealityProduct,
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
