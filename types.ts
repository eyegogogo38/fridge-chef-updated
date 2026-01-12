
export type MealTime = '아침' | '점심' | '저녁';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
}

export interface RecipeResponse {
  recipes: Omit<Recipe, 'id' | 'imageUrl'>[];
}
