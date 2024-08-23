from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class User(BaseModel):
    open_id: str


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
    KILOGRAMME = "KILOGRAMME"
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
    photo_key: str
    weight: int
    diet: list[DietsEnum] = []
    additional_information: str | None = None
    payment_method: PaymentMethodsEnum


class Ingredient(BaseModel):
    name: str
