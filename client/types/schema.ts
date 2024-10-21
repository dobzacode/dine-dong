interface BaseModel {
  create_time: Date;
  update_time: Date;
}

export interface Chat extends BaseModel {
  chat_id: string;
  user1_sub: string;
  user2_sub: string;
}

export interface Message extends BaseModel {
  chat_id: string;
  sender_sub: string;
  receiver_sub: string;
  content: string;
}
export interface User extends BaseModel {
  user_sub: string;
  email: string;
  username: string;
  about_me: string | null;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  picture_key: string | null;
  residency: Address | null;
}

export interface Address extends BaseModel {
  address1: string;
  address2: string | null;
  formatted_address: string;
  city: string;
  department: string | null;
  postal_code: string;
  country: string;
  lat: number;
  lng: number;
  distance?: number;
}

export enum OrderStatusEnum {
  FINALIZED = 'FINALIZED',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS'
}

export interface Order extends BaseModel {
  order_id: string;
  user_sub: string;
  meal_id: string;
  status: keyof typeof OrderStatusEnum;
}

export enum DietsEnum {
  VEGETARIAN = 'VEGETARIAN',
  VEGAN = 'VEGAN',
  GLUTENFREE = 'GLUTENFREE',
  LACTOSEFREE = 'LACTOSEFREE'
}

export enum PaymentMethodsEnum {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON'
}

export enum UnitEnum {
  MILLIGRAMME = 'MILLIGRAMME',
  GRAMME = 'GRAMME',
  MILLILITRE = 'MILLILITRE',
  CENTILITRE = 'CENTILITRE',
  LITRE = 'LITRE',
  CUILLIERE_CAFE = 'CUILLIERE_CAFE',
  CUILLIERE_SOUPE = 'CUILLIERE_SOUPE',
  UNITE = 'UNITE'
}

export interface IngredientMeal extends BaseModel {
  quantity: number | null;
  unit: UnitEnum | null;
}

export interface Meal extends BaseModel {
  name: string;
  cooking_date: Date;
  price: number;
  expiration_date: Date;
  picture_key: string;
  weight: number;
  diet: DietsEnum[];
  additional_information: string | null;
  payment_method: PaymentMethodsEnum;
  is_ordered: boolean;
}

export interface Ingredient {
  name: string;
}
