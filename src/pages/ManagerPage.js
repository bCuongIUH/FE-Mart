import React, { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../untills/api'; 
import './ManagerPage.css';
import { useNavigate } from 'react-router-dom';
const ManagerPage = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: '', saleStartDate: '', saleEndDate: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); 
  };
 
  useEffect(() => {
    async function fetchProducts() {
      try {
        const productList = await getAllProducts();
        setProducts(productList);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    }
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const result = await createProduct(newProduct);
      setProducts([...products, result.product]);
      setNewProduct({ name: '', price: '', description: '', image: '', saleStartDate: '', saleEndDate: '' });
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm:', error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const result = await updateProduct(editingProduct._id, editingProduct);
      setProducts(products.map(product => product._id === result.product._id ? result.product : product));
      setEditingProduct(null);
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter(product => product._id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };

  return (
    <div className="manager-page">
      <header className="header">
        <div className="header-left">
          <button className="btn-home" onClick={goBack}>quay lại</button>
        </div>
        <div className="header-right">
          <button className="btn-info">Thông Tin</button>
          <button className="btn-stats">Thống Kê</button>
          <button className="btn-services">Dịch Vụ</button>
        </div>
      </header>
      <section className="product-form">
        <form onSubmit={newProduct._id ? handleUpdateProduct : handleCreateProduct}>
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Giá"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            required
          />
          <textarea
            placeholder="Mô tả"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewProduct({ ...newProduct, image: URL.createObjectURL(e.target.files[0]) })}
          />
          <input
            type="date"
            placeholder="Ngày bắt đầu khuyến mãi"
            value={newProduct.saleStartDate}
            onChange={(e) => setNewProduct({ ...newProduct, saleStartDate: e.target.value })}
          />
          <input
            type="date"
            placeholder="Ngày kết thúc khuyến mãi"
            value={newProduct.saleEndDate}
            onChange={(e) => setNewProduct({ ...newProduct, saleEndDate: e.target.value })}
          />
          <button className="btn-submit" type="submit">{newProduct._id ? 'Cập Nhật' : 'Thêm Sản Phẩm'}</button>
          {newProduct._id && <button className="btn-cancel" onClick={() => setEditingProduct(null)}>Hủy</button>}
        </form>
      </section>
      <section className="product-list">
        {products.map(product => (
          <div className="product-card" key={product._id}>
            <img src={product.image} alt={product.name} />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="product-price">${product.price}</p>
            </div>
            <div className="product-actions">
              <button className="btn-edit" onClick={() => setEditingProduct(product)}>Sửa</button>
              <button className="btn-delete" onClick={() => handleDeleteProduct(product._id)}>Xóa</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ManagerPage;
