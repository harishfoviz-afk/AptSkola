export interface RemediationPlan {
  produce: string;
  agent: string; // NaHCO3, KMnO4, Salt
  agentDisplay: string;
  duration: number; // minutes
  instructions: string;
  steps: string[];
}

export const GET_REMEDIATION_PLAN = (produce: string): RemediationPlan => {
  const p = produce.toLowerCase();
  
  if (p.includes('leafy') || p.includes('spinach') || p.includes('palak')) {
    return {
      produce,
      agent: 'NaHCO3',
      agentDisplay: 'Baking Soda ($NaHCO_3$)',
      duration: 5,
      instructions: 'Soak in 1% baking soda solution. Best for organophosphates.',
      steps: [
        'Mix 1 teaspoon of Baking Soda in 1 liter of fresh water.',
        'Submerge the leaves fully in the solution.',
        'Let it soak for 5 minutes (timer below).',
        'Rinse gently under running water to remove dissolved residues.'
      ]
    };
  }
  
  if (p.includes('gourd') || p.includes('melon') || p.includes('thick')) {
    return {
      produce,
      agent: 'KMnO4',
      agentDisplay: 'Potassium Permanganate ($KMnO_4$)',
      duration: 15,
      instructions: 'Strong oxidative cleaning for high-pesticide gourds.',
      steps: [
        'Add a tiny pinch of $KMnO_4$ to a bowl of water until it turns pale pink.',
        'Caution: Do not use a dark purple concentrated solution.',
        'Soak the produce for 15 minutes to neutralize surface chemicals.',
        'Scrub the skin with a soft vegetable brush.',
        'Rinse multiple times until water runs clear.'
      ]
    };
  }
  
  if (p.includes('tomato') || p.includes('apple') || p.includes('brinjal')) {
    return {
      produce,
      agent: 'Salt',
      agentDisplay: 'Rock Salt (NaCl)',
      duration: 10,
      instructions: 'Traditional saline soak for common surface residues.',
      steps: [
        'Prepare a 2% salt solution (20g salt per liter).',
        'Soak for 10 minutes to draw out surface-level toxins.',
        'Swirl the produce occasionally to improve exposure.',
        'Rinse thoroughly with fresh water.'
      ]
    };
  }

  // Default
  return {
    produce,
    agent: 'Salt',
    agentDisplay: 'Rock Salt (NaCl)',
    duration: 12,
    instructions: 'Standard salt water soak for general residential safety.',
    steps: [
      'Mix 2 tablespoons of Rock Salt in a basin of water.',
      'Soak produce for 12 minutes.',
      'Rinse well before consumption or cooking.'
    ]
  };
};
