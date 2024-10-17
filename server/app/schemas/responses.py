from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict

from .base import Address, Ingredient, IngredientMeal, Meal, Order, User


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseResponse, Order):
    create_time: datetime
    update_time: datetime
    pass


class OrderSummary(BaseResponse):
    create_time: datetime
    update_time: datetime
    order_id: str
    status: Literal["FINALIZED", "CANCELLED", "IN_PROGRESS"]


class ModifyOrderStatusResponse(OrderResponse):
    owner_sub: str


class AddressResponse(BaseResponse, Address):
    pass


class AddressWithDistanceResponse(BaseResponse, Address):
    distance: float


class UserResponse(BaseResponse, User):
    user_sub: str
    residency: Address
    pass


class MealResponse(BaseResponse, Meal):
    meal_id: str
    user_sub: str
    pass


class OrderWithMealResponse(OrderResponse):
    meal: MealResponse


class MealWithAddressResponse(BaseResponse, Meal):
    meal_id: str
    address: AddressWithDistanceResponse
    pass


class MealsResponse(BaseResponse):
    meals: list[MealWithAddressResponse]
    total: int
    hasMore: bool


class MealSummary(BaseResponse):
    meal_id: str
    name: str
    description: str | None


class IngredientResponse(BaseResponse, Ingredient):
    ingredient_id: str
    pass


class IngredientDetailsResponse(BaseResponse, Ingredient, IngredientMeal):
    pass


class MealDetailsResponse(BaseResponse, Meal):
    meal_id: str
    address: AddressWithDistanceResponse
    ingredients: list[IngredientDetailsResponse]
    user_sub: str


class MealWithIngredientsAndAddressResponse(BaseResponse, Meal):
    ingredients: list[IngredientDetailsResponse]
    address: Address


class IngredientMealResponse(BaseResponse, IngredientMeal):
    meal_id: str
    ingredient_id: str
    pass
