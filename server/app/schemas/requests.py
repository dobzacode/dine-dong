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


class modifyUserProfileRequest(BaseRequest):
    user_id: str
    first_name: str | None = None
    last_name: str | None = None
    about_me: str | None = None
    picture_url: str | None = None
    residency: Address | None = None


class AddressRequest(Address):
    pass


class CreateMealRequest(Meal):
    ingredients: list[IngredientRequest]
    address: Address


class CreateIngredientRequest(BaseRequest):
    name: str
