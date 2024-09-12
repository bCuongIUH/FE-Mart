import React, { useState, useEffect, useContext } from 'react';
import '../pages/UIPage.css';
// import { AuthContext } from '../untills/context/AuthContext';
import { getAllProducts } from '../untills/api'; 

function UIPage() {

  const [products, setProducts] = useState([]); 
  const [error, setError] = useState(null); 

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts(); 
        setProducts(data); 
        console.log('Dữ liệu sản phẩm:', data); // xem thông tin sản phẩm ở đây
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu sản phẩm');
        console.error(error);
      }
    };

    fetchProducts(); 
  }, []); 



  const handleProductClick = (product) => {
    // Xử lý sản phẩm dc chọn, render ra thong tin của sp blabla
    console.log('Sản phẩm được chọn:', product);
  };


  return (
    <div className="ui-page">
      <header className="header">
        <h1>SOPPE</h1>
        <nav>
          <a href="/">Trang Chủ</a>
          <a href="/products">Giỏ Hàng</a>
          <a href="/contact">Liên Hệ</a>
          <a  href="/account">Tài Khoản</a>
        </nav>
      </header>

      <main className="main-content">
        <section className="product-list">
          {error && <p className="error-message">{error}</p>}
          {products.length > 0 ? (
            products.map(product => (
              <button
                key={product._id}
                className="product-button"
                onClick={() => handleProductClick(product)}
              >
                <img src={product.image} alt={product.name} className="product-image" />
                <h2 className="product-name">{product.description}</h2>
                <p className="product-price" style={ {color:'red', marginTop: 'auto'}}>{product.price} VNĐ</p>
              </button>
            ))
          ) : (
            <p>Đang tải sản phẩm...</p>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 Shop Online. All rights reserved.</p>
        <div className="footer-links">
          <a href="/">Trang Chủ</a>
          <a href="/products">Sản Phẩm</a>
          <a href="/contact">Liên Hệ</a>
          <a href="/about">Giới Thiệu</a>
        </div>
      </footer>
    </div>
  );
}

export default UIPage;
