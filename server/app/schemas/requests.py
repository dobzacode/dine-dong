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


class modifyUserRequest(BaseRequest):
    user_id: str
    username: str | None = None
    email: str | None = None
    phone_number: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    about_me: str | None = None
    picture_key: str | None = None
    residency: Address | None = None


class AddressRequest(Address):
    pass


class CreateMealRequest(Meal):
    ingredients: list[IngredientRequest]
    address: Address


class CreatePaymentIntentRequest(BaseModel):
    amount: int
    currency: str
    description: str
    userId: str


class CreateIngredientRequest(BaseRequest):
    name: str
