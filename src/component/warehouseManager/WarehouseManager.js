import React, { useContext, useState } from 'react';
import styles from './WarehouseManager.module.css';
import { AuthContext } from '../../untills/context/AuthContext';
import { useNavigate } from 'react-router-dom';

import AllProductsWarehouse from './item/AllProductsWarehouse';
import WarehouseImport from './item/WarehouseImport';

function WarehouseManager() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  // Cập nhật danh sách categories với component tương ứng cho từng subcategory
  const categories = [
    {
      name: 'Quản lý nhập kho',
      subcategories: [
        { name: 'Danh sách sản phẩm', component: <AllProductsWarehouse /> },
        { name: 'Tạo phiếu nhập kho', component: <WarehouseImport/> }, 
        { name: 'Quản lý nhà cung cấp', component: <div>Quản lý nhà cung cấp component</div> }, 
        { name: 'Xem lịch sử nhập kho', component: <div>Lịch sử nhập kho component</div> },
      ],
    },
    {
      name: 'Quản lý xuất kho',
      subcategories: [
        { name: 'Tạo phiếu xuất kho', component: <div>Tạo phiếu xuất kho component</div> },
        { name: 'Quản lý đơn vị vận chuyển', component: <div>Quản lý đơn vị vận chuyển component</div> }, 
        { name: 'Xem lịch sử xuất kho', component: <div>Lịch sử xuất kho component</div> },
      ],
    },
    {
      name: 'Kiểm kê kho',
      subcategories: [
        { name: 'Tạo phiếu kiểm kê', component: <div>Tạo phiếu kiểm kê component</div> }, 
        { name: 'Báo cáo hàng tồn kho', component: <div>Báo cáo hàng tồn kho component</div> }, 
        { name: 'Lịch sử kiểm kê', component: <div>Lịch sử kiểm kê component</div> },
      ],
    },
    {
      name: 'Báo cáo & Thống kê',
      subcategories: [
        { name: 'Báo cáo nhập xuất tồn', component: <div>Báo cáo nhập xuất tồn component</div> }, 
        { name: 'Báo cáo doanh thu', component: <div>Báo cáo doanh thu component</div> }, 
        { name: 'Thống kê tồn kho', component: <div>Thống kê tồn kho component</div> },
      ],
    },
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1); 
  };

  // Hàm xử lý khi nhấn vào subcategory
  const handleSubcategoryClick = (component) => {
    setSelectedComponent(component); 
  };

  return (
    <div className={styles.warehouseManager}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleGoBack}>
          Quay lại
        </button>
        <h1>Quản lý kho</h1>
        <div className={styles.account}>
          <img
            src="https://res.cloudinary.com/dhpqoqtgx/image/upload/v1726249497/ke78gjlzmk0epm2mv77s.jpg"
            alt="User Avatar"
            className={styles.avatar}
            onClick={toggleDropdown}
          />
          {showDropdown && (
            <div className={styles.dropdown}>
              <ul>
                <li><a href="/profile">Thông tin</a></li>
                <li><a href="/settings">Cài đặt</a></li>
                <li><a href="#" onClick={handleLogout}>Đăng xuất</a></li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.menu}>
          {categories.map((category, index) => (
            <div key={index} className={styles.category}>
              <button
                className={styles.categoryButton}
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
              </button>
              {selectedCategory === category.name && (
                <ul className={styles.subcategoryList}>
                  {category.subcategories.map((subcategory, idx) => (
                    <li 
                      key={idx} 
                      className={styles.subcategoryItem}
                      onClick={() => handleSubcategoryClick(subcategory.component)} 
                    >
                      {subcategory.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        
      
        <div className={styles.mainContent}>
          {selectedComponent ? (
            selectedComponent
          ) : (
            <p>Chọn mục quản lý để bắt đầu.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WarehouseManager;
