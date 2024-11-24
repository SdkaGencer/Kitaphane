import axios from 'axios';
import { useState, useEffect } from 'react';
import Modal from 'react-modal';   //modalı dahil ettik
import { toast } from 'react-toastify'; //react toastı dahil ettik
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root');

function Authors() {
  const [authors, setAuthor] = useState([]);  
  const [loading, setLoading] = useState(true); //yükleniyor yazısı
  const [upDate, setUpDate] = useState(false);

  const [newAuthor, setNewAuthor] = useState({      //yeni yazar eklemek için
    name: "",
    birthDate: "",
    country: ""
  });

  const [upDateAuthor, setUpDateAuthor] = useState({   // yazar güncellemek için
    id: "",
    name: "",
    birthDate: "",
    country: ""
  });

  //modalların açıklığını kontrol için
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);   
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);


  //Verileri çektik
  useEffect(() => {
    axios.get("https://distinctive-laurianne-sidika-3ce48187.koyeb.app/api/v1/authors").then((res) => {
      setAuthor(res.data);
      setLoading(false);
      setUpDate(true);
    });
  }, [upDate]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  //yeni yazar ekleme fonk.
  const handleAddAuthors = () => {
    if (!newAuthor.name || !newAuthor.country || !newAuthor.birthDate) {
      toast.error('Tüm alanları doldurun!');
      return;
    }

    axios.post("https://distinctive-laurianne-sidika-3ce48187.koyeb.app/api/v1/authors", newAuthor).then(() => {
      toast.success('Yazar başarıyla eklendi!');
      setUpDate(false);
      setNewAuthor({ name: "", birthDate: "", country: "" });
      setIsAddModalOpen(false);
    }).catch((err) => {
      toast.error('Yazar eklenemedi!');
      console.log(err);
    });
  };

  const handleNewAuthorsChange = (e) => {
    setNewAuthor({ ...newAuthor, [e.target.name]: e.target.value });
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpDateAuthor((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateAuthorBtn = (auth) => {
    setUpDateAuthor(auth);
    setIsUpdateModalOpen(true);
  };
 
  //Yazar güncelleme fonk.
  const handleUpdateAuthor = () => {
    if (!upDateAuthor.name || !upDateAuthor.country) {
      toast.error('İsim ve ülke alanı boş olamaz!');
      return;
    }

    axios.put("https://distinctive-laurianne-sidika-3ce48187.koyeb.app/api/v1/authors/" + upDateAuthor.id, upDateAuthor).then(() => {
      toast.success('Yazar başarıyla güncellendi!');
      setUpDate(false);
      setUpDateAuthor({ id: "", name: "", birthDate: "", country: "" });
      setIsUpdateModalOpen(false);
    }).catch((err) => {
      toast.error('Yazar güncellenemedi!');
      console.log(err);
    });
  };

  //Yazar Silme fonk.
  const handleDeleteAuthors = (id) => {
    axios.delete("https://distinctive-laurianne-sidika-3ce48187.koyeb.app/api/v1/authors/" + id).then(() => {
      toast.success('Yazar başarıyla silindi!');
      setUpDate(false);
    }).catch((err) => {
      toast.error('Yazar silinemedi!');
      console.log(err);
    });
  };

  return (
    <>
      <h1>Yazarlar</h1>

      {/* Ekleme Butonu */}
      <button onClick={() => setIsAddModalOpen(true)}>Ekle</button>

      {/* Yazar Ekle Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        contentLabel="Yazar Ekle"
        style={{
          content: { width: '400px', margin: 'auto', borderRadius: '10px' }
        }}
      >
        <h3>Yazar Ekle</h3>
        <input
          type="text"
          placeholder="Adı"
          name="name"
          value={newAuthor.name}
          onChange={handleNewAuthorsChange}
          required
        />
        <input
          type="date"
          placeholder="Doğum Tarihi"
          name="birthDate"
          value={newAuthor.birthDate}
          onChange={handleNewAuthorsChange}
          required
        />
        <input
          type="text"
          placeholder="Ülke"
          name="country"
          value={newAuthor.country}
          onChange={handleNewAuthorsChange}
          required
        />
        <button onClick={handleAddAuthors}>Ekle</button>
        <button onClick={() => setIsAddModalOpen(false)}>Kapat</button>
      </Modal>

      {/* Yazar Güncelle Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        contentLabel="Yazar Güncelle"
        style={{
          content: { width: '400px', margin: 'auto', borderRadius: '10px' }
        }}
      >
        <h3>Yazar Güncelle</h3>
        <input
          type="text"
          placeholder="Adı"
          name="name"
          value={upDateAuthor.name}
          onChange={handleUpdateInputChange}
          required
        />
        <input
          type="date"
          placeholder="Doğum Tarihi"
          name="birthDate"
          value={upDateAuthor.birthDate}
          onChange={handleUpdateInputChange}
        />
        <input
          type="text"
          placeholder="Ülke"
          name="country"
          value={upDateAuthor.country}
          onChange={handleUpdateInputChange}
          required
        />
        <button onClick={handleUpdateAuthor}>Güncelle</button>
        <button onClick={() => setIsUpdateModalOpen(false)}>Kapat</button>
      </Modal>

      {/* Listeleme Tablosu */}
      <table>
        <thead>
          <tr>
            <th>İsim</th>
            <th>Doğum Yılı</th>
            <th>Ülke</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>{author.birthDate}</td>
              <td>{author.country}</td>
              <td>
                <button onClick={() => handleUpdateAuthorBtn(author)}>Güncelle</button>
                <button onClick={() => handleDeleteAuthors(author.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Authors;
