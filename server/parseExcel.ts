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

interface RoutineRow {
  pregnantNursing: boolean;
  acneType: string;
  severityGroup: string;
  mature: string;
  fitzGroup: string;
  skinType: string;
  cleanser: string;
  toner: string;
  actives: string;
  spf: string;
  hydrator: string;
  moisturizer: string;
  spotBpo: string;
}

let routineData: RoutineRow[] = [];

// Product alternatives mapping with real affiliate links
const productAlternatives: { [key: string]: Array<{name: string, brand: string, price: number, tier: 'budget' | 'standard' | 'premium', link: string}> } = {
  'BARRIER BALANCE CREAMY CLEANSER': [
    { name: 'CeraVe Hydrating Facial Cleanser', brand: 'CeraVe', price: 15.99, tier: 'budget', link: 'https://www.cerave.com/skincare/cleansers/hydrating-facial-cleanser' },
    { name: 'La Roche-Posay Toleriane Cleanser', brand: 'La Roche-Posay', price: 18.99, tier: 'standard', link: 'https://www.laroche-posay.us/face-and-body-skin-care/face-products/face-wash/toleriane-hydrating-gentle-face-cleanser-tolerianehydratinggentlefacecleanser.html' },
  ],
  'ULTRA GENTLE CLEANSER': [
    { name: 'Cetaphil Gentle Skin Cleanser', brand: 'Cetaphil', price: 14.99, tier: 'budget', link: 'https://www.cetaphil.com/us/cleansers/gentle-skin-cleanser/302993927228.html' },
    { name: 'Vanicream Gentle Facial Cleanser', brand: 'Vanicream', price: 12.99, tier: 'budget', link: 'https://www.vanicream.com/product/vanicream-gentle-facial-cleanser' },
  ],
  'ANTIOXIDANT SCRUB': [
    { name: 'Paula\'s Choice Skin Perfecting 2% BHA Gel Exfoliant', brand: 'Paula\'s Choice', price: 32.00, tier: 'standard', link: 'https://www.paulaschoice.com/skin-perfecting-2pct-bha-gel-exfoliant/3210.html' },
    { name: 'The Ordinary AHA 30% + BHA 2% Peeling Solution', brand: 'The Ordinary', price: 8.00, tier: 'budget', link: 'https://theordinary.com/en-us/aha-30-bha-2-peeling-solution-100063.html' },
  ],
  'MANDELIC SCRUB': [
    { name: 'By Wishtrend Mandelic Acid 5% Prep Water', brand: 'Wishtrend', price: 23.00, tier: 'standard', link: 'https://wishtrend.com/products/by-wishtrend-mandelic-acid-5-skin-prep-water' },
    { name: 'The Ordinary Mandelic Acid 10% + HA', brand: 'The Ordinary', price: 6.80, tier: 'budget', link: 'https://theordinary.com/en-us/mandelic-acid-10-ha-100438.html' },
  ],
  'MANDELIC WASH': [
    { name: 'Vivant Skincare Mandelic Acid 3-in-1 Wash', brand: 'Vivant', price: 42.00, tier: 'premium', link: 'https://www.vivantskincare.com/products/mandelic-acid-3-in-1-wash' },
    { name: 'The Ordinary Mandelic Acid 10% + HA', brand: 'The Ordinary', price: 6.80, tier: 'budget', link: 'https://theordinary.com/en-us/mandelic-acid-10-ha-100438.html' },
  ],
  'MOISTURE BALANCE TONER': [
    { name: 'Paula\'s Choice Skin Recovery Toner', brand: 'Paula\'s Choice', price: 29.00, tier: 'standard', link: 'https://www.paulaschoice.com/skin-recovery-enriched-calming-toner/145.html' },
    { name: 'Isntree Hyaluronic Acid Toner', brand: 'Isntree', price: 18.00, tier: 'budget', link: 'https://www.isntree.com/product/hyaluronic-acid-toner-200ml/62/' },
  ],
  'CALMING TONER': [
    { name: 'Klairs Supple Preparation Unscented Toner', brand: 'Klairs', price: 21.00, tier: 'standard', link: 'https://www.klairscosmetics.com/product/supple-preparation-unscented-toner' },
    { name: 'COSRX Centella Water Alcohol-Free Toner', brand: 'COSRX', price: 17.00, tier: 'budget', link: 'https://www.cosrx.com/products/centella-water-alcohol-free-toner' },
  ],
  'SAL-C TONER': [
    { name: 'Paula\'s Choice 2% BHA Liquid Exfoliant', brand: 'Paula\'s Choice', price: 32.00, tier: 'standard', link: 'https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201.html' },
    { name: 'The Ordinary Salicylic Acid 2% Solution', brand: 'The Ordinary', price: 6.50, tier: 'budget', link: 'https://theordinary.com/en-us/salicylic-acid-2-solution-100439.html' },
  ],
  'Vitamin A corrective serum': [
    { name: 'The Ordinary Retinol 0.5% in Squalane', brand: 'The Ordinary', price: 6.50, tier: 'budget', link: 'https://theordinary.com/en-us/retinol-0-5-in-squalane-100066.html' },
    { name: 'Paula\'s Choice 1% Retinol Treatment', brand: 'Paula\'s Choice', price: 58.00, tier: 'premium', link: 'https://www.paulaschoice.com/clinical-1pct-retinol-treatment/8510.html' },
  ],
  'MANDELIC 5%': [
    { name: 'The Ordinary Mandelic Acid 10% + HA', brand: 'The Ordinary', price: 6.80, tier: 'budget', link: 'https://theordinary.com/en-us/mandelic-acid-10-ha-100438.html' },
    { name: 'By Wishtrend Mandelic Acid 5% Prep Water', brand: 'Wishtrend', price: 23.00, tier: 'standard', link: 'https://wishtrend.com/products/by-wishtrend-mandelic-acid-5-skin-prep-water' },
  ],
  'MANDELIC 8%': [
    { name: 'The Ordinary Mandelic Acid 10% + HA', brand: 'The Ordinary', price: 6.80, tier: 'budget', link: 'https://theordinary.com/en-us/mandelic-acid-10-ha-100438.html' },
    { name: 'Vivant Skincare 8% Mandelic Acid Serum', brand: 'Vivant', price: 68.00, tier: 'premium', link: 'https://www.vivantskincare.com/products/mandelic-acid-serum-8' },
  ],
  'SALICYLIC SERUM': [
    { name: 'Paula\'s Choice 2% BHA Liquid Exfoliant', brand: 'Paula\'s Choice', price: 32.00, tier: 'standard', link: 'https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201.html' },
    { name: 'The Ordinary Salicylic Acid 2% Solution', brand: 'The Ordinary', price: 6.50, tier: 'budget', link: 'https://theordinary.com/en-us/salicylic-acid-2-solution-100439.html' },
    { name: 'Paula\'s Choice SKIN PERFECTING 2% BHA Gel', brand: 'Paula\'s Choice', price: 32.00, tier: 'premium', link: 'https://www.paulaschoice.com/skin-perfecting-2pct-bha-gel-exfoliant/3210.html' },
  ],
  'Daily SPF 30': [
    { name: 'EltaMD UV Clear SPF 46', brand: 'EltaMD', price: 39.00, tier: 'premium', link: 'https://eltamd.com/products/uv-clear-broad-spectrum-spf-46' },
    { name: 'CeraVe AM Facial Moisturizing Lotion SPF 30', brand: 'CeraVe', price: 16.99, tier: 'budget', link: 'https://www.cerave.com/skincare/moisturizers/am-facial-moisturizing-lotion-with-sunscreen' },
  ],
  'Ultimate SPF 28': [
    { name: 'La Roche-Posay Anthelios Mineral SPF 50', brand: 'La Roche-Posay', price: 34.99, tier: 'standard', link: 'https://www.laroche-posay.us/anthelios-mineral-sunscreen-spf-50-3337875546407.html' },
    { name: 'Neutrogena Ultra Sheer Dry-Touch SPF 55', brand: 'Neutrogena', price: 11.99, tier: 'budget', link: 'https://www.neutrogena.com/products/sun/ultra-sheer-dry-touch-sunscreen-broad-spectrum-spf-55/6811047.html' },
  ],
  'HYDRABALANCE': [
    { name: 'The Ordinary Hyaluronic Acid 2% + B5', brand: 'The Ordinary', price: 7.90, tier: 'budget', link: 'https://theordinary.com/en-us/hyaluronic-acid-2-b5-100422.html' },
    { name: 'La Roche-Posay Hyalu B5 Pure Hyaluronic Acid Serum', brand: 'La Roche-Posay', price: 39.99, tier: 'premium', link: 'https://www.laroche-posay.us/hyalu-b5-pure-hyaluronic-acid-serum-3337875774598.html' },
  ],
  'CRAN-PEPTIDE CREAM': [
    { name: 'CeraVe PM Facial Moisturizing Lotion', brand: 'CeraVe', price: 14.99, tier: 'budget', link: 'https://www.cerave.com/skincare/moisturizers/pm-facial-moisturizing-lotion' },
    { name: 'Olay Regenerist Micro-Sculpting Cream', brand: 'Olay', price: 32.99, tier: 'standard', link: 'https://www.olay.com/en-us/skin-care-products/regenerist-micro-sculpting-cream' },
  ],
  'CLEARDERMA': [
    { name: 'Cetaphil Pro Oil Absorbing Moisturizer', brand: 'Cetaphil', price: 16.99, tier: 'budget', link: 'https://www.cetaphil.com/us/moisturizers/pro-oil-absorbing-moisturizer-spf-30/302994124917.html' },
    { name: 'La Roche-Posay Effaclar Mat', brand: 'La Roche-Posay', price: 24.99, tier: 'standard', link: 'https://www.laroche-posay.us/effaclar-mat-3337872414084.html' },
  ],
  'ACNE MED 2.5%': [
    { name: 'PanOxyl Acne Creamy Wash 4% Benzoyl Peroxide', brand: 'PanOxyl', price: 9.99, tier: 'budget', link: 'https://www.panoxyl.com/products/creamy-wash-4-benzoyl-peroxide/' },
    { name: 'CeraVe Acne Foaming Cream Cleanser', brand: 'CeraVe', price: 14.99, tier: 'standard', link: 'https://www.cerave.com/skincare/cleansers/acne-foaming-cream-cleanser' },
  ],
  'ACNE MED 5%': [
    { name: 'PanOxyl Acne Foaming Wash 10% Benzoyl Peroxide', brand: 'PanOxyl', price: 11.99, tier: 'budget', link: 'https://www.panoxyl.com/products/foaming-wash-10-benzoyl-peroxide/' },
    { name: 'La Roche-Posay Effaclar Duo Acne Treatment', brand: 'La Roche-Posay', price: 22.99, tier: 'standard', link: 'https://www.laroche-posay.us/effaclar-duo-dual-acne-treatment-3337872414099.html' },
  ],
  'ACNE MED 10%': [
    { name: 'PanOxyl Acne Foaming Wash 10% Benzoyl Peroxide', brand: 'PanOxyl', price: 11.99, tier: 'budget', link: 'https://www.panoxyl.com/products/foaming-wash-10-benzoyl-peroxide/' },
    { name: 'Neutrogena Stubborn Acne AM Treatment', brand: 'Neutrogena', price: 15.99, tier: 'standard', link: 'https://www.neutrogena.com/products/acne/stubborn-acne-am-treatment-with-benzoyl-peroxide/6814701.html' },
  ],
};

export function parseExcelFile() {
  try {
    const filePath = path.join(process.cwd(), 'attached_assets', 'Acne_Assist_TreeWorkbook_NotPN FINAL.xlsx - Noninflamed (12) (1)_1759810721493.csv');
    
    if (!fs.existsSync(filePath)) {
      console.error('CSV file not found at:', filePath);
      return false;
    }

    const workbook = XLSX.readFile(filePath, { raw: false, cellDates: false });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    console.log('Excel data loaded:', data.length, 'rows');

    routineData = data.map((row: any) => ({
      pregnantNursing: row['Pregnant/Nursing?'] === 'Yes',
      acneType: row['Acne Type'] || '',
      severityGroup: row['Severity Group'] || '',
      mature: row['Mature?'] || '',
      fitzGroup: row['Fitz Group'] || '',
      skinType: row['Skin Type'] || '',
      cleanser: row['Cleanser'] || '',
      toner: row['Toner'] || '',
      actives: row['Actives/Serums'] || '',
      spf: row['SPF'] || '',
      hydrator: row['Hydrator/Support'] || '',
      moisturizer: row['Moisturizer'] || '',
      spotBpo: row['Spot/BPO'] || 'None',
    }));

    console.log('Parsed routine data:', routineData.length, 'routines');
    return true;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return false;
  }
}

function getProductAlternatives(productName: string, category: string) {
  const alternatives = productAlternatives[productName] || [];
  
  return alternatives.map(alt => ({
    name: alt.name,
    brand: alt.brand,
    category,
    priceTier: alt.tier,
    price: alt.price,
    benefits: [`Recommended for your skin type`],
    affiliateLink: alt.link,
  }));
}

function buildProductsFromRow(row: RoutineRow) {
  const morningProducts = [];
  const eveningProducts = [];

  // Morning routine: Cleanser → Toner → Actives → SPF → Hydrator → Moisturizer
  if (row.cleanser && row.cleanser !== 'None') {
    const alts = getProductAlternatives(row.cleanser, 'Cleanser');
    if (alts.length > 0) morningProducts.push(alts[0]);
  }
  if (row.toner && row.toner !== 'None') {
    const alts = getProductAlternatives(row.toner, 'Toner');
    if (alts.length > 0) morningProducts.push(alts[0]);
  }
  if (row.actives && row.actives !== 'None') {
    const alts = getProductAlternatives(row.actives, 'Serum');
    if (alts.length > 0) morningProducts.push(alts[0]);
  }
  if (row.spf && row.spf !== 'None') {
    const alts = getProductAlternatives(row.spf, 'SPF');
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

  // Evening routine: Cleanser → Toner → Actives → Spot/BPO → Hydrator → Moisturizer
  if (row.cleanser && row.cleanser !== 'None') {
    const alts = getProductAlternatives(row.cleanser, 'Cleanser');
    if (alts.length > 0) eveningProducts.push(alts[0]);
  }
  if (row.toner && row.toner !== 'None') {
    const alts = getProductAlternatives(row.toner, 'Toner');
    if (alts.length > 0) eveningProducts.push(alts[0]);
  }
  if (row.actives && row.actives !== 'None') {
    const alts = getProductAlternatives(row.actives, 'Serum');
    if (alts.length > 0) eveningProducts.push(alts[0]);
  }
  if (row.spotBpo && row.spotBpo !== 'None') {
    const alts = getProductAlternatives(row.spotBpo, 'Spot Treatment');
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

  return { morning: morningProducts, evening: eveningProducts };
}

export function getRoutineForAnswers(answers: {
  skinType: string;
  fitzpatrickType: string;
  acneTypes: string[];
  acneSeverity: string;
  isPregnantOrNursing: string;
}): RoutineRecommendation | null {
  if (routineData.length === 0) {
    parseExcelFile();
  }

  const isPregnant = answers.isPregnantOrNursing === 'yes';

  // Determine the highest priority acne type
  // Hierarchy: acne-rosacea > inflamed > noninflamed
  let primaryAcneType = 'Noninflamed'; // default
  
  if (answers.acneTypes.includes('acne-rosacea')) {
    primaryAcneType = 'Acne Rosacea';
  } else if (answers.acneTypes.includes('inflamed')) {
    primaryAcneType = 'Inflamed';
  } else if (answers.acneTypes.includes('noninflamed')) {
    primaryAcneType = 'Noninflamed';
  }

  // Helper function to check if severity matches
  const severityMatches = (csvSeverity: string, userSeverity: string) => {
    if (csvSeverity === 'All') return true;
    
    const userSev = userSeverity.toLowerCase();
    const csvSev = csvSeverity.toLowerCase();
    
    // Handle compound severity values like "Mild, Moderate" or "Moderate, Severe"
    if (csvSev.includes(',')) {
      const severities = csvSev.split(',').map(s => s.trim());
      return severities.includes(userSev);
    }
    
    return csvSev === userSev;
  };

  // Find matching routine with exact match first
  let matchingRow = routineData.find(row => {
    // Pregnant/Nursing match
    const pregnancyMatch = row.pregnantNursing === isPregnant;
    
    // Acne type match
    const acneTypeMatch = row.acneType === primaryAcneType;
    
    // Severity match
    const sevMatch = severityMatches(row.severityGroup, answers.acneSeverity);
    
    // Fitz group match (1-3 or 4+ or All)
    const userFitz = answers.fitzpatrickType;
    const fitzMatch = row.fitzGroup === 'All' || row.fitzGroup === userFitz;
    
    // Skin type match (exact or All)
    const skinTypeMatch = row.skinType === 'All' || 
                          row.skinType.toLowerCase() === answers.skinType.toLowerCase() ||
                          row.skinType.toLowerCase().includes(answers.skinType.toLowerCase());
    
    return pregnancyMatch && acneTypeMatch && sevMatch && fitzMatch && skinTypeMatch;
  });

  // If no exact match, try relaxing skin type constraint
  if (!matchingRow) {
    matchingRow = routineData.find(row => {
      const pregnancyMatch = row.pregnantNursing === isPregnant;
      const acneTypeMatch = row.acneType === primaryAcneType;
      const sevMatch = severityMatches(row.severityGroup, answers.acneSeverity);
      const userFitz = answers.fitzpatrickType;
      const fitzMatch = row.fitzGroup === 'All' || row.fitzGroup === userFitz;
      
      return pregnancyMatch && acneTypeMatch && sevMatch && fitzMatch;
    });
  }

  // If still no match, try with "All" values
  if (!matchingRow) {
    matchingRow = routineData.find(row => {
      const pregnancyMatch = row.pregnantNursing === isPregnant;
      const acneTypeMatch = row.acneType === primaryAcneType;
      const sevMatch = severityMatches(row.severityGroup, answers.acneSeverity);
      
      return pregnancyMatch && acneTypeMatch && sevMatch && (row.fitzGroup === 'All' || row.skinType === 'All' || row.mature === 'All');
    });
  }

  // Last resort: use first matching acne type and pregnancy status
  if (!matchingRow) {
    matchingRow = routineData.find(row => {
      const pregnancyMatch = row.pregnantNursing === isPregnant;
      const acneTypeMatch = row.acneType === primaryAcneType;
      
      return pregnancyMatch && acneTypeMatch;
    });
  }

  if (!matchingRow) {
    console.error('No matching routine found for:', answers);
    return null;
  }

  const products = buildProductsFromRow(matchingRow);

  return {
    skinType: answers.skinType,
    fitzpatrickType: answers.fitzpatrickType,
    acneTypes: answers.acneTypes,
    isPregnantOrNursing: isPregnant,
    products,
  };
}
