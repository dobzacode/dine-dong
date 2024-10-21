import type {
  Address,
  Chat,
  Ingredient,
  IngredientMeal,
  Meal,
  Order,
  OrderStatusEnum,
  PaymentMethodsEnum,
  UnitEnum,
  User
} from './schema';

export interface AddressResponse extends Address {}

export interface UserResponse extends User {
  user_sub: string;
}

export interface MealResponse extends Meal {
  meal_id: string;
  user_sub: string;
}

export interface OrderWithMealResponse extends Order {
  meal: MealWithAddressResponse;
}

export interface OrderSummaryResponse {
  order_id: string;
  status: keyof typeof OrderStatusEnum;
  create_time: string;
  update_time: string;
}

export interface ModifyOrderStatusResponse extends OrderResponse {
  owner_sub: string;
}

export interface MealWithAddressResponse
  extends Omit<MealResponse, 'cooking_date' | 'expiration_date' | 'payment_method'> {
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
  user_sub: string;
}

export interface UserResponse extends User {
  user_sub: string;
  residency: Address;
}

export interface OrderResponse extends Order {
  order: OrderResponse;
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

export interface ChatResponse extends Chat {}

export interface ExtendedChatResponse extends ChatResponse {
  other_user_image: string | null;
  other_user_name: string;
  last_message_content: string | null;
  meal_image: string;
  meal_name: string;
}

export interface ChatSnippetResponse {
  meal_name: string;
  other_user_name: string;
}
