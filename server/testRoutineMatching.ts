import { getRoutineForAnswers } from './parseExcel';

// Test cases based on user-reported issues
const testCases = [
  {
    name: 'REPORTED BUG: Not mature, Moderate Inflamed, Fitz 1-3, Oily, Not pregnant',
    input: {
      skinType: 'oily',
      fitzpatrickType: '1-3',
      acneTypes: ['inflamed'],
      acneSeverity: 'moderate',
      isPregnantOrNursing: 'no',
      age: '30',
    },
    expected: {
      treatment: 'BPO 5%',
      cleanser: 'ACTIVE CLEANSER',
      toner: 'RESURFACING TONER',
      serum: 'MANDELIC SERUM (FULL STRENGTH)',
      spf: 'MINERAL SPF',
    }
  },
  {
    name: 'CRITICAL: Not mature, Severe Inflamed, Fitz 1-3, Oily, Not pregnant',
    input: {
      skinType: 'oily',
      fitzpatrickType: '1-3',
      acneTypes: ['inflamed'],
      acneSeverity: 'severe',
      isPregnantOrNursing: 'no',
      age: '30',
    },
    expected: {
      treatment: 'BPO 10%',
      cleanser: 'ACTIVE CLEANSER',
      toner: 'RESURFACING TONER',
    }
  },
  {
    name: 'Not mature, Severe Inflamed, Fitz 1-3, Normal, Not pregnant',
    input: {
      skinType: 'normal',
      fitzpatrickType: '1-3',
      acneTypes: ['inflamed'],
      acneSeverity: 'severe',
      isPregnantOrNursing: 'no',
      age: '30',
    },
    expected: {
      treatment: 'BPO 5%',
      cleanser: 'GEL CLEANSER',
      toner: 'SOOTHING TONER',
    }
  },
  {
    name: 'Not mature, Moderate Inflamed, Fitz 1-3, Normal, Not pregnant',
    input: {
      skinType: 'normal',
      fitzpatrickType: '1-3',
      acneTypes: ['inflamed'],
      acneSeverity: 'moderate',
      isPregnantOrNursing: 'no',
      age: '30',
    },
    expected: {
      treatment: 'BPO 5%',
      cleanser: 'GEL CLEANSER',
      toner: 'SOOTHING TONER',
    }
  },
  {
    name: 'Dry, Normal skin type edge case - Fitz 4+, Noninflamed Mild',
    input: {
      skinType: 'dry',
      fitzpatrickType: '4+',
      acneTypes: ['noninflamed'],
      acneSeverity: 'mild',
      isPregnantOrNursing: 'no',
      age: '30',
    },
    expected: {
      cleanser: 'VITAMIN SCRUB',
      toner: 'SOOTHING TONER',
      serum: 'RETINOL SERUM',
    }
  },
  {
    name: 'Normal skin - Fitz 4+, Noninflamed Mild (should also match Dry, Normal row)',
    input: {
      skinType: 'normal',
      fitzpatrickType: '4+',
      acneTypes: ['noninflamed'],
      acneSeverity: 'mild',
      isPregnantOrNursing: 'no',
      age: '30',
    },
    expected: {
      cleanser: 'VITAMIN SCRUB',
      toner: 'SOOTHING TONER',
      serum: 'RETINOL SERUM',
    }
  }
];

console.log('\n========================================');
console.log('ROUTINE MATCHING TEST SUITE');
console.log('========================================\n');

let passCount = 0;
let failCount = 0;

testCases.forEach((testCase, index) => {
  console.log(`\n--- Test ${index + 1}: ${testCase.name} ---`);
  
  const result = getRoutineForAnswers(testCase.input);
  
  if (!result) {
    console.error('❌ FAIL: No routine returned');
    failCount++;
    return;
  }
  
  let testPassed = true;
  const failures: string[] = [];
  
  // Check treatment (BPO) - most critical
  if (testCase.expected.treatment) {
    const hasTreatment = result.productIds.some(id => {
      if (testCase.expected.treatment === 'BPO 2.5%') return id === 'bpo-2-5';
      if (testCase.expected.treatment === 'BPO 5%') return id === 'bpo-5';
      if (testCase.expected.treatment === 'BPO 10%') return id === 'bpo-10';
      return false;
    });
    
    if (!hasTreatment) {
      testPassed = false;
      failures.push(`Expected treatment: ${testCase.expected.treatment}, got product IDs: ${result.productIds.join(', ')}`);
    }
  }
  
  // Check cleanser
  if (testCase.expected.cleanser) {
    const hasCleanser = result.productIds.some(id => {
      if (testCase.expected.cleanser === 'ACTIVE CLEANSER') return id === 'active-cleanser';
      if (testCase.expected.cleanser === 'GEL CLEANSER') return id === 'gel-cleanser';
      if (testCase.expected.cleanser === 'CREAMY CLEANSER') return id === 'creamy-cleanser';
      if (testCase.expected.cleanser === 'VITAMIN SCRUB') return id === 'vitamin-scrub';
      if (testCase.expected.cleanser === 'EXFOLIATING SCRUB') return id === 'exfoliating-scrub';
      return false;
    });
    
    if (!hasCleanser) {
      testPassed = false;
      failures.push(`Expected cleanser: ${testCase.expected.cleanser}`);
    }
  }
  
  // Check toner
  if (testCase.expected.toner) {
    const hasToner = result.productIds.some(id => {
      if (testCase.expected.toner === 'RESURFACING TONER') return id === 'resurfacing-toner';
      if (testCase.expected.toner === 'SOOTHING TONER') return id === 'soothing-toner';
      if (testCase.expected.toner === 'MOISTURIZING TONER') return id === 'moisturizing-toner';
      return false;
    });
    
    if (!hasToner) {
      testPassed = false;
      failures.push(`Expected toner: ${testCase.expected.toner}`);
    }
  }
  
  // Check serum
  if (testCase.expected.serum) {
    const hasSerum = result.productIds.some(id => {
      if (testCase.expected.serum === 'MANDELIC SERUM (FULL STRENGTH)') return id === 'mandelic-serum-full';
      if (testCase.expected.serum === 'MANDELIC SERUM (GENTLE)') return id === 'mandelic-serum-gentle';
      if (testCase.expected.serum === 'RETINOL SERUM') return id === 'retinol-serum';
      if (testCase.expected.serum === 'RESURFACING SERUM') return id === 'resurfacing-serum';
      return false;
    });
    
    if (!hasSerum) {
      testPassed = false;
      failures.push(`Expected serum: ${testCase.expected.serum}`);
    }
  }
  
  // Check SPF
  if (testCase.expected.spf) {
    const hasSpf = result.productIds.some(id => {
      if (testCase.expected.spf === 'MINERAL SPF') return id === 'mineral-spf';
      if (testCase.expected.spf === 'CHEMICAL SPF') return id === 'chemical-spf';
      return false;
    });
    
    if (!hasSpf) {
      testPassed = false;
      failures.push(`Expected SPF: ${testCase.expected.spf}`);
    }
  }
  
  if (testPassed) {
    console.log('✅ PASS: All expected products found');
    passCount++;
  } else {
    console.log('❌ FAIL:');
    failures.forEach(f => console.log(`  - ${f}`));
    console.log(`  Got product IDs: ${result.productIds.join(', ')}`);
    failCount++;
  }
});

console.log('\n========================================');
console.log(`RESULTS: ${passCount} passed, ${failCount} failed`);
console.log('========================================\n');
