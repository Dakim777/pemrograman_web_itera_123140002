import os
from waitress import serve
from app import main


if __name__ == '__main__':
    settings = {
        'sqlalchemy.url': os.environ.get('DATABASE_URL', 'sqlite:///dev.db')
    }
    app = main({}, **settings)
    print('Serving on http://0.0.0.0:6543')
    serve(app, host='0.0.0.0', port=6543)
