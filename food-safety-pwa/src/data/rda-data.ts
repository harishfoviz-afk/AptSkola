export interface NutritionInfo {
  produce: string;
  vitamins: string[];
  minerals: string[];
  benefits: string;
}

export const INDIAN_RDA_PRODUCE: Record<string, NutritionInfo> = {
  "Tomato": {
    produce: "Tomato",
    vitamins: ["Vitamin C", "Vitamin K", "Vitamin A"],
    minerals: ["Potassium", "Manganese"],
    benefits: "Heart health & skin protection via Lycopene."
  },
  "Leafy Greens": {
    produce: "Spinach/Palak",
    vitamins: ["Vitamin K", "Vitamin A", "Vitamin C", "Folate"],
    minerals: ["Iron", "Calcium", "Magnesium"],
    benefits: "Bone health & blood oxygenation."
  },
  "Amla": {
    produce: "Amla (Indian Gooseberry)",
    vitamins: ["Vitamin C (Extreme High)", "Vitamin E"],
    minerals: ["Chromium", "Zinc"],
    benefits: "Immunity booster & hair health."
  },
  "Brinjal": {
    produce: "Brinjal (Baingan)",
    vitamins: ["Vitamin B6", "Vitamin K"],
    minerals: ["Manganese", "Potassium"],
    benefits: "Brain health & antioxidant support."
  },
  "Apple": {
    produce: "Apple",
    vitamins: ["Vitamin C", "Vitamin B-complex"],
    minerals: ["Potassium", "Fiber"],
    benefits: "Digestive health & lung function."
  }
};
