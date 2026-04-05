// Pesticide Intensity Data for India (kg/ha)
// Source: Ministry of Agriculture & Farmers Welfare (Proxy/Internal Knowledge)

export interface RegionalPesticideData {
  state: string;
  intensity: number; // kg/ha
  commonPesticides: string[];
}

export const INDIAN_PESTICIDE_DATA: Record<string, RegionalPesticideData> = {
  "Telangana": {
    state: "Telangana",
    intensity: 0.613,
    commonPesticides: ["Organophosphates (OP)", "Monocrotophos", "Acephate"]
  },
  "Punjab": {
    state: "Punjab",
    intensity: 0.741,
    commonPesticides: ["Synthetic Pyrethroids", "Chlorpyrifos"]
  },
  "Haryana": {
    state: "Haryana",
    intensity: 0.620,
    commonPesticides: ["Neonicotinoids", "Imidacloprid"]
  },
  "Maharashtra": {
    state: "Maharashtra",
    intensity: 0.521,
    commonPesticides: ["Carbamates", "Dimethoate"]
  },
  "Andhra Pradesh": {
    state: "Andhra Pradesh",
    intensity: 0.589,
    commonPesticides: ["Triazophos", "Cypermethrin"]
  },
  "Default": {
    state: "India (Average)",
    intensity: 0.350,
    commonPesticides: ["General Purpose Pesticides"]
  }
};

// Produce specific risk factors
export const PRODUCE_RISK_MAP: Record<string, number> = {
  "Tomato": 1.2,
  "Leafy Greens": 1.5,
  "Cabbage": 1.4,
  "Brinjal": 1.3,
  "Potato": 1.0,
  "Onion": 0.8,
  "Apple": 1.4
};

export const calculateSafetyScore = (residueIntensity: number, state: string, produce: string) => {
  const stateData = INDIAN_PESTICIDE_DATA[state] || INDIAN_PESTICIDE_DATA["Default"];
  const produceRisk = PRODUCE_RISK_MAP[produce] || 1.0;
  
  // Base score 100
  // Deduct based on regional intensity, produce risk, and detected residue
  let score = 100;
  
  // Regional penalty (higher intensity = higher penalty)
  score -= (stateData.intensity * 20);
  
  // Produce penalty
  score -= (produceRisk * 10);
  
  // Detected residue penalty (0.0 to 1.0)
  score -= (residueIntensity * 40);
  
  return Math.max(0, Math.min(100, Math.round(score)));
};
