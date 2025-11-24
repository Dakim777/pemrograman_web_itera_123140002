"""seed matakuliah data

Revision ID: 0002_seed_matakuliah
Revises: 0001_create_matakuliah
Create Date: 2025-11-24 00:05:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0002_seed_matakuliah'
down_revision = '0001_create_matakuliah'
branch_labels = None
depends_on = None


def upgrade():
    matakuliah_table = sa.table(
        'matakuliah',
        sa.column('kode_mk', sa.Text()),
        sa.column('nama_mk', sa.Text()),
        sa.column('sks', sa.Integer()),
        sa.column('semester', sa.Integer()),
    )

    op.bulk_insert(matakuliah_table, [
        {'kode_mk': 'IF101', 'nama_mk': 'Algoritma dan Pemrograman', 'sks': 3, 'semester': 1},
        {'kode_mk': 'IF102', 'nama_mk': 'Struktur Data', 'sks': 3, 'semester': 2},
        {'kode_mk': 'IF201', 'nama_mk': 'Basis Data', 'sks': 3, 'semester': 3},
    ])


def downgrade():
    conn = op.get_bind()
    conn.execute(
        sa.text("DELETE FROM matakuliah WHERE kode_mk IN ('IF101','IF102','IF201')")
    )
