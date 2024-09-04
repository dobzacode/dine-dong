import type {
  Address,
  Ingredient,
  IngredientMeal,
  Meal,
  PaymentMethodsEnum,
  UnitEnum,
  User
} from './schema';

interface BaseResponse {}

export interface AddressResponse extends BaseResponse, Address {}

export interface UserResponse extends BaseResponse, User {
  user_id: string;
}

export interface MealResponse extends BaseResponse, Meal {
  meal_id: string;
  user_id: string;
}

export interface MealWithAddressResponse
  extends BaseResponse,
    Omit<Meal, 'cooking_date' | 'expiration_date' | 'payment_method'> {
  meal_id: string;
  expiration_date: string;
  cooking_date: string;
  address: Address;
  payment_method: keyof typeof PaymentMethodsEnum;
}

export interface MealsResponse extends BaseResponse {
  meals: MealWithAddressResponse[];
  total: number;
  hasMore: boolean;
}

export interface MealSummaryResponse extends BaseResponse {
  meal_id: string;
  name: string;
  description: string | null;
}

export interface MealDetailsResponse extends BaseResponse, MealWithAddressResponse {
  ingredients: IngredientDetailsResponse[];
  user_id: string;
}

export interface UserResponse extends BaseResponse, User {
  user_id: string;
  residency: Address;
}

export interface IngredientResponse extends BaseResponse, Ingredient {
  ingredient_id: string;
}

export interface IngredientDetailsResponse
  extends BaseResponse,
    Ingredient,
    IngredientMealResponse {}

export interface MealWithIngredientsAndAddressResponse extends BaseResponse, Meal {
  ingredients: IngredientDetailsResponse[];
  address: Address;
}

export interface IngredientMealResponse extends BaseResponse, Omit<IngredientMeal, 'unit'> {
  unit: keyof typeof UnitEnum;
  meal_id: string;
  ingredient_id: string;
}
