"""add_email_name_in_user

Revision ID: 4e43454be281
Revises: 408aa4bfe2d7
Create Date: 2024-09-02 15:48:52.763608

"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "4e43454be281"
down_revision = "408aa4bfe2d7"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    op.add_column(
        "user_account",
        sa.Column(
            "email",
            sa.String(length=256),
            nullable=False,
            server_default="example@example.com",
        ),
    )
    op.add_column(
        "user_account", sa.Column("first_name", sa.String(length=256), nullable=True)
    )
    op.add_column(
        "user_account", sa.Column("last_name", sa.String(length=256), nullable=True)
    )
    op.add_column(
        "user_account", sa.Column("phone_number", sa.String(length=256), nullable=True)
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("user_account", "phone_number")
    op.drop_column("user_account", "last_name")
    op.drop_column("user_account", "first_name")
    op.drop_column("user_account", "email")

    # ### end Alembic commands ###
