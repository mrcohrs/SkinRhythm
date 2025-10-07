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

const productAlternatives: { [key: string]: Array<{name: string, brand: string, price: number, tier: 'budget' | 'standard' | 'premium', link: string}> } = {
  'BARRIER BALANCE CREAMY CLEANSER': [
    { name: 'La Roche-Posay Toleriane Hydrating Gentle Cleanser', brand: 'La Roche-Posay', price: 18.99, tier: 'standard', link: 'https://www.dermstore.com/p/la-roche-posay-toleriane-hydrating-gentle-cleanser-400ml/11429066/' },
    { name: 'SkinCeuticals Gentle Cleanser', brand: 'SkinCeuticals', price: 38.00, tier: 'premium', link: 'https://www.skinceuticals.com/skincare/facial-cleansers/gentle-cleanser/S33.html' },
    { name: 'Youth To The People Superfood Gentle Antioxidant Cleanser', brand: 'Youth To The People', price: 38.00, tier: 'premium', link: 'https://www.sephora.com/product/clean-clean-gentle-gel-foaming-cleanser-P514513' },
  ],
  'ULTRA GENTLE CLEANSER': [
    { name: 'Youth To The People Superfood Gentle Antioxidant Cleanser', brand: 'Youth To The People', price: 38.00, tier: 'standard', link: 'https://www.sephora.com/product/clean-clean-gentle-gel-foaming-cleanser-P514513' },
  ],
  'MANDELIC WASH': [
    { name: 'Prequel Glycerin and Glycolic Acid Cleanser', brand: 'Prequel', price: 24.00, tier: 'budget', link: 'https://prequelskin.com/products/gleanser-glycerin-and-glycolic-acid-cleanser' },
    { name: 'Prequel Glycerin and Salicylic Acid Cleanser', brand: 'Prequel', price: 24.00, tier: 'standard', link: 'https://prequelskin.com/products/gleanser-glycerin-and-salicylic-acid-cleanser' },
    { name: 'Circadia Cleansing Gel with Mandelic Acid', brand: 'Circadia', price: 42.00, tier: 'premium', link: 'https://artofskincare.com/products/circadia-cleansing-gel-with-mandelic-acid' },
  ],
  'ANTIOXIDANT SCRUB': [
    { name: 'Paula\'s Choice The UnScrub', brand: 'Paula\'s Choice', price: 32.00, tier: 'budget', link: 'https://www.paulaschoice.com/the-unscrub/740-7400.html' },
    { name: 'ClearStem VitaminScrub', brand: 'ClearStem', price: 48.00, tier: 'standard', link: 'https://clearstem.com/products/vitaminscrub' },
  ],
  'MANDELIC SCRUB': [
    { name: 'Prequel Glycerin and Salicylic Acid Cleanser', brand: 'Prequel', price: 24.00, tier: 'budget', link: 'https://prequelskin.com/products/gleanser-glycerin-and-salicylic-acid-cleanser' },
    { name: 'Prequel Glycerin and Salicylic Acid Cleanser', brand: 'Prequel', price: 24.00, tier: 'standard', link: 'https://prequelskin.com/products/gleanser-glycerin-and-salicylic-acid-cleanser' },
    { name: 'Bibalo Mandelic Scrub', brand: 'Bibalo', price: 58.00, tier: 'premium', link: 'https://www.bibalosangeles.com/products/mandelic-scrub' },
  ],
  'MOISTURE BALANCE TONER': [
    { name: 'Klairs Supple Preparation Unscented Toner', brand: 'Klairs', price: 23.00, tier: 'budget', link: 'https://www.ulta.com/p/supple-preparation-unscented-toner-pimprod2023584' },
    { name: 'Face Reality Moisture Balance Toner', brand: 'Face Reality', price: 28.00, tier: 'standard', link: 'https://facerealityskincare.com/products/moisture-balance-toner' },
    { name: 'Biba Sousa Hydrating Toner with Phospholipids', brand: 'Biba Sousa', price: 45.00, tier: 'premium', link: 'https://www.amazon.com/Biba-Sousa-Hydrating-Toner-Phospholipids/dp/B0C5NNCMLT' },
  ],
  'CALMING TONER': [
    { name: 'Paula\'s Choice Calm Nourishing Milky Toner', brand: 'Paula\'s Choice', price: 28.00, tier: 'budget', link: 'https://www.paulaschoice.com/calm-nourishing-milky-toner/9230-9230.html' },
    { name: 'Face Reality Soothing Radiance Toner', brand: 'Face Reality', price: 32.00, tier: 'standard', link: 'https://facerealityskincare.com/products/soothing-radiance-toner' },
  ],
  'SAL-C TONER': [
    { name: 'Cleen Beauty PHA Toner', brand: 'Cleen Beauty', price: 18.00, tier: 'budget', link: 'https://www.walmart.com/ip/cleen-beauty-PHA-Toner-alcohol-free-5-fl-oz/542088548' },
    { name: 'Paula\'s Choice Skin Perfecting 2% BHA Liquid Exfoliant', brand: 'Paula\'s Choice', price: 32.00, tier: 'standard', link: 'https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201-2010.html' },
  ],
  'Vitamin A corrective serum': [
    { name: 'Good Molecules Gentle Retinol Cream', brand: 'Good Molecules', price: 14.00, tier: 'standard', link: 'https://www.goodmolecules.com/s/good-molecules-gentle-retinol-cream-single' },
  ],
  'MANDELIC 5%': [
    { name: 'Paula\'s Choice Skin Perfecting 6% Mandelic Acid + 2% Lactic Acid Liquid Exfoliant', brand: 'Paula\'s Choice', price: 38.00, tier: 'budget', link: 'https://www.sephora.com/product/mini-skin-perfecting-6-mandelic-acid-2-lactic-acid-liquid-exfoliant-P514579' },
    { name: 'Paula\'s Choice Skin Perfecting 6% Mandelic Acid + 2% Lactic Acid Liquid Exfoliant', brand: 'Paula\'s Choice', price: 38.00, tier: 'standard', link: 'https://www.sephora.com/product/mini-skin-perfecting-6-mandelic-acid-2-lactic-acid-liquid-exfoliant-P514579' },
    { name: 'Sofie Pavitt Mandelic Clearing Serum', brand: 'Sofie Pavitt', price: 85.00, tier: 'premium', link: 'https://www.sofiepavittface.com/products/mandelic-clearing-serum' },
  ],
  'MANDELIC 8%': [
    { name: 'Good Molecules Mandelic Acid Serum', brand: 'Good Molecules', price: 12.00, tier: 'standard', link: 'https://www.goodmolecules.com/s/good-molecules-mandelic-acid-serum-single' },
    { name: 'Sofie Pavitt Mandelic Clearing Serum', brand: 'Sofie Pavitt', price: 85.00, tier: 'premium', link: 'https://www.sofiepavittface.com/products/mandelic-clearing-serum' },
  ],
  'SALICYLIC SERUM': [
    { name: 'Naturium Salicylic Acid Serum 2%', brand: 'Naturium', price: 19.99, tier: 'standard', link: 'https://naturium.com/products/salicylic-acid-serum-2' },
  ],
  'HYDRABALANCE': [
    { name: 'Good Molecules Hyaluronic Acid Serum', brand: 'Good Molecules', price: 12.00, tier: 'budget', link: 'https://www.goodmolecules.com/s/good-molecules-hyaluronic-acid-serum-30-ml' },
    { name: 'Youth To The People Super Saturated Hydrating Barrier Serum', brand: 'Youth To The People', price: 48.00, tier: 'standard', link: 'https://www.sephora.com/product/super-saturated-hydrating-barrier-serum-P518192' },
    { name: 'Prequel Multi-Quench Polyglutamic Acid Serum', brand: 'Prequel', price: 38.00, tier: 'premium', link: 'https://prequelskin.com/products/multi-quench-polyglutamic-acid-serum' },
  ],
  'CRAN-PEPTIDE CREAM': [
    { name: 'Vanicream Daily Facial Moisturizer', brand: 'Vanicream', price: 14.99, tier: 'budget', link: 'https://www.target.com/p/vanicream-daily-facial-moisturizer-for-sensitive-skin-3-fl-oz/-/A-80038093' },
    { name: 'Medik8 Total Moisture Daily Facial Cream', brand: 'Medik8', price: 52.00, tier: 'standard', link: 'https://us.medik8.com/products/total-moisture-daily-facial-cream' },
    { name: 'ClearStem HydraGlow', brand: 'ClearStem', price: 78.00, tier: 'premium', link: 'https://clearstem.com/products/hydraglow' },
  ],
  'CRAN PEPTIDE CREAM': [
    { name: 'Vanicream Daily Facial Moisturizer', brand: 'Vanicream', price: 14.99, tier: 'budget', link: 'https://www.target.com/p/vanicream-daily-facial-moisturizer-for-sensitive-skin-3-fl-oz/-/A-80038093' },
    { name: 'Medik8 Total Moisture Daily Facial Cream', brand: 'Medik8', price: 52.00, tier: 'standard', link: 'https://us.medik8.com/products/total-moisture-daily-facial-cream' },
    { name: 'ClearStem HydraGlow', brand: 'ClearStem', price: 78.00, tier: 'premium', link: 'https://clearstem.com/products/hydraglow' },
  ],
  'CLEARDERMA': [
    { name: 'Byoma Blemish & Acne Control Moisturizer', brand: 'Byoma', price: 14.99, tier: 'budget', link: 'https://www.target.com/p/byoma-blemish-acne-control-moisturizer-1-69-fl-oz/-/A-94468812' },
    { name: 'Prequel AM/PM Face Moisturizer', brand: 'Prequel', price: 38.00, tier: 'standard', link: 'https://prequelskin.com/products/am-pm-face-moisturizer' },
    { name: 'ClearStem HydraGlow', brand: 'ClearStem', price: 78.00, tier: 'premium', link: 'https://clearstem.com/products/hydraglow' },
  ],
  'Daily SPF 30': [
    { name: 'Supergoop Unseen Sunscreen SPF 40', brand: 'Supergoop', price: 36.00, tier: 'budget', link: 'https://martie.com/products/unseen-sunscreen-invisible-broad-spectrum-spf-40-pa-2' },
    { name: 'Supergoop Every Single Face Watery Lotion SPF 50', brand: 'Supergoop', price: 38.00, tier: 'standard', link: 'https://www.sephora.com/product/supergoop-every-single-face-watery-lotion-spf-50-P482325' },
    { name: 'Prequel Solar Shade Chemical Sunscreen', brand: 'Prequel', price: 42.00, tier: 'premium', link: 'https://prequelskin.com/products/solar-shade-chemical-sunscreen' },
  ],
  'DAILY SPF 30': [
    { name: 'Supergoop Unseen Sunscreen SPF 40', brand: 'Supergoop', price: 36.00, tier: 'budget', link: 'https://martie.com/products/unseen-sunscreen-invisible-broad-spectrum-spf-40-pa-2' },
    { name: 'Supergoop Every Single Face Watery Lotion SPF 50', brand: 'Supergoop', price: 38.00, tier: 'standard', link: 'https://www.sephora.com/product/supergoop-every-single-face-watery-lotion-spf-50-P482325' },
    { name: 'Prequel Solar Shade Chemical Sunscreen', brand: 'Prequel', price: 42.00, tier: 'premium', link: 'https://prequelskin.com/products/solar-shade-chemical-sunscreen' },
  ],
  'Ultimate SPF 28': [
    { name: 'Prequel Sun Barrier Mineral Sunscreen', brand: 'Prequel', price: 42.00, tier: 'premium', link: 'https://prequelskin.com/products/sun-barrier-mineral-sunscreen' },
  ],
  'ULTIMATE SPF 28': [
    { name: 'Prequel Sun Barrier Mineral Sunscreen', brand: 'Prequel', price: 42.00, tier: 'premium', link: 'https://prequelskin.com/products/sun-barrier-mineral-sunscreen' },
  ],
  'ACNE MED 2.5%': [
    { name: 'Dr. Song Benzoyl Peroxide 2.5%', brand: 'Dr. Song', price: 12.99, tier: 'budget', link: 'https://www.amazon.com/dp/B00DFEGDVS/' },
    { name: 'MDacne Treatment Cream with Benzoyl Peroxide', brand: 'MDacne', price: 24.99, tier: 'standard', link: 'https://www.amazon.com/MDacne-Treatment-Blemishes-Plant-Based-Ingredients/dp/B0917KL3V7/' },
    { name: 'Sofie Pavitt 5% Benzoyl Peroxide Acne Treatment Mask', brand: 'Sofie Pavitt', price: 48.00, tier: 'premium', link: 'https://www.sephora.com/product/sofie-pavitt-face-5-benzoyl-peroxide-acne-treatment-mask-with-glycolic-acid-P515840' },
  ],
  'ACNE MED 5%': [
    { name: 'MDacne Acne Treatment Gel 5%', brand: 'MDacne', price: 24.99, tier: 'budget', link: 'https://www.amazon.com/dp/B0917LKT7B/' },
  ],
  'ACNE MED 10%': [
    { name: 'AcneFree Terminator 10 Acne Spot Treatment', brand: 'AcneFree', price: 9.99, tier: 'budget', link: 'https://www.amazon.com/AcneFree-Terminator-Treatment-Peroxide-Strength/dp/B0014VTOAQ/' },
  ],
};

export function parseExcelFile() {
  try {
    const filePath = path.join(process.cwd(), 'attached_assets', 'Acne_Assist_TreeWorkbook_NotPN FINAL.xlsx - Noninflamed (12) (1)_1759814958965.csv');
    
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
      severityGroup: row['Severity'] || '',
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

  let primaryAcneType = 'Noninflamed';
  
  if (answers.acneTypes.includes('acne-rosacea')) {
    primaryAcneType = 'Acne Rosacea';
  } else if (answers.acneTypes.includes('inflamed')) {
    primaryAcneType = 'Inflamed';
  } else if (answers.acneTypes.includes('noninflamed')) {
    primaryAcneType = 'Noninflamed';
  }

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

  let matchingRow = routineData.find(row => {
    const pregnancyMatch = row.pregnantNursing === isPregnant;
    const acneTypeMatch = row.acneType === primaryAcneType;
    const sevMatch = severityMatches(row.severityGroup, answers.acneSeverity);
    const userFitz = answers.fitzpatrickType;
    const fitzMatch = row.fitzGroup === 'All' || row.fitzGroup === userFitz;
    const skinTypeMatch = row.skinType === 'All' || 
                          row.skinType.toLowerCase() === answers.skinType.toLowerCase() ||
                          row.skinType.toLowerCase().includes(answers.skinType.toLowerCase());
    
    return pregnancyMatch && acneTypeMatch && sevMatch && fitzMatch && skinTypeMatch;
  });

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

  if (!matchingRow) {
    matchingRow = routineData.find(row => {
      const pregnancyMatch = row.pregnantNursing === isPregnant;
      const acneTypeMatch = row.acneType === primaryAcneType;
      const sevMatch = severityMatches(row.severityGroup, answers.acneSeverity);
      
      return pregnancyMatch && acneTypeMatch && sevMatch && (row.fitzGroup === 'All' || row.skinType === 'All' || row.mature === 'All');
    });
  }

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
