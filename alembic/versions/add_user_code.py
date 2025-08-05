"""add user code

Revision ID: b14285f23c18
Revises: b14285f23c17
Create Date: 2024-01-20 12:30:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'b14285f23c18'
down_revision = 'b14285f23c17'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('users', sa.Column('user_code', sa.String(), nullable=True))
    op.create_index(op.f('ix_users_user_code'), 'users', ['user_code'], unique=True)

def downgrade():
    op.drop_index(op.f('ix_users_user_code'), table_name='users')
    op.drop_column('users', 'user_code') 