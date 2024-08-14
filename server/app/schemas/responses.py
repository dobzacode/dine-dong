from typing import Optional

from pydantic import BaseModel, ConfigDict


class BaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseResponse):
    user_id: str
    open_id: str
    meals: Optional[list[str]] = None

class MealResponse(BaseResponse):
    meal_id: int
    name: str
    ingredients: list[str]
    user: str

        
class IngredientResponse(BaseResponse):
    ingredient_id: int
    name: str
    meal: list[str]

    
