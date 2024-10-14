"""replace_completed_with_inprogress

Revision ID: 29a72ffb3140
Revises: 6c3f1178d7bb
Create Date: 2024-10-14 11:18:00.913692

"""

from alembic_postgresql_enum import TableReference

from alembic import op

# revision identifiers, used by Alembic.
revision = "29a72ffb3140"
down_revision = "6c3f1178d7bb"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    op.sync_enum_values(
        "public",
        "statussenum",
        ["IN_PROGRESS", "CANCELLED", "FINALIZED"],
        [
            TableReference(
                table_schema="public", table_name="order", column_name="status"
            )
        ],
        enum_values_to_rename=[("COMPLETED", "IN_PROGRESS")],
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.sync_enum_values(
        "public",
        "statussenum",
        ["COMPLETED", "CANCELLED", "FINALIZED"],
        [
            TableReference(
                table_schema="public", table_name="order", column_name="status"
            )
        ],
        enum_values_to_rename=[],
    )

    # ### end Alembic commands ###
