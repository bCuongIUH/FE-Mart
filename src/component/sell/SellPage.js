import React, { useContext, useEffect, useState } from "react";
import { createDirectSaleBill, getAllProducts } from "../../untills/api"; 
import styles from "./SellPage.module.css"; 
import { AuthContext } from "../../untills/context/AuthContext";
import { useNavigate } from "react-router-dom";

function SellPage ()  {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [quantity, setQuantity] = useState(1); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false); 
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); 

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getAllProducts();
        setProducts(productList);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };
    fetchProducts();
  }, []);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setQuantity(1); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  const addToCart = () => {
    if (selectedProduct) {
   
      if (quantity > selectedProduct.lines[0]?.quantity) {
        alert("Số lượng yêu cầu vượt quá số lượng tồn kho!");
        return;
      }
  
      const linePrice = selectedProduct.lines[0]?.unitPrice || 0;
      const totalItemPrice = linePrice * quantity;
      const updatedCart = [...cart, { ...selectedProduct, unitPrice: linePrice, quantity }];
      setCart(updatedCart);
      setTotalPrice(totalPrice + totalItemPrice);
      closeModal(); 
    }
  };
  
  const removeFromCart = (index) => {
    const removedProductPrice = cart[index].unitPrice * cart[index].quantity;
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    setTotalPrice(totalPrice - removedProductPrice);
  };

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true); 
  };

  const confirmPayment = async () => {
    try {
    
      const items = cart.map(item => ({
        product: item._id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      }));

      //tạo
      const response = await createDirectSaleBill(paymentMethod, items);
      console.log("Hóa đơn tạo thành công:", response);
      
      setCart([]); 
      setTotalPrice(0);
      setIsCheckoutModalOpen(false); 
      alert("Thanh toán thành công!");
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Thanh toán thất bại!");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles["sell-container"]}>
      {/* <div className={styles["sell-header"]}>
        <button className={styles["sell-header-title"]} onClick={handleBack}>C'Mart</button>
        <h1>Giao diện bán hàng</h1>
      </div> */}

      <div className={styles["sell-content"]}>
        {/* sản phẩm */}
        <div className={styles["sell-product-list"]}>
          <h2>Danh sách sản phẩm</h2>
          <div className={styles["sell-product-grid"]}>
            {products.map((product) => (
              <div key={product._id} className={styles["sell-product-item"]}>
                <h3>{product.name}</h3>
                <p>Giá: {product.lines[0]?.unitPrice || 0} VND</p>
                <p>Số lượng tồn: {product.lines[0]?.quantity || 0}</p>
                <button onClick={() => openModal(product)}>Thêm vào giỏ</button>
              </div>
            ))}
          </div>
        </div>

{/* list */}
        <div className={styles["sell-cart"]}>
          <h2>Giỏ hàng</h2>
          <div className={styles["sell-cart-list"]}>
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className={styles["sell-cart-item"]}>
                  <h4>{item.name}</h4>
                  <p>Giá: {item.unitPrice} VND</p>
                  <p>Số lượng: {item.quantity}</p>
                  <button className={styles["remove-item"]} onClick={() => removeFromCart(index)}>-</button>
                </div>
              ))
            ) : (
              <p>Chưa có đơn hàng</p>
            )}
          </div>

          <div className={styles["sell-checkout"]}>
            <h3>Tổng tiền: {totalPrice} VND</h3>
            <button onClick={handleCheckout}>Thanh toán</button>
          </div>
        </div>
      </div>

      {isModalOpen && selectedProduct && (
        <div className={styles["modal"]}>
          <div className={styles["modal-content"]}>
            <h3>{selectedProduct.name}</h3>
            <p>Giá: {selectedProduct.lines[0]?.unitPrice || 0} VND</p>
            <p>Số lượng tồn kho: {selectedProduct.lines[0]?.quantity || 0}</p>
            <label>
              Số lượng:
              <input
                type="number"
                min="1"
                max={selectedProduct.lines[0]?.quantity}
                value={quantity}
                onChange={handleQuantityChange}
              />
            </label>
            <button onClick={addToCart}>Thêm vào giỏ</button>
            <button onClick={closeModal}>Hủy</button>
          </div>
        </div>
      )}


      {isCheckoutModalOpen && (
        <div className={styles["modal"]}>
          <div className={styles["modal-content"]}>
            <h3>Xác nhận thanh toán</h3>
            <p>Tổng tiền: {totalPrice} VND</p>
            <label>
              Phương thức thanh toán:
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="Cash">Tiền mặt</option>
                <option value="Card">Thẻ</option>
              </select>
            </label>
            <button onClick={confirmPayment}>Xác nhận</button>
            <button onClick={() => setIsCheckoutModalOpen(false)}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellPage;
