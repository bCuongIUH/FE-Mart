
import styles from './ProductsModel.module.css';
import React, { useState } from 'react';
function ProductsModal({ product, onClose, onBuyNow }) {
  const [quantity, setQuantity] = useState(1); 
  const maxQuantity = product.lines[0]?.quantity || 0; 
  const [cart, setCart] = useState([]);
  const handleClickOutside = (e) => {
    if (e.target.classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  // const onAddToCart = () => {
  //   console.log(`Thêm vào giỏ hàng: ${product.name}, số lượng: ${quantity}`);
   
  // };
  const onAddToCart = (product, quantity) => {
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa
    const existingProductIndex = cart.findIndex(item => item._id === product._id);

    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã có, tăng số lượng
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
     
      setCart([...cart, { ...product, quantity }]);
    }

    console.log('Sản phẩm đã thêm vào giỏ hàng:', cart);
  };


  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  console.log("ở đây 1", product);
  
  console.log("ở đây",product.lines);
  

  return (
    <div className={styles.modalOverlay} onClick={handleClickOutside}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2 className={styles.modalTitle}>{product.name}</h2>
        <img src={product.image} alt={product.name} className={styles.modalImage} />
        <p className={styles.modalDescription}>{product.description}</p>
        <p className={styles.modalPrice}>{product.lines[0]?.unitPrice} VNĐ</p>

        <div className={styles.quantityControl}>
          <p><strong>Số lượng có sẵn:</strong> {maxQuantity}</p>
          <div className={styles.quantityButtons}>
            <button onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              max={maxQuantity}
              className={styles.quantityInput}
            />
            <button onClick={incrementQuantity} disabled={quantity >= maxQuantity}>+</button>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.addToCartButton} onClick={onAddToCart}>
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
