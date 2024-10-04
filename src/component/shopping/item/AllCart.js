import React, { useContext, useEffect, useState } from 'react';
import { getAllCart } from '../../../untills/api';
import { AuthContext } from '../../../untills/context/AuthContext';
import styles from './AllCart.module.css'; 

function AllCart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); 

  useEffect(() => {
    const fetchGioHang = async () => {
      if (!user || !user._id) {
        setError('Không tìm thấy thông tin người dùng');
        return;
      }

      try {
        const data = await getAllCart(user._id); 
        setCart(data);
        console.log('Dữ liệu giỏ hàng:', data); 
      } catch (error) {
        setError("giỏ hàng trống");
        // console.error(error);
      }
    };
    fetchGioHang();
  }, [user]);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prev) => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const totalAmount = cart?.items
    .filter(item => selectedItems.includes(item._id))
    .reduce((total, item) => total + item.totalPrice, 0);

  const handleCheckout = () => {
    alert(`Tổng số tiền cần thanh toán: ${totalAmount} VND`);
  };

  const handleProductClick = (item) => {
    setSelectedProduct(item); 
  };

  const closeModal = () => {
    setSelectedProduct(null); 
  };

  return (
    <div>
      <h2>Giỏ hàng của bạn</h2>
      {error && <p>{error}</p>}
      {cart && cart.items && cart.items.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <ul>
          {cart && cart.items && cart.items.map((item) => (
            <li key={item._id} className={styles.cartItem}>
              {/* Kiểm tra item.product trước khi truy cập thuộc tính image */}
              {item.product ? (
                <>
                  <img src={item.product.image} alt={item.product.name} className={styles.cartItemImage} />
                  <div className={styles.productDetails}>
                    <span 
                      className={styles.productName} 
                      onClick={() => handleProductClick(item)} 
                    >
                      {item.product.name}
                    </span>
                    <p className={styles.productDescription}>{item.product.description}</p>
                    <p className={styles.quantity}>SL: {item.quantity}</p> 
                  </div>
                  <p className={styles.price}>Thành giá: {item.totalPrice} VND</p> 
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(item._id)} 
                    onChange={() => handleCheckboxChange(item._id)} 
                    className={styles.checkbox} 
                  />
                </>
              ) : (
                <p>Thông tin sản phẩm không khả dụng.</p>
              )}
            </li>
          ))}
        </ul>
      )}
      {selectedItems.length > 0 && (
        <div className={styles.checkout}>
          <p>Tổng số tiền cần thanh toán: {totalAmount} VND</p>
          <button onClick={handleCheckout}>Thanh toán</button>
        </div>
      )}
      {selectedProduct && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.close} onClick={closeModal}>&times;</span>
            <h2>Chi tiết sản phẩm</h2>
            
            {selectedProduct.product ? (
              <>
                <img src={selectedProduct.product.image} alt={selectedProduct.product.name} className={styles.modalImage} />
                <p>Tên: {selectedProduct.product.name}</p>
                <p>Mô tả: {selectedProduct.product.description}</p>
                <p>Giá: {selectedProduct.unitPrice} VND</p>
                <p>Số lượng: {selectedProduct.quantity}</p>
                <p>Tổng giá: {selectedProduct.totalPrice} VND</p>
              </>
            ) : (
              <p>Thông tin sản phẩm không khả dụng.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AllCart;
