"""add user hobby views

Revision ID: b14285f23c17
Revises: b14285f23c16
Create Date: 2024-01-20 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'b14285f23c17'
down_revision = 'b14285f23c16'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('user_hobby_views',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('hobby_id', sa.Integer(), nullable=True),
        sa.Column('viewed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['hobby_id'], ['hobbies.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_hobby_views_id'), 'user_hobby_views', ['id'], unique=False)

def downgrade():
    op.drop_index(op.f('ix_user_hobby_views_id'), table_name='user_hobby_views')
    op.drop_table('user_hobby_views') 