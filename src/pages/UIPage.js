
import React, { useState, useEffect, useContext } from 'react';
import '../pages/UIPage.css';
import { AuthContext } from '../untills/context/AuthContext';
import { getAllProducts } from '../untills/api'; 

function UIPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu sản phẩm');
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    console.log('Sản phẩm được chọn:', product);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handleLogout = () => {
    logout(); 
    window.location.href = '/'; 
  };
 
  return (
    <div className="ui-page">
      <header className="header">
        <h1>SOPPE</h1>
        <nav>
          <a href="/">Trang Chủ</a>
          <a href="/products">Giỏ Hàng</a>
          <a href="/contact">Liên Hệ</a>

          {/* Tài Khoản - chọn mở option mở chức năng quản lí của user*/}
          <div className="account">
            <img
              src="https://res.cloudinary.com/dhpqoqtgx/image/upload/v1726249497/ke78gjlzmk0epm2mv77s.jpg"  // ảnh default
              alt="User Avatar"
              className="avatar"
              onClick={toggleDropdown} 
            />
            {showDropdown && (
              <div className="dropdown">
                <ul>
                  <li><a href="/profile">Thông tin</a></li>
                  <li><a href="/settings">Cài đặt</a></li>
                  <li><a href="/change-password">Cập nhật mật khẩu</a></li>
                  <li onClick={handleLogout}>Đăng xuất</li>
                </ul>
              </div>
            )}
          </div>
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
