

import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

// Modal stilini belirleyelim
Modal.setAppElement("#root");

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [updateCategory, setUpdateCategory] = useState({ id: "", name: "", description: "" });
  const [originalCategory, setOriginalCategory] = useState(null);

  const [isAddModalOpen, setAddModalOpen] = useState(false); // Yeni kategori modal durumu
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false); // Güncelleme modal durumu

  useEffect(() => {
    axios.get("https://distinctive-laurianne-sidika-3ce48187.koyeb.app/api/v1/categories").then((res) => {
      setCategories(res.data);
      setLoading(false);
    });
  }, [refresh]);

  if (loading) return <div>Yükleniyor...</div>;

  const handleAddCategory = (e) => {
    e.preventDefault();
    axios.post("https://distinctive-laurianne-sidika-3ce48187.koyeb.app/api/v1/categories", newCategory)
      .then(() => {
        toast.success("Yeni kategori eklendi!");
        setRefresh(!refresh);
        setNewCategory({ name: "", description: "" });
        setAddModalOpen(false); // Modal'ı kapat
      })
      .catch(() => {
        toast.error("Kategori eklenirken bir hata oluştu.");
      });
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleUpdateCategory = () => {
    if (
      originalCategory &&
      originalCategory.name === updateCategory.name &&
      originalCategory.description !== updateCategory.description
    ) {
      toast.error("Sadece açıklama değişikliği yapamazsınız.");
      return;
    }

    axios.put(`https://distinctive-laurianne-sidika-3ce48187.koyeb.app/api/v1/categories/${updateCategory.id}`, updateCategory)
      .then(() => {
        toast.success("Kategori başarıyla güncellendi!");
        setRefresh(!refresh);
        setUpdateCategory({ id: "", name: "", description: "" });
        setOriginalCategory(null);
        setUpdateModalOpen(false); // Modal'ı kapat
      })
      .catch(() => {
        toast.error("Kategori güncellenirken bir hata oluştu.");
      });
  };

  const handleUpdateCategoryChange = (e) => {
    setUpdateCategory({ ...updateCategory, [e.target.name]: e.target.value });
  };

  const handleSelectCategory = (category) => {
    setUpdateCategory(category);
    setOriginalCategory(category);
    setUpdateModalOpen(true); // Güncelleme modal'ını aç
  };

  const handleDeleteCategory = (id) => {
    axios.delete(`https://distinctive-laurianne-sidika-3ce48187.koyeb.app/api/v1/categories/${id}`)
      .then(() => {
        toast.success("Kategori silindi!");
        setRefresh(!refresh);
      })
      .catch(() => {
        toast.error("Kategori silinirken bir hata oluştu.");
      });
  };

  return (
    <>
      <h1>Kategoriler</h1>

      {/* Yeni Kategori Ekleme Butonu */}
      <button onClick={() => setAddModalOpen(true)}>Yeni Kategori Ekle</button>

      {/* Yeni Kategori Modal */}
      <Modal isOpen={isAddModalOpen} onRequestClose={() => setAddModalOpen(false)} contentLabel="Yeni Kategori">
        <h3>Yeni Kategori</h3>
        <form onSubmit={handleAddCategory}>
          <input
            type="text"
            name="name"
            value={newCategory.name}
            placeholder="Kategori Adı"
            required
            onChange={handleNewCategoryChange}
          />
          <input
            type="text"
            name="description"
            value={newCategory.description}
            placeholder="Açıklama"
            required
            onChange={handleNewCategoryChange}
          />
          <button type="submit">Ekle</button>
          <button onClick={() => setAddModalOpen(false)}>Kapat</button>
        </form>
      </Modal>

      {/* Kategori Güncelleme Modal */}
      <Modal isOpen={isUpdateModalOpen} onRequestClose={() => setUpdateModalOpen(false)} contentLabel="Kategori Güncelle">
        <h3>Kategori Güncelle</h3>
        <input
          type="text"
          name="name"
          value={updateCategory.name}
          placeholder="Kategori Adı"
          onChange={handleUpdateCategoryChange}
        />
        <input
          type="text"
          name="description"
          value={updateCategory.description}
          placeholder="Açıklama"
          onChange={handleUpdateCategoryChange}
        />
        <button onClick={handleUpdateCategory}>Güncelle</button>
        <button onClick={() => setUpdateModalOpen(false)}>Kapat</button>
      </Modal>

      {/* Kategorileri Tabloyla Listeleme */}
      <table>
        <thead>
          <tr>
            <th>İsim</th>
            <th>Açıklama</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => handleSelectCategory(category)}>Güncelle</button>
                <button onClick={() => handleDeleteCategory(category.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Categories;
