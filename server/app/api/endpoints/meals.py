from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Security
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
from app.models import Address, DietsEnum, Ingredient, Meal, User, ingredient_meal
from app.schemas.requests import CreateMealRequest
from app.schemas.responses import (
    IngredientMealResponse,
    MealResponse,
    MealWithAddressResponse,
    MealWithIngredientsAndAddressResponse,
)

router = APIRouter()
auth = VerifyToken()


@router.get(
    "", response_model=list[MealWithAddressResponse], description="Get all meals"
)
async def get_meals(
    session: AsyncSession = Depends(deps.get_session),
    limit: int = Query(10, description="Number of meals to return"),
    offset: int = Query(0, description="Number of meals to skip"),
    lat: float = Query(45.767572, description="Latitude of the user"),
    lng: float = Query(4.833102, description="Longitude of the user"),
    radius: int = Query(6200, description="Radius of the search"),
    diet: list[DietsEnum] = Query(None, description="Diet of the meals"),
    name: str = Query("", description="Name of the meals"),
    price_max: int = Query(
        100, ge=0, le=1000, description="Maximum price of the meals"
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
    user_location = ST_GeogFromText(f"POINT({lng} {lat})")

    try:
        # Step 1: Filter results using ST_DWithin
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
            .where(func.lower(Meal.name).like(f"%{name.lower()}%"))
            .where((Meal.weight <= weight_max) & (Meal.weight >= weight_min))
            .where(Meal.price <= price_max)
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

    return meals


@router.get(
    "/ingredient_meal/{ingredient_id}/{meal_id}", response_model=IngredientMealResponse
)
async def get_ingredient_meal_by_id(
    ingredient_id: str = Path(description="ID of the ingredient to retrieve"),
    meal_id: str = Path(description="ID of the meal to retrieve"),
    session: AsyncSession = Depends(deps.get_session),
):
    query = (
        select(ingredient_meal)
        .filter(Ingredient.ingredient_id == ingredient_id)
        .filter(Meal.meal_id == meal_id)
    )
    ingredient_meal_data = await session.scalar(query)
    return ingredient_meal_data


@router.get(
    "/{meal_id}",
    response_model=MealResponse,
    description="Get a meal by ID",
)
async def get_meal_by_id(
    meal_id: str = Path(description="ID of the meal to retrieve"),
    session: AsyncSession = Depends(deps.get_session),
):
    try:
        query = select(Meal).filter(Meal.meal_id == meal_id)
        meal = await session.scalar(query)

        if not meal:
            raise HTTPException(status_code=404, detail="Meal not found")

        return meal
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Une erreur est survenue")


@router.get(
    "/{meal_id}/details",
    response_model=MealWithIngredientsAndAddressResponse,
    description="Get meal with details by ID",
)
async def get_meal_details_by_id(
    meal_id: str = Path(description="ID of the meal to retrieve"),
    snippet: bool = Query(False, description="Return a concise snippet of the meal"),
    session: AsyncSession = Depends(deps.get_session),
):
    query = select(Meal).filter(Meal.meal_id == meal_id)
    meal = await session.scalar(query)

    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    for ingredient in meal.ingredients:
        print("hihi")
        query = (
            select(ingredient_meal)
            .filter(Ingredient.ingredient_id == ingredient.ingredient_id)
            .filter(Meal.meal_id == meal.meal_id)
        )
        ingredient_meal_data = await session.scalar(query)
        print(ingredient_meal_data, "OHHH")

    return meal


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
                ingredient_meal_data = ingredient_meal.insert().values(
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
                ingredient_meal_data = ingredient_meal.insert().values(
                    meal_id=new_meal.meal_id,
                    ingredient_id=new_ingredient.ingredient_id,
                    quantity=ingredient.quantity or None,
                    unit=ingredient.unit.name if ingredient.unit else None,
                )
            await session.execute(ingredient_meal_data)
        await session.commit()
        await session.refresh(new_meal)

        return new_meal
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la création du repas",
        )
