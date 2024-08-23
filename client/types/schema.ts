interface BaseModel {
  createTime: Date;
  updateTime: Date;
}

interface User extends BaseModel {
  userId: string;
  openId: string;
  meals: Meal[];
  address: Address | null;
}

interface Address {
  address1: string;
  address2: string | null;
  formatted_address: string;
  city: string;
  department: string | null;
  postalCode: string;
  country: string;
  lat: number;
  lng: number;
}

interface Ingredient extends BaseModel {
  ingredientId: string;
  name: string;
  meals: Meal[];
}

interface Meal extends BaseModel {
  mealId: string;
  name: string;
  ingredients: Ingredient[];
  pictureKey?: string;
  user: User;
  userId: string;
  cookingDate: Date;
  expirationDate: Date;
  weight: number;
  diet: DietsEnum[];
  additionalInformation: string | null;
  paymentMethod: PaymentMethodsEnum;
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
