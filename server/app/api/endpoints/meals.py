from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Security, status
from fastapi.responses import JSONResponse
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


@router.get("", response_model=MealsResponse, description="Obtenir tous les repas")
async def get_meals(
    session: AsyncSession = Depends(deps.get_session),
    limit: int = Query(20, description="Nombre de repas à retourner"),
    offset: int = Query(0, description="Nombre de repas à ignorer"),
    lat: float = Query(45.767572, description="Latitude de l'utilisateur"),
    lng: float = Query(4.833102, description="Longitude de l'utilisateur"),
    radius: int = Query(10, description="Rayon de recherche en km"),
    diet: list[DietsEnum] = Query(None, description="Régime des repas"),
    name: str = Query("", description="Nom des repas"),
    max_price: int = Query(1000, ge=0, le=1000, description="Prix maximum des repas"),
    weight_max: int = Query(1000, ge=0, le=1000, description="Poids maximum des repas"),
    weight_min: int = Query(0, ge=0, le=1000, description="Poids minimum des repas"),
    sort: Literal["distance", "price"] = Query(
        None, description="Trier par distance ou prix"
    ),
    user_id: str = Query(None, description="ID de l'utilisateur"),
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
            .where(user_id is None or Meal.user_id == user_id)
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
            .where(user_id is None or Meal.user_id == user_id)
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
    description="Obtenir les détails d'un repas par ID",
)
async def get_meal_details_by_id(
    session: AsyncSession = Depends(deps.get_session),
    id: str = Query(None, description="ID du repas à récupérer"),
    lat: float = Query(45.767572, description="Latitude de l'utilisateur"),
    lng: float = Query(4.833102, description="Longitude de l'utilisateur"),
):
    if not id:
        raise HTTPException(status_code=422, detail="ID est requis")

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
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "Repas non trouvé"},
            )

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
            status_code=500,
            detail="Une erreur est survenue lors de la récupération des détails du repas",
        )


@router.get(
    "/summaries",
    response_model=list[MealSummary],
    description="Obtenir tous les ID de repas, titres et descriptions",
)
async def get_meal_summaries(
    session: AsyncSession = Depends(deps.get_session),
    id: str = Query(None, description="ID du repas à récupérer"),
):
    try:
        query = select(Meal.meal_id, Meal.name, Meal.additional_information)

        if id:
            query = query.where(Meal.meal_id == id)

        result = await session.execute(query)
        meal_summaries = result.all()

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération des résumés des repas",
        )

    if not meal_summaries:
        raise HTTPException(status_code=404, detail="Aucun repas trouvé")
    meals = [
        {"meal_id": meal_id, "name": meal_name, "description": description}
        for meal_id, meal_name, description in meal_summaries
    ]
    return meals


@router.get(
    "/distance",
    response_model=float,
    description="Obtenir la distance entre l'utilisateur et un repas",
)
async def get_distance(
    session: AsyncSession = Depends(deps.get_session),
    lat: float = Query(None, description="Latitude de l'utilisateur"),
    lng: float = Query(None, description="Longitude de l'utilisateur"),
    id: str = Query(None, description="ID du repas à récupérer"),
    user: dict = Security(auth.verify),
):
    if not id or not lat or not lng:
        raise HTTPException(status_code=422, detail="ID, lat ou lng sont requis")

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

    except Exception as e:
        print(e, "Error")
        raise HTTPException(
            status_code=500,
            detail="Une erreur est survenue lors de la récupération de la distance du repas",
        )

    if not result:
        raise HTTPException(status_code=404, detail="Repas non trouvé")

    return result.distance / 1000


@router.post(
    "",
    description="Créer un nouveau repas",
    response_model=MealResponse,
    status_code=201,
)
async def create_meal(
    meal_data: CreateMealRequest,
    session: AsyncSession = Depends(deps.get_session),
    token: dict[str, str] = Depends(deps.extract_sub_email_from_jwt),
    user: dict = Security(auth.verify),
):
    user = await session.scalar(select(User).where(User.open_id == token.get("sub")))

    if not user:
        raise HTTPException(status_code=401, detail="Vous n'êtes pas connecté")

    try:
        new_address = Address(
            user=user,
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
            picture_key=meal_data.picture_key,
            weight=meal_data.weight,
            additional_information=meal_data.additional_information,
            diet=meal_data.diet,
            payment_method=meal_data.payment_method,
            user=user,
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
