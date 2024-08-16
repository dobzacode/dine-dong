"""add unique constraint on ingredient name

Revision ID: af79e570faca
Revises: 73648e90e0a9
Create Date: 2024-08-14 21:46:15.402462

"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "af79e570faca"
down_revision = "73648e90e0a9"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("playing_with_neon")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "playing_with_neon",
        sa.Column("id", sa.INTEGER(), autoincrement=True, nullable=False),
        sa.Column("name", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column("value", sa.REAL(), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint("id", name="playing_with_neon_pkey"),
    )
    # ### end Alembic commands ###
