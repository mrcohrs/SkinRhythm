import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { determineRoutineType, weeklyRoutines, type RoutineType } from '@shared/weeklyRoutines';
import { getProductAlternative } from './productAlternatives';

export interface RoutineRecommendation {
  skinType: string;
  fitzpatrickType: string;
  acneTypes: string[];
  isPregnantOrNursing: boolean;
  routineType: RoutineType;
  products: {
    morning: Array<{
      name: string;
      brand: string;
      category: string;
      priceTier: 'budget' | 'standard' | 'premium';
      price: number;
      benefits: string[];
      affiliateLink: string;
    }>;
    evening: Array<{
      name: string;
      brand: string;
      category: string;
      priceTier: 'budget' | 'standard' | 'premium';
      price: number;
      benefits: string[];
      affiliateLink: string;
    }>;
  };
}

interface RoutineRow {
  pregnantNursing: boolean;
  acneType: string;
  severityGroup: string;
  mature: string;
  fitzGroup: string;
  skinType: string;
  cleanser: string;
  toner: string;
  serum: string;
  sunscreen: string;
  hydrator: string;
  moisturizer: string;
  treatment: string;
}

let routineData: RoutineRow[] = [];

export function parseExcelFile() {
  try {
    const filePath = path.join(process.cwd(), 'attached_assets', 'Acne Agent Routine Logic.xlsx - Noninflamed (12)_1760647720504.csv');
    
    if (!fs.existsSync(filePath)) {
      console.error('CSV file not found at:', filePath);
      return false;
    }

    const workbook = XLSX.readFile(filePath, { raw: true, cellDates: false });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: true, defval: '' });

    console.log('Excel data loaded:', data.length, 'rows');

    routineData = data.map((row: any) => ({
      pregnantNursing: row['Pregnant/Nursing?'] === 'Yes',
      acneType: String(row['Acne Type'] || '').trim(),
      severityGroup: String(row['Severity'] || '').trim(),
      mature: String(row['Mature?'] || '').trim(),
      fitzGroup: String(row['Fitz Group'] || '').trim(),
      skinType: String(row['Skin Type'] || '').trim(),
      cleanser: String(row['Cleanser'] || '').trim(),
      toner: String(row['Toner'] || '').trim(),
      serum: String(row['Serum'] || '').trim(),
      sunscreen: String(row['Sunscreen'] || '').trim(),
      hydrator: String(row['Hydrator'] || '').trim(),
      moisturizer: String(row['Moisturizer'] || '').trim(),
      treatment: String(row['Treatment'] || 'None').trim(),
    }));

    console.log('Parsed routine data:', routineData.length, 'routines');
    return true;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return false;
  }
}

function getProductAlternatives(productName: string, category: string) {
  // Get product info from CSV-based system
  const csvAlt = getProductAlternative(productName);
  
  if (csvAlt) {
    // Use the actual product name extracted from CSV URL
    // NEVER use generic names like "Active Cleanser" or Face Reality names
    
    return [{
      name: csvAlt.defaultProductName, // Real product name from URL
      brand: '', // No brand display needed
      category,
      priceTier: 'standard' as const,
      price: 0,
      benefits: [`Recommended for your skin type`],
      affiliateLink: csvAlt.affiliateLink, // Use affiliate link for shop/buy CTA
      originalLink: csvAlt.defaultProductLink, // Keep original link for reference
      premiumOptions: csvAlt.premiumOptions,
    }];
  }
  
  // If not found in CSV, log error and return empty
  console.error(`Product not found in CSV: ${productName}`);
  return [];
}

function buildProductsFromRow(row: RoutineRow) {
  const morningProducts = [];
  const eveningProducts = [];

  // Morning routine
  if (row.cleanser && row.cleanser !== 'None') {
    const alts = getProductAlternatives(row.cleanser, 'Cleanser');
    if (alts.length > 0) morningProducts.push(alts[0]);
  }
  if (row.toner && row.toner !== 'None') {
    const alts = getProductAlternatives(row.toner, 'Toner');
    if (alts.length > 0) morningProducts.push(alts[0]);
  }
  if (row.serum && row.serum !== 'None') {
    const alts = getProductAlternatives(row.serum, 'Serum');
    if (alts.length > 0) morningProducts.push(alts[0]);
  }
  if (row.hydrator && row.hydrator !== 'None') {
    const alts = getProductAlternatives(row.hydrator, 'Hydrator');
    if (alts.length > 0) morningProducts.push(alts[0]);
  }
  if (row.moisturizer && row.moisturizer !== 'None') {
    const alts = getProductAlternatives(row.moisturizer, 'Moisturizer');
    if (alts.length > 0) morningProducts.push(alts[0]);
  }
  if (row.sunscreen && row.sunscreen !== 'None') {
    const alts = getProductAlternatives(row.sunscreen, 'SPF');
    if (alts.length > 0) morningProducts.push(alts[0]);
  }

  // Evening routine
  if (row.cleanser && row.cleanser !== 'None') {
    const alts = getProductAlternatives(row.cleanser, 'Cleanser');
    if (alts.length > 0) eveningProducts.push(alts[0]);
  }
  if (row.toner && row.toner !== 'None') {
    const alts = getProductAlternatives(row.toner, 'Toner');
    if (alts.length > 0) eveningProducts.push(alts[0]);
  }
  if (row.serum && row.serum !== 'None') {
    const alts = getProductAlternatives(row.serum, 'Serum');
    if (alts.length > 0) eveningProducts.push(alts[0]);
  }
  if (row.hydrator && row.hydrator !== 'None') {
    const alts = getProductAlternatives(row.hydrator, 'Hydrator');
    if (alts.length > 0) eveningProducts.push(alts[0]);
  }
  if (row.moisturizer && row.moisturizer !== 'None') {
    const alts = getProductAlternatives(row.moisturizer, 'Moisturizer');
    if (alts.length > 0) eveningProducts.push(alts[0]);
  }
  if (row.treatment && row.treatment !== 'None') {
    const alts = getProductAlternatives(row.treatment, 'Spot Treatment');
    if (alts.length > 0) eveningProducts.push(alts[0]);
  }

  return { morning: morningProducts, evening: eveningProducts };
}

function stripPremiumOptions(routine: RoutineRecommendation): RoutineRecommendation {
  return {
    ...routine,
    products: {
      morning: routine.products.morning.map(p => {
        const { premiumOptions, ...rest } = p as any;
        return rest;
      }),
      evening: routine.products.evening.map(p => {
        const { premiumOptions, ...rest } = p as any;
        return rest;
      }),
    },
  };
}

export function getRoutineForAnswers(answers: {
  skinType: string;
  fitzpatrickType: string;
  acneTypes: string[];
  acneSeverity: string;
  isPregnantOrNursing: string;
  age?: string;
  isPremiumUser?: boolean;
}): RoutineRecommendation | null {
  if (routineData.length === 0) {
    parseExcelFile();
  }

  const isPregnant = answers.isPregnantOrNursing === 'yes';

  let primaryAcneType = 'Noninflamed';
  
  if (answers.acneTypes.includes('acne-rosacea')) {
    primaryAcneType = 'Acne Rosacea';
  } else if (answers.acneTypes.includes('inflamed')) {
    primaryAcneType = 'Inflamed';
  } else if (answers.acneTypes.includes('noninflamed')) {
    primaryAcneType = 'Noninflamed';
  }

  console.log('=== MATCHING DEBUG ===');
  console.log('Input:', {
    primaryAcneType,
    acneSeverity: answers.acneSeverity,
    fitzpatrickType: answers.fitzpatrickType,
    skinType: answers.skinType,
    age: answers.age,
    isMature: parseInt(answers.age || '0') >= 45,
    isPregnant
  });

  const severityMatches = (csvSeverity: string, userSeverity: string) => {
    if (csvSeverity === 'All') return true;
    
    const userSev = userSeverity.toLowerCase();
    const csvSev = csvSeverity.toLowerCase();
    
    if (csvSev.includes(',')) {
      const severities = csvSev.split(',').map(s => s.trim());
      return severities.includes(userSev);
    }
    
    return csvSev === userSev;
  };

  // Determine if user is mature (45+ years old)
  const userAge = parseInt(answers.age || '0') || 0;
  const isMature = userAge >= 45;

  let matchingRow = routineData.find((row, index) => {
    const pregnancyMatch = row.pregnantNursing === isPregnant;
    const acneTypeMatch = row.acneType === primaryAcneType;
    const sevMatch = severityMatches(row.severityGroup, answers.acneSeverity);
    const userFitz = answers.fitzpatrickType;
    const fitzMatch = row.fitzGroup === 'All' || row.fitzGroup === userFitz;
    const skinTypeMatch = row.skinType === 'All' || 
                          row.skinType.toLowerCase() === answers.skinType.toLowerCase() ||
                          row.skinType.toLowerCase().includes(answers.skinType.toLowerCase());
    const matureMatch = row.mature === 'All' || (row.mature === 'Yes') === isMature;
    
    const isMatch = pregnancyMatch && acneTypeMatch && sevMatch && fitzMatch && skinTypeMatch && matureMatch;
    
    if (isMatch) {
      console.log(`FOUND MATCH at index ${index}:`, row);
    }
    
    return isMatch;
  });

  if (!matchingRow) {
    console.error('No matching routine found');
    console.log('Available routines:', routineData.map(r => ({
      pregnantNursing: r.pregnantNursing,
      acneType: r.acneType,
      severity: r.severityGroup,
      mature: r.mature,
      fitz: r.fitzGroup,
      skinType: r.skinType
    })));
    return null;
  }

  console.log('Matched row:', matchingRow);

  const products = buildProductsFromRow(matchingRow);

  const routineType = determineRoutineType(answers.acneTypes, answers.acneSeverity);

  const recommendation: RoutineRecommendation = {
    skinType: answers.skinType,
    fitzpatrickType: answers.fitzpatrickType,
    acneTypes: answers.acneTypes,
    isPregnantOrNursing: isPregnant,
    routineType,
    products,
  };

  // Only return premium options if user is premium
  if (!answers.isPremiumUser) {
    return stripPremiumOptions(recommendation);
  }

  return recommendation;
}

parseExcelFile();
