import React, { useContext, useEffect, useState } from 'react';
import { getDamuaCart } from '../../../untills/api'; 
import { AuthContext } from '../../../untills/context/AuthContext';
import styles from './completedCart.module.css';

function CompletedCartUser() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      if (!user || !user._id) {
        setError('Không tìm thấy thông tin người dùng');
        return;
      }

      try {
        const data = await getDamuaCart(user._id);
       
        const updatedOrders = data.map(order => {
          const totalPrice = (order.items || []).reduce((total, item) => {
            if (item.product) {
              return total + item.currentPrice * item.quantity; 
            }
            return total;
          }, 0);
          
          return { ...order, totalPrice }; 
        });

        setOrders(updatedOrders);
        console.log('Đơn hàng đã hoàn thành:', updatedOrders);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu đơn hàng');
        console.error(error);
      }
    };
    fetchCompletedOrders();
  }, [user]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div>
      <h2>Đơn hàng đã hoàn thành</h2>
      {error && <p>{error}</p>}
      {orders.length === 0 ? (
        <p>Không có đơn hàng nào đã hoàn thành.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id} className={styles.orderItem} onClick={() => handleOrderClick(order)}>
              <p>Mã đơn hàng: {order._id}</p>
              <p>Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Tổng tiền: {order.totalPrice} VND</p>
              <p>Trạng thái: {order.status}</p>
            </li>
          ))}
        </ul>
      )}
      {selectedOrder && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.close} onClick={closeModal}>&times;</span>
            <h2>Chi tiết đơn hàng</h2>
            <p>Mã đơn hàng: {selectedOrder._id}</p>
            <p>Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
            <p>Tổng tiền: {selectedOrder.totalPrice} VND</p>
            <p>Trạng thái: {selectedOrder.status}</p>
            <h3>Sản phẩm:</h3>
            <ul>
              {selectedOrder.items.map((item) => (
                <li key={item._id} className={styles.productItem}>
                  {item.product ? (
                    <div className={styles.productDetails}>
                      <img src={item.product.image} alt={item.product.name} className={styles.productImage} />
                      <div className={styles.productInfo}>
                        <p>Tên sản phẩm: {item.product.name}</p>
                        <p>Số lượng: {item.quantity}</p>
                        <p>Giá: {item.currentPrice} VND</p>
                      </div>
                    </div>
                  ) : (
                    <p>Thông tin sản phẩm không khả dụng.</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompletedCartUser;