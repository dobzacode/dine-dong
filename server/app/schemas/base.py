from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class Address(BaseModel):
    address1: str
    address2: str | None = None
    formatted_address: str
    city: str
    department: str | None = None
    postal_code: str
    country: str
    lat: float
    lng: float


class User(BaseModel):
    email: str
    username: str
    is_valid: bool = False
    first_name: str | None = None
    last_name: str | None = None
    about_me: str | None = None
    phone_number: str | None = None
    picture_key: str | None = None
    residency: Address | None = None


class OrderEnum(str, Enum):
    COMPLETED = "FINALIZED"
    CANCELLED = "CANCELLED"
    IN_PROGRESS = "IN_PROGRESS"


class Order(BaseModel):
    order_id: str
    user_sub: str
    meal_id: str
    status: OrderEnum


class DietsEnum(str, Enum):
    VEGETARIAN = "VEGETARIAN"
    VEGAN = "VEGAN"
    GLUTENFREE = "GLUTENFREE"
    LACTOSEFREE = "LACTOSEFREE"


class PaymentMethodsEnum(str, Enum):
    ONLINE = "ONLINE"
    IN_PERSON = "IN_PERSON"


class UnitEnum(str, Enum):
    MILLIGRAMME = "MILLIGRAMME"
    GRAMME = "GRAMME"
    MILLILITRE = "MILLILITRE"
    CENTILITRE = "CENTILITRE"
    LITRE = "LITRE"
    CUILLIERE_CAFE = "CUILLIERE_CAFE"
    CUILLIERE_SOUPE = "CUILLIERE_SOUPE"
    UNITE = "UNITE"


class IngredientMeal(BaseModel):
    quantity: int | None = None
    unit: UnitEnum | None = None


class Meal(BaseModel):
    name: str
    cooking_date: datetime
    expiration_date: datetime
    picture_key: str
    price: int
    weight: int
    diet: list[DietsEnum] | None = []
    additional_information: str | None = None
    payment_method: PaymentMethodsEnum
    is_ordered: bool = False


class Ingredient(BaseModel):
    name: str
