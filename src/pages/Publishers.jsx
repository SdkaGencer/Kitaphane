

import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

// Modal stilini özelleştirmek için
Modal.setAppElement("#root");

function Publishers() {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const [newPublisher, setNewPublisher] = useState({
    name: "",
    establishmentYear: "",
    address: "",
  });

  const [updatePublisher, setUpdatePublisher] = useState({
    id: "",
    name: "",
    establishmentYear: "",
    address: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get("https://distinctive-laurianne-sidika-3ce48187.koyeb.app/api/v1/publishers")
      .then((res) => {
        setPublishers(res.data);
        setLoading(false);
      })
      .catch(() => toast.error("Veriler yüklenirken hata oluştu!"));
  }, [refresh]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  const handleAddPublisher = (e) => {
    e.preventDefault();
    
    if (newPublisher.establishmentYear <= 0) {
      toast.error("Kuruluş yılı negatif ya da sıfır olamaz!");
      return;
    }

    axios
      .post("https://distinctive-laurianne-sidika-3ce48187.koyeb.app/api/v1/publishers", newPublisher)
      .then(() => {
        setRefresh(!refresh);
        setNewPublisher({ name: "", establishmentYear: "", address: "" });
        toast.success("Yeni yayıncı başarıyla eklendi!");
        setIsAddModalOpen(false); // Modalı kapat
      })
      .catch(() => toast.error("Yayıncı eklenirken hata oluştu!"));
  };

  const handleNewPublisherChange = (e) => {
    setNewPublisher({ ...newPublisher, [e.target.name]: e.target.value });
  };

  const handleUpdatePublisher = () => {
    if (!updatePublisher.name) {
      toast.error("İsim alanı boş bırakılamaz!");
      return;
    }
    if (!updatePublisher.establishmentYear || updatePublisher.establishmentYear <= 0) {
      toast.error("Kuruluş yılı negatif, sıfır veya boş bırakılamaz!");
      return;
    }
    if (!updatePublisher.address) {
      toast.error("Adres boş bırakılamaz!");
      return;
    }
    
  
    // Önceki verilerle karşılaştırma
    const publisherToUpdate = publishers.find((p) => p.id === updatePublisher.id);
  
    // Sadece adres değişirse uyarı ver
    const isOnlyAddressChanged =
      updatePublisher.address !== publisherToUpdate.address &&
      updatePublisher.name === publisherToUpdate.name &&
      updatePublisher.establishmentYear === publisherToUpdate.establishmentYear;
  
    if (isOnlyAddressChanged) {
      toast.error("Sadece adresi değiştiremezsiniz!");
      return;
    }
  
    // Hiçbir şey değişmemişse uyarı ver
    const isNoChange =
      updatePublisher.name === publisherToUpdate.name &&
      updatePublisher.establishmentYear === publisherToUpdate.establishmentYear &&
      updatePublisher.address === publisherToUpdate.address;
  
    if (isNoChange) {
      toast.info("Hiçbir değişiklik yapılmadı!", {
        style: { backgroundColor: "yellow", color: "white" }, // Sarı renkli bilgi mesajı
      });
      return;
    }
  
    // Güncelleme işlemi
    axios
      .put(`https://distinctive-laurianne-sidika-3ce48187.koyeb.app/api/v1/publishers${updatePublisher.id}`, updatePublisher)
      .then(() => {
        setRefresh(!refresh);
        setUpdatePublisher({ id: "", name: "", establishmentYear: "", address: "" });
        toast.success("Yayıncı başarıyla güncellendi!");
      })
      .catch(() => toast.error("Güncellenirken hata oluştu!"));
  };
  

  const handleUpdatePublisherChange = (e) => {
    setUpdatePublisher({ ...updatePublisher, [e.target.name]: e.target.value });
  };

  const handleSelectPublisher = (publisher) => {
    setUpdatePublisher(publisher);
    setIsUpdateModalOpen(true); // Güncelleme modalını aç
  };

  const handleDeletePublisher = (id) => {
    axios
      .delete(`https://distinctive-laurianne-sidika-3ce48187.koyeb.app/api/v1/publishers/${id}`)
      .then(() => {
        setRefresh(!refresh);
        toast.success("Yayıncı başarıyla silindi!");
      })
      .catch(() => toast.error("Silinirken hata oluştu!"));
  };

  return (
    <>
      <h1>Yayıncılar</h1>

      <button onClick={() => setIsAddModalOpen(true)}>Yeni Yayıncı Ekle</button>

      {/* Yeni Yayıncı Modal */}
      <Modal isOpen={isAddModalOpen} onRequestClose={() => setIsAddModalOpen(false)}>
        <h3>Yeni Yayıncı Ekle</h3>
        <form onSubmit={handleAddPublisher}>
          <input
            type="text"
            name="name"
            value={newPublisher.name}
            placeholder="Adı"
            required
            onChange={handleNewPublisherChange}
          />
          <input
            type="number"
            name="establishmentYear"
            value={newPublisher.establishmentYear}
            placeholder="Kuruluş Yılı"
            required
            onChange={handleNewPublisherChange}
          />
          <input
            type="text"
            name="address"
            value={newPublisher.address}
            placeholder="Adres"
            
            title="Adres yalnızca harflerden oluşabilir"
            required
            onChange={handleNewPublisherChange}
          />
          <button type="submit">Ekle</button>
        </form>
        <button onClick={() => setIsAddModalOpen(false)}>Kapat</button>
      </Modal>

      {/* Yayıncı Güncelleme Modal */}
      <Modal isOpen={isUpdateModalOpen} onRequestClose={() => setIsUpdateModalOpen(false)}>
        <h3>Yayıncı Güncelle</h3>
        <input
          type="text"
          name="name"
          value={updatePublisher.name}
          placeholder="Adı"
          onChange={handleUpdatePublisherChange}
        />
        <input
          type="number"
          name="establishmentYear"
          value={updatePublisher.establishmentYear}
          placeholder="Kuruluş Yılı"
          onChange={handleUpdatePublisherChange}
        />
        <input
          type="text"
          name="address"
          value={updatePublisher.address}
          placeholder="Adres"
          onChange={handleUpdatePublisherChange}
        />
        <button onClick={handleUpdatePublisher}>Güncelle</button>
        <button onClick={() => setIsUpdateModalOpen(false)}>Kapat</button>
      </Modal>

      {/* Yayıncıları Listeleme - Tablo */}
      <table>
        <thead>
          <tr>
            <th>Adı</th>
            <th>Kuruluş Yılı</th>
            <th>Adres</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {publishers.map((publisher) => (
            <tr key={publisher.id}>
              <td>{publisher.name}</td>
              <td>{publisher.establishmentYear}</td>
              <td>{publisher.address}</td>
              <td>
                <button onClick={() => handleSelectPublisher(publisher)}>Güncelle</button>
                <button onClick={() => handleDeletePublisher(publisher.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Publishers;
