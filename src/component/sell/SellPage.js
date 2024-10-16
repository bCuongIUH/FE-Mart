import React, { useContext, useEffect, useState } from "react";
import { createDirectSaleBill, getAllProducts } from "../../untills/api"; 
import { AuthContext } from "../../untills/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Modal, message, Select, Input, Card, Row, Col, Table } from "antd";
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Option } = Select;

function SellPage() {
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
        message.error("Lỗi khi lấy sản phẩm: " + error.message);
      }
    };
    fetchProducts();
  }, []); 

  
console.log(products);

  const handleOutsideClick = (event) => {
    if (event.target.closest('.product-card')) return; 
    setSelectedProduct(null);
  };

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
      if (quantity > selectedProduct.quantity) {
        message.warning("Số lượng yêu cầu vượt quá số lượng tồn kho!");
        return;
      }
  
      const existingProductIndex = cart.findIndex(item => item._id === selectedProduct._id);
      if (existingProductIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingProductIndex].quantity += quantity;
        setCart(updatedCart);
      } else {
        const linePrice = selectedProduct.currentPrice || 0;
        const totalItemPrice = linePrice * quantity;
        const updatedCart = [...cart, { ...selectedProduct, currentPrice: linePrice, quantity }];
        setCart(updatedCart);
        setTotalPrice(totalPrice + totalItemPrice);
      }
  
      closeModal(); 
      message.success("Sản phẩm đã được thêm vào giỏ hàng!");
    }
  };
  
  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);

    const removedProduct = cart[index];
    const removedProductPrice = removedProduct.currentPrice * removedProduct.quantity;
    setTotalPrice(prevTotal => prevTotal - removedProductPrice);
    
    message.success("Sản phẩm đã được xóa khỏi giỏ hàng!");
  };
  
  const handleCheckout = () => {
    setIsCheckoutModalOpen(true); 
  };

  const confirmPayment = async () => {
    try {
      const items = cart.map(item => ({
        product: item._id,
        quantity: item.quantity,
        currentPrice: item.currentPrice,
        totalPrice: item.currentPrice * item.quantity,
      }));

      const response = await createDirectSaleBill(paymentMethod, items);
      console.log("Hóa đơn tạo thành công:", response);
      
      setCart([]); 
      setTotalPrice(0);
      setIsCheckoutModalOpen(false); 
      message.success("Thanh toán thành công!");
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      message.error("Thanh toán thất bại! Vui lòng thử lại.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ display: 'flex', padding: '20px' }} onClick={handleOutsideClick}>
      {/* Phần bên trái: Danh sách sản phẩm */}
      <div style={{ flex: 1, marginRight: '20px' }}>
        <h2>Danh sách sản phẩm</h2>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col span={8} key={product._id}>
              <Card 
                title={product.name}
                cover={<img alt={product.name} src={product.image} style={{ height: 150, objectFit: 'cover' }} />}
               
                style={{ width: '100%', cursor: 'pointer' }}
                onClick={() => openModal(product)}
                className="product-card"
              >
                <p>Giá: {product.currentPrice || 0} VND</p>
                <p>Số lượng tồn: {product.quantity || 0}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Phần bên phải: Giỏ hàng và thanh toán */}
      <div style={{ flex: 1 }}>
        <h2>Giỏ hàng <ShoppingCartOutlined style={{ fontSize: '24px' }} /></h2>
        
        {/* Giỏ hàng */}
        <Table
          dataSource={cart}
          rowKey="_id"
          pagination={false}
          columns={[
            { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
            { title: 'Giá', dataIndex: 'currentPrice', key: 'currentPrice', render: (text) => `${text} VND` },
            { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
            {
              title: 'Hành động',
              key: 'action',
              render: (_, record, index) => (
                <Button onClick={() => removeFromCart(index)}>Xóa</Button>
              ),
            },
          ]}
        />

        <h3>Tổng tiền: {totalPrice} VND</h3>
        
        {/* Thanh toán */}
        <Col
          pagination={false}
          style={{ marginTop: '20px' }}
        >
          <tbody>
            <tr>
              <td>Tổng tiền:</td>
              <td>{totalPrice} VND</td>
            </tr>
            <tr>
              {/* <td>Phương thức thanh toán:</td> */}
              <td>
                <Select 
                  value={paymentMethod} 
                  onChange={(value) => setPaymentMethod(value)} 
                  style={{ width: "100%", marginBottom: 16 }}
                >
                  <Option value="Cash">Tiền mặt</Option>
                  <Option value="Card">Thẻ</Option>
                </Select>
              </td>
            </tr>
          </tbody>
        </Col>
        
        <Button type="primary" onClick={handleCheckout}>Thanh toán</Button>
      </div>

      {/* Modal thêm sản phẩm */}
      <Modal
        title="Thông tin chi tiết sản phẩm"
        visible={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <h3>{selectedProduct?.name}</h3>
        <img alt={selectedProduct?.name} src={selectedProduct?.image} style={{ height: 150, objectFit: 'cover' }} />
        <p>Mã sản phẩm: {selectedProduct?.code}</p>
        <p>Barcode: {selectedProduct?.barcode}</p>
        <p>Giá: {selectedProduct?.currentPrice || 0} VND</p>
        <p>Số lượng tồn kho: {selectedProduct?.quantity || 0}</p>
        <Input
          type="number"
          min="1"
          max={selectedProduct?.quantity}
          value={quantity}
          onChange={handleQuantityChange}
        />
        <Button type="primary" onClick={addToCart}>Thêm vào giỏ</Button>
        {/* <Button onClick={closeModal}>Hủy</Button> */}
      </Modal>

      {/* Modal xác nhận thanh toán */}
              <Modal
          title="Xác nhận thanh toán"
          visible={isCheckoutModalOpen}
          onCancel={() => setIsCheckoutModalOpen(false)}
          footer={null}
        >
          <p>Tổng tiền: {totalPrice} VND</p>
          {/* Hiện thị thông tin giỏ hàng */}
          <Table
            dataSource={cart}
            rowKey="_id"
            pagination={false}
            columns={[
              { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
              { title: 'Giá', dataIndex: 'currentPrice', key: 'currentPrice', render: (text) => `${text} VND` },
              { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
              { title: 'Thành tiền', render: (text, record) => `${record.currentPrice * record.quantity} VND` }
            ]}
          />
          <h3>Tổng tiền: {totalPrice} VND</h3>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button type="primary" onClick={confirmPayment}>Xác nhận</Button>
          </div>
        </Modal>
    </div>
  );
}

export default SellPage;
