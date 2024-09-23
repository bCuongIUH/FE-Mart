import React, { useState, useEffect, useContext } from 'react';
import styles from './UIPage.module.css'; 
import { AuthContext } from '../untills/context/AuthContext';
import { getAllProducts } from '../untills/api';
import ProductsModal from '../component/products/ProductsModel'

function UIPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
console.log('====================================');
console.log(products);
console.log('====================================');
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
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    // Implement add to cart logic
    console.log('bỏ vào giỏ, mua :))', product);
    handleCloseModal();
  };

  const handleBuyNow = (product) => {
    // Implement buy now logic
    console.log('mua sản phẩm thành công 1:', product);
    handleCloseModal();
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className={styles.uiPage}>
      <header className={styles.header}>
        <h1>SOPPE</h1>
        <nav className={styles.headerNav}>
          <a href="/">Trang Chủ</a>
          <a href="/products">Giỏ Hàng</a>
          <a href="/contact">Liên Hệ</a>

          <div className={styles.account}>
            <img
              src="https://res.cloudinary.com/dhpqoqtgx/image/upload/v1726249497/ke78gjlzmk0epm2mv77s.jpg" // ảnh default
              alt="User Avatar"
              className={styles.avatar}
              onClick={toggleDropdown}
            />
            {showDropdown && (
              <div className={styles.dropdown}>
                <ul className={styles.dropdownList}>
                  <li className={styles.dropdownItem}><a href="/profile">Thông tin</a></li>
                  <li className={styles.dropdownItem}><a href="/settings">Cài đặt</a></li>
                  <li className={styles.dropdownItem}><a href="/change-password">Cập nhật mật khẩu</a></li>
                  <li className={styles.dropdownLogout} onClick={handleLogout}>Đăng xuất</li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.productList}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {products.length > 0 ? (
            products.map(product => (
              <button
                key={product._id}
                className={styles.productButton}
                onClick={() => handleProductClick(product)}
              >
                <img src={product.image} alt={product.name} className={styles.productImage} />
                <h2 className={styles.productName}>{product.description}</h2>
                <p className={styles.productPrice} style={{color: 'red', marginTop: 'auto'}}>{product.price} VNĐ</p>
              </button>
            ))
          ) : (
            <p>Đang tải sản phẩm...</p>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Shop Online. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="/">Trang Chủ</a>
          <a href="/products">Sản Phẩm</a>
          <a href="/contact">Liên Hệ</a>
          <a href="/about">Giới Thiệu</a>
        </div>
      </footer>

      {selectedProduct && (
        <ProductsModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
          onAddToCart={handleAddToCart} 
          onBuyNow={handleBuyNow} 
        />
      )}
    </div>
  );
}

export default UIPage;
