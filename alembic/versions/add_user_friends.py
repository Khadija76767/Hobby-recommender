"""add_user_friends

Revision ID: b14285f23c20
Revises: b14285f23c19
Create Date: 2024-01-20 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b14285f23c20'
down_revision = 'b14285f23c19'
branch_labels = None
depends_on = None


def upgrade():
    # Create user_friends table
    op.create_table('user_friends',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('friend_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['friend_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('user_id', 'friend_id')
    )


def downgrade():
    # Drop user_friends table
    op.drop_table('user_friends') 