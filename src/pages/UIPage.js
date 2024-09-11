import React, { useContext } from 'react';
import '../pages/UIPage.css';
import { UserContext } from '../untills/context/UserContext';

const products = [
  { id: 1, name: 'Sản phẩm 1', price: '100.000 VNĐ', image: 'path/to/product1.jpg' },
  { id: 2, name: 'Sản phẩm 2', price: '200.000 VNĐ', image: 'path/to/product2.jpg' },
  { id: 3, name: 'Sản phẩm 3', price: '300.000 VNĐ', image: 'path/to/product3.jpg' },
  
];

//  console.log(user);
function UIPage() {
  
  return (
    <div className="ui-page">
      <header className="header">
        <h1>SOPPE</h1>
        <nav>
          <a href="/">Trang Chủ</a>
          <a href="/products">Giỏ Hàng</a>
          {/* <a href="/contact">Liên Hệ</a> */}
          <a href="/account">Tài Khoản</a>
        </nav>
      </header>

      <main className="main-content">
        <section className="product-list">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">{product.price}</p>
              <button className="btn-add-to-cart">Thêm Vào Giỏ</button>
            </div>
          ))}
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
