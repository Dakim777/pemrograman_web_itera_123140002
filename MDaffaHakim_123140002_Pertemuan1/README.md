# Aplikasi Manajemen Tugas Mahasiswa

## Deskripsi

Aplikasi Manajemen Tugas Mahasiswa adalah aplikasi berbasis web yang dirancang untuk membantu mahasiswa dalam mengelola tugas-tugas akademik. Aplikasi ini memungkinkan pengguna untuk menambahkan, mengedit, menghapus, dan menandai status penyelesaian tugas dengan antarmuka yang sederhana dan mudah digunakan.

## Fitur Utama

1. Menambahkan tugas baru dengan informasi nama tugas, mata kuliah, dan deadline
2. Mengedit informasi tugas yang telah dibuat
3. Menghapus tugas yang sudah tidak diperlukan
4. Menandai tugas sebagai selesai atau belum selesai
5. Memfilter tugas berdasarkan status (semua, pending, selesai)
6. Mencari tugas berdasarkan nama tugas atau mata kuliah
7. Menampilkan statistik jumlah tugas, tugas selesai, tugas pending, dan persentase penyelesaian

## Screenshot Aplikasi

### Tampilan Dashboard
![Dashboard](dashboard.png)

Dashboard menampilkan statistik tugas dan daftar semua tugas yang telah dibuat.

### Form Input Tugas
![Form Modal](form.png)

Form untuk menambahkan atau mengedit tugas dilengkapi dengan validasi input.

### Fitur Filter dan Pencarian
![Filter](filter.png)

Pengguna dapat memfilter tugas berdasarkan status dan melakukan pencarian secara real-time.

## Cara Menjalankan Aplikasi

1. Pastikan semua file (index.html, style.css, script.js) berada dalam satu folder
2. Buka file index.html menggunakan web browser
3. Aplikasi akan langsung dapat digunakan

Alternatif lain adalah dengan menggunakan Live Server pada Visual Studio Code:
1. Buka folder project di Visual Studio Code
2. Install extension Live Server jika belum tersedia
3. Klik kanan pada file index.html
4. Pilih "Open with Live Server"

## Daftar Fitur yang Telah Diimplementasikan

| No | Fitur | Status | Keterangan |
|----|-------|--------|-----------|
| 1 | Create | Selesai | Menambah tugas baru |
| 2 | Read | Selesai | Menampilkan daftar tugas |
| 3 | Update | Selesai | Mengedit tugas |
| 4 | Delete | Selesai | Menghapus tugas |
| 5 | Validasi Form | Selesai | Validasi input nama, mata kuliah, dan deadline |
| 6 | Filter | Selesai | Filter berdasarkan status tugas |
| 7 | Pencarian | Selesai | Pencarian berdasarkan keyword |
| 8 | Statistik | Selesai | Menampilkan dashboard statistik |
| 9 | Toggle Status | Selesai | Mengubah status penyelesaian tugas |
| 10 | Responsive Design | Selesai | Tampilan responsif untuk berbagai ukuran layar |

## Penjelasan Teknis

### Penyimpanan Data dengan localStorage

Aplikasi ini menggunakan variabel JavaScript untuk menyimpan data tugas dalam memori selama aplikasi berjalan. Data akan hilang ketika halaman di-refresh atau browser ditutup.

Untuk implementasi penyimpanan data yang persisten, dapat ditambahkan fungsi localStorage sebagai berikut:

```javascript
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}
```

Fungsi `saveTasks()` dipanggil setiap kali terjadi perubahan data (tambah, edit, hapus), sedangkan `loadTasks()` dipanggil saat aplikasi pertama kali dimuat. Data disimpan dalam format JSON string menggunakan `JSON.stringify()` dan diubah kembali menjadi array menggunakan `JSON.parse()`.

### Validasi Form

Validasi form dilakukan pada sisi client untuk memastikan data yang diinput oleh pengguna sesuai dengan kriteria yang ditentukan. Berikut adalah implementasi validasi form:

```javascript
function validateForm() {
    let isValid = true;
    
    if (!inputName.value.trim()) {
        errorName.textContent = 'Nama tugas tidak boleh kosong';
        inputName.classList.add('error');
        isValid = false;
    }
    
    if (!inputSubject.value.trim()) {
        errorSubject.textContent = 'Mata kuliah tidak boleh kosong';
        inputSubject.classList.add('error');
        isValid = false;
    }
    
    if (!inputDeadline.value) {
        errorDeadline.textContent = 'Deadline harus diisi';
        inputDeadline.classList.add('error');
        isValid = false;
    } else {
        const selectedDate = new Date(inputDeadline.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errorDeadline.textContent = 'Deadline tidak boleh di masa lalu';
            inputDeadline.classList.add('error');
            isValid = false;
        }
    }
    
    return isValid;
}
```

Validasi yang diterapkan meliputi:
1. Nama tugas tidak boleh kosong
2. Mata kuliah tidak boleh kosong
3. Deadline harus diisi dan tidak boleh tanggal yang sudah lewat

Jika terdapat kesalahan input, pesan error akan ditampilkan di bawah field yang bermasalah dan field tersebut akan ditandai dengan border berwarna merah. Proses penyimpanan data tidak akan dilanjutkan hingga semua input valid.

## Informasi Pengembang

- Nama: [Nama Lengkap]
- NIM: [Nomor Induk Mahasiswa]
- Mata Kuliah: Pemrograman Web
- Dosen Pengampu: [Nama Dosen]
