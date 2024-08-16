from typing import Optional

from pydantic import BaseModel


class BaseRequest(BaseModel):
    pass

class CreateMealRequest(BaseRequest):
    name: str
    ingredients: Optional[list[str]] = None
    
class CreateIngredientRequest(BaseRequest):
    name: str