import React, { useContext, useEffect, useState } from "react";
import {
  createDirectSaleBill,
  getAllProducts,
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
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import ProductsModal from "../products/ProductsModel";
import ProductsModalAdmin from "../sell/ProductsModalAdmin";

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
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const productList = await getAllProducts();
        setProducts(productList);
        setFilteredProducts(productList);

        const categoryList = await getCategories();
        console.log("Categories fetched: ", categoryList);
        setCategories(categoryList.categories);
      } catch (error) {
        message.error("Lỗi khi lấy dữ liệu: " + error.message);
      }
    };
    fetchProductsAndCategories();
  }, []);

  console.log("123", products);
  
  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cart.reduce((acc, item) => {
        const unitValue = item.unit ? item.unit.value : 1; // Lấy giá trị đơn vị nếu có
        return acc + item.currentPrice * unitValue * item.quantity;
      }, 0);
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [cart]);

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (!categoryId) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category === categoryId
      );
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

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const confirmPayment = async () => {
    try {
      const items = cart.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        currentPrice: item.currentPrice,
        unit: item.unit.name, // Thêm thông tin đơn vị vào hóa đơn
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

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

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
          padding: "10px",
        }}
      >
        <h2>Danh sách sản phẩm</h2>

        <Select
          placeholder="Chọn danh mục"
          style={{ width: "30%", marginBottom: "16px" }}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <Option value={null}>Tất cả</Option>
          {Array.isArray(categories) &&
            categories.map((category) => (
              <Option key={category._id} value={category._id}>
                {category.name}
              </Option>
            ))}
        </Select>

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
                        : "Liên hệ"}
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
      <div style={{ flex: 1 }}>
        <h2>
          Giỏ hàng <ShoppingCartOutlined style={{ fontSize: "24px" }} />
        </h2>

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

        <Col pagination={false} style={{ marginTop: "20px" }}>
          <tbody>
            <tr>
              <td>Tổng tiền:</td>
              <td>{formatCurrency(totalPrice)}</td>
            </tr>
            <tr>
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

        <Button type="primary" onClick={handleCheckout}>
          Thanh toán
        </Button>
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
