
import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [updateBook, setUpdateBook] = useState({ //Burda veriyi sağlayan yerdeki şemaya uygun yapı oluşturmak önemli.
    id: "",
    name: "",
    publicationYear: "",
    stock: "",
    author: { id: "" },
    publisher: { id: "" },
    categories: [{ id: "" }],
  });

  const [newBook, setNewBook] = useState({
    name: "",
    publicationYear: "",
    stock: "",
    author: "",
    publisher: "",
    categories: "",
  });

  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);

  // Modal visibility state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/books").then((res) => {
      setBooks(res.data);
      setLoading(false);
      setUpdate(false);
    });

    axios.get("http://localhost:8080/api/v1/authors").then((res) => {
      setAuthors(res.data);
    });

    axios.get("http://localhost:8080/api/v1/publishers").then((res) => {
      setPublishers(res.data);
    });

    axios.get("http://localhost:8080/api/v1/categories").then((res) => {
      setCategories(res.data);
    });
  }, [update]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }
 //Ekleme
  const handleAddBook = () => {  //Tüm inputların doluluğunu kontrol ediyorum
    if (!newBook.name || !newBook.publicationYear || !newBook.stock || !newBook.author || !newBook.publisher || !newBook.categories) {
      toast.error("Tüm alanları doldurduğunuzdan emin olun.");
      return;
    }

    if (newBook.stock <= 0) {         //Stok için kontrol
      toast.error("Stok değeri 0 veya negatif olamaz.");
      return;
    }

    if (newBook.publicationYear <= 0) {
      toast.error("Yayın yılı 0 veya negatif olamaz.");
      return;
    }

    const bookData = {
      name: newBook.name,
      publicationYear: newBook.publicationYear,
      stock: newBook.stock,
      author: { id: newBook.author },
      publisher: { id: newBook.publisher },
      categories: newBook.categories ? [{ id: newBook.categories }] : [],
    };

    axios
      .post("http://localhost:8080/api/v1/books", bookData)
      .then((response) => {
        setBooks((prevBooks) => [...prevBooks, response.data]); // Listeyi güncelle
        setUpdate(true);
        setNewBook({
          name: "",
          publicationYear: "",
          stock: "",
          author: "",
          publisher: "",
          categories: "",
        });
        setIsAddModalOpen(false); // Modalı kapat
        toast.success("Kitap başarıyla eklendi.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Kitap eklenirken bir hata oluştu.");
      });
  };

  //Güncelleme fonk.
  const handleUpdateBook = () => {
    if (!updateBook.name || !updateBook.publicationYear || !updateBook.stock || !updateBook.author.id || !updateBook.publisher.id || !updateBook.categories[0].id) {
      toast.error("Tüm alanları doldurduğunuzdan emin olun.");
      return;
    }

    if (updateBook.stock <= 0) {
      toast.error("Stok değeri 0 veya negatif olamaz.");
      return;
    }

    if (updateBook.publicationYear <= 0) {
      toast.error("Yayın yılı 0 veya negatif olamaz.");
      return;
    }

    const updatedData = {
      ...updateBook,
      author: { id: updateBook.author.id },
      publisher: { id: updateBook.publisher.id },
      categories: updateBook.categories.map((cat) => ({ id: cat.id })),
    };

    axios
      .put(`http://localhost:8080/api/v1/books/${updateBook.id}`, updatedData)
      .then((response) => {
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book.id === updateBook.id ? response.data : book // Güncellenmiş kitabı listeye ekle
          )
        );
        setUpdate(true);
        setUpdateBook({
          id: "",
          name: "",
          publicationYear: "",
          stock: "",
          author: { id: "" },
          publisher: { id: "" },
          categories: [{ id: "" }],
        });
        setIsUpdateModalOpen(false); // Modalı kapat
        toast.success("Kitap başarıyla güncellendi.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Kitap güncellenirken bir hata oluştu.");
      });
  };

  const handleUpdateBookBtn = (book) => {
    setUpdateBook({
      ...book,
      categories: book.categories.length > 0 ? book.categories : [{ id: "" }],
    });
    setIsUpdateModalOpen(true); // Güncelleme modali aç
  };

  const handleDeleteBook = (id) => {
    axios
      .delete(`http://localhost:8080/api/v1/books/${id}`)
      .then(() => {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id)); // Silinen kitabı listeden çıkar
        setUpdate(true);
        toast.success("Kitap başarıyla silindi.");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Kitap silinirken bir hata oluştu.");
      });
  };

  return (
    <>
      <div>
        <h2>Kitaplar</h2>
        
        <button onClick={() => setIsAddModalOpen(true)}>Kitap Ekle</button>

        <table>
          <thead>
            <tr>
              <th>Kitap Adı</th>
              <th>Yazar, Yayıncı, Kategori</th>
              <th>Yayın Yılı</th>
              <th>Stok</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.name}</td>
                <td>{book.author.name}, {book.publisher.name}, {book.categories.map(cat => cat.name).join(", ")}</td>
                <td>{book.publicationYear}</td>
                <td>{book.stock}</td>
                <td>
                  <button onClick={() => handleUpdateBookBtn(book)}>Güncelle</button>
                  <button onClick={() => handleDeleteBook(book.id)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kitap Ekle Modal */}
      <Modal isOpen={isAddModalOpen} onRequestClose={() => setIsAddModalOpen(false)}>
        <h3>Kitap Ekle</h3>
        <input
          type="text"
          placeholder="Kitap Adı"
          name="name"
          value={newBook.name}
          onChange={(e) => setNewBook({ ...newBook, [e.target.name]: e.target.value })}
        />
        <input
          type="number"
          placeholder="Yayın Yılı"
          name="publicationYear"
          value={newBook.publicationYear}
          onChange={(e) => setNewBook({ ...newBook, [e.target.name]: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stok"
          name="stock"
          value={newBook.stock}
          onChange={(e) => setNewBook({ ...newBook, [e.target.name]: e.target.value })}
        />
        <select
          name="author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, [e.target.name]: e.target.value })}
        >
          <option value="">Yazar Seçin</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>{author.name}</option>
          ))}
        </select>
        <select
          name="publisher"
          value={newBook.publisher}
          onChange={(e) => setNewBook({ ...newBook, [e.target.name]: e.target.value })}
        >
          <option value="">Yayıncı Seçin</option>
          {publishers.map((publisher) => (
            <option key={publisher.id} value={publisher.id}>{publisher.name}</option>
          ))}
        </select>
        <select
          name="categories"
          value={newBook.categories}
          onChange={(e) => setNewBook({ ...newBook, [e.target.name]: e.target.value })}
        >
          <option value="">Kategori Seçin</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button onClick={handleAddBook}>Ekle</button>
        <button onClick={() => setIsAddModalOpen(false)}>İptal</button>
      </Modal>

      {/* Kitap Güncelle Modal */}
      <Modal isOpen={isUpdateModalOpen} onRequestClose={() => setIsUpdateModalOpen(false)}>
        <h3>Kitap Düzenle</h3>
        <input
          type="text"
          placeholder="Kitap Adı"
          name="name"
          value={updateBook.name}
          onChange={(e) => setUpdateBook({ ...updateBook, [e.target.name]: e.target.value })}
        />
        <input
          type="number"
          placeholder="Yayın Yılı"
          name="publicationYear"
          value={updateBook.publicationYear}
          onChange={(e) => setUpdateBook({ ...updateBook, [e.target.name]: e.target.value })}
        />
        <input
          type="number"
          placeholder="Stok"
          name="stock"
          value={updateBook.stock}
          onChange={(e) => setUpdateBook({ ...updateBook, [e.target.name]: e.target.value })}
        />
        <select
          name="author"
          value={updateBook.author.id}
          onChange={(e) => setUpdateBook({ ...updateBook, author: { id: e.target.value } })}
        >
          <option value="">Yazar Seçin</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>{author.name}</option>
          ))}
        </select>
        <select
          name="publisher"
          value={updateBook.publisher.id}
          onChange={(e) => setUpdateBook({ ...updateBook, publisher: { id: e.target.value } })}
        >
          <option value="">Yayıncı Seçin</option>
          {publishers.map((publisher) => (
            <option key={publisher.id} value={publisher.id}>{publisher.name}</option>
          ))}
        </select>
        <select
          name="categories"
          value={updateBook.categories[0].id}
          onChange={(e) => setUpdateBook({ ...updateBook, categories: [{ id: e.target.value }] })}
        >
          <option value="">Kategori Seçin</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button onClick={handleUpdateBook}>Güncelle</button>
        <button onClick={() => setIsUpdateModalOpen(false)}>İptal</button>
      </Modal>
    </>
  );
}

export default Books;

