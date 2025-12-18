export interface Ingredient {
  id: string;
  name: string;
  imageSeed: string;
}

export type CourseType = 'primo' | 'secondo' | 'dolce' | 'sorpresa';

export interface RecipeRequest {
  selectedIngredients: string[];
  customIngredients: string;
  mealType: 'pranzo' | 'cena';
  courseType: CourseType;
  peopleCount: number;
  intolerances: string;
}

export interface RecipeResponse {
  recipeName: string;
  description: string;
  ingredientsList: string[];
  steps: string[];
  winePairing: string;
  nonnoTip: string;
  prepTimeMinutes: number;
}