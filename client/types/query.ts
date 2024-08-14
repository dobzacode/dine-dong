export interface UserResponse {
  user_id: string;
  open_id: string;
  meals?: string[];
}

export interface MealResponse {
  meal_id: number;
  name: string;
  ingredients: string[];
  user: string;
}

export interface IngredientResponse {
  ingredient_id: number;
  name: string;
  meal: string[];
}
