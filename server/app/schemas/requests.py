from pydantic import BaseModel

from .base import Address, Ingredient, Meal, UnitEnum, User


class BaseRequest(BaseModel):
    pass


class IngredientRequest(Ingredient):
    quantity: int | None = None
    unit: UnitEnum | None = None


class AddressRequest(Address):
    pass


class CreateUserRequest(User):
    address: Address
    sub: str


class CreateMealRequest(Meal):
    ingredients: list[IngredientRequest]
    address: Address


class CreatePaymentIntentRequest(BaseModel):
    amount: int
    currency: str
    description: str
    userSub: str
    mealId: str
    isNewPaymentIntent: bool


class CreateIngredientRequest(BaseRequest):
    name: str


class ModifyMealRequest(CreateMealRequest):
    meal_id: str


class ModifyUserRequest(BaseRequest):
    user_sub: str
    username: str | None = None
    email: str | None = None
    phone_number: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    about_me: str | None = None
    picture_key: str | None = None
    residency: Address | None = None


class CreateChatRequest(BaseRequest):
    user1_sub: str
    user2_sub: str


class CreateMessageRequest(BaseRequest):
    content: str
    receiver_sub: str
