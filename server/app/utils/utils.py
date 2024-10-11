from sqlalchemy import select

from app.models import Ingredient, IngredientMeal


def update_if_not_none(instance, field, value):
    if value is not None:
        setattr(instance, field, value)


def update_user_data(user, user_data):
    update_if_not_none(user, "username", user_data.username)
    update_if_not_none(user, "email", user_data.email)
    update_if_not_none(user, "phone_number", user_data.phone_number)
    update_if_not_none(user, "first_name", user_data.first_name)
    update_if_not_none(user, "last_name", user_data.last_name)
    update_if_not_none(user, "about_me", user_data.about_me)
    update_if_not_none(user, "picture_key", user_data.picture_key)


def update_user_address(user, user_data):
    for field in [
        "address1",
        "address2",
        "formatted_address",
        "city",
        "department",
        "postal_code",
        "country",
        "lat",
        "lng",
    ]:
        update_if_not_none(user.residency, field, getattr(user_data, field))


def update_meal_data(meal, meal_data):
    update_if_not_none(meal, "name", meal_data.name)
    update_if_not_none(meal, "price", meal_data.price)
    update_if_not_none(meal, "cooking_date", meal_data.cooking_date)
    update_if_not_none(meal, "expiration_date", meal_data.expiration_date)
    update_if_not_none(meal, "picture_key", meal_data.picture_key)
    update_if_not_none(meal, "weight", meal_data.weight)
    update_if_not_none(meal, "additional_information", meal_data.additional_information)
    update_if_not_none(meal, "diet", meal_data.diet)
    update_if_not_none(meal, "payment_method", meal_data.payment_method)


def update_meal_address(meal, meal_data):
    for field in [
        "address1",
        "address2",
        "formatted_address",
        "city",
        "department",
        "postal_code",
        "country",
        "lat",
        "lng",
    ]:
        update_if_not_none(meal.address, field, getattr(meal_data.address, field))


async def process_meal_ingredients(meal, meal_data, session):
    updated_ingredient_ids = set()

    for ingredient in meal_data.ingredients:
        ingredient_query = select(Ingredient).where(Ingredient.name == ingredient.name)
        existing_ingredient = await session.scalar(ingredient_query)
        if existing_ingredient:
            updated_ingredient_ids.add(existing_ingredient.ingredient_id)
            ingredient_meal_query = select(IngredientMeal).where(
                (IngredientMeal.meal_id == meal.meal_id)
                & (IngredientMeal.ingredient_id == existing_ingredient.ingredient_id)
            )
            existing_ingredient_meal = await session.scalar(ingredient_meal_query)

            if existing_ingredient_meal:
                update_if_not_none(
                    existing_ingredient_meal, "quantity", ingredient.quantity
                )
                update_if_not_none(
                    existing_ingredient_meal,
                    "unit",
                    ingredient.unit.name if ingredient.unit else None,
                )
            else:
                ingredient_meal_data = IngredientMeal(
                    meal_id=meal.meal_id,
                    ingredient_id=existing_ingredient.ingredient_id,
                    quantity=ingredient.quantity,
                    unit=ingredient.unit.name if ingredient.unit else None,
                )
                session.add(ingredient_meal_data)
        else:
            new_ingredient = Ingredient(name=ingredient.name)
            session.add(new_ingredient)
            await session.flush()
            await session.refresh(new_ingredient)
            ingredient_meal_data = IngredientMeal(
                meal_id=meal.meal_id,
                ingredient_id=new_ingredient.ingredient_id,
                quantity=ingredient.quantity,
                unit=ingredient.unit.name if ingredient.unit else None,
            )
            updated_ingredient_ids.add(new_ingredient.ingredient_id)
            session.add(ingredient_meal_data)

    return updated_ingredient_ids


async def remove_old_ingredients(
    existing_ingredient_meals, updated_ingredient_ids, session
):
    for existing_ingredient_meal in existing_ingredient_meals:
        if existing_ingredient_meal.ingredient_id not in updated_ingredient_ids:
            await session.delete(existing_ingredient_meal)
