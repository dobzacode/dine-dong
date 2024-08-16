export interface BaseModel {
  createTime: Date;
  updateTime: Date;
}

export interface User extends BaseModel {
  userId: string;
  openId: string;
  meals: Meal[];
}

export interface Ingredient extends BaseModel {
  ingredientId: string;
  name: string;
  meals: Meal[];
}

export interface Meal extends BaseModel {
  mealId: string;
  name: string;
  ingredients: Ingredient[];
  pictureKey?: string;
  user: User;
  userId: string;
}
