"""create matakuliah table

Revision ID: 0001_create_matakuliah
Revises: 
Create Date: 2025-11-24 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_create_matakuliah'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'matakuliah',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('kode_mk', sa.Text(), nullable=False),
        sa.Column('nama_mk', sa.Text(), nullable=False),
        sa.Column('sks', sa.Integer(), nullable=False),
        sa.Column('semester', sa.Integer(), nullable=False),
        sa.UniqueConstraint('kode_mk', name='uq_matakuliah_kode_mk')
    )


def downgrade():
    op.drop_table('matakuliah')
