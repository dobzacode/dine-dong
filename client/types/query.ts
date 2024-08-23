import { DietsEnum, PaymentMethodsEnum } from './schema';

export interface UserResponse {
  user_id: string;
  open_id: string;
  meals?: string[];
}

export interface MealResponse {
  meal_id: string;
  user_id: string;
  name: string;
  cooking_date: string;
  expiration_date: string;
  photo_key: string;
  weight: number;
  diet: DietsEnum[];
  additional_information: string | null;
  payment_method: PaymentMethodsEnum;
}
export interface IngredientResponse {
  ingredient_id: number;
  name: string;
  meal: string[];
}
