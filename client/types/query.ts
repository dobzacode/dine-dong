import type { Address, Ingredient, IngredientMeal, Meal, User } from './schema';

interface BaseResponse {}

export interface AddressResponse extends BaseResponse, Address {}

export interface UserResponse extends BaseResponse, User {}

export interface MealResponse extends BaseResponse, Meal {
  meal_id: string;
  user_id: string;
}

export interface MealWithAddressResponse
  extends BaseResponse,
    Omit<Meal, 'cooking_date' | 'expiration_date'> {
  meal_id: string;
  expiration_date: string;
  cooking_date: string;
  address: Address;
}

export interface IngredientResponse extends BaseResponse, Ingredient {
  ingredient_id: string;
}

export interface IngredientDetailsResponse extends BaseResponse, Ingredient, IngredientMeal {}

export interface MealWithIngredientsAndAddressResponse extends BaseResponse, Meal {
  ingredients: IngredientDetailsResponse[];
  address: Address;
}

export interface IngredientMealResponse extends BaseResponse, IngredientMeal {
  meal_id: string;
  ingredient_id: string;
}
