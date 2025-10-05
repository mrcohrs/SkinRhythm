import { parseExcelFile, getRoutineForAnswers } from './parseExcel';

console.log('Testing Excel parser...\n');

const success = parseExcelFile();
console.log('Parse successful:', success);

if (success) {
  const testAnswers = {
    skinType: 'oily',
    fitzpatrickType: '1-3',
    acneTypes: ['inflamed'],
    isPregnantOrNursing: 'no',
  };

  console.log('\nTesting routine lookup with:', testAnswers);
  const routine = getRoutineForAnswers(testAnswers);
  
  if (routine) {
    console.log('\nFound routine:');
    console.log('- Skin Type:', routine.skinType);
    console.log('- Fitzpatrick:', routine.fitzpatrickType);
    console.log('- Acne Types:', routine.acneTypes);
    console.log('- Morning products:', routine.products.morning.length);
    console.log('- Evening products:', routine.products.evening.length);
  } else {
    console.log('No routine found');
  }
}
