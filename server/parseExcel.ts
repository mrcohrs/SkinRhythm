import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { determineRoutineType, weeklyRoutines, type RoutineType } from '@shared/weeklyRoutines';
import { getProductByCsvKey } from '@shared/productLibrary';

export interface RoutineRecommendation {
  skinType: string;
  fitzpatrickType: string;
  acneTypes: string[];
  isPregnantOrNursing: boolean;
  routineType: RoutineType;
  productIds: {
    morning: string[];
    evening: string[];
  };
  // Temporary: keep for backward compatibility during migration
  products?: {
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

function getProductIdFromCsvKey(csvKey: string): string | null {
  if (!csvKey || csvKey === 'None') return null;
  
  const product = getProductByCsvKey(csvKey.toUpperCase().trim());
  
  if (!product) {
    console.error(`Product not found in library for CSV key: ${csvKey}`);
    return null;
  }
  
  return product.id;
}

function buildProductIdsFromRow(row: RoutineRow): { morning: string[]; evening: string[] } {
  const morningProductIds: string[] = [];
  const eveningProductIds: string[] = [];

  // Morning routine
  const morningCleanser = getProductIdFromCsvKey(row.cleanser);
  if (morningCleanser) morningProductIds.push(morningCleanser);
  
  const morningToner = getProductIdFromCsvKey(row.toner);
  if (morningToner) morningProductIds.push(morningToner);
  
  const morningSerum = getProductIdFromCsvKey(row.serum);
  if (morningSerum) morningProductIds.push(morningSerum);
  
  const morningHydrator = getProductIdFromCsvKey(row.hydrator);
  if (morningHydrator) morningProductIds.push(morningHydrator);
  
  const morningMoisturizer = getProductIdFromCsvKey(row.moisturizer);
  if (morningMoisturizer) morningProductIds.push(morningMoisturizer);
  
  const morningSunscreen = getProductIdFromCsvKey(row.sunscreen);
  if (morningSunscreen) morningProductIds.push(morningSunscreen);

  // Evening routine (reuse some products, add treatment)
  const eveningCleanser = getProductIdFromCsvKey(row.cleanser);
  if (eveningCleanser) eveningProductIds.push(eveningCleanser);
  
  const eveningToner = getProductIdFromCsvKey(row.toner);
  if (eveningToner) eveningProductIds.push(eveningToner);
  
  const eveningSerum = getProductIdFromCsvKey(row.serum);
  if (eveningSerum) eveningProductIds.push(eveningSerum);
  
  const eveningHydrator = getProductIdFromCsvKey(row.hydrator);
  if (eveningHydrator) eveningProductIds.push(eveningHydrator);
  
  const eveningMoisturizer = getProductIdFromCsvKey(row.moisturizer);
  if (eveningMoisturizer) eveningProductIds.push(eveningMoisturizer);
  
  const eveningTreatment = getProductIdFromCsvKey(row.treatment);
  if (eveningTreatment) eveningProductIds.push(eveningTreatment);

  return { morning: morningProductIds, evening: eveningProductIds };
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

  const productIds = buildProductIdsFromRow(matchingRow);
  console.log('Built product IDs:', productIds);

  const routineType = determineRoutineType(answers.acneTypes, answers.acneSeverity);

  const recommendation: RoutineRecommendation = {
    skinType: answers.skinType,
    fitzpatrickType: answers.fitzpatrickType,
    acneTypes: answers.acneTypes,
    isPregnantOrNursing: isPregnant,
    routineType,
    productIds,
  };

  return recommendation;
}

parseExcelFile();
