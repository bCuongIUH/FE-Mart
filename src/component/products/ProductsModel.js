import { useContext, useState } from 'react';

import { getAddToCart } from '../../untills/api'; 
import styles from './ProductsModel.module.css';
import { AuthContext } from '../../untills/context/AuthContext';

function ProductsModal({ product, onClose, onBuyNow }) {
  const { user } = useContext(AuthContext); 
  const [quantity, setQuantity] = useState(1); 
  const maxQuantity = product.lines[0]?.quantity || 0; 
  const [cart, setCart] = useState([]);

  const handleClickOutside = (e) => {
    if (e.target.classList.contains(styles.modalOverlay)) {
      onClose();
    }
  };

  const onAddToCart = async () => {
    try {
      if (!user || !user._id) {
        return console.error('User chưa đăng nhập');
      }

      if (!product || !product._id) {
        return console.error('Sản phẩm không hợp lệ');
      }
      const cartData = await getAddToCart(user._id, product._id, quantity);

      setCart(cartData.items);
      console.log('Sản phẩm đã thêm vào giỏ hàng:', cartData);

    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    }
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
