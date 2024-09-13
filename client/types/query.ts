import type {
  Address,
  Ingredient,
  IngredientMeal,
  Meal,
  PaymentMethodsEnum,
  UnitEnum,
  User
} from './schema';

export interface AddressResponse extends Address {}

export interface UserResponse extends User {
  user_id: string;
}

export interface MealResponse extends Meal {
  meal_id: string;
  user_id: string;
}

export interface MealWithAddressResponse
  extends Omit<Meal, 'cooking_date' | 'expiration_date' | 'payment_method'> {
  meal_id: string;
  expiration_date: string;
  cooking_date: string;
  address: Address;
  payment_method: keyof typeof PaymentMethodsEnum;
}

export interface MealsPaginatedResponse {
  meals: MealWithAddressResponse[];
  total: number;
  hasMore: boolean;
}

export interface MealSummaryResponse {
  meal_id: string;
  name: string;
  description: string | null;
}

export interface MealDetailsResponse extends MealWithAddressResponse {
  ingredients: IngredientDetailsResponse[];
  user_id: string;
}

export interface UserResponse extends User {
  user_id: string;
  residency: Address;
}

export interface IngredientResponse extends Ingredient {
  ingredient_id: string;
}

export interface IngredientDetailsResponse extends Ingredient, IngredientMealResponse {}

export interface MealWithIngredientsAndAddressResponse extends Meal {
  ingredients: IngredientDetailsResponse[];
  address: Address;
}

export interface IngredientMealResponse extends Omit<IngredientMeal, 'unit'> {
  unit: keyof typeof UnitEnum;
  meal_id: string;
  ingredient_id: string;
}
