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
from typing import Literal, get_args

from geoalchemy2 import Geometry, WKBElement  # type: ignore
from sqlalchemy import DateTime, ForeignKey, String, Uuid, event, func
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

    open_id: Mapped[str] = mapped_column(String(256), nullable=False, unique=True)

    email: Mapped[str] = mapped_column(String(256), nullable=False, unique=True)

    username: Mapped[str] = mapped_column(
        String(35),
        nullable=False,
        unique=True,
        default=lambda _: f"user-{uuid.uuid4()}",
    )

    first_name: Mapped[str] = mapped_column(String(35), nullable=True)
    last_name: Mapped[str] = mapped_column(String(35), nullable=True)

    phone_number: Mapped[str] = mapped_column(String(256), nullable=True)

    picture_url: Mapped[str] = mapped_column(String(256), nullable=True)

    addresses: Mapped[list["Address"]] = relationship(
        back_populates="user", lazy="selectin", foreign_keys="[Address.user_id]"
    )

    residency: Mapped["Address"] = relationship(
        back_populates="resident",
        lazy="selectin",
        cascade="all, delete",
        foreign_keys="[Address.resident_id]",
    )

    meals: Mapped[list["Meal"]] = relationship(
        back_populates="user", lazy="selectin", cascade="all, delete"
    )


class Address(Base):
    __tablename__ = "address"

    address_id: Mapped[str] = mapped_column(
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

    user: Mapped["User"] = relationship(
        back_populates="addresses", lazy="selectin", foreign_keys="[Address.user_id]"
    )
    user_id: Mapped[str] = mapped_column(ForeignKey("user_account.user_id"))

    resident: Mapped["User"] = relationship(
        back_populates="residency",
        lazy="selectin",
        foreign_keys="[Address.resident_id]",
    )
    resident_id: Mapped[str] = mapped_column(
        ForeignKey("user_account.user_id"), nullable=True
    )

    meals: Mapped[list["Meal"]] = relationship(
        back_populates="address", lazy="selectin"
    )

    @property
    def distance(self):
        return self._distance if hasattr(self, "_distance") else None

    @distance.setter
    def distance(self, value):
        self._distance = value

    def distance_to(self, other_point):
        return func.ST_Distance(func.ST_GeogFromWKB(self.geo_location), other_point)

    @classmethod
    def __declare_last__(cls):
        @event.listens_for(cls, "before_insert")
        def set_geo_location(mapper, connection, target):
            target.geo_location = func.ST_GeomFromText(
                f"POINT({target.lng} {target.lat})"
            )


UnitsEnum = Literal[
    "MILLIGRAMME",
    "GRAMME",
    "MILLILITRE",
    "CENTILITRE",
    "LITRE",
    "CUILLIERE_CAFE",
    "CUILLIERE_SOUPE",
    "UNITE",
]


class IngredientMeal(Base):
    __tablename__ = "ingredient_meal"

    ingredient_id: Mapped[str] = mapped_column(
        ForeignKey("ingredient.ingredient_id"), primary_key=True
    )
    meal_id: Mapped[str] = mapped_column(
        ForeignKey("meal.meal_id", ondelete="CASCADE"), primary_key=True
    )
    quantity: Mapped[int] = mapped_column(nullable=True)
    unit: Mapped[UnitsEnum] = mapped_column(
        SqlEnum(
            *get_args(UnitsEnum),
            name="unitenum",
            create_constraint=True,
            validate_strings=True,
        ),
        nullable=True,
    )

    ingredient: Mapped["Ingredient"] = relationship(back_populates="ingredient_meals")
    meal: Mapped["Meal"] = relationship(back_populates="ingredient_meals")


class Ingredient(Base):
    __tablename__ = "ingredient"

    ingredient_id: Mapped[str] = mapped_column(
        Uuid(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )

    name: Mapped[str] = mapped_column(String(256), nullable=False, unique=True)

    ingredient_meals: Mapped[list["IngredientMeal"]] = relationship(
        back_populates="ingredient", lazy="selectin"
    )


DietsEnum = Literal["VEGETARIAN", "VEGAN", "GLUTENFREE", "LACTOSEFREE"]
PaymentMethodsEnum = Literal["ONLINE", "IN_PERSON"]


class Meal(Base):
    __tablename__ = "meal"

    meal_id: Mapped[str] = mapped_column(
        Uuid(as_uuid=False), primary_key=True, default=lambda _: str(uuid.uuid4())
    )

    price: Mapped[int] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(60), nullable=False)
    cooking_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    expiration_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    picture_url: Mapped[str] = mapped_column(String(256), nullable=False)

    weight: Mapped[int] = mapped_column(nullable=False)

    additional_information: Mapped[str] = mapped_column(String(500), nullable=True)
    ingredient_meals: Mapped[list["IngredientMeal"]] = relationship(
        back_populates="meal", lazy="selectin", cascade="all, delete"
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
