from pydantic import BaseModel

from .base import Address, Ingredient, Meal, UnitEnum, User


class BaseRequest(BaseModel):
    pass


class IngredientRequest(Ingredient):
    quantity: int | None = None
    unit: UnitEnum | None = None


class CreateUserRequest(User):
    address: Address
    sub: str
    pass


class AddressRequest(Address):
    pass


class CreateMealRequest(Meal):
    ingredients: list[IngredientRequest]
    address: Address


class CreateIngredientRequest(BaseRequest):
    name: str
