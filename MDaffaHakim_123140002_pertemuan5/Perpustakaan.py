from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Optional

# ======================================
# ABSTRACT BASE CLASS: LibraryItem
# ======================================
class LibraryItem(ABC):
    """
    Abstract base class untuk semua item di perpustakaan.

    """
    
    def __init__(self, item_id: str, title: str, author: str, year: int):
        """
        Constructor untuk LibraryItem
        
        Args:
            item_id: ID unik untuk item
            title: Judul item
            author: Penulis/kreator item
            year: Tahun publikasi
        """
        self.__item_id = item_id  # Private attribute
        self._title = title  # Protected attribute
        self._author = author
        self._year = year
        self._is_available = True  # Status ketersediaan item
    
    # Property untuk mengakses item_id (read-only)
    @property
    def item_id(self) -> str:
        """Getter untuk item_id (read-only)"""
        return self.__item_id
    
    # Property untuk title dengan validation
    @property
    def title(self) -> str:
        """Getter untuk title"""
        return self._title
    
    @title.setter
    def title(self, value: str):
        """Setter untuk title dengan validasi"""
        if not value or len(value.strip()) == 0:
            raise ValueError("Judul tidak boleh kosong!")
        self._title = value.strip()
    
    @property
    def author(self) -> str:
        """Getter untuk author"""
        return self._author
    
    @property
    def year(self) -> int:
        """Getter untuk year"""
        return self._year
    
    @property
    def is_available(self) -> bool:
        """Getter untuk status ketersediaan"""
        return self._is_available
    
    @is_available.setter
    def is_available(self, value: bool):
        """Setter untuk status ketersediaan"""
        self._is_available = value
    
    @abstractmethod
    def get_item_type(self) -> str:
        """
        Method abstract yang harus diimplementasikan oleh subclass.
        Mengembalikan tipe item (Book, Magazine, etc.)
        """
        pass
    
    @abstractmethod
    def display_info(self) -> str:
        """
        Method abstract untuk menampilkan informasi detail item.
        Setiap subclass harus mengimplementasikan cara menampilkan informasinya sendiri.
        """
        pass
    
    def borrow(self) -> bool:
        """
        Method untuk meminjam item
        Returns: True jika berhasil, False jika item tidak tersedia
        """
        if self._is_available:
            self._is_available = False
            return True
        return False
    
    def return_item(self) -> bool:
        """
        Method untuk mengembalikan item
        Returns: True jika berhasil, False jika item sudah tersedia
        """
        if not self._is_available:
            self._is_available = True
            return True
        return False


# ======================================
# SUBCLASS 1: Book
# ======================================
class Book(LibraryItem):
    """
    Class untuk merepresentasikan buku di perpustakaan.
    Inheritance dari LibraryItem dengan atribut tambahan untuk buku.
    """
    
    def __init__(self, item_id: str, title: str, author: str, year: int, 
                 isbn: str, pages: int, genre: str):
        """
        Constructor untuk Book
        
        Args:
            item_id: ID unik buku
            title: Judul buku
            author: Penulis buku
            year: Tahun publikasi
            isbn: ISBN buku
            pages: Jumlah halaman
            genre: Genre buku
        """
        super().__init__(item_id, title, author, year)
        self.__isbn = isbn  # Private attribute
        self._pages = pages
        self._genre = genre
    
    @property
    def isbn(self) -> str:
        """Getter untuk ISBN (read-only)"""
        return self.__isbn
    
    @property
    def pages(self) -> int:
        """Getter untuk jumlah halaman"""
        return self._pages
    
    @property
    def genre(self) -> str:
        """Getter untuk genre"""
        return self._genre
    
    def get_item_type(self) -> str:
        """Implementasi method abstract - mengembalikan tipe 'Book'"""
        return "Book"
    
    def display_info(self) -> str:
        """
        Implementasi method abstract - menampilkan informasi lengkap buku
        Polymorphism: method yang sama tapi implementasi berbeda dari parent class
        """
        status = "✓ Tersedia" if self.is_available else "✗ Dipinjam"
        return f"""
╔═══════════════════════════════════════════════════════════════
║ INFORMASI BUKU
╠═══════════════════════════════════════════════════════════════
║ ID         : {self.item_id}
║ Judul      : {self.title}
║ Penulis    : {self.author}
║ Tahun      : {self.year}
║ ISBN       : {self.isbn}
║ Halaman    : {self.pages} halaman
║ Genre      : {self.genre}
║ Status     : {status}
╚═══════════════════════════════════════════════════════════════
"""


# ======================================
# SUBCLASS 2: Magazine
# ======================================
class Magazine(LibraryItem):
    """
    Class untuk merepresentasikan majalah di perpustakaan.
    Inheritance dari LibraryItem dengan atribut tambahan untuk majalah.
    """
    
    def __init__(self, item_id: str, title: str, publisher: str, year: int,
                 issue_number: int, month: str):
        """
        Constructor untuk Magazine
        
        Args:
            item_id: ID unik majalah
            title: Judul majalah
            publisher: Penerbit majalah
            year: Tahun publikasi
            issue_number: Nomor edisi
            month: Bulan publikasi
        """
        super().__init__(item_id, title, publisher, year)
        self._issue_number = issue_number
        self._month = month
    
    @property
    def issue_number(self) -> int:
        """Getter untuk nomor edisi"""
        return self._issue_number
    
    @property
    def month(self) -> str:
        """Getter untuk bulan publikasi"""
        return self._month
    
    def get_item_type(self) -> str:
        """Implementasi method abstract - mengembalikan tipe 'Magazine'"""
        return "Magazine"
    
    def display_info(self) -> str:
        """
        Implementasi method abstract - menampilkan informasi lengkap majalah
        Polymorphism: method yang sama tapi implementasi berbeda dari parent class
        """
        status = "✓ Tersedia" if self.is_available else "✗ Dipinjam"
        return f"""
╔═══════════════════════════════════════════════════════════════
║ INFORMASI MAJALAH
╠═══════════════════════════════════════════════════════════════
║ ID         : {self.item_id}
║ Judul      : {self.title}
║ Penerbit   : {self.author}
║ Tahun      : {self.year}
║ Edisi      : #{self.issue_number}
║ Bulan      : {self.month}
║ Status     : {status}
╚═══════════════════════════════════════════════════════════════
"""


# ======================================
# CLASS: Library
# ======================================
class Library:
    """
    Class untuk mengelola koleksi perpustakaan.
    Menerapkan encapsulation dengan menyimpan koleksi sebagai private attribute.
    """
    
    def __init__(self, name: str):
        """
        Constructor untuk Library
        
        Args:
            name: Nama perpustakaan
        """
        self.__name = name  # Private attribute
        self.__items: List[LibraryItem] = []  # Private list untuk menyimpan item
        self.__borrowed_count = 0  # Track jumlah item yang dipinjam
    
    @property
    def name(self) -> str:
        """Getter untuk nama perpustakaan"""
        return self.__name
    
    @property
    def total_items(self) -> int:
        """Getter untuk jumlah total item"""
        return len(self.__items)
    
    @property
    def available_items(self) -> int:
        """Getter untuk jumlah item yang tersedia"""
        return sum(1 for item in self.__items if item.is_available)
    
    @property
    def borrowed_items(self) -> int:
        """Getter untuk jumlah item yang dipinjam"""
        return self.__borrowed_count
    
    def add_item(self, item: LibraryItem) -> bool:
        """
        Menambahkan item ke perpustakaan
        
        Args:
            item: LibraryItem atau subclassnya
            
        Returns:
            True jika berhasil, False jika item_id sudah ada
        """
        # Cek apakah item_id sudah ada
        if any(existing.item_id == item.item_id for existing in self.__items):
            print(f"❌ Error: Item dengan ID '{item.item_id}' sudah ada!")
            return False
        
        self.__items.append(item)
        print(f"✓ Item '{item.title}' berhasil ditambahkan ke perpustakaan!")
        return True
    
    def display_all_items(self) -> None:
        """
        Menampilkan semua item di perpustakaan
        Demonstrasi polymorphism: memanggil display_info() pada berbagai tipe item
        """
        if not self.__items:
            print("📚 Perpustakaan masih kosong!")
            return
        
        print(f"\n{'='*65}")
        print(f"  DAFTAR KOLEKSI PERPUSTAKAAN: {self.__name}")
        print(f"{'='*65}")
        print(f"Total Item: {self.total_items} | Tersedia: {self.available_items} | Dipinjam: {self.borrowed_items}")
        print(f"{'='*65}\n")
        
        # Polymorphism: setiap item memanggil display_info() sesuai tipenya
        for item in self.__items:
            print(item.display_info())
    
    def search_by_title(self, title: str) -> List[LibraryItem]:
        """
        Mencari item berdasarkan judul (case-insensitive)
        
        Args:
            title: Kata kunci judul yang dicari
            
        Returns:
            List of LibraryItem yang cocok
        """
        results = [
            item for item in self.__items 
            if title.lower() in item.title.lower()
        ]
        return results
    
    def search_by_id(self, item_id: str) -> Optional[LibraryItem]:
        """
        Mencari item berdasarkan ID
        
        Args:
            item_id: ID item yang dicari
            
        Returns:
            LibraryItem jika ditemukan, None jika tidak
        """
        for item in self.__items:
            if item.item_id == item_id:
                return item
        return None
    
    def borrow_item(self, item_id: str) -> bool:
        """
        Meminjam item dari perpustakaan
        
        Args:
            item_id: ID item yang akan dipinjam
            
        Returns:
            True jika berhasil, False jika gagal
        """
        item = self.search_by_id(item_id)
        if item is None:
            print(f"❌ Item dengan ID '{item_id}' tidak ditemukan!")
            return False
        
        if item.borrow():
            self.__borrowed_count += 1
            print(f"✓ Item '{item.title}' berhasil dipinjam!")
            return True
        else:
            print(f"❌ Item '{item.title}' sedang dipinjam!")
            return False
    
    def return_item(self, item_id: str) -> bool:
        """
        Mengembalikan item ke perpustakaan
        
        Args:
            item_id: ID item yang akan dikembalikan
            
        Returns:
            True jika berhasil, False jika gagal
        """
        item = self.search_by_id(item_id)
        if item is None:
            print(f"❌ Item dengan ID '{item_id}' tidak ditemukan!")
            return False
        
        if item.return_item():
            self.__borrowed_count -= 1
            print(f"✓ Item '{item.title}' berhasil dikembalikan!")
            return True
        else:
            print(f"❌ Item '{item.title}' tidak sedang dipinjam!")
            return False
    
    def display_statistics(self) -> None:
        """Menampilkan statistik perpustakaan"""
        print(f"\n{'='*65}")
        print(f"  STATISTIK PERPUSTAKAAN: {self.__name}")
        print(f"{'='*65}")
        print(f"Total Item       : {self.total_items}")
        print(f"Item Tersedia    : {self.available_items}")
        print(f"Item Dipinjam    : {self.borrowed_items}")
        
        # Hitung berdasarkan tipe
        books = sum(1 for item in self.__items if isinstance(item, Book))
        magazines = sum(1 for item in self.__items if isinstance(item, Magazine))
        
        print(f"Total Buku       : {books}")
        print(f"Total Majalah    : {magazines}")
        print(f"{'='*65}\n")


# ======================================
# MAIN PROGRAM - DEMONSTRASI
# ======================================
def main():
    """
    Main program untuk demonstrasi sistem perpustakaan
    """
    print("="*65)
    print("  SISTEM MANAJEMEN PERPUSTAKAAN")
    print("="*65)
    
    # Membuat instance Library
    perpustakaan = Library("Perpustakaan Institut Teknologi Sumatera")
    
    # Menambahkan buku ke perpustakaan
    book1 = Book(
        item_id="B001",
        title="Clean Code: A Handbook of Agile Software Craftsmanship",
        author="Robert C. Martin",
        year=2008,
        isbn="978-0132350884",
        pages=464,
        genre="Programming"
    )
    
    book2 = Book(
        item_id="B002",
        title="Python Crash Course",
        author="Eric Matthes",
        year=2019,
        isbn="978-1593279288",
        pages=544,
        genre="Programming"
    )
    
    book3 = Book(
        item_id="B003",
        title="The Pragmatic Programmer",
        author="David Thomas, Andrew Hunt",
        year=2019,
        isbn="978-0135957059",
        pages=352,
        genre="Programming"
    )
    
    # Menambahkan majalah ke perpustakaan
    mag1 = Magazine(
        item_id="M001",
        title="National Geographic",
        publisher="National Geographic Society",
        year=2024,
        issue_number=11,
        month="November"
    )
    
    mag2 = Magazine(
        item_id="M002",
        title="IEEE Spectrum",
        publisher="IEEE",
        year=2024,
        issue_number=10,
        month="October"
    )
    
    # Tambahkan item ke perpustakaan
    perpustakaan.add_item(book1)
    perpustakaan.add_item(book2)
    perpustakaan.add_item(book3)
    perpustakaan.add_item(mag1)
    perpustakaan.add_item(mag2)
    
    # Tampilkan statistik
    perpustakaan.display_statistics()
    
    # Tampilkan semua item
    perpustakaan.display_all_items()
    
    # Demonstrasi pencarian
    print("\n" + "="*65)
    print("  DEMONSTRASI PENCARIAN")
    print("="*65)
    
    print("\n🔍 Mencari item dengan kata kunci 'Python':")
    results = perpustakaan.search_by_title("Python")
    if results:
        for item in results:
            print(f"  - {item.title} ({item.get_item_type()})")
    else:
        print("  Tidak ada hasil ditemukan.")
    
    print("\n🔍 Mencari item dengan ID 'B001':")
    item = perpustakaan.search_by_id("B001")
    if item:
        print(item.display_info())
    
    # Demonstrasi peminjaman
    print("\n" + "="*65)
    print("  DEMONSTRASI PEMINJAMAN")
    print("="*65)
    print()
    
    perpustakaan.borrow_item("B001")
    perpustakaan.borrow_item("M001")
    
    # Coba pinjam yang sudah dipinjam
    print()
    perpustakaan.borrow_item("B001")
    
    # Tampilkan statistik setelah peminjaman
    perpustakaan.display_statistics()
    
    # Demonstrasi pengembalian
    print("\n" + "="*65)
    print("  DEMONSTRASI PENGEMBALIAN")
    print("="*65)
    print()
    
    perpustakaan.return_item("B001")
    
    # Coba kembalikan yang belum dipinjam
    print()
    perpustakaan.return_item("B002")
    
    # Tampilkan statistik akhir
    perpustakaan.display_statistics()
    
    # Tampilkan semua item (untuk melihat perubahan status)
    print("\n" + "="*65)
    print("  STATUS AKHIR KOLEKSI")
    print("="*65)
    perpustakaan.display_all_items()


# Jalankan program
if __name__ == "__main__":
    main()