"""remove messages table

Revision ID: b14285f23c19
Revises: b14285f23c18
Create Date: 2024-01-20 13:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'b14285f23c19'
down_revision = 'b14285f23c18'
branch_labels = None
depends_on = None

def upgrade():
    op.drop_table('messages')

def downgrade():
    op.create_table('messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('content', sa.String(), nullable=True),
        sa.Column('sender_id', sa.Integer(), nullable=True),
        sa.Column('receiver_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['receiver_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['sender_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    ) 