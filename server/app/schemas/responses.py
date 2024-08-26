from pydantic import BaseModel, ConfigDict

from .base import Address, Ingredient, IngredientMeal, Meal, User


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class AddressResponse(BaseResponse, Address):
    pass


class UserResponse(BaseResponse, User):
    pass


class MealResponse(BaseResponse, Meal):
    meal_id: str
    user_id: str
    pass


class MealWithAddressResponse(BaseResponse, Meal):
    meal_id: str
    address: Address
    pass


class IngredientResponse(BaseResponse, Ingredient):
    ingredient_id: str
    pass


class IngredientDetailsResponse(BaseResponse, Ingredient, IngredientMeal):
    pass


class MealWithIngredientsAndAddressResponse(BaseResponse, Meal):
    ingredients: list[IngredientDetailsResponse]
    address: Address


class IngredientMealResponse(BaseResponse, IngredientMeal):
    meal_id: str
    ingredient_id: str
    pass
