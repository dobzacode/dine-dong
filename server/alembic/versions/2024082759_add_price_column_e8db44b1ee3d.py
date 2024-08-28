"""add_price_column

Revision ID: e8db44b1ee3d
Revises: 69ce0a3bb8fd
Create Date: 2024-08-27 09:59:40.694568

"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "e8db44b1ee3d"
down_revision = "69ce0a3bb8fd"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    op.add_column(
        "meal", sa.Column("price", sa.Integer(), nullable=False, server_default="10")
    )
    op.alter_column("meal", "price", nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("meal", "price")

    # ### end Alembic commands ###
