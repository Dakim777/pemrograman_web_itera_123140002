# Aplikasi Manajemen Matakuliah (Pyramid)

Proyek ini adalah implementasi praktikum: API CRUD sederhana untuk pengelolaan
matakuliah menggunakan Pyramid (WSGI), SQLAlchemy (ORM) dan SQLite sebagai
database development default. Kode ini siap untuk diadaptasi ke PostgreSQL.

Fitur utama:
- Model `Matakuliah` lengkap dengan atribut: id, kode_mk, nama_mk, sks, semester
- Endpoint CRUD lengkap dengan validasi dan handling duplicate `kode_mk`
- Script inisialisasi dev DB dan 3 sample data
- Test suite (pytest + webtest) untuk memverifikasi alur CRUD

Prerequisites
- Python 3.8+ (direkomendasikan 3.10+)
- Git (opsional)

Instalasi (lokal)

1. Buat virtual environment dan aktifkan

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Testing — screenshot (gunakan untuk dokumentasi)
-----------------------------------------------

Berikut screenshot dari pengujian API. Silakan ambil screenshot dari terminal/Postman dan ganti file-file di folder `docs/` jika perlu.

GET all (daftar matakuliah):

![GET all](docs/screenshot_get_all.png)

GET one (detail matakuliah):

![GET one](docs/screenshot_get_one.png)

Create (POST):

![Create](docs/screenshot_create.png)

Update & Delete (PUT / DELETE):

![Update/Delete](docs/screenshot_update_delete.png)



Contoh curl

Create:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"kode_mk":"IF200","nama_mk":"Contoh","sks":3,"semester":2}' http://localhost:6543/api/matakuliah
```

Get all:
```bash
curl http://localhost:6543/api/matakuliah
```

Update:
```bash
curl -X PUT -H "Content-Type: application/json" -d '{"nama_mk":"Updated"}' http://localhost:6543/api/matakuliah/1
```

Delete:
```bash
curl -X DELETE http://localhost:6543/api/matakuliah/1
```

Testing
-------

Project sudah dilengkapi test suite minimal yang memverifikasi alur CRUD
menggunakan pytest dan webtest. Test berada di `tests/test_api.py`.

1) Pastikan virtualenv aktif dan dependensi terpasang

```bash
source .venv/bin/activate
pip install -r requirements.txt
```

2) Jalankan seluruh test

```bash
pytest -q
```

Output yang diharapkan: semua test lulus. Contoh output singkat:

```
1 passed
```

Jika test gagal, lihat pesan error untuk detail. Test membuat SQLite database
sementara pada folder temporer sehingga tidak akan mengganggu `dev.db`.


Alembic (migrasi database)
---------------------------

Projekt ini sudah menyertakan konfigurasi Alembic sederhana di folder `alembic/`.
Langkah cepat:

1. Pastikan virtualenv aktif dan dependensi terpasang (alembic ada di `requirements.txt`)

```bash
source .venv/bin/activate
pip install -r requirements.txt
```

2. Pastikan `DATABASE_URL` di-set apabila ingin memakai DB selain default `dev.db`:

```bash
export DATABASE_URL=postgresql://user:password@localhost:5432/mydb
```

3. Jalankan migration head (membuat tabel sesuai revisi awal):

```bash
alembic upgrade head -c alembic.ini
```

4. Membuat revisi baru setelah mengubah model:

```bash
alembic revision --autogenerate -m "deskripsi perubahan" -c alembic.ini
alembic upgrade head -c alembic.ini
```

Catatan: `alembic.ini` dan `alembic/env.py` sudah disesuaikan agar membaca `DATABASE_URL`


Dokumentasi API (format tugas)
-----------------------------

Model data (contoh JSON):

```json
{
   "id": 1,
   "kode_mk": "IF101",
   "nama_mk": "Algoritma",
   "sks": 3,
   "semester": 1
}
```

Endpoint:

| Method | URL | Description |
|:------:|:---:|:-----------:|
| GET | /api/matakuliah | Mengambil semua data matakuliah |
| GET | /api/matakuliah/{id} | Mengambil detail satu matakuliah |
| POST | /api/matakuliah | Menambahkan matakuliah baru |
| PUT | /api/matakuliah/{id} | Mengupdate data matakuliah |
| DELETE | /api/matakuliah/{id} | Menghapus data matakuliah |

Testing (contoh perintah curl):

Create :
```bash
curl -X POST http://localhost:6543/api/matakuliah \
   -H "Content-Type: application/json" \
   -d '{"kode_mk": "IF202", "nama_mk": "Sistem Operasi", "sks": 3, "semester": 4}'
```

Read all :
```bash
curl -X GET http://localhost:6543/api/matakuliah
```

Read by id :
```bash
curl -X GET http://localhost:6543/api/matakuliah/1
```

Update :
```bash
curl -X PUT http://localhost:6543/api/matakuliah/1 \
   -H "Content-Type: application/json" \
   -d '{"sks": 6, "nama_mk": "Sistem Operasi"}'
```

Delete :
```bash
curl -X DELETE http://localhost:6543/api/matakuliah/1
```

