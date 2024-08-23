from pydantic import BaseModel

from .base import Address, Ingredient, Meal, UnitEnum


class BaseRequest(BaseModel):
    pass


class IngredientRequest(Ingredient):
    quantity: int | None = None
    unit: UnitEnum | None = None


class AddressRequest(Address):
    pass


class CreateMealRequest(Meal):
    ingredients: list[IngredientRequest]
    address: AddressRequest


class CreateIngredientRequest(BaseRequest):
    name: str
