from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Security
from geoalchemy2.functions import (  # type: ignore
    ST_Distance,
    ST_DWithin,
    ST_GeogFromText,
    ST_GeogFromWKB,
)
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.security.authenticate import VerifyToken
from app.models import Address, DietsEnum, Ingredient, IngredientMeal, Meal, User
from app.schemas.requests import CreateMealRequest
from app.schemas.responses import (
    MealDetailsResponse,
    MealResponse,
    MealsResponse,
    MealSummary,
)

router = APIRouter()
auth = VerifyToken()


@router.get("", response_model=MealsResponse, description="Get all meals")
async def get_meals(
    session: AsyncSession = Depends(deps.get_session),
    limit: int = Query(20, description="Number of meals to return"),
    offset: int = Query(0, description="Number of meals to skip"),
    lat: float = Query(45.767572, description="Latitude of the user"),
    lng: float = Query(4.833102, description="Longitude of the user"),
    radius: int = Query(10, description="Radius of the search in km"),
    diet: list[DietsEnum] = Query(None, description="Diet of the meals"),
    name: str = Query("", description="Name of the meals"),
    max_price: int = Query(
        1000, ge=0, le=1000, description="Maximum price of the meals"
    ),
    weight_max: int = Query(
        1000, ge=0, le=1000, description="Maximum weight of the meals"
    ),
    weight_min: int = Query(
        0, ge=0, le=1000, description="Minimum weight of the meals"
    ),
    sort: Literal["distance", "price"] = Query(
        None, description="Sort by distance or price"
    ),
):
    try:
        user_location = ST_GeogFromText(f"POINT({lng} {lat})")
        query = (
            select(Meal, Address)
            .join(Address)
            .where(
                ST_DWithin(
                    user_location,
                    ST_GeogFromWKB(Address.geo_location),
                    radius * 1000,
                )
            )
            .where(diet is None or Meal.diet.contains(diet))
            .where(func.lower(Meal.name).startswith(f"{name.lower()}"))
            .where((Meal.weight <= weight_max) & (Meal.weight >= weight_min))
            .where(Meal.price <= max_price)
            .limit(limit)
            .offset(offset)
            .add_columns(
                ST_Distance(user_location, Address.geo_location).label("distance")
            )
        )

        match sort:
            case "distance":
                query = query.order_by("distance")
            case "price":
                query = query.order_by(Meal.price)
            case _:
                query = query.order_by("distance")

        result = await session.execute(query)
        meal_address_distance = result.all()

        total_query = (
            select(func.count())
            .select_from(Meal)
            .join(Address)
            .where(
                ST_DWithin(
                    user_location,
                    ST_GeogFromWKB(Address.geo_location),
                    radius * 1000,
                )
            )
            .where(diet is None or Meal.diet.contains(diet))
            .where(func.lower(Meal.name).like(f"%{name.lower()}%"))
            .where((Meal.weight <= weight_max) & (Meal.weight >= weight_min))
            .where(Meal.price <= max_price)
        )

        total_result = await session.execute(total_query)
        total_meals = total_result.scalar()

        if total_meals is None:
            total_meals = 0

        meals = []
        for meal, address, distance in meal_address_distance:
            address.distance = distance / 1000
            meal.address = address
            meals.append(meal)

    except Exception as e:
        print(e, "Error")
        raise HTTPException(status_code=500, detail="Une erreur est survenue")

    if not meals:
        raise HTTPException(status_code=404, detail="Aucun repas trouvé")

    return {
        "meals": meals,
        "total": total_meals,
        "hasMore": offset + limit < total_meals,
    }


@router.get(
    "/details",
    response_model=MealDetailsResponse,
    description="Get meal details by ID",
)
async def get_meal_details_by_id(
    session: AsyncSession = Depends(deps.get_session),
    id: str = Query(None, description="ID of the meal to retrieve"),
    lat: float = Query(45.767572, description="Latitude of the user"),
    lng: float = Query(4.833102, description="Longitude of the user"),
):
    if not id:
        raise HTTPException(status_code=422, detail="ID is required")

    try:
        user_location = ST_GeogFromText(f"POINT({lng} {lat})")
        meal_query = (
            select(Meal, Address)
            .select_from(Meal)
            .join(Address)
            .filter(Meal.meal_id == id)
            .add_columns(
                ST_Distance(user_location, Address.geo_location).label("distance")
            )
        )
        meal_result = await session.execute(meal_query)
        result = meal_result.first()

        if not result:
            raise HTTPException(status_code=404, detail="Meal not found")

        meal, address, distance = result
        address.distance = distance / 1000
        meal.address = address

        ingredient_query = (
            select(IngredientMeal, Ingredient)
            .join(Ingredient)
            .filter(IngredientMeal.meal_id == meal.meal_id)
        )
        ingredient_result = await session.execute(ingredient_query)
        meal.ingredients = [
            {
                "ingredient_id": im.ingredient_id,
                "name": i.name,
                "quantity": im.quantity,
                "unit": im.unit,
            }
            for im, i in ingredient_result.all()
        ]

        return meal
    except Exception as e:
        print(e, "Error")
        raise HTTPException(
            status_code=500, detail="An error occurred while retrieving meal details"
        )


@router.get(
    "/summaries",
    response_model=list[MealSummary],
    description="Get all meal IDs, titles, and descriptions",
)
async def get_meal_summaries(
    session: AsyncSession = Depends(deps.get_session),
    id: str = Query(None, description="ID of the meal to retrieve"),
):
    try:
        query = select(Meal.meal_id, Meal.name, Meal.additional_information)

        if id:
            query = query.where(Meal.meal_id == id)

        result = await session.execute(query)
        meal_summaries = result.all()

        if not meal_summaries:
            raise HTTPException(status_code=404, detail="No meals found")
        meals = [
            {"meal_id": meal_id, "name": meal_name, "description": description}
            for meal_id, meal_name, description in meal_summaries
        ]
        return meals
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500, detail="An error occurred while retrieving meal summaries"
        )


@router.get(
    "/distance",
    response_model=float,
)
async def get_distance(
    session: AsyncSession = Depends(deps.get_session),
    lat: float = Query(None, description="Latitude of the user"),
    lng: float = Query(None, description="Longitude of the user"),
    id: str = Query(None, description="ID of the meal to retrieve"),
    user: dict = Security(auth.verify),
):
    if not id or not lat or not lng:
        raise HTTPException(status_code=422, detail="ID, lat or lng is required")

    try:
        user_location = ST_GeogFromText(f"POINT({lng} {lat})")
        distance_query = (
            select(Meal, Address)
            .join(Address)
            .filter(Meal.meal_id == id)
            .add_columns(
                ST_Distance(user_location, Address.geo_location).label("distance")
            )
        )
        query_result = await session.execute(distance_query)
        result = query_result.first()

        if not result:
            raise HTTPException(status_code=404, detail="Meal not found")

        return result.distance / 1000
    except Exception as e:
        print(e, "Error")
        raise HTTPException(
            status_code=500, detail="An error occurred while retrieving meal details"
        )


@router.post(
    "", description="Create a new meal", response_model=MealResponse, status_code=201
)
async def create_meal(
    meal_data: CreateMealRequest,
    current_user: User = Depends(deps.get_current_user),
    session: AsyncSession = Depends(deps.get_session),
    user: dict = Security(auth.verify),
):
    try:
        new_address = Address(
            user=current_user,
            address1=meal_data.address.address1,
            address2=meal_data.address.address2,
            formatted_address=meal_data.address.formatted_address,
            city=meal_data.address.city,
            department=meal_data.address.department,
            postal_code=meal_data.address.postal_code,
            country=meal_data.address.country,
            lat=meal_data.address.lat,
            lng=meal_data.address.lng,
        )

        new_meal = Meal(
            price=meal_data.price,
            name=meal_data.name,
            cooking_date=meal_data.cooking_date,
            expiration_date=meal_data.expiration_date,
            picture_url=meal_data.picture_url,
            weight=meal_data.weight,
            additional_information=meal_data.additional_information,
            diet=meal_data.diet,
            payment_method=meal_data.payment_method,
            user=current_user,
            address=new_address,
        )
        session.add(new_meal)
        for ingredient in meal_data.ingredients:
            query = select(Ingredient).filter(Ingredient.name == ingredient.name)
            existing_ingredient = await session.scalar(query)
            if existing_ingredient:
                ingredient_meal_data = IngredientMeal(
                    meal_id=new_meal.meal_id,
                    ingredient_id=existing_ingredient.ingredient_id,
                    quantity=ingredient.quantity or None,
                    unit=ingredient.unit.name if ingredient.unit else None,
                )
            else:
                new_ingredient = Ingredient(name=ingredient.name)
                session.add(new_ingredient)
                await session.flush()
                await session.refresh(new_ingredient)
                ingredient_meal_data = IngredientMeal(
                    meal_id=new_meal.meal_id,
                    ingredient_id=new_ingredient.ingredient_id,
                    quantity=ingredient.quantity or None,
                    unit=ingredient.unit.name if ingredient.unit else None,
                )
            session.add(ingredient_meal_data)
        await session.commit()
        await session.refresh(new_meal)

        return new_meal
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la création du repas",
        )
