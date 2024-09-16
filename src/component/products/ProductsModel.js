import React from 'react';
import styles from './ProductsModel.module.css';

function ProductsModal({ product, onClose, onAddToCart, onBuyNow }) {
    // Handle click outside the modal to close it
    const handleClickOutside = (e) => {
      if (e.target.classList.contains(styles.modalOverlay)) {
        onClose();
      }
    };
  
    return (
      <div className={styles.modalOverlay} onClick={handleClickOutside}>
        <div className={styles.modalContent}>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
          <h2 className={styles.modalTitle}>{product.name}</h2>
          <img src={product.image} alt={product.name} className={styles.modalImage} />
          <p className={styles.modalDescription}>{product.description}</p>
          <p className={styles.modalPrice}>{product.price} VNĐ</p>
          
          <div className={styles.modalActions}>
            <button className={styles.addToCartButton} onClick={() => onAddToCart(product)}>
              Thêm vào giỏ hàng
            </button>
            <button className={styles.buyNowButton} onClick={() => onBuyNow(product)}>
              Mua Ngay
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default ProductsModal;