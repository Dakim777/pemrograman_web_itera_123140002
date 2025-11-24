import json
from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from sqlalchemy.exc import IntegrityError
from .models import Matakuliah


def get_db(request):
    SessionFactory = request.registry.settings.get('db.session_factory')
    if not SessionFactory:
        raise RuntimeError('DB session factory not configured')
    session = SessionFactory()

    def cleanup(request):
        try:
            session.close()
        except Exception:
            pass

    request.add_finished_callback(cleanup)
    return session


@view_config(route_name='get_all', renderer='json')
def get_all(request):
    session = get_db(request)
    items = session.query(Matakuliah).all()
    return {'matakuliahs': [i.to_dict() for i in items]}


@view_config(route_name='get_one', renderer='json')
def get_one(request):
    session = get_db(request)
    id = request.matchdict.get('id')
    item = session.get(Matakuliah, int(id))
    if not item:
        raise HTTPNotFound(json_body={'error': 'Not found'})
    return item.to_dict()


@view_config(route_name='create', renderer='json')
def create(request):
    try:
        payload = request.json_body
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'Invalid JSON'})

    # basic validation
    required = ['kode_mk', 'nama_mk', 'sks', 'semester']
    for r in required:
        if r not in payload:
            raise HTTPBadRequest(json_body={'error': f'Missing field: {r}'})

    session = get_db(request)
    item = Matakuliah(
        kode_mk=payload['kode_mk'],
        nama_mk=payload['nama_mk'],
        sks=int(payload['sks']),
        semester=int(payload['semester']),
    )
    session.add(item)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPBadRequest(json_body={'error': 'kode_mk must be unique'})
    return {'created': item.to_dict()}


@view_config(route_name='update', renderer='json')
def update(request):
    try:
        payload = request.json_body
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'Invalid JSON'})
    session = get_db(request)
    id = request.matchdict.get('id')
    item = session.get(Matakuliah, int(id))
    if not item:
        raise HTTPNotFound(json_body={'error': 'Not found'})
    # only allow certain fields
    for k in ('kode_mk', 'nama_mk', 'sks', 'semester'):
        if k in payload:
            setattr(item, k, payload[k])
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPBadRequest(json_body={'error': 'kode_mk must be unique'})
    return {'updated': item.to_dict()}


@view_config(route_name='delete', renderer='json')
def delete(request):
    session = get_db(request)
    id = request.matchdict.get('id')
    item = session.get(Matakuliah, int(id))
    if not item:
        raise HTTPNotFound(json_body={'error': 'Not found'})
    session.delete(item)
    session.commit()
    return {'deleted': True}


@view_config(route_name='home')
def home(request):
        html = """
        <html>
            <head><title>Aplikasi Matakuliah API</title></head>
            <body>
                <h1>Aplikasi Manajemen Matakuliah (API)</h1>
                <p>Gunakan endpoint <code>/api/matakuliah</code> untuk mengakses API.</p>
                <ul>
                    <li>GET /api/matakuliah — daftar semua</li>
                    <li>GET /api/matakuliah/{id} — detail</li>
                    <li>POST /api/matakuliah — tambah</li>
                    <li>PUT /api/matakuliah/{id} — update</li>
                    <li>DELETE /api/matakuliah/{id} — hapus</li>
                </ul>
            </body>
        </html>
        """
        return Response(body=html, content_type='text/html')
