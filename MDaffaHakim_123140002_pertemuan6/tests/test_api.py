import os
import sys
import tempfile
import json
from webtest import TestApp
# ensure repo root is on sys.path so 'app' package can be imported
ROOT = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, ROOT)

from app import main
from app.models import Base
from sqlalchemy import create_engine


def make_app(db_url):
    settings = {'sqlalchemy.url': db_url}
    app = main({}, **settings)
    return TestApp(app)


def test_crud(tmp_path):
    db_file = tmp_path / 'test.db'
    db_url = f'sqlite:///{db_file}'
    engine = create_engine(db_url)
    Base.metadata.create_all(engine)

    app = make_app(db_url)

    # create
    payload = {'kode_mk': 'IF300', 'nama_mk': 'Test MK', 'sks': 2, 'semester': 1}
    res = app.post_json('/api/matakuliah', payload)
    assert res.status_int == 200
    created = res.json['created']
    assert created['kode_mk'] == 'IF300'

    mid = created['id']

    # get all
    res = app.get('/api/matakuliah')
    assert res.status_int == 200
    assert any(m['kode_mk'] == 'IF300' for m in res.json['matakuliahs'])

    # get one
    res = app.get(f'/api/matakuliah/{mid}')
    assert res.status_int == 200
    assert res.json['kode_mk'] == 'IF300'

    # update
    res = app.put_json(f'/api/matakuliah/{mid}', {'nama_mk': 'Updated'})
    assert res.status_int == 200
    assert res.json['updated']['nama_mk'] == 'Updated'

    # delete
    res = app.delete(f'/api/matakuliah/{mid}')
    assert res.status_int == 200
    assert res.json['deleted'] is True
