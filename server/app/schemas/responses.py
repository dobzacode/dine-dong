from datetime import date
from enum import Enum

from pydantic import BaseModel, ConfigDict


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class AddressResponse(BaseResponse):
    address_id: str
    address1: str
    address2: str | None = None
    formatted_address: str
    city: str
    department: str | None = None
    postal_code: str
    country: str
    lat: float
    lng: float


class UserResponse(BaseResponse):
    user_id: str
    open_id: str
    meals: list[str] | None = None


class DietsEnum(str, Enum):
    VEGETARIAN = "vegetarian"
    VEGAN = "vegan"
    GLUTENFREE = "glutenFree"
    LACTOSEFREE = "lactoseFree"


class PaymentMethodsEnum(str, Enum):
    ONLINE = "online"
    IN_PERSON = "inPerson"


class MealResponse(BaseResponse):
    meal_id: str
    name: str
    cooking_date: date
    expiration_date: date
    photo_key: str
    weight: int
    diet: list[DietsEnum] = []
    additional_information: str | None = None
    payment_method: PaymentMethodsEnum


class IngredientResponse(BaseResponse):
    ingredient_id: str
    name: str


class UnitEnum(str, Enum):
    MILLIGRAMME = "milligramme"
    GRAMME = "gramme"
    KILOGRAMME = "kilogramme"
    MILLILITRE = "millilitre"
    CENTILITRE = "centilitre"
    LITRE = "litre"
    CUILLEUR = "cuillière à café"
    CUILLEUR_SOUPE = "cuillière à soupe"
    UNITE = "unité"


class IngredientMealResponse(BaseResponse):
    ingredient_id: str
    meal_id: str
    quantity: int | None = None
    unit: UnitEnum | None = None


class MealWithIngredientsResponse(MealResponse):
    ingredients: list[str] | None = []
