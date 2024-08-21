from fastapi import APIRouter, Depends, Security
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security.authenticate import VerifyToken
from app.models import Ingredient, Meal, User
from app.schemas.requests import CreateMealRequest
from app.schemas.responses import MealResponse

router = APIRouter()
auth = VerifyToken()

# @router.get("/",  description="Get all meals", response_model=list[MealResponse])
# async def get_all_meals(
#     session: AsyncSession = Depends(deps.get_session)) -> list[MealResponse]:
#     meals = await session.scalars(select(Meal))
#     return meals


@router.post("", description="Create a new meal", response_model=MealResponse)
async def create_meal(
    meal_data: CreateMealRequest,
    current_user: User = Depends(deps.get_current_user),
    session: AsyncSession = Depends(deps.get_session),
    user: dict = Security(auth.verify),
):
    meal = Meal(name=meal_data.name, user=current_user)
    session.add(meal)
    if meal_data.ingredients:
        for ingredient_name in meal_data.ingredients:
            query = select(Ingredient).filter(Ingredient.name == ingredient_name)
            existing_ingredient = await session.scalar(query)
            if not existing_ingredient:
                new_ingredient = Ingredient(name=ingredient_name, meals=[meal])
                session.add(new_ingredient)
            else:
                existing_ingredient.meals.append(meal)

    await session.commit()
    await session.refresh(meal)
    return meal
