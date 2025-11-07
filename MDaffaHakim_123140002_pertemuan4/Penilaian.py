# M.DAFFA HAKIM MATONDANG
# 123140002
data_mahasiswa = [
    {
        "nama": "Muhammad Daffa Hakim Matondang",
        "NIM": "123140002",
        "nilai_uts": 95,
        "nilai_uas": 90,
        "nilai_tugas": 90
    },
    {
        "nama": "Daniel Calvin Simanjuntak",
        "NIM": "123140004",
        "nilai_uts": 78,
        "nilai_uas": 70,
        "nilai_tugas": 70
    },
    {
        "nama": "Danang Ridho Laksono",
        "NIM": "123140005",
        "nilai_uts": 50,
        "nilai_uas": 60,
        "nilai_tugas": 65
    },
    {
        "nama": "Muhammad Fadillah Akbar",
        "NIM": "123140003",
        "nilai_uts": 65,
        "nilai_uas": 70,
        "nilai_tugas": 68
    },
    {
        "nama": "Febrian Valentino",
        "NIM": "123140034",
        "nilai_uts": 45,
        "nilai_uas": 50,
        "nilai_tugas": 48
    }
]


# Fungsi untuk menghitung nilai akhir (30% UTS + 40% UAS + 30% Tugas)
def hitung_nilai_akhir(nilai_uts, nilai_uas, nilai_tugas):
    nilai_akhir = (0.3 * nilai_uts) + (0.4 * nilai_uas) + (0.3 * nilai_tugas)
    return nilai_akhir


# Fungsi untuk menentukan grade
def tentukan_grade(nilai_akhir):
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"


# Fungsi untuk menampilkan data dalam format tabel
def tampilkan_tabel():
    print("\n" + "="*115)
    print(f"{'No':<5} {'Nama':<30} {'NIM':<12} {'UTS':<8} {'UAS':<8} {'Tugas':<10} {'Nilai Akhir':<15} {'Grade':<8}")
    print("="*115)
    
    for i, mhs in enumerate(data_mahasiswa, 1):
        nilai_akhir = hitung_nilai_akhir(mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"])
        grade = tentukan_grade(nilai_akhir)
        print(f"{i:<5} {mhs['nama']:<30} {mhs['NIM']:<12} {mhs['nilai_uts']:<8} {mhs['nilai_uas']:<8} {mhs['nilai_tugas']:<10} {nilai_akhir:<15.2f} {grade:<8}")
    
    print("="*115)


# Fungsi untuk mencari mahasiswa dengan nilai tertinggi/terendah
def cari_mahasiswa_ekstrem():
    nilai_tertinggi = -1
    nilai_terendah = 101
    mhs_tertinggi = None
    mhs_terendah = None
    
    for mhs in data_mahasiswa:
        nilai_akhir = hitung_nilai_akhir(mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"])
        
        if nilai_akhir > nilai_tertinggi:
            nilai_tertinggi = nilai_akhir
            mhs_tertinggi = mhs
        
        if nilai_akhir < nilai_terendah:
            nilai_terendah = nilai_akhir
            mhs_terendah = mhs
    
    print("\n📊 MAHASISWA DENGAN NILAI TERTINGGI:")
    print(f"Nama: {mhs_tertinggi['nama']}")
    print(f"NIM: {mhs_tertinggi['NIM']}")
    print(f"Nilai Akhir: {nilai_tertinggi:.2f}")
    print(f"Grade: {tentukan_grade(nilai_tertinggi)}")
    
    print("\n📊 MAHASISWA DENGAN NILAI TERENDAH:")
    print(f"Nama: {mhs_terendah['nama']}")
    print(f"NIM: {mhs_terendah['NIM']}")
    print(f"Nilai Akhir: {nilai_terendah:.2f}")
    print(f"Grade: {tentukan_grade(nilai_terendah)}")


# Fungsi untuk input data mahasiswa baru
def input_mahasiswa_baru():
    print("\n=== INPUT DATA MAHASISWA BARU ===")
    nama = input("Nama: ")
    nim = input("NIM: ")
    nilai_uts = float(input("Nilai UTS: "))
    nilai_uas = float(input("Nilai UAS: "))
    nilai_tugas = float(input("Nilai Tugas: "))
    
    mahasiswa_baru = {
        "nama": nama,
        "NIM": nim,
        "nilai_uts": nilai_uts,
        "nilai_uas": nilai_uas,
        "nilai_tugas": nilai_tugas
    }
    
    data_mahasiswa.append(mahasiswa_baru)
    print("\n✅ Data mahasiswa berhasil ditambahkan!")


# Fungsi untuk filter mahasiswa berdasarkan grade
def filter_berdasarkan_grade():
    grade_input = input("\nMasukkan grade yang ingin dicari (A/B/C/D/E): ").upper()
    
    print(f"\n=== MAHASISWA DENGAN GRADE {grade_input} ===")
    print(f"{'No':<5} {'Nama':<30} {'NIM':<12} {'Nilai Akhir':<15} {'Grade':<8}")
    print("="*75)
    
    ditemukan = False
    nomor = 1
    
    for mhs in data_mahasiswa:
        nilai_akhir = hitung_nilai_akhir(mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"])
        grade = tentukan_grade(nilai_akhir)
        
        if grade == grade_input:
            print(f"{nomor:<5} {mhs['nama']:<30} {mhs['NIM']:<12} {nilai_akhir:<15.2f} {grade:<8}")
            nomor += 1
            ditemukan = True
    
    if not ditemukan:
        print(f"Tidak ada mahasiswa dengan grade {grade_input}")
    print("="*75)


# Fungsi untuk hitung rata-rata nilai kelas
def hitung_rata_rata():
    total_nilai = 0
    jumlah_mahasiswa = len(data_mahasiswa)
    
    for mhs in data_mahasiswa:
        nilai_akhir = hitung_nilai_akhir(mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"])
        total_nilai += nilai_akhir
    
    rata_rata = total_nilai / jumlah_mahasiswa
    
    print(f"\n RATA-RATA NILAI KELAS: {rata_rata:.2f}")


# Menu utama
def menu_utama():
    while True:
        print("\n" + "="*50)
        print("PROGRAM PENGELOLAAN DATA NILAI MAHASISWA")
        print("="*50)
        print("1. Tampilkan Semua Data Mahasiswa")
        print("2. Input Data Mahasiswa Baru")
        print("3. Filter Mahasiswa Berdasarkan Grade")
        print("4. Hitung Rata-Rata Nilai Kelas")
        print("5. Cari Mahasiswa dengan Nilai Tertinggi/Terendah")
        print("6. Keluar")
        print("="*50)
        
        pilihan = input("Pilih menu (1-6): ")
        
        if pilihan == "1":
            tampilkan_tabel()
        elif pilihan == "2":
            input_mahasiswa_baru()
        elif pilihan == "3":
            filter_berdasarkan_grade()
        elif pilihan == "4":
            hitung_rata_rata()
        elif pilihan == "5":
            cari_mahasiswa_ekstrem()
        elif pilihan == "6":
            print("\nTerima kasih telah menggunakan program ini!")
            break
        else:
            print("\n❌ Pilihan tidak valid! Silakan pilih 1-6.")


# Jalankan program
if __name__ == "__main__":
    menu_utama()