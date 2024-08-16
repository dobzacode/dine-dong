from typing import Optional

from pydantic import BaseModel, ConfigDict


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseResponse):
    user_id: str
    open_id: str
    meals: Optional[list[str]] = None

class MealResponse(BaseResponse):
    meal_id: str
    name: str
    picture_key: str | None = None

        
class IngredientResponse(BaseResponse):
    ingredient_id: str
    name: str
    meals: list[str]
    
class MealWithIngredientsResponse(MealResponse):
    ingredients: list[str] | None = []

    
