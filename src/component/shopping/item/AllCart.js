import React, { useContext, useEffect, useState } from 'react';
import { createBill, getAllCart } from '../../../untills/api';
import { AuthContext } from '../../../untills/context/AuthContext';
import { Radio, Button, message } from 'antd'; // Import Ant Design components
import styles from './AllCart.module.css'; 

function AllCart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGioHang = async () => {
      if (!user || !user._id) {
        setError('Không tìm thấy thông tin người dùng');
        setLoading(false);
        return;
      }

      try {
        const data = await getAllCart(user._id); 
        if (!data || !data.items) {
          throw new Error("Không có giỏ hàng.");
        }
        setCart(data);
      } catch (error) {
        setError(error.response?.data?.message || "Giỏ hàng trống");
      } finally {
        setLoading(false);
      }
    };
    fetchGioHang();
  }, [user]);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prev) => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const totalAmount = selectedItems.length > 0 ? 
    cart?.items
      .filter(item => selectedItems.includes(item._id))
      .reduce((total, item) => total + item.totalPrice, 0) : 0;

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      message.warning('Vui lòng chọn sản phẩm để thanh toán.');
      return;
    }

    try {
      await createBill(user._id, paymentMethod, selectedItems);
      message.success(`Hóa đơn đã được tạo thành công. Tổng số tiền: ${totalAmount} VND. Phương thức thanh toán: ${paymentMethod}`);

      // Cập nhật giỏ hàng sau khi thanh toán thành công
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter(item => !selectedItems.includes(item._id))
      }));
      setSelectedItems([]); // Reset selected items
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo hóa đơn, vui lòng thử lại.');
      console.error('Lỗi khi tạo hóa đơn:', error);
    }
  };

  const handleProductClick = (item) => {
    setSelectedProduct(item); 
  };

  const closeModal = () => {
    setSelectedProduct(null); 
  };

  if (loading) {
    return <p>Đang tải giỏ hàng...</p>;
  }

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

          {/* Thêm tùy chọn chọn phương thức thanh toán */}
          <label htmlFor="paymentMethod">Chọn phương thức thanh toán:</label>
          <Radio.Group 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)} 
            style={{ marginBottom: '10px', display: 'block' }} // Đảm bảo chúng nằm trên cùng
          >
            <Radio value="Cash">Tiền mặt</Radio>
            <Radio value="Card">Thẻ</Radio>
          </Radio.Group>

          <Button 
            type="primary" 
            style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }} 
            onClick={handleCheckout}
          >
            Thanh toán
          </Button>
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
                <p>Giá: {selectedProduct.currentPrice} VND</p>
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
