"""modify photo_key by picture_rul

Revision ID: 69ce0a3bb8fd
Revises: 90e3f6cd31ed
Create Date: 2024-08-26 15:08:28.096212

"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "69ce0a3bb8fd"
down_revision = "90e3f6cd31ed"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    op.add_column(
        "meal", sa.Column("picture_url", sa.String(length=256), nullable=False)
    )
    op.drop_column("meal", "photo_key")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column(
        "meal",
        sa.Column(
            "photo_key", sa.VARCHAR(length=256), autoincrement=False, nullable=False
        ),
    )
    op.drop_column("meal", "picture_url")

    # ### end Alembic commands ###
