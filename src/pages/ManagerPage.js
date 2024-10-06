import React, { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../untills/api'; 
import './ManagerPage.css';
import { useNavigate } from 'react-router-dom';

const ManagerPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: '', saleStartDate: '', saleEndDate: '' });
  
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

  const handleProductClick = (product) => {
    setSelectedProduct(product); 
  };

  const handleCloseModal = () => {
    setSelectedProduct(null); 
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
          <button className="btn-home" onClick={goBack}>Quay lại</button>
        </div>
      </header>

      <section className="product-list">
        {products.map(product => (
          <div className="product-card" key={product._id} onClick={() => handleProductClick(product)}>
            <img src={product.image} alt={product.name} />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="product-price">${product.lines[0].unitPrice}</p>
            </div>
            <div className="product-actions">
              <button className="btn-edit">Sửa</button>
              <button className="btn-delete" onClick={(e) => {
                e.stopPropagation(); 
                handleDeleteProduct(product._id);
              }}>Xóa</button>
            </div>
          </div>
        ))}
      </section>

      {selectedProduct && (
        <>
          <div className="modal-overlay" onClick={handleCloseModal}></div>
          <div className="modal">
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <div className="product-details">
              <h3>Thông tin sản phẩm</h3>
              <p className="product-details-name">{selectedProduct.name}</p>
              <p className="product-details-description">{selectedProduct.description}</p>
              <p>Giá bán: ${selectedProduct.lines[0].unitPrice}</p>
              <p>Số lượng: {selectedProduct.lines[0].quantity}</p>
              <button onClick={handleCloseModal}>Đóng</button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default ManagerPage;
