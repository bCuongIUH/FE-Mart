// import { useContext, useState } from 'react';
// import { getAddToCart } from '../../untills/api'; 
// import styles from './ProductsModel.module.css';
// import { AuthContext } from '../../untills/context/AuthContext';

// function ProductsModal({ product, onClose, onBuyNow }) {
//   const { user } = useContext(AuthContext); 
//   const [quantity, setQuantity] = useState(1); 
//   const maxQuantity = product.quantity || 0; 
//   const [cart, setCart] = useState([]);

//   const handleClickOutside = (e) => {
//     if (e.target.classList.contains(styles.modalOverlay)) {
//       onClose();
//     }
//   };

//   const onAddToCart = async () => {
//     try {
//       if (!user || !user._id) {
//         return console.error('User chưa đăng nhập');
//       }

//       if (!product || !product._id) {
//         return console.error('Sản phẩm không hợp lệ');
//       }
//       const cartData = await getAddToCart(user._id, product._id, quantity);

//       setCart(cartData.items);
//       console.log('Sản phẩm đã thêm vào giỏ hàng:', cartData);

//     } catch (error) {
//       console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
//     }
//   };

//   const handleQuantityChange = (e) => {
//     const value = parseInt(e.target.value);
//     if (value > 0 && value <= maxQuantity) {
//       setQuantity(value);
//     }
//   };

//   const incrementQuantity = () => {
//     if (quantity < maxQuantity) {
//       setQuantity(prev => prev + 1);
//     }
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       setQuantity(prev => prev - 1);
//     }
//   };

//   return (
//     <div className={styles.modalOverlay} onClick={handleClickOutside}>
//       <div className={styles.modalContent}>
//         <button className={styles.closeButton} onClick={onClose}>&times;</button>
//         <div className={styles.modalBody}>
//           <img src={product.image} alt={product.name} className={styles.modalImage} />
//           <div className={styles.modalDetails}>
//             <h2 className={styles.modalTitle}>{product.name}</h2>
//             <p className={styles.modalDescription}>{product.description}</p>
//             <p className={styles.modalPrice}>{product.currentPrice} VNĐ</p>
//             <div className={styles.quantityControl}>
//               <p><strong>Số lượng có sẵn:</strong> {maxQuantity}</p>
//               <div className={styles.quantityButtons}>
//                 <button onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
//                 <input
//                   type="number"
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   min="1"
//                   max={maxQuantity}
//                   className={styles.quantityInput}
//                 />
//                 <button onClick={incrementQuantity} disabled={quantity >= maxQuantity}>+</button>
//               </div>
//             </div>
//             <div className={styles.modalActions}>
//               <button className={styles.addToCartButton} onClick={onAddToCart}>
//                 Thêm vào giỏ hàng
//               </button>
//               <button className={styles.buyNowButton} onClick={() => onBuyNow(product)}>
//                 Mua Ngay
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProductsModal;
import { useContext, useState } from "react";
import { getAddToCart } from "../../untills/api";
import { AuthContext } from "../../untills/context/AuthContext";
import { message } from "antd"; // Import message từ Ant Design
import { Modal, Button } from "react-bootstrap"; // Import Modal từ React-Bootstrap

function ProductsModal({ product, onClose, onBuyNow }) {
  const { user } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = product.quantity || 0; // Lấy số lượng từ product.quantity
  const [cart, setCart] = useState([]);

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const onAddToCart = async () => {
    try {
      if (!user || !user._id) {
        return message.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      }

      if (!product || !product._id) {
        return message.error("Sản phẩm không hợp lệ");
      }

      const cartData = await getAddToCart(user._id, product._id, quantity);
      setCart(cartData.items);

      message.success("Sản phẩm đã được thêm vào giỏ hàng");
    } catch (error) {
      message.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
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
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modalContent" style={{ display: "flex" }}>
          <div
            className="imageContainer"
            style={{ flex: 1, marginRight: "20px" }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "auto",
                border: "1px solid #ccc",
              }}
            />
            <p style={{ fontSize: "12px", textAlign: "center", color: "gray" }}>
              * Hình ảnh chỉ mang tính chất minh họa *
            </p>
          </div>
          <div
            className="modalDetails"
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
              {product.name}
            </h2>
            <p style={{ fontSize: "18px", marginBottom: "10px" }}>
              {product.description}
            </p>
            <p style={{ fontSize: "22px", marginBottom: "15px" }}>
              {product.currentPrice ? (
                <span style={{ fontWeight: "bold" }}>
                  {formatPrice(product.currentPrice)}
                </span>
              ) : (
                <span>Giá không có sẵn</span>
              )}
            </p>
            <div style={{ marginBottom: "20px" }}>
              <p>
                <strong>Số lượng có sẵn:</strong> {maxQuantity}
              </p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  style={{
                    backgroundColor: "#0046ad", // Màu xanh
                    borderColor: "#0046ad", // Màu xanh cho viền
                  }}
                >
                  -
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={maxQuantity}
                  style={{
                    width: "50px",
                    textAlign: "center",
                    margin: "0 10px",
                  }}
                />
                <Button
                  onClick={incrementQuantity}
                  disabled={quantity >= maxQuantity}
                  style={{
                    backgroundColor: "#0046ad", // Màu xanh
                    borderColor: "#0046ad", // Màu xanh cho viền
                  }}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{
            backgroundColor: "#0046ad", // Màu xanh cho nút
            borderColor: "#0046ad", // Màu xanh cho viền nút
          }}
          onClick={onAddToCart}
        >
          Thêm vào giỏ hàng
        </Button>
        <Button
          style={{
            backgroundColor: "#0046ad", // Màu xanh cho nút
            borderColor: "#0046ad", // Màu xanh cho viền nút
          }}
          onClick={onClose}
        >
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductsModal;
