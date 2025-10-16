/**
 * Extracts a readable product name from a product URL
 * @param url - The product URL (from Amazon, Sephora, etc.)
 * @returns A formatted product name
 */
export function extractProductName(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const hostname = urlObj.hostname;

    // Extract brand from hostname for better context
    let brand = '';
    if (hostname.includes('sephora.com')) {
      brand = 'Sephora';
    } else if (hostname.includes('amazon.com')) {
      brand = 'Amazon';
    } else if (hostname.includes('ulta.com')) {
      brand = 'Ulta';
    } else if (hostname.includes('target.com')) {
      brand = 'Target';
    } else if (hostname.includes('dermstore.com')) {
      brand = 'Dermstore';
    } else if (hostname.includes('paulaschoice.com')) {
      brand = "Paula's Choice";
    } else if (hostname.includes('theordinary.com')) {
      brand = 'The Ordinary';
    } else if (hostname.includes('cerave.com')) {
      brand = 'CeraVe';
    } else if (hostname.includes('vanicream.com')) {
      brand = 'Vanicream';
    } else if (hostname.includes('laroche-posay')) {
      brand = 'La Roche-Posay';
    } else if (hostname.includes('skinceuticals.com')) {
      brand = 'SkinCeuticals';
    } else if (hostname.includes('prequelskin.com')) {
      brand = 'Prequel';
    } else if (hostname.includes('goodmolecules.com')) {
      brand = 'Good Molecules';
    } else if (hostname.includes('walmart.com')) {
      brand = 'Walmart';
    } else if (hostname.includes('naturium.com')) {
      brand = 'Naturium';
    } else if (hostname.includes('clearstem.com')) {
      brand = 'CLEARSTEM';
    }

    // Try to extract product name from path
    let productName = '';

    // Sephora pattern: /product/product-name-with-dashes/PXXXX
    if (hostname.includes('sephora.com')) {
      const match = pathname.match(/\/product\/([^\/]+)/);
      if (match && match[1]) {
        productName = match[1]
          .split('-')
          .filter(part => !part.startsWith('P') || part.length < 3) // Remove product codes like P515840
          .join(' ')
          .replace(/\b\w/g, l => l.toUpperCase())
          .trim();
      }
    }
    // Amazon pattern: Look for product name in path segments
    else if (hostname.includes('amazon.com')) {
      const segments = pathname.split('/').filter(s => s && !s.startsWith('dp') && !s.startsWith('B0'));
      if (segments.length > 0) {
        productName = segments[segments.length - 1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
          .trim();
      }
    }
    // Target pattern: /p/product-name/-/A-XXXXX
    else if (hostname.includes('target.com')) {
      const match = pathname.match(/\/p\/([^\/]+)/);
      if (match && match[1]) {
        productName = match[1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
          .trim();
      }
    }
    // The Ordinary, Paula's Choice, and other brands: /products/product-name
    else if (pathname.includes('/products/') || pathname.includes('/product/')) {
      const match = pathname.match(/\/products?\/([^\/\?]+)/);
      if (match && match[1]) {
        productName = match[1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
          .replace(/\d+pct/gi, match => match.replace('pct', '%'))
          .replace(/\bSpf\b/gi, 'SPF')
          .replace(/\bBha\b/gi, 'BHA')
          .replace(/\bAha\b/gi, 'AHA')
          .replace(/\bHa\b/gi, 'HA')
          .replace(/\d+ml/gi, match => match.toUpperCase())
          .trim();
      }
    }

    // If we got a product name, return it with brand if available
    if (productName) {
      return brand ? `${brand} - ${productName}` : productName;
    }

    // Fallback: Just return the brand/domain
    return brand || hostname.replace('www.', '').split('.')[0];
  } catch (e) {
    console.error('Error extracting product name from URL:', url, e);
    return 'View Product';
  }
}
