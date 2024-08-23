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
from enum import Enum
from typing import Literal, get_args

from geoalchemy2 import Geometry, WKBElement
from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Uuid,
    event,
    func,
)
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.dialects.postgresql import ARRAY
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

    addresses: Mapped[list["Address"]] = relationship(
        back_populates="user", lazy="selectin"
    )

    meals: Mapped[list["Meal"]] = relationship(
        back_populates="user", lazy="selectin", cascade="all"
    )


class Address(Base):
    __tablename__ = "address"

    address_id: Mapped[int] = mapped_column(
        Uuid(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )

    address1: Mapped[str] = mapped_column(String(256), nullable=False)
    address2: Mapped[str] = mapped_column(String(256), nullable=True)
    formatted_address: Mapped[str] = mapped_column(String(256), nullable=False)
    city: Mapped[str] = mapped_column(String(256), nullable=False)
    department: Mapped[str] = mapped_column(String(256), nullable=True)
    postal_code: Mapped[str] = mapped_column(String(256), nullable=True)
    country: Mapped[str] = mapped_column(String(256), nullable=False)

    lat: Mapped[float] = mapped_column(nullable=False)
    lng: Mapped[float] = mapped_column(nullable=False)
    geo_location: Mapped[WKBElement] = mapped_column(
        Geometry(geometry_type="POINT", srid=4326, spatial_index=True)
    )

    user: Mapped["User"] = relationship(back_populates="addresses", lazy="selectin")
    user_id: Mapped[str] = mapped_column(ForeignKey("user_account.user_id"))

    meals: Mapped[list["Meal"]] = relationship(
        back_populates="address", lazy="selectin"
    )

    @classmethod
    def __declare_last__(cls):
        @event.listens_for(cls, "before_insert")
        def set_geo_location(mapper, connection, target):
            target.geo_location = func.ST_GeomFromText(
                f"POINT({target.lng} {target.lat})", 4326
            )


class UnitEnum(str, Enum):
    MILLIGRAMME = "MILLIGRAMME"
    GRAMME = "GRAMME"
    MILLILITRE = "MILLILITRE"
    CENTILITRE = "CENTILITRE"
    LITRE = "LITRE"
    CUILLIERE_CAFE = "CUILLIERE_CAFE"
    CUILLIERE_SOUPE = "CUILLIERE_SOUPE"
    UNITE = "UNITE"


ingredient_meal = Table(
    "ingredient_meal",
    Base.metadata,
    Column("ingredient_id", ForeignKey("ingredient.ingredient_id"), primary_key=True),
    Column("meal_id", ForeignKey("meal.meal_id"), primary_key=True),
    Column("quantity", Integer, nullable=True),
    Column("unit", SqlEnum(UnitEnum), nullable=True),
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


DietsEnum = Literal["VEGETARIAN", "VEGAN", "GLUTENFREE", "LACTOSEFREE"]
PaymentMethodsEnum = Literal["ONLINE", "IN_PERSON"]


class Meal(Base):
    __tablename__ = "meal"

    meal_id: Mapped[int] = mapped_column(
        Uuid(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )

    name: Mapped[str] = mapped_column(String(60), nullable=False)
    cooking_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    expiration_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    photo_key: Mapped[str] = mapped_column(String(256), nullable=False)

    weight: Mapped[int] = mapped_column(nullable=False)

    additional_information: Mapped[str] = mapped_column(String(500), nullable=True)
    ingredients: Mapped[list["Ingredient"]] = relationship(
        back_populates="meals", secondary=ingredient_meal, lazy="selectin"
    )

    address: Mapped["Address"] = relationship(back_populates="meals", lazy="selectin")
    address_id: Mapped[str] = mapped_column(
        ForeignKey("address.address_id"), nullable=False
    )

    diet: Mapped[list[DietsEnum]] = mapped_column(
        ARRAY(
            SqlEnum(
                *get_args(DietsEnum),
                name="dietsenum",
                create_constraint=True,
                validate_strings=True,
            )
        ),
        nullable=True,
        server_default="{}",
    )
    payment_method: Mapped[PaymentMethodsEnum] = mapped_column(
        SqlEnum(
            *get_args(PaymentMethodsEnum),
            name="paymentmethodsenum",
            create_constraint=True,
            validate_strings=True,
        ),
        nullable=False,
    )

    user: Mapped["User"] = relationship(back_populates="meals", lazy="selectin")
    user_id: Mapped[str] = mapped_column(
        ForeignKey("user_account.user_id"), nullable=False
    )
