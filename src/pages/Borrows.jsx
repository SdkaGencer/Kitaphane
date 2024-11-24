import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Modal from 'react-modal';

function Borrows() {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  const [newBorrow, setNewBorrow] = useState({
    borrowerName: "",
    borrowerMail: "",
    borrowingDate: "",
    bookForBorrowingRequest: {
      id: "",
    },
  });

  const [updateBorrow, setUpdateBorrow] = useState({
    id: "",
    borrowerName: "",
    borrowingDate: "",
    returnDate: "",
  });

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {  //burası önemli
    const fetchData = async () => {
      try {
        const [borrowsRes, booksRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/borrows"),
          axios.get("http://localhost:8080/api/v1/books"),
        ]);
        setBorrows(borrowsRes.data);
        setBooks(booksRes.data);
        setLoading(false);
        setUpdate(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [update]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  const handleAddBorrow = () => {
    if (!newBorrow.borrowerName || !newBorrow.borrowerMail || !newBorrow.borrowingDate || !newBorrow.bookForBorrowingRequest.id) {
      toast.error("Tüm alanları doldurun.");
      return;
    }

    const selectedBook = books.find(book => book.id === parseInt(newBorrow.bookForBorrowingRequest.id));
    if (selectedBook && selectedBook.stock <= 0) {  //stok kontrolü
      toast.error("Bu kitaptan kalmadı.");
      return;
    }

    axios
      .post("http://localhost:8080/api/v1/borrows", newBorrow)
      .then((response) => {
        setBorrows((prevBorrows) => [...prevBorrows, response.data]); // Yeni borcu listeye ekle
        setNewBorrow({
          borrowerName: "",
          borrowerMail: "",
          borrowingDate: "",
          bookForBorrowingRequest: {
            id: "",
          },
        });
        setIsAddModalOpen(false);  // Modalı kapat
        toast.success("Ödünç alma işlemi başarıyla eklendi.");
      })
      .catch((err) => {
        toast.error("Bir hata oluştu.");
        console.log(err);
      });
  };

  const handleNewBorrowChange = (e) => {
    const { name, value } = e.target;
    if (name === "bookId") {
      setNewBorrow((prev) => ({
        ...prev,
        bookForBorrowingRequest: { ...prev.bookForBorrowingRequest, id: value },
      }));
    } else {
      setNewBorrow((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleUpdateBorrowChange = (e) => {
    const { name, value } = e.target;
    setUpdateBorrow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateBorrowBtn = (borrow) => {
    setUpdateBorrow(borrow);
    setIsUpdateModalOpen(true);  // Güncelleme modalını aç
  };

  const handleUpdateBorrow = () => {
    if (!updateBorrow.borrowerName || !updateBorrow.borrowingDate || !updateBorrow.returnDate) {
      toast.error("Tüm alanları doldurun.");
      return;
    }

    axios
      .put(
        `http://localhost:8080/api/v1/borrows/${updateBorrow.id}`,
        updateBorrow
      )
      .then((response) => {
        setBorrows((prevBorrows) =>
          prevBorrows.map((borrow) =>
            borrow.id === response.data.id ? response.data : borrow
          )
        ); // Güncellenen borcu listeye yerleştir
        setUpdateBorrow({
          borrowerName: "",
          borrowingDate: "",
          returnDate: "",
        });
        setIsUpdateModalOpen(false);  // Modalı kapat
        toast.success("Ödünç alma işlemi başarıyla güncellendi.");
      })
      .catch((err) => {
        toast.error("Bir hata oluştu.");
        console.log(err);
      });
  };

  const handleDeleteBorrow = (id) => {
    axios
      .delete(`http://localhost:8080/api/v1/borrows/${id}`)
      .then(() => {
        setBorrows((prevBorrows) => prevBorrows.filter((borrow) => borrow.id !== id)); // Silinen borcu listeden çıkar
        toast.success("Ödünç alma işlemi başarıyla silindi.");
      })
      .catch((err) => {
        toast.error("Bir hata oluştu.");
        console.log(err);
      });
  };

  return (
    <>
      <h1>Ödünç Alan Kişiler</h1>

      {/* Ekleme Butonu */}
      <button onClick={() => setIsAddModalOpen(true)}>Ekle</button>

      {/* Ödünç Alma Ekleme Modal */}
      <Modal isOpen={isAddModalOpen} onRequestClose={() => setIsAddModalOpen(false)}>
        <h3>Ödünç Alma Ekle</h3>
        <input
          type="text"
          placeholder="Borç Alanın Adı"
          name="borrowerName"
          value={newBorrow.borrowerName}
          onChange={handleNewBorrowChange}
        />
        <input
          type="email"
          placeholder="Borç Alanın E-postası"
          name="borrowerMail"
          value={newBorrow.borrowerMail}
          onChange={handleNewBorrowChange}
        />
        <input
          type="date"
          name="borrowingDate"
          value={newBorrow.borrowingDate}
          onChange={handleNewBorrowChange}
        />
        <select
          name="bookId"
          value={newBorrow.bookForBorrowingRequest.id}
          onChange={handleNewBorrowChange}
        >
          <option value="" disabled>Kitap Seç</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>{book.name}</option>
          ))}
        </select>
        <button onClick={handleAddBorrow}>Ekle</button>
        <button onClick={() => setIsAddModalOpen(false)}>Kapat</button>
      </Modal>

      {/* Güncelleme Modal */}
      <Modal isOpen={isUpdateModalOpen} onRequestClose={() => setIsUpdateModalOpen(false)}>
        <h3>Ödünç Alma Güncelle</h3>
        <input
          type="text"
          placeholder="Borç Alanın Adı"
          name="borrowerName"
          value={updateBorrow.borrowerName}
          onChange={handleUpdateBorrowChange}
        />
        <input
          type="date"
          name="borrowingDate"
          value={updateBorrow.borrowingDate}
          onChange={handleUpdateBorrowChange}
        />
        <input
          type="date"
          name="returnDate"
          value={updateBorrow.returnDate}
          onChange={handleUpdateBorrowChange}
        />
        <button onClick={handleUpdateBorrow}>Güncelle</button>
        <button onClick={() => setIsUpdateModalOpen(false)}>Kapat</button>
      </Modal>

      {/* Ödünç Alma Listeleme */}
      <table>
        <thead>
          <tr>
            <th>İsim</th>
            <th>E-posta</th>
            <th>Alma Tarihi</th>
            <th>Geri Verme Tarihi</th>
            <th>Kitap</th>
            <th>Aksiyonlar</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((borrow) => (
            <tr key={borrow.id}>
              <td>{borrow.borrowerName}</td>
              <td>{borrow.borrowerMail}</td>
              <td>{borrow.borrowingDate}</td>
              <td>{borrow.returnDate}</td>
              <td>{borrow.book.name}</td>
              <td>
                <button onClick={() => handleUpdateBorrowBtn(borrow)}>Güncelle</button>
                <button onClick={() => handleDeleteBorrow(borrow.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Borrows;
