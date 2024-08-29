import asyncio
import datetime
import random

from faker import Faker  # type: ignore
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import database_session
from app.mock.meals.mock_data import ADDRESSES, FRENCH_DISH_NAMES, FRENCH_INGREDIENTS
from app.models import Address, Ingredient, IngredientMeal, Meal, User


def generate_combined_diet(fake):
    diets = ["VEGETARIAN", "GLUTENFREE", "VEGAN", "LACTOSEFREE"]
    selected_diets = set(fake.random_elements(elements=diets, unique=True))
    if "VEGAN" in selected_diets and "VEGETARIAN" in selected_diets:
        selected_diets.remove("VEGETARIAN")

    # Introduce a probability of returning an empty array
    if random.random() < len(diets) / 10:  # Adjust the probability as needed
        selected_diets = set()

    return list(selected_diets)


def generate_french_address(fake):
    address = random.choice(ADDRESSES)
    return address


async def generate_random_ingredients(
    fake, session: AsyncSession, meal: Meal, num_ingredients=3
) -> list[Ingredient]:
    ingredients_data = []
    seen_ingredients = set()

    for _ in range(num_ingredients):
        ingredient_name = random.choice(FRENCH_INGREDIENTS)

        if ingredient_name not in seen_ingredients:
            query = select(Ingredient).where(Ingredient.name == ingredient_name)
            existing_ingredient = await session.scalar(query)
            if not existing_ingredient:
                new_ingredient = Ingredient(name=ingredient_name)
                session.add(new_ingredient)
                await session.flush()
                await session.refresh(new_ingredient)
                existing_ingredient = new_ingredient
            new_ingredient_meal = IngredientMeal(
                meal_id=meal.meal_id,
                ingredient_id=existing_ingredient.ingredient_id,
                unit=random.choice(
                    (
                        "MILLIGRAMME",
                        "GRAMME",
                        "MILLILITRE",
                        "CENTILITRE",
                        "LITRE",
                        "CUILLIERE_CAFE",
                        "CUILLIERE_SOUPE",
                        "UNITE",
                    )
                ),
                quantity=fake.random_int(min=1, max=1000),
            )
            session.add(new_ingredient_meal)
            ingredients_data.append(existing_ingredient)
            seen_ingredients.add(ingredient_name)
        else:
            num_ingredients -= 1

    return ingredients_data


async def generate_mock_data(num_entries=10):
    session = database_session.get_async_session()

    fake = Faker("fr_FR")

    for _ in range(num_entries):
        try:
            open_id = fake.email()

            address = generate_french_address(fake)

            price = fake.random_int(min=2, max=100)
            meal_name = random.choice(FRENCH_DISH_NAMES)
            cooking_date = fake.past_datetime(tzinfo=None)
            expiration_date = cooking_date + datetime.timedelta(
                days=fake.random_int(min=1, max=3)
            )
            picture_url = fake.image_url()
            weight = fake.random_int(min=100, max=1000)
            additional_information = fake.text()

            diet_list = generate_combined_diet(fake)
            payment_method = fake.random_element(elements=["ONLINE", "IN_PERSON"])

            user = User(open_id=open_id)
            session.add(user)
            await session.flush()
            await session.refresh(user)
            address_model = Address(
                user_id=user.user_id,
                address1=address["address1"],
                formatted_address=address["formatted_address"],
                city=address["city"],
                department=address["department"],
                postal_code=address["postal_code"],
                country=address["country"],
                lat=address["latitude"],
                lng=address["longitude"],
            )

            session.add(address_model)
            await session.flush()
            await session.refresh(address_model)
            meal = Meal(
                user_id=user.user_id,
                address_id=address_model.address_id,
                price=price,
                name=meal_name,
                cooking_date=cooking_date,
                expiration_date=expiration_date,
                picture_url=picture_url,
                weight=weight,
                additional_information=additional_information,
                diet=diet_list,
                payment_method=payment_method,
            )
            session.add(meal)
            await generate_random_ingredients(fake, session, meal)

            print(f"Generated meal with ID: {meal.meal_id} for user: {user.open_id}")
        except Exception as e:
            print(f"Error generating meal data: {e}")

    try:
        await session.commit()
    except Exception as e:
        print(f"Error committing the session: {e}")


if __name__ == "__main__":
    asyncio.run(generate_mock_data(100))
