import React, { useContext, useState } from 'react';
import styles from './suppliers.module.css';
import { AuthContext } from '../../untills/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Suppliersimport from './item/suppliersImport';


function Suppliers() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  // Cập nhật danh sách categories với component tương ứng cho từng subcategory
  const categories = [
    {
      name: 'Quản lý nhà cung cấp',
      subcategories: [
        { name: 'Danh sách nhà cung cấp', component: <div>lấy ds nhà cung cấp</div> },
      
        { name: 'Quản lý nhà cung cấp', component: <Suppliersimport /> }, 
       
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
    setSelectedComponent(component); // Cập nhật component được chọn
  };

  return (
    <div className={styles.warehouseManager}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleGoBack}>
          Quay lại
        </button>
        <h1>Quản lý nhà cung cấp</h1>
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
                      onClick={() => handleSubcategoryClick(subcategory.component)} // Xử lý hiển thị component tương ứng
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

export default Suppliers;
