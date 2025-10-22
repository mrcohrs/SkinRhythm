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
  // Single array of unique product IDs - no duplication
  productIds: string[];
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
    const filePath = path.join(process.cwd(), 'attached_assets', 'Acne Agent Routine Logic.xlsx (12) (1)_1761162778689.csv');
    
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

// Build unique product list from CSV row (no duplication)
function buildProductIdsFromRow(row: RoutineRow): string[] {
  const productIds: string[] = [];

  // Add shared products (used in both AM and PM)
  const cleanser = getProductIdFromCsvKey(row.cleanser);
  if (cleanser) productIds.push(cleanser);
  
  const toner = getProductIdFromCsvKey(row.toner);
  if (toner) productIds.push(toner);
  
  const serum = getProductIdFromCsvKey(row.serum);
  if (serum) productIds.push(serum);
  
  const hydrator = getProductIdFromCsvKey(row.hydrator);
  if (hydrator) productIds.push(hydrator);
  
  const moisturizer = getProductIdFromCsvKey(row.moisturizer);
  if (moisturizer) productIds.push(moisturizer);
  
  // Add AM-only product (sunscreen)
  const sunscreen = getProductIdFromCsvKey(row.sunscreen);
  if (sunscreen) productIds.push(sunscreen);
  
  // Add PM-only product (treatment)
  const treatment = getProductIdFromCsvKey(row.treatment);
  if (treatment) productIds.push(treatment);

  // Deduplicate in case CSV has same product in multiple columns
  return Array.from(new Set(productIds));
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

  // Calculate detailed specificity metrics for a row
  const getSpecificityMetrics = (row: RoutineRow, userSkinType: string) => {
    // Count exact matches (highest priority)
    let exactMatches = 0;
    
    // Mature exact match
    if (row.mature !== 'All') exactMatches++;
    
    // Fitz exact match
    if (row.fitzGroup !== 'All') exactMatches++;
    
    // Skin type exact match (single type that exactly matches user)
    if (row.skinType !== 'All' && !row.skinType.includes(',') && 
        row.skinType.toLowerCase() === userSkinType.toLowerCase()) {
      exactMatches++;
    }
    
    // Severity exact match (single severity)
    if (row.severityGroup !== 'All' && !row.severityGroup.includes(',')) {
      exactMatches++;
    }
    
    // Count partial matches (medium priority)
    let partialMatches = 0;
    
    // Multi-value skin type that includes user's type (e.g., "Dry, Normal" when user is "dry")
    if (row.skinType !== 'All' && row.skinType.includes(',')) {
      partialMatches++;
    }
    
    // Multi-value severity (e.g., "Mild, Moderate")
    if (row.severityGroup !== 'All' && row.severityGroup.includes(',')) {
      partialMatches++;
    }
    
    // Count "All" wildcards (lowest priority - fewer is better)
    let wildcards = 0;
    if (row.mature === 'All') wildcards++;
    if (row.fitzGroup === 'All') wildcards++;
    if (row.skinType === 'All') wildcards++;
    if (row.severityGroup === 'All') wildcards++;
    
    return {
      exactMatches,
      partialMatches,
      wildcards,
      // Composite score for sorting (exact matches most important, then partial, then fewer wildcards)
      score: (exactMatches * 1000) + (partialMatches * 100) - wildcards
    };
  };

  // Determine if user is mature (45+ years old)
  const userAge = parseInt(answers.age || '0') || 0;
  const isMature = userAge >= 45;

  // Find all matching rows with their specificity metrics
  const allMatchingRows: Array<{
    row: RoutineRow, 
    originalIndex: number,
    metrics: {
      exactMatches: number,
      partialMatches: number,
      wildcards: number,
      score: number
    }
  }> = [];

  routineData.forEach((row, originalIndex) => {
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
      const metrics = getSpecificityMetrics(row, answers.skinType);
      allMatchingRows.push({ row, originalIndex, metrics });
    }
  });

  // Sort by specificity metrics (exact matches first, then fewer partials, then fewer wildcards)
  allMatchingRows.sort((a, b) => {
    // Primary: Most exact matches wins (higher is better)
    if (b.metrics.exactMatches !== a.metrics.exactMatches) {
      return b.metrics.exactMatches - a.metrics.exactMatches;
    }
    
    // Secondary: FEWER partial matches wins (single-value > multi-value)
    // A row with "Oily" is more specific than "Dry, Normal"
    if (a.metrics.partialMatches !== b.metrics.partialMatches) {
      return a.metrics.partialMatches - b.metrics.partialMatches;
    }
    
    // Tertiary: Fewest wildcards wins (lower is better)
    if (a.metrics.wildcards !== b.metrics.wildcards) {
      return a.metrics.wildcards - b.metrics.wildcards;
    }
    
    // Tie-breaker: Lower original index (earlier in CSV) wins
    return a.originalIndex - b.originalIndex;
  });

  // Log all matching rows with their specificity metrics
  if (allMatchingRows.length > 0) {
    console.log(`\n=== FOUND ${allMatchingRows.length} MATCHING ROWS ===`);
    allMatchingRows.forEach(({ row, originalIndex, metrics }) => {
      console.log(`Match CSV-Row-${originalIndex + 1} [Exact:${metrics.exactMatches}, Partial:${metrics.partialMatches}, Wildcards:${metrics.wildcards}, Score:${metrics.score}]:`, {
        mature: row.mature,
        fitz: row.fitzGroup,
        skin: row.skinType,
        severity: row.severityGroup,
        treatment: row.treatment
      });
    });
    console.log('=== SELECTING MOST SPECIFIC (TOP MATCH) ===\n');
  }

  // Select the most specific match (first after sorting)
  const matchingRow = allMatchingRows.length > 0 ? allMatchingRows[0].row : null;

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
