// Weekly routine schedules for different acne types
// This is a premium feature that provides detailed week-by-week guidance

export interface WeeklyRoutineStep {
  weekRange: string;
  amRoutine: string[];
  pmRoutine: string[];
  notes?: string;
}

export type RoutineType = 'inflamed' | 'noninflamed-mild' | 'noninflamed-moderate-severe' | 'rosacea';

export const weeklyRoutines: Record<RoutineType, WeeklyRoutineStep[]> = {
  'inflamed': [
    {
      weekRange: 'Weeks 1–2',
      amRoutine: ['Cleanser', 'Ice', 'Toner', 'Serum (every other day)', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Ice', 'Timed Acne Med', 'Cleanser', 'Toner', 'Hydrator (optional)', 'Moisturizer'],
      notes: 'Week 1: Apply benzoyl peroxide and leave on for 15 minutes, then rinse and proceed with cleanser, toner, hydrator, and moisturizer. Week 2: Apply benzoyl peroxide and leave on for 30-45 minutes, then rinse and proceed with same routine.'
    },
    {
      weekRange: 'Weeks 3–4',
      amRoutine: ['Cleanser', 'Ice', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Ice', 'Toner', 'Hydrator (optional)', 'Acne Med'],
      notes: 'Leave acne med on overnight. No moisturizer before or after acne med.'
    },
    {
      weekRange: 'Weeks 5–6',
      amRoutine: ['Cleanser', 'Ice', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Ice', 'Toner', 'Serum', 'Hydrator (optional)', 'Acne Med'],
      notes: 'Leave acne med on overnight. No moisturizer before or after acne med.'
    }
  ],
  'noninflamed-mild': [
    {
      weekRange: 'Weeks 1–2',
      amRoutine: ['Cleanser', 'Toner', 'Serum (every other day)', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Toner', 'Hydrator (optional)', 'Moisturizer']
    },
    {
      weekRange: 'Weeks 3–4',
      amRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Toner', 'Hydrator (optional)', 'Moisturizer']
    },
    {
      weekRange: 'Weeks 5–6',
      amRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer']
    }
  ],
  'noninflamed-moderate-severe': [
    {
      weekRange: 'Weeks 1–2',
      amRoutine: ['Cleanser', 'Toner', 'Serum (every other day)', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Timed Acne Med', 'Cleanser', 'Toner', 'Hydrator (optional)', 'Moisturizer'],
      notes: 'Week 1: Apply benzoyl peroxide and leave on for 15 minutes, then rinse and proceed with cleanser, toner, hydrator, and moisturizer. Week 2: Apply benzoyl peroxide and leave on for 30-45 minutes, then rinse and proceed with same routine.'
    },
    {
      weekRange: 'Weeks 3–4',
      amRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Toner', 'Hydrator (optional)', 'Acne Med'],
      notes: 'Leave acne med on overnight. No moisturizer before or after acne med.'
    },
    {
      weekRange: 'Weeks 5–6',
      amRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Acne Med'],
      notes: 'Leave acne med on overnight. No moisturizer before or after acne med.'
    }
  ],
  'rosacea': [
    {
      weekRange: 'Weeks 1–2',
      amRoutine: ['Cleanser', 'Toner', 'Serum (every other day)', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Timed Acne Med', 'Cleanser', 'Toner', 'Hydrator (optional)', 'Moisturizer'],
      notes: 'Week 1: Apply benzoyl peroxide and leave on for 15 minutes, then rinse and proceed with cleanser, toner, hydrator, and moisturizer. Week 2: Apply benzoyl peroxide and leave on for 30-45 minutes, then rinse and proceed with same routine.'
    },
    {
      weekRange: 'Weeks 3–4',
      amRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Toner', 'Hydrator (optional)', 'Acne Med'],
      notes: 'Leave acne med on overnight. No moisturizer before or after acne med.'
    },
    {
      weekRange: 'Weeks 5–6',
      amRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Acne Med'],
      notes: 'Leave acne med on overnight. No moisturizer before or after acne med.'
    }
  ]
};

// Determine which routine type to use based on acne types and severity
export function determineRoutineType(acneTypes: string[], acneSeverity: string): RoutineType {
  const hasInflamed = acneTypes.some(type => 
    type.toLowerCase().includes('cyst') || 
    type.toLowerCase().includes('nodule') || 
    type.toLowerCase().includes('papule') ||
    type.toLowerCase().includes('pustule')
  );

  const hasRosacea = acneTypes.some(type => 
    type.toLowerCase().includes('rosacea')
  );

  if (hasRosacea) {
    return 'rosacea';
  }

  if (hasInflamed) {
    return 'inflamed';
  }

  // Non-inflamed acne
  const isMild = acneSeverity.toLowerCase() === 'mild';
  return isMild ? 'noninflamed-mild' : 'noninflamed-moderate-severe';
}

// Map category names from routine steps to product categories
export const categoryMapping: Record<string, string> = {
  'Cleanser': 'Cleanser',
  'Ice': 'Ice', // Special case - not a product
  'Toner': 'Toner',
  'Serum': 'Serum',
  'Serum (every other day)': 'Serum',
  'Hydrator': 'Hydrator',
  'Hydrator (optional)': 'Hydrator',
  'Moisturizer': 'Moisturizer',
  'Sunscreen': 'SPF',
  'Acne Med': 'Spot Treatment',
  'Timed Acne Med': 'Spot Treatment',
};
