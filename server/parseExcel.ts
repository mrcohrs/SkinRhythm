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
    const filePath = path.join(process.cwd(), 'attached_assets', 'Acne_Assist_Routines_60_With_Alternatives_1759622368076.xlsx');
    
    if (!fs.existsSync(filePath)) {
      console.error('Excel file not found at:', filePath);
      return false;
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

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

      return {
        skinType: (row['Skin Type'] || 'Normal').split('/')[0],
        fitzpatrickType: row['Fitz Group'] || '1-3',
        acneTypes,
        isPregnantOrNursing: row['P/N?'] === 'Yes',
        products: {
          morning: [
            ...(cleanserAlts.length > 0 ? [cleanserAlts[0]] : []),
            ...(tonerAlts.length > 0 ? [tonerAlts[0]] : []),
            ...(activeAlts.length > 0 ? [activeAlts[0]] : []),
            ...(spfAlts.length > 0 ? [spfAlts[0]] : []),
          ],
          evening: [
            ...(cleanserAlts.length > 1 ? [cleanserAlts[1]] : cleanserAlts.length > 0 ? [cleanserAlts[0]] : []),
            ...(activeAlts.length > 1 ? [activeAlts[1]] : activeAlts.length > 0 ? [activeAlts[0]] : []),
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
    
    const acneTypeMatch = answers.acneTypes.some(userType => 
      routine.acneTypes.some(routineType => 
        routineType.toLowerCase().includes(userType.toLowerCase()) ||
        userType.toLowerCase().includes(routineType.toLowerCase())
      )
    );

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
