"""Initialize a local SQLite database and insert sample data."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, Matakuliah


def init_db(url='sqlite:///dev.db'):
    engine = create_engine(url)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # add sample data if empty
    if session.query(Matakuliah).count() == 0:
        samples = [
            Matakuliah(kode_mk='IF101', nama_mk='Algoritma dan Pemrograman', sks=3, semester=1),
            Matakuliah(kode_mk='IF102', nama_mk='Struktur Data', sks=3, semester=2),
            Matakuliah(kode_mk='IF201', nama_mk='Basis Data', sks=3, semester=3),
        ]
        session.add_all(samples)
        session.commit()
    print('Initialized database at', url)


if __name__ == '__main__':
    init_db()
