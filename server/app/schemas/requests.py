from pydantic import BaseModel


class BaseRequest(BaseModel):
    pass


class CreateMealRequest(BaseRequest):
    name: str
    ingredients: list[str] | None = None


class CreateIngredientRequest(BaseRequest):
    name: str
