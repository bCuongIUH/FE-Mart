import React, { useEffect, useState } from "react";
import { Button, Modal, message, Row, Col, InputNumber, Input, Select } from "antd";
import { getAllPriceProduct } from "../../untills/priceApi";
import { ShoppingCartOutlined } from "@ant-design/icons";
import CartTable from "./CartTable"; // CartTable Component

const { Option } = Select;

const ProductPrices = () => {
  const [prices, setPrices] = useState([]);
  const [filteredPrices, setFilteredPrices] = useState([]);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [cart, setCart] = useState([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState({});
  const [selectedPrice, setSelectedPrice] = useState({});
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [inputQuantity, setInputQuantity] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getAllPriceProduct();
        if (data.success) {
          setPrices(data.prices);
          setFilteredPrices(data.prices);

          const categoryList = [...new Set(data.prices.map((product) => product.category))];
          setCategories(categoryList);

          const defaultUnits = {};
          const defaultPrices = {};
          const defaultQuantities = {};
          const defaultInputQuantities = {};

          data.prices.forEach((product) => {
            const baseUnit = product.units.find((unit) => unit.conversionValue === 1);
            if (baseUnit) {
              defaultUnits[product.productId] = baseUnit.unitName;
              defaultPrices[product.productId] = baseUnit.price;
              defaultQuantities[product.productId] = baseUnit.quantity;
              defaultInputQuantities[product.productId] = 1;
            }
          });

          setSelectedUnit(defaultUnits);
          setSelectedPrice(defaultPrices);
          setSelectedQuantity(defaultQuantities);
          setInputQuantity(defaultInputQuantities);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPrices();
  }, []);
  console.log("prices", prices);
  
  const handleUnitChange = (productId, unit) => {
    setSelectedUnit((prevUnits) => ({ ...prevUnits, [productId]: unit.unitName }));
    setSelectedPrice((prevPrices) => ({ ...prevPrices, [productId]: unit.price }));
    setSelectedQuantity((prevQuantities) => ({ ...prevQuantities, [productId]: unit.quantity }));
  };

  const handleInputQuantityChange = (productId, quantity) => {
    setInputQuantity((prevQuantities) => ({ ...prevQuantities, [productId]: quantity }));
  };

  const addToCart = (product) => {
    const unitName = selectedUnit[product.productId];
    const price = selectedPrice[product.productId];
    const quantity = inputQuantity[product.productId];

    if (selectedQuantity[product.productId] === 0) {
      return message.warning("Đơn vị đã chọn hết hàng!");
    }

    if (price === 0) {
      return message.warning("Sản phẩm có giá trị bằng 0, không thể thêm vào giỏ hàng!");
    }

    const itemInCart = cart.find(
      (item) => item.productId === product.productId && item.unit === unitName
    );

    if (itemInCart) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === product.productId && item.unit === unitName
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, unit: unitName, price, quantity }]);
    }
    message.success("Sản phẩm đã được thêm vào giỏ hàng!");
  };

  const removeFromCart = (productId, unitName) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.productId === productId && item.unit === unitName))
    );
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    applyFilters(value, searchText);
  };

  const handleSearchTextChange = (event) => {
    const searchValue = event.target.value;
    setSearchText(searchValue);
    applyFilters(selectedCategory, searchValue);
  };

  const applyFilters = (category, search) => {
    let updatedPrices = prices;

    if (category) {
      updatedPrices = updatedPrices.filter((product) => product.category === category);
    }

    if (search) {
      updatedPrices = updatedPrices.filter((product) =>
        product.productName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredPrices(updatedPrices);
  };

  const formatCurrency = (value) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* Left Side: Product List */}
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
          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={{ marginBottom: "20px" }}>
            <Input
              placeholder="Tìm kiếm sản phẩm"
              value={searchText}
              onChange={handleSearchTextChange}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <Select
              placeholder="Chọn danh mục"
              onChange={handleCategoryChange}
              value={selectedCategory}
              style={{ width: "100%" }}
            >
              <Option value={null}>Tất cả</Option>
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {filteredPrices.length > 0 &&
            filteredPrices.map((product) => (
              <Col span={24} key={product.productId}>
                <div
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#fff",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={product.image}
                      alt={product.productName}
                      style={{ width: "100px", height: "100px", marginRight: "15px" }}
                    />
                    <div>
                      <h2>{product.productName}</h2>
                      <div>
                        {product.units.map((unit) => (
                          <Button
                            key={unit.unitName}
                            style={{
                              margin: "5px",
                              backgroundColor:
                                selectedUnit[product.productId] === unit.unitName
                                  ? "#40a9ff"
                                  : "#f0f0f0",
                              color:
                                selectedUnit[product.productId] === unit.unitName
                                  ? "#fff"
                                  : "#000",
                            }}
                            onClick={() => handleUnitChange(product.productId, unit)}
                          >
                            {unit.unitName}
                          </Button>
                        ))}
                      </div>
                      <p>
                        <strong>Giá:</strong> {formatCurrency(selectedPrice[product.productId] || 0)}
                      </p>
                      <p>
                        <strong>Số lượng còn:</strong>{" "}
                        {selectedQuantity[product.productId] !== undefined
                          ? selectedQuantity[product.productId]
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <InputNumber
                      min={0}
                      max={selectedQuantity[product.productId]}
                      value={inputQuantity[product.productId]}
                      onChange={(value) => handleInputQuantityChange(product.productId, value)}
                      style={{ width: "80px" }}
                    />
                    <Button
                      icon={<ShoppingCartOutlined />}
                      onClick={() => addToCart(product)}
                      type="primary"
                    />
                  </div>
                </div>
              </Col>
            ))}
        </Row>
      </div>

      {/* Right Side: Cart */}
      <div style={{ flex: 1, overflowY: "auto", marginTop: "20px", position: "relative" }}>
        <h2>
          Giỏ hàng <ShoppingCartOutlined style={{ fontSize: "24px" }} />
        </h2>
        <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
          <CartTable 
            cart={cart}
            formatCurrency={formatCurrency}
            removeFromCart={removeFromCart}
          />
        </div>

        <Button
          type="primary"
          onClick={() => setIsCheckoutModalOpen(true)}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
          }}
        >
          Thanh toán
        </Button>

        <Modal
          title="Xác nhận thanh toán"
          visible={isCheckoutModalOpen}
          onCancel={() => setIsCheckoutModalOpen(false)}
          footer={null}
        >
          <p>
            Tổng tiền:{" "}
            {formatCurrency(cart.reduce((acc, item) => acc + item.price * item.quantity, 0))}
          </p>
          <Button type="primary" onClick={() => message.success("Thanh toán thành công!")}>
            Xác nhận
          </Button>
        </Modal>
      </div>
    </div>
  );
};

export default ProductPrices;
