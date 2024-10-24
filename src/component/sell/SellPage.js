import React, { useContext, useEffect, useState } from "react";
import {
  createDirectSaleBill,
  getAllProductsPOP,
  getCategories,
} from "../../untills/api";
import { AuthContext } from "../../untills/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Modal,
  message,
  Select,
  Input,
  Card,
  Row,
  Col,
  Table,
  Checkbox, Radio,Popover
} from "antd";
import { GiftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import ProductsModal from "../products/ProductsModel";
import ProductsModalAdmin from "../sell/ProductsModalAdmin";
import { getActivePromotionPrograms } from "../../services/promotionProgramService";
import { getVoucherByPromotionProgramId } from "../../services/voucherService";

const { Option } = Select;
const { Search } = Input;

function SellPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const { user } = useContext(AuthContext);
  const [promotionactive, setPromotionactive]  = useState([]);
  const [filteredPromotionactive, setFilteredPromotionactive] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const navigate = useNavigate();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isVoucherVisible, setIsVoucherVisible] = useState(false);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productList = await getAllProductsPOP();
        setProducts(productList);
        setFilteredProducts(productList);

        const categoryList = await getCategories();
        console.log("Categories fetched: ", categoryList);
        setCategories(categoryList.categories);

        const promotionActiveList = await getActivePromotionPrograms();
        setPromotionactive(promotionActiveList);
        setFilteredPromotionactive(promotionActiveList);

        // Lấy voucher cho từng chương trình khuyến mãi đang hoạt động
        const vouchersPromises = promotionActiveList.map(async (promotion) => {
          const vouchersForPromotion = await getVoucherByPromotionProgramId(promotion._id);
          return { promotionId: promotion._id, vouchers: vouchersForPromotion };
        });

        // Chờ tất cả các yêu cầu lấy voucher hoàn thành
        const fetchedVouchers = await Promise.all(vouchersPromises);
        setVouchers(fetchedVouchers);
      } catch (error) {
        message.error("Lỗi khi lấy dữ liệu: " + error.message);
      }
    };

    fetchProductsAndCategories();
  }, []);

  console.log("Khuyến mãi active:", promotionactive);
  console.log("Vouchers:", vouchers);



  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cart.reduce((acc, item) => {
        const unitValue = item.unit ? item.unit.value : 1; 
        return acc + item.currentPrice * unitValue * item.quantity;
      }, 0);
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [cart]);

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
  };

 // Xử lý khi chọn danh mục

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (!categoryId) {
      setFilteredProducts(products); 
    } else {
      const filtered = products.filter(product => product.category === categoryId);
      setFilteredProducts(filtered);
    }
  };
  



  const handleSearchChange = (searchValue) => {
    setSearchText(searchValue);
    filterProducts(selectedCategory, searchValue);
  };

  const filterProducts = (categoryId, searchValue) => {
    let filtered = products;

    if (categoryId) {
      filtered = filtered.filter(
        (product) => product.categoryId === categoryId
      );
    }

    if (searchValue) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const openModal = (product) => {
    if (product.quantity <= 0) {
      message.warning("Sản phẩm đã hết vui lòng chọn sản phẩm khác!");
      return;
    }
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
    if (!selectedProduct) {
      message.warning("Chưa chọn sản phẩm!");
      return;
    }
  
    // Kiểm tra xem đã chọn đơn vị chưa
    if (!selectedUnit) {
      message.warning("Vui lòng chọn đơn vị!");
      return;
    }
  
    if (
      selectedProduct.currentPrice == null ||
      selectedProduct.currentPrice <= 0
    ) {
      message.warning(
        "Sản phẩm có giá trị bằng 0 hoặc không hợp lệ không thể thêm vào giỏ hàng!"
      );
      return;
    }
  
    if (quantity > selectedProduct.quantity) {
      message.warning("Số lượng yêu cầu vượt quá số lượng tồn kho!");
      return;
    }
  
    const existingProductIndex = cart.findIndex(
      (item) =>
        item._id === selectedProduct._id && item.unit.name === selectedUnit.name
    );
  
    const unitName = selectedUnit ? selectedUnit.name : "Không có"; // Lấy thông tin đơn vị
    const unitValue = selectedUnit ? selectedUnit.value : 1; // Lấy thông tin đơn vị
  
    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      const updatedCart = [
        ...cart,
        {
          ...selectedProduct,
          currentPrice: selectedProduct.currentPrice,
          quantity,
          unit: { name: unitName, value: unitValue },
        }, // Lưu thêm đơn vị
      ];
      setCart(updatedCart);
    }
  
    closeModal();
    setSelectedUnit(null);
    message.success("Sản phẩm đã được thêm vào giỏ hàng!");
  };
  

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);

    const removedProduct = cart[index];
    const removedProductPrice =
      removedProduct.currentPrice * removedProduct.quantity;
    setTotalPrice((prevTotal) => prevTotal - removedProductPrice);

    message.success("Sản phẩm đã được xóa khỏi giỏ hàng!");
  };


  //check vào phương thức thanh toán 
  const handleCheckout = async () => {
    setIsCheckoutModalOpen(true); 
    if (!paymentMethod) {
      message.warning("Vui lòng chọn phương thức thanh toán!");
      return;
    }
  
  };
  
  // Ví dụ hàm để chọn voucher
const handleVoucherSelection = (voucher) => {
  setSelectedVoucher(voucher); // Cập nhật selectedVoucher khi người dùng chọn
};
console.log("log",products);

const confirmPayment = async () => {
  try {
    const items = cart.map((item) => {
      // Lấy giá trị đơn vị tính (value)
      const unitValue = item.units[0].details[0].value; // Giả sử chỉ có một đơn vị tính và một chi tiết

      // Tính toán số lượng thực tế
      const actualQuantity = item.quantity * unitValue;

      return {
        product: item._id,
        name: item.name,
        quantity: actualQuantity, // Sử dụng số lượng thực tế
        currentPrice: item.currentPrice,
        unitDetailId: item.unitDetailId,
        totalPrice: item.currentPrice * actualQuantity, // Tính tổng giá trị dựa trên số lượng thực tế
        createBy: user._id
      };
    });

    console.log("Phương thức thanh toán:", paymentMethod);

    // Tính toán tổng giá trị đơn hàng
    let totalOrderPrice = items.reduce((total, item) => total + item.totalPrice, 0);

    // Kiểm tra voucher và áp dụng nếu có
    if (selectedVoucher) {
      const { conditions } = selectedVoucher;
      const validCondition = conditions.find(condition => totalOrderPrice >= condition.minOrderValue);

      if (validCondition) {
        // Nếu điều kiện hợp lệ, áp dụng giảm giá
        totalOrderPrice -= validCondition.discountAmount;
        console.log(`Giảm giá ${validCondition.discountAmount} VND với voucher ${selectedVoucher.code}`);
      } else {
        message.warning("Giá trị đơn hàng không đủ để áp dụng voucher này.");
      }
    }

    // Gửi yêu cầu thanh toán với tổng giá trị đã cập nhật
    const response = await createDirectSaleBill(paymentMethod, items, totalOrderPrice);
    console.log("Hóa đơn tạo thành công:", response);

    // Xóa giỏ hàng và reset tổng giá trị
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

  const formatCurrency = (value) => {
    if (typeof value !== 'number' || isNaN(value)) {
      return '0 ₫';
    }
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  
// Hàm kiểm tra khi chọn checkbox

const handlePaymentMethodChange = (e) => {
  setPaymentMethod(e.target.value);
}

// Nội dung hiển thị khi người dùng nhấn vào icon khuyến mãi
const voucherContent = (
  <div>
    {vouchers.length > 0 ? (
      vouchers.map((voucher, index) => (
        <p key={index}>
          <strong>{voucher.promotionId}</strong>: Giảm {formatCurrency(voucher.discount)}
        </p>
      ))
    ) : (
      <p>Không có voucher khả dụng.</p>
    )}
  </div>
);

  return (
    <div style={{ display: "flex", padding: "20px" }}>
  {/* Phần bên trái: Danh sách sản phẩm */}
  <div
    style={{
      flex: 1,
      marginRight: "20px",
      height: "85vh",
      overflowY: "auto",
      border: "1px solid #f0f0f0",
      // padding: "10px",
    }}
  >
  

    {/* Phần chọn danh mục cố định */}
    <div
      style={{
        position: "sticky",
        top: 0,
        backgroundColor: "#fff",
        zIndex: 1,
        padding: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
      
    >
        <h2>Danh sách sản phẩm</h2>
       {/* Dropdown sắp xếp theo danh mục */}
              <Select
            placeholder="Chọn danh mục"
            style={{ width: '30%', marginBottom: '16px' }}
            value={selectedCategory}
            onChange={handleCategoryChange} 
        >
            <Option value={null}>Tất cả</Option>
            {Array.isArray(categories) && categories.map((category) => (
                <Option key={category._id} value={category._id}>
                    {category.name}
                </Option>
            ))}
        </Select>

    </div>

    <Row gutter={[10, 10]}>
      {filteredProducts.map((product) => (
        <Col span={24} key={product._id}>
          <div
            style={{
              display: "flex",
              padding: "10px",
              border: "1px solid #f0f0f0",
              borderRadius: "10px",
              alignItems: "center",
              backgroundColor: "#fafafa",
            }}
            onClick={() => openModal(product)}
          >
            <div style={{ flex: "0 0 60px", marginRight: "15px" }}>
              <img
                alt={product.name}
                src={product.image}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: "5px", fontWeight: "bold" }}>
                {product.name}
              </h4>
              <p style={{ marginBottom: "5px", color: "#999" }}>
                {product.category.name}
              </p>
              <p style={{ marginBottom: "5px", color: "#333" }}>
                {product.description}
              </p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={{ marginRight: "10px", fontWeight: "bold" }}>
                  {product.currentPrice > 0
                    ? `${formatCurrency(product.currentPrice)}`
                    : "Chưa cập nhật giá"}
                </p>
                <p style={{ color: "#888" }}>Còn lại: {product.quantity}</p>
              </div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  </div>

      {/* Phần bên phải: Giỏ hàng và thanh toán */}
      <div style={{ flex: 1, overflowY: "auto", marginTop: "20px" }}>
        <h2>
          Giỏ hàng <ShoppingCartOutlined style={{ fontSize: "24px" }} />
        </h2>

        <div
          style={{
            maxHeight: "300px", 
            overflowY: "auto",
            border: "1px solid #f0f0f0",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <Table
            dataSource={cart}
            rowKey="_id"
            pagination={false}
            columns={[
              { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
              {
                title: "Giá",
                dataIndex: "currentPrice",
                key: "currentPrice",
                render: (text, record) =>
                  `${formatCurrency(record.currentPrice * record.unit.value)}`,
              },
              { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
              {
                title: "Đơn vị",
                dataIndex: ["unit", "name"],
                key: "unit",
              },
              {
                title: "Thành tiền",
                render: (text, record) =>
                  `${formatCurrency(
                    record.currentPrice * record.unit.value * record.quantity
                  )}`,
              },
              {
                title: '',
                key: 'action',
                render: (_, record, index) => (
                  <Button onClick={() => removeFromCart(index)}>Xóa</Button>
                ),
              },
            ]}
          />
        </div>

        <h3>Tổng tiền: {formatCurrency(totalPrice)}</h3>
          {/* Thêm icon khuyến mãi */}
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                <Popover
                  content={voucherContent}
                  // title="Voucher khả dụng"
                  trigger="click"
                  visible={isVoucherVisible}
                  onVisibleChange={(visible) => setIsVoucherVisible(visible)}
                >
                  <GiftOutlined style={{ fontSize: '24px', cursor: 'pointer', color: '#faad14' }} />
                </Popover>
                <span style={{ marginLeft: '8px' }}>Chương trình khuyến mãi!!!</span>
              </div>



        <div style={{ marginBottom: "20px" }}>
          <Radio.Group 
            onChange={handlePaymentMethodChange} 
            value={paymentMethod} 
            style={{ display: 'flex', flexDirection: 'column' }} 
          >
            <Radio value="Cash">Tiền mặt</Radio>
            <Radio value="Card">Thẻ</Radio>
          </Radio.Group>

          <Button type="primary" onClick={handleCheckout} style={{ marginTop: "20px" }}>
            Thanh toán
          </Button>
        </div>

      </div>

      {selectedProduct && (
        <ProductsModalAdmin
          product={selectedProduct}
          onClose={closeModal}
          onAddToCart={addToCart}
          selectedUnit={selectedUnit}
          setSelectedUnit={setSelectedUnit}
          handleQuantityChange={handleQuantityChange}
          setQuantity={setQuantity}
          quantity={quantity}
        />
      )}

      <Modal
        title="Xác nhận thanh toán"
        visible={isCheckoutModalOpen}
        onCancel={() => setIsCheckoutModalOpen(false)}
        footer={null}
      >
        <p>Tổng tiền: {formatCurrency(totalPrice)} </p>
       
        <Table
          dataSource={cart}
          rowKey="_id"
          pagination={false}
          columns={[
            { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
            {
              title: "Giá",
              dataIndex: "currentPrice",
              key: "currentPrice",
              render: (text, record) =>
                `${formatCurrency(record.currentPrice * record.unit.value)}`,
            },
            { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
            {
              title: "Đơn vị",
              dataIndex: ["unit", "name"],
              key: "unit",
            },
            {
              title: "Thành tiền",
              render: (text, record) =>
                `${formatCurrency(
                  record.currentPrice * record.unit.value * record.quantity
                )}`,
            },
          ]}
        />
        <h3>Tổng tiền: {formatCurrency(totalPrice)}</h3>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="primary" onClick={confirmPayment}>
            Xác nhận
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default SellPage;