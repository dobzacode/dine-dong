# SQL Alchemy models declaration.
# https://docs.sqlalchemy.org/en/20/orm/quickstart.html#declare-models
# mapped_column syntax from SQLAlchemy 2.0.

# https://alembic.sqlalchemy.org/en/latest/tutorial.html
# Note, it is used by alembic migrations logic, see `alembic/env.py`

# Alembic shortcuts:
# # create migration
# alembic revision --autogenerate -m "migration_name"

# # apply all migrations
# alembic upgrade head


import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String, Table, Uuid, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    create_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    update_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class User(Base):
    __tablename__ = "user_account"

    user_id: Mapped[str] = mapped_column(
        Uuid(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    open_id: Mapped[str] = mapped_column(String(256), nullable=False)

    meals: Mapped[list["Meal"]] = relationship(back_populates="user", lazy="selectin", cascade="all")


ingredient_meal = Table(
    "ingredient_meal",
    Base.metadata,
    Column("ingredient_id", ForeignKey("ingredient.ingredient_id"), primary_key=True),
    Column("meal_id", ForeignKey("meal.meal_id"), primary_key=True),
)


class Ingredient(Base):
    __tablename__ = "ingredient"

    ingredient_id: Mapped[int] = mapped_column(
        Uuid(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(256), nullable=False, unique=True)
    
    meals: Mapped[list["Meal"]] = relationship(
        back_populates="ingredients", secondary=ingredient_meal, lazy="selectin"
    )


class Meal(Base):
    __tablename__ = "meal"

    meal_id: Mapped[int] = mapped_column(
        Uuid(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )
    name: Mapped[str] = mapped_column(String(256), nullable=False)
    
    ingredients: Mapped[list["Ingredient"]] = relationship(
        back_populates="meals", secondary=ingredient_meal, lazy="selectin"
    )
    
    picture_key: Mapped[str] = mapped_column(String(256), nullable=True)
    
    user: Mapped["User"] = relationship(back_populates="meals", lazy="selectin")
    user_id: Mapped[str] = mapped_column(
        ForeignKey("user_account.user_id")
    )