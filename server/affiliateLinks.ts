import fs from 'fs';
import path from 'path';

interface AffiliateLinkMapping {
  originalLink: string;
  affiliateLink: string;
}

let affiliateLinkMap: Map<string, string> = new Map();

// Normalize URL for matching (remove trailing slashes, query params for comparison)
function normalizeUrlForMatching(url: string): string {
  try {
    const urlObj = new URL(url);
    // Use protocol + hostname + pathname for matching (ignore query params)
    return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`.toLowerCase().replace(/\/$/, '');
  } catch (e) {
    return url.toLowerCase().replace(/\/$/, '');
  }
}

export function parseAffiliateLinksCsv() {
  const csvPath = path.join(process.cwd(), 'attached_assets', 'Affiliate Links - Sheet1_1760657834370.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('Affiliate links CSV not found at:', csvPath);
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
        columns.push(currentColumn.trim().replace(/^"|"$/g, '')); // Remove surrounding quotes
        currentColumn = '';
      } else {
        currentColumn += char;
      }
    }
    columns.push(currentColumn.trim().replace(/^"|"$/g, '')); // Add last column
    
    if (columns.length < 2) continue;
    
    const originalLink = columns[0];
    const affiliateLink = columns[1];
    
    if (originalLink && affiliateLink && originalLink.startsWith('http') && affiliateLink.startsWith('http')) {
      // Store normalized URL as key for matching
      const normalizedKey = normalizeUrlForMatching(originalLink);
      affiliateLinkMap.set(normalizedKey, affiliateLink);
    }
  }
  
  console.log(`Loaded ${affiliateLinkMap.size} affiliate link mappings`);
}

export function getAffiliateLink(originalLink: string): string {
  const normalizedLink = normalizeUrlForMatching(originalLink);
  const affiliateLink = affiliateLinkMap.get(normalizedLink);
  
  // Return affiliate link if found, otherwise return original link
  return affiliateLink || originalLink;
}

// Parse on module load
parseAffiliateLinksCsv();
