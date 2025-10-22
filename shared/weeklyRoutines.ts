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
      amRoutine: ['Cleanser', 'Ice (see notes)', 'Toner', 'Serum (every other day)', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Ice (see notes)', 'BPO Mask (see notes)', 'Cleanser', 'Toner', 'Hydrator (optional)', 'Moisturizer'],
      notes: 'Apply a thin layer of your BPO product to your face for 15-30 min (week 1) / 30 mins - 1hr (week 2) then continue with cleanser, toner, hydrator (optional), and moisturizer.'
    },
    {
      weekRange: 'Weeks 3–4',
      amRoutine: ['Cleanser', 'Ice', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Ice', 'Toner', 'Hydrator (optional)', 'Benzoyl Peroxide'],
      notes: 'Leave Benzoyl Peroxide on overnight. No moisturizer before or after Benzoyl Peroxide.'
    },
    {
      weekRange: 'Weeks 5–6',
      amRoutine: ['Cleanser', 'Ice', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Ice', 'Toner', 'Serum', 'Hydrator (optional)', 'Benzoyl Peroxide'],
      notes: 'Leave Benzoyl Peroxide on overnight. No moisturizer before or after Benzoyl Peroxide.'
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
      pmRoutine: ['Cleanser', 'BPO Mask (see notes)', 'Cleanser', 'Toner', 'Hydrator (optional)', 'Moisturizer'],
      notes: 'Apply a thin layer of your BPO product to your face for for 15-30 min (week 1) / 30 mins - 1hr (week 2) then continue with cleanser, toner, hydrator (optional), and moisturizer.'
    },
    {
      weekRange: 'Weeks 3–4',
      amRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Toner', 'Hydrator (optional)', 'Benzoyl Peroxide'],
      notes: 'Leave Benzoyl Peroxide on overnight. No moisturizer before or after Benzoyl Peroxide.'
    },
    {
      weekRange: 'Weeks 5–6',
      amRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Benzoyl Peroxide'],
      notes: 'Leave Benzoyl Peroxide on overnight. No moisturizer before or after Benzoyl Peroxide.'
    }
  ],
  'rosacea': [
    {
      weekRange: 'Weeks 1–2',
      amRoutine: ['Cleanser', 'Toner', 'Serum (every other day)', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Benzoyl Peroxide Mask', 'Cleanser', 'Toner', 'Hydrator (optional)', 'Moisturizer'],
      notes: 'BPO Mask Details: Apply a thin layer of your BPO product to your face for for 15-30 min (week 1) / 30 mins - 1hr (week 2) then continue with cleanser, toner, hydrator (optional), and moisturizer.'
    },
    {
      weekRange: 'Weeks 3–4',
      amRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Toner', 'Hydrator (optional)', 'Benzoyl Peroxide'],
      notes: 'Leave Benzoyl Peroxide on overnight. No moisturizer before or after Benzoyl Peroxide.'
    },
    {
      weekRange: 'Weeks 5–6',
      amRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Moisturizer', 'Sunscreen'],
      pmRoutine: ['Cleanser', 'Toner', 'Serum', 'Hydrator (optional)', 'Benzoyl Peroxide'],
      notes: 'Leave Benzoyl Peroxide on overnight. No moisturizer before or after Benzoyl Peroxide.'
    }
  ]
};

// Determine which routine type to use based on acne types and severity
export function determineRoutineType(acneTypes: string[], acneSeverity: string): RoutineType {
  // Check for "inflamed" string directly from quiz
  const hasInflamed = acneTypes.some(type => 
    type.toLowerCase() === 'inflamed' ||
    type.toLowerCase().includes('inflamed')
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
  'Ice (see notes)': 'Ice', // Special case - not a product
  'Toner': 'Toner',
  'Serum': 'Serum',
  'Serum (every other day)': 'Serum',
  'Hydrator': 'Hydrator',
  'Hydrator (optional)': 'Hydrator',
  'Moisturizer': 'Moisturizer',
  'Sunscreen': 'SPF',
  'Benzoyl Peroxide': 'Spot Treatment',
  'Benzoyl Peroxide Mask': 'Spot Treatment',
  'BPO Mask (see notes)': 'Spot Treatment',
};
