"""add_cancellation_reason

Revision ID: 95433ed0ebf0
Revises: e03b89c3c486
Create Date: 2024-10-16 17:52:58.340949

"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "95433ed0ebf0"
down_revision = "e03b89c3c486"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    op.add_column(
        "order", sa.Column("cancellation_reason", sa.String(length=256), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("order", "cancellation_reason")

    # ### end Alembic commands ###
