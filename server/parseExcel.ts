import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export interface RoutineRecommendation {
  skinType: string;
  fitzpatrickType: string;
  acneTypes: string[];
  isPregnantOrNursing: boolean;
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

let routineData: RoutineRecommendation[] = [];

export function parseExcelFile() {
  try {
    const filePath = path.join(process.cwd(), 'attached_assets', 'Acne_Assist_Routines_60_With_Alternatives.xlsx - Not Pregnant or Nursing_1759626714930.csv');
    
    if (!fs.existsSync(filePath)) {
      console.error('CSV file not found at:', filePath);
      return false;
    }

    const workbook = XLSX.readFile(filePath, { raw: false, cellDates: false });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    console.log('Excel data loaded:', data.length, 'rows');
    console.log('Sample row:', data[0]);

    const extractProductsFromAlternatives = (altText: string, priceTier: 'budget' | 'standard' | 'premium') => {
      const products: any[] = [];
      const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;
      let index = 0;
      
      while ((match = regex.exec(altText)) !== null && index < 3) {
        const [_, name, url] = match;
        products.push({
          name,
          brand: name.split(' ')[0],
          category: '',
          priceTier,
          price: priceTier === 'budget' ? 15.99 : priceTier === 'standard' ? 32.99 : 75.00,
          benefits: ['Recommended for your skin type'],
          affiliateLink: url,
        });
        index++;
      }
      
      return products;
    };

    routineData = data.map((row: any) => {
      const acneTypes: string[] = [];
      if (row['Inflamed?'] === 'Inflamed') acneTypes.push('inflamed');
      if (row['Inflamed?'] === 'Noninflamed') acneTypes.push('noninflamed');
      if (row['Acne Rosacea?'] === 'Yes') acneTypes.push('acne-rosacea');

      const cleanserAlts = extractProductsFromAlternatives(row['Cleanser Alternatives'] || '', 'budget');
      const tonerAlts = extractProductsFromAlternatives(row['Toner Alternatives'] || '', 'budget');
      const activeAlts = extractProductsFromAlternatives(row['Actives/Serums Alternatives'] || '', 'standard');
      const spfAlts = extractProductsFromAlternatives(row['SPF Alternatives'] || '', 'standard');
      const moisturizerAlts = extractProductsFromAlternatives(row['Moisturizer Alternatives'] || '', 'budget');
      const hydratorAlts = extractProductsFromAlternatives(row['Hydrator/Support Alternatives'] || '', 'standard');
      const spotBpoAlts = extractProductsFromAlternatives(row['Spot/BPO Alternatives'] || '', 'standard');

      // Normalize Fitz Group - handle CSV date parsing issues
      let fitzGroup = row['Fitz Group'] || '1-3';
      if (typeof fitzGroup === 'string' && fitzGroup.includes('/')) {
        // If it was parsed as a date like "1/3/01", convert to "1-3"
        fitzGroup = fitzGroup.startsWith('1/') ? '1-3' : '4+';
      }

      return {
        skinType: (row['Skin Type'] || 'Normal').split('/')[0],
        fitzpatrickType: fitzGroup,
        acneTypes,
        isPregnantOrNursing: row['P/N?'] === 'Yes',
        products: {
          morning: [
            ...(cleanserAlts.length > 0 ? [cleanserAlts[0]] : []),
            ...(tonerAlts.length > 0 ? [tonerAlts[0]] : []),
            ...(activeAlts.length > 0 ? [activeAlts[0]] : []),
            ...(moisturizerAlts.length > 0 ? [moisturizerAlts[0]] : []),
            ...(spfAlts.length > 0 ? [spfAlts[0]] : []),
          ],
          evening: [
            ...(cleanserAlts.length > 1 ? [cleanserAlts[1]] : cleanserAlts.length > 0 ? [cleanserAlts[0]] : []),
            ...(activeAlts.length > 1 ? [activeAlts[1]] : activeAlts.length > 0 ? [activeAlts[0]] : []),
            ...(spotBpoAlts.length > 0 ? [spotBpoAlts[0]] : []),
            ...(hydratorAlts.length > 0 ? [hydratorAlts[0]] : []),
            ...(moisturizerAlts.length > 0 ? [moisturizerAlts[0]] : []),
          ],
        },
      };
    });

    console.log('Parsed routine data:', routineData.length, 'routines');
    return true;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return false;
  }
}

export function getRoutineForAnswers(answers: {
  skinType: string;
  fitzpatrickType: string;
  acneTypes: string[];
  isPregnantOrNursing: string;
}): RoutineRecommendation | null {
  if (routineData.length === 0) {
    parseExcelFile();
  }

  const isPregnant = answers.isPregnantOrNursing === 'yes';

  const matchingRoutine = routineData.find(routine => {
    const skinTypeMatch = routine.skinType.toLowerCase() === answers.skinType.toLowerCase();
    const fitzpatrickMatch = routine.fitzpatrickType === answers.fitzpatrickType;
    const pregnancyMatch = routine.isPregnantOrNursing === isPregnant;
    
    // Acne type priority: acne-rosacea > inflamed > noninflamed
    let acneTypeMatch = false;
    
    if (answers.acneTypes.length === 0) {
      // If no acne types specified, match any routine
      acneTypeMatch = true;
    } else if (answers.acneTypes.includes('acne-rosacea')) {
      // If user has acne rosacea, they ONLY get acne rosacea routine (trumps inflamed/noninflamed)
      acneTypeMatch = routine.acneTypes.includes('acne-rosacea');
    } else if (answers.acneTypes.includes('inflamed')) {
      // If user has inflamed (but not acne rosacea), they get inflamed routines (inflamed trumps noninflamed)
      acneTypeMatch = routine.acneTypes.includes('inflamed');
    } else if (answers.acneTypes.includes('noninflamed')) {
      // If user only has noninflamed, they get noninflamed routines
      acneTypeMatch = routine.acneTypes.includes('noninflamed');
    }

    return skinTypeMatch && fitzpatrickMatch && pregnancyMatch && acneTypeMatch;
  });

  if (matchingRoutine) {
    return matchingRoutine;
  }

  const partialMatch = routineData.find(routine => {
    const skinTypeMatch = routine.skinType.toLowerCase() === answers.skinType.toLowerCase();
    const fitzpatrickMatch = routine.fitzpatrickType === answers.fitzpatrickType;
    return skinTypeMatch && fitzpatrickMatch;
  });

  return partialMatch || routineData[0] || null;
}
