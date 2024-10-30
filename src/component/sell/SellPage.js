import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Modal,
  message,
  Row,
  Col,
  InputNumber,
  Input,
  Select,
} from "antd";
import { getAllPriceProduct } from "../../untills/priceApi";
import { createDirectSaleBill } from "../../untills/api";
import { ShoppingCartOutlined } from "@ant-design/icons";
import CartTable from "./CartTable";
import { getAllActiveVouchers } from "../../services/voucherService";
import { formatCurrency } from "../../untills/formatCurrency";
import { AuthContext } from "../../untills/context/AuthContext";

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
  const [vouchers, setVouchers] = useState([]);
  const [applicableVouchers, setApplicableVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getAllPriceProduct();
        if (data.success) {
          setPrices(data.prices);
          setFilteredPrices(data.prices);
          initializeProductState(data.prices);
        } else {
          setError(data.message);
        }
        const voucherData = await getAllActiveVouchers();
        setVouchers(voucherData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPrices();
  }, []);


  const initializeProductState = (products) => {
    const defaultUnits = {};
    const defaultPrices = {};
    const defaultQuantities = {};
    const defaultInputQuantities = {};

    products.forEach((product) => {
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
  };

  const handleVoucherSelect = (value) => {
    const selected = vouchers.find((voucher) => voucher._id === value);
    setSelectedVoucher(selected);
    calculateDiscount(selected);
  };

  const calculateDiscount = (voucher) => {
    if (!voucher) return;

    let discount = 0;
    const totalAmount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    if (voucher.type === "PercentageDiscount" && voucher.conditions) {
      const condition = voucher.conditions[0];
      if (totalAmount >= condition.minOrderValue) {
        discount = (totalAmount * condition.discountPercentage) / 100;
        if (discount > condition.maxDiscountAmount) {
          discount = condition.maxDiscountAmount;
        }
      }
    } else if (voucher.type === "FixedDiscount" && voucher.conditions) {
      const condition = voucher.conditions[0];
      if (totalAmount >= condition.minOrderValue) {
        discount = condition.discountAmount;
      }
    } else if (voucher.type === "BuyXGetY" && voucher.conditions) {
      const condition = voucher.conditions[0];
      const productXInCart = cart.find(
        (item) => item.productId === condition.productXId
      );
      const productYExists = cart.find(
        (item) => item.productId === condition.productYId && item.price === 0
      );

      if (
        productXInCart &&
        productXInCart.quantity >= condition.quantityX &&
        !productYExists
      ) {
        const productY = prices.find(
          (product) => product.productId === condition.productYId
        );
        if (productY) {
          setCart((prevCart) => [
            ...prevCart,
            {
              ...productY,
              unit: selectedUnit[condition.productYId],
              price: 0,
              quantity: condition.quantityY,
            },
          ]);
        }
      }
    }
    setDiscountAmount(discount);
    message.success("Áp dụng mã khuyến mãi thành công!");
  };
  const removeFromCart = (productId, unitName) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.productId === productId && item.unit === unitName)
      )
    );
  };

  const filterApplicableVouchers = () => {
    const totalAmount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const applicable = vouchers.filter((voucher) => {
      if (voucher.type === "PercentageDiscount" && voucher.conditions) {
        return totalAmount >= voucher.conditions[0].minOrderValue;
      } else if (voucher.type === "FixedDiscount" && voucher.conditions) {
        return totalAmount >= voucher.conditions[0].minOrderValue;
      } else if (voucher.type === "BuyXGetY" && voucher.conditions) {
        const productXInCart = cart.find(
          (item) => item.productId === voucher.conditions[0].productXId
        );
        return (
          productXInCart &&
          productXInCart.quantity >= voucher.conditions[0].quantityX
        );
      }
      return false;
    });
    setApplicableVouchers(applicable);
  };

  useEffect(() => {
    filterApplicableVouchers();
  }, [cart, vouchers]);



  const handlePayment = async () => {
    const items = cart.map((item) => ({
      // createBy: user._id,
      product: item.productId,
      quantity: item.quantity,
      currentPrice: item.price,
      unit: item.unit,
     
    }));

    try {
      await createDirectSaleBill(
        
        paymentMethod,
        items,
        "",
        selectedVoucher ? selectedVoucher.code : ""
      );
      message.success("Thanh toán thành công!");
      setIsCheckoutModalOpen(false);
      setCart([]);
      setDiscountAmount(0);
      setSelectedVoucher(null);
    } catch (error) {
      message.error("Lỗi khi thanh toán. Vui lòng thử lại.");
    }
  };
  
  
  const handleUnitChange = (productId, unit) => {
    setSelectedUnit((prevUnits) => ({
      ...prevUnits,
      [productId]: unit.unitName,
    }));
    setSelectedPrice((prevPrices) => ({
      ...prevPrices,
      [productId]: unit.price,
    }));
    setSelectedQuantity((prevQuantities) => ({
      ...prevQuantities,
      [productId]: unit.quantity,
    }));
  };

  const addToCart = (product) => {
    const unitName = selectedUnit[product.productId];
    const price = selectedPrice[product.productId];
    const quantity = inputQuantity[product.productId] || 1;

    if (selectedQuantity[product.productId] === 0) {
      return message.warning("Đơn vị đã chọn hết hàng!");
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

  return (
    <div style={{ display: "flex", padding: "20px" }}>
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
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Input
          placeholder="Tìm kiếm sản phẩm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <Select
          placeholder="Chọn danh mục"
          onChange={(value) => setSelectedCategory(value)}
          value={selectedCategory}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <Option value={null}>Tất cả</Option>
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>

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
                      style={{
                        width: "100px",
                        height: "100px",
                        marginRight: "15px",
                      }}
                    />
                    <div>
                      <h2>{product.productName}</h2>
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
                          onClick={() =>
                            handleUnitChange(product.productId, unit)
                          }
                        >
                          {unit.unitName}
                        </Button>
                      ))}
                      <p>
                        <strong>Giá:</strong>{" "}
                        {formatCurrency(selectedPrice[product.productId] || 0)}
                      </p>
                      <p>
                        <strong>Số lượng còn:</strong>{" "}
                        {selectedQuantity[product.productId]}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <InputNumber
                      min={1}
                      max={selectedQuantity[product.productId]}
                      value={inputQuantity[product.productId] || 1}
                      onChange={(value) =>
                        setInputQuantity((prev) => ({
                          ...prev,
                          [product.productId]: value,
                        }))
                      }
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

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginTop: "20px",
          position: "relative",
        }}
      >
        <h2>
          Giỏ hàng <ShoppingCartOutlined />
        </h2>
        <CartTable
          removeFromCart={removeFromCart}
          cart={cart}
          formatCurrency={formatCurrency}
        />
        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "right",
            marginRight: "20px",
          }}
        >
          Tổng tiền:{" "}
          {formatCurrency(
            cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
          )}
        </p>

        <Select
          placeholder="Chọn voucher"
          onChange={handleVoucherSelect}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <Option value={null}>Không áp dụng voucher</Option>
          {applicableVouchers.map((voucher) => (
            <Option key={voucher._id} value={voucher._id}>
              {voucher.code}
            </Option>
          ))}
        </Select>

        <p
          style={{ fontSize: "16px", textAlign: "right", marginRight: "20px" }}
        >
          Giảm giá: {formatCurrency(discountAmount)}
        </p>

        <Select
          placeholder="Chọn hình thức thanh toán"
          onChange={(value) => setPaymentMethod(value)}
          value={paymentMethod}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <Option value="Cash">Tiền mặt</Option>
          <Option value="Card">Thẻ</Option>
        </Select>

        <Button
          type="primary"
          onClick={() => setIsCheckoutModalOpen(true)}
          style={{ position: "absolute", bottom: "20px", right: "20px" }}
        >
          Thanh toán
        </Button>

        {/* <Modal
          title="Xác nhận thanh toán"
          visible={isCheckoutModalOpen}
          onCancel={() => setIsCheckoutModalOpen(false)}
          footer={null}
        >
          <p>
            Tổng tiền:{" "}
            {formatCurrency(
              cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
            )}
          </p>
          <p>Giảm giá: {formatCurrency(discountAmount)}</p>
          <p>
            <strong>
              Thành tiền:{" "}
              {formatCurrency(
                cart.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                ) - discountAmount
              )}
            </strong>
          </p>
          <Button type="primary" onClick={handlePayment}>
            Xác nhận
          </Button>
        </Modal> */}
        <Modal
          title="Xác nhận thanh toán"
          visible={isCheckoutModalOpen}
          onCancel={() => setIsCheckoutModalOpen(false)}
          footer={null}
        >
          <h4>Sản phẩm mua:</h4>
          {cart.map((item) => (
            <div key={item.productId} style={{ marginBottom: "10px" }}>
              <p>
                <strong>Tên sản phẩm:</strong> {item.productName}
              </p>
              <p>
                <strong>Đơn vị:</strong> {item.unit}
              </p>
              <p>
                <strong>Giá:</strong> {formatCurrency(item.price)}
              </p>
              <p>
                <strong>Số lượng:</strong> {item.quantity}
              </p>
            </div>
          ))}

          {selectedVoucher && (
            <div style={{ marginBottom: "10px" }}>
              <p>
                <strong>Mã giảm giá:</strong> {selectedVoucher.code}
              </p>
              <p>
                <strong>Số tiền giảm:</strong> {formatCurrency(discountAmount)}
              </p>
            </div>
          )}

          <p>
            Tổng tiền:{" "}
            {formatCurrency(
              cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
            )}
          </p>
          <p>Giảm giá: {formatCurrency(discountAmount)}</p>
          <p>
            <strong>
              Thành tiền:{" "}
              {formatCurrency(
                cart.reduce((acc, item) => acc + item.price * item.quantity, 0) -
                discountAmount
              )}
            </strong>
          </p>
          <Button type="primary" onClick={handlePayment}>
            Xác nhận
          </Button>
        </Modal>



      </div>
    </div>
  );
};

export default ProductPrices;
