from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from sqlalchemy.orm import sessionmaker
from .models import Base


def main(global_config, **settings):
    engine = engine_from_config(settings, 'sqlalchemy.')
    # create a scoped/session factory and store in settings for views to use
    SessionFactory = sessionmaker(bind=engine, future=True)
    settings['db.session_factory'] = SessionFactory

    # ensure tables exist in dev mode
    Base.metadata.create_all(engine)

    config = Configurator(settings=settings)
    # API-only app: no template engine required
    config.add_static_view('static', 'static', cache_max_age=3600)

    # add routes
    config.add_route('get_all', '/api/matakuliah', request_method='GET')
    config.add_route('create', '/api/matakuliah', request_method='POST')
    config.add_route('get_one', '/api/matakuliah/{id}', request_method='GET')
    config.add_route('update', '/api/matakuliah/{id}', request_method='PUT')
    config.add_route('delete', '/api/matakuliah/{id}', request_method='DELETE')
    config.add_route('home', '/')

    config.scan()
    return config.make_wsgi_app()
