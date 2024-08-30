"""fix_enum

Revision ID: e8d1a7206e83
Revises: 37bb2ac61376
Create Date: 2024-08-23 09:25:41.837637

"""

import sqlalchemy as sa
from alembic_postgresql_enum import TableReference
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision = "e8d1a7206e83"
down_revision = "37bb2ac61376"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    sa.Enum("ONLINE", "IN_PERSON", name="paymentmethodsenum").create(op.get_bind())
    op.alter_column(
        "meal",
        "diet",
        existing_type=postgresql.ARRAY(
            postgresql.ENUM(
                "VEGETARIAN", "VEGAN", "GLUTENFREE", "LACTOSEFREE", name="dietsenum"
            )
        ),
        nullable=True,
    )
    op.alter_column(
        "meal",
        "payment_method",
        existing_type=sa.VARCHAR(length=8),
        type_=sa.Enum(
            "ONLINE", "IN_PERSON", name="paymentmethodsenum", create_constraint=True
        ),
        existing_nullable=False,
        postgresql_using="payment_method::paymentmethodsenum",
    )
    op.sync_enum_values(
        "public",
        "unitenum",
        [
            "milligramme",
            "gramme",
            "kilogramme",
            "millilitre",
            "centilitre",
            "litre",
            "cuillière_cafe",
            "cuillière_soupe",
            "unite",
        ],
        [
            TableReference(
                table_schema="public", table_name="ingredient_meal", column_name="unit"
            )
        ],
        enum_values_to_rename=[],
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.sync_enum_values(
        "public",
        "unitenum",
        [
            "MILLIGRAMME",
            "GRAMME",
            "KILOGRAMME",
            "MILLILITRE",
            "CENTILITRE",
            "LITRE",
            "CUILLEUR",
            "CUILLEUR_SOUPE",
            "UNITE",
        ],
        [
            TableReference(
                table_schema="public", table_name="ingredient_meal", column_name="unit"
            )
        ],
        enum_values_to_rename=[],
    )
    op.alter_column(
        "meal",
        "payment_method",
        existing_type=sa.Enum(
            "ONLINE", "IN_PERSON", name="paymentmethodsenum", create_constraint=True
        ),
        type_=sa.VARCHAR(length=8),
        existing_nullable=False,
    )
    op.alter_column(
        "meal",
        "diet",
        existing_type=postgresql.ARRAY(
            postgresql.ENUM(
                "VEGETARIAN", "VEGAN", "GLUTENFREE", "LACTOSEFREE", name="dietsenum"
            )
        ),
        nullable=False,
    )
    sa.Enum("ONLINE", "IN_PERSON", name="paymentmethodsenum").drop(op.get_bind())
    # ### end Alembic commands ###