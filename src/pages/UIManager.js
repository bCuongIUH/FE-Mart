import React, { useEffect, useState, useContext } from 'react';
import { getAllProducts } from '../untills/api'; 
import styles from './UIManager.module.css'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../untills/context/AuthContext';

const UIManager = () => {
  const { user, logout } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
console.log(user);

  const handleNavigate = (path) => {
    navigate(path); 
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getAllProducts();
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className={styles.uiManager}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Quản lí siêu thị</h1>
        <div className={styles.headerRight}>
          <img
            src="https://res.cloudinary.com/dhpqoqtgx/image/upload/v1726249497/ke78gjlzmk0epm2mv77s.jpg" // default avatar image
            alt="User Avatar"
            className={styles.avatar}
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className={styles.dropdown}>
              <ul className={styles.dropdownUl}>
                <li className={styles.dropdownLi}><a href="/profile">Thông tin</a></li>
                <li className={styles.dropdownLi}><a href="/settings">Cài đặt</a></li>
                <li className={styles.dropdownLi}><a href="/cart">Giỏ hàng</a></li>
                <li className={`${styles.dropdownLi} ${styles.dropdownLiLast}`} onClick={handleLogout}>Đăng xuất</li>
              </ul>
            </div>
          )}
        </div>
      </header>
      
      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <button className={styles.sidebarButton} onClick={() => handleNavigate('/manage-products')}>Quản lí sản phẩm</button>
          <button className={styles.sidebarButton} onClick={() => handleNavigate('/WarehouseManager')}>Quản lí kho</button>
          <button className={styles.sidebarButton} onClick={() => handleNavigate('/ManageEmployees')}>Quản lí nhân viên</button>
          <button className={styles.sidebarButton} onClick={() => handleNavigate('/manage-vouchers')}>Quản lí voucher</button>
          <button className={styles.sidebarButton} onClick={() => handleNavigate('/khuyen-mai')}>Chương trình khuyến mãi</button>
          <button className={styles.sidebarButton} onClick={() => handleNavigate('/statistics')}>Thống kê</button>


        </aside>
        {/* <main className={styles.productList}>
          {products.map((product) => (
            <div className={styles.productCard} key={product.id}>
              <img src={product.image} alt={product.name} className={styles.productImage} />
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className={styles.productPrice}>{product.price} VND</p>
              </div>
            </div>
          ))}
        </main> */}
      <div>
       code phần giao diện 
      </div>
      </div>
    </div>
  );
};

export default UIManager;
