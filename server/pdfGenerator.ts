import PDFDocument from 'pdfkit';
import type { Routine } from '@shared/schema';

interface RoutinePDFData {
  routine: Routine;
  userFirstName: string;
}

export function generateRoutinePDF(data: RoutinePDFData): typeof PDFDocument {
  const { routine, userFirstName } = data;
  const routineData = routine.routineData as any;
  
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  // Title Page
  doc.fontSize(28).font('Helvetica-Bold').text('SkinRhythm', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(20).font('Helvetica').text(`${userFirstName}'s Personalized Routine`, { align: 'center' });
  doc.moveDown(2);

  // User Profile
  doc.fontSize(16).font('Helvetica-Bold').text('Your Skin Profile');
  doc.moveDown(0.5);
  doc.fontSize(11).font('Helvetica');
  
  if (routineData.skinType) {
    doc.text(`Skin Type: ${routineData.skinType}`);
  }
  if (routineData.acneTypes && routineData.acneTypes.length > 0) {
    doc.text(`Acne Type(s): ${routineData.acneTypes.map((type: string) => type.replace('-', ' ')).join(', ')}`);
  }
  if (routineData.acneSeverity) {
    doc.text(`Severity: ${routineData.acneSeverity}`);
  }
  if (routineData.fitzpatrickType) {
    doc.text(`Fitzpatrick Type: ${routineData.fitzpatrickType}`);
  }
  
  doc.moveDown(2);

  // Morning Routine
  doc.fontSize(16).font('Helvetica-Bold').text('Morning Routine');
  doc.moveDown(0.5);
  
  if (routineData.products?.morning && routineData.products.morning.length > 0) {
    routineData.products.morning.forEach((product: any, index: number) => {
      doc.fontSize(11).font('Helvetica-Bold').text(`${index + 1}. ${product.category}`, { continued: false });
      doc.fontSize(10).font('Helvetica').text(`   ${product.name}`, { indent: 15 });
      if (product.priceRange) {
        doc.text(`   Price: ${product.priceRange}`, { indent: 15 });
      }
      doc.moveDown(0.5);
    });
  }

  doc.moveDown(1);

  // Evening Routine
  doc.fontSize(16).font('Helvetica-Bold').text('Evening Routine');
  doc.moveDown(0.5);
  
  if (routineData.products?.evening && routineData.products.evening.length > 0) {
    routineData.products.evening.forEach((product: any, index: number) => {
      doc.fontSize(11).font('Helvetica-Bold').text(`${index + 1}. ${product.category}`, { continued: false });
      doc.fontSize(10).font('Helvetica').text(`   ${product.name}`, { indent: 15 });
      if (product.priceRange) {
        doc.text(`   Price: ${product.priceRange}`, { indent: 15 });
      }
      doc.moveDown(0.5);
    });
  }

  // New page for actives ramping
  doc.addPage();
  
  doc.fontSize(16).font('Helvetica-Bold').text('6-Week Actives Introduction Plan');
  doc.moveDown(0.5);
  doc.fontSize(10).font('Helvetica').text('Gradually introduce active ingredients to minimize irritation and build tolerance.');
  doc.moveDown(1);

  // Week-by-week plan
  const weekPlan = [
    { week: 'Week 1-2', frequency: 'Use actives (like mandelic acid, retinol, or benzoyl peroxide) every 3rd night only', note: 'Start slow to assess tolerance' },
    { week: 'Week 3-4', frequency: 'Use actives every other night', note: 'Increase if no irritation occurs' },
    { week: 'Week 5-6', frequency: 'Use actives nightly as tolerated', note: 'Full strength routine achieved' }
  ];

  weekPlan.forEach((plan) => {
    doc.fontSize(11).font('Helvetica-Bold').text(plan.week);
    doc.fontSize(10).font('Helvetica').text(`Frequency: ${plan.frequency}`, { indent: 15 });
    doc.fontSize(9).font('Helvetica-Oblique').text(`Tip: ${plan.note}`, { indent: 15 });
    doc.moveDown(0.8);
  });

  doc.moveDown(1);

  // Application Tips
  doc.fontSize(16).font('Helvetica-Bold').text('Application Tips & Tricks');
  doc.moveDown(0.5);
  
  const tips = [
    'Always apply products on clean, dry skin for best absorption',
    'Wait 30-60 seconds between each product application',
    'Use a pea-sized amount for facial actives - more is not better',
    'Apply SPF as your final morning step, reapply every 2 hours when outdoors',
    'If experiencing irritation, reduce active usage frequency and increase hydration',
    'Avoid mixing strong actives (like retinol and AHAs) on the same night',
    'Keep products away from direct sunlight and extreme temperatures',
    'Track your progress with weekly photos in consistent lighting'
  ];

  doc.fontSize(10).font('Helvetica');
  tips.forEach((tip, index) => {
    doc.text(`${index + 1}. ${tip}`);
    doc.moveDown(0.3);
  });

  doc.moveDown(2);

  // Important Notes
  doc.fontSize(14).font('Helvetica-Bold').text('Important Safety Information');
  doc.moveDown(0.5);
  doc.fontSize(9).font('Helvetica').text(
    'This routine is for educational purposes only and does not constitute medical advice. ' +
    'SkinRhythm is not a substitute for professional dermatological care. If you experience severe ' +
    'irritation, allergic reactions, or your acne worsens, discontinue use and consult a healthcare provider. ' +
    'Perform a patch test before using new products, especially if you have sensitive skin or known allergies.'
  );

  doc.moveDown(1);
  doc.fontSize(9).font('Helvetica-Oblique').text('Generated by SkinRhythm - Your Personalized Skincare Platform', { align: 'center' });

  return doc;
}
