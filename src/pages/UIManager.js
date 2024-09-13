import React, { useEffect, useState, useContext } from 'react';
import { getAllProducts } from '../untills/api'; 
import './UIManager.css'; // File CSS tùy chỉnh
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../untills/context/AuthContext';

const UIManager = () => {
  const { user } = useContext(AuthContext);
  console.log('User:', user);
  
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  //nút chuyển trang 
  const handleNavigate = () => {
    navigate('/ManagerPage'); 
  };
  // Lấy tất cả sản phẩm khi trang được tải
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getAllProducts();
        setProducts(productList);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="ui-manager">
      <header className="header">
        <h1 className="header-title">Quản lí siêu thị</h1>
        <nav className="header-nav">
          <button className="nav-btn" onClick={handleNavigate}>Sản phẩm</button>
          <button className="nav-btn">Dịch vụ</button>
          <button className="nav-btn">Thống kê</button>
          <button className="nav-btn">Thông tin</button>
        </nav>
      </header>
      
      <section className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="product-price">{product.price} VND</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default UIManager;
