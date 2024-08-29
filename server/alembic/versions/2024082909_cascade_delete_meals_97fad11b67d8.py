"""cascade_delete_meals

Revision ID: 97fad11b67d8
Revises: e8db44b1ee3d
Create Date: 2024-08-29 12:09:09.880123

"""

from alembic import op

# revision identifiers, used by Alembic.
revision = "97fad11b67d8"
down_revision = "e8db44b1ee3d"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    op.create_unique_constraint(None, "ingredient_meal", ["ingredient_id", "meal_id"])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, "ingredient_meal", type_="unique")

    # ### end Alembic commands ###
