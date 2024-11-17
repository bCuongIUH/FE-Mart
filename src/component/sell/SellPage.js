import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  message,
  Row,
  Col,
  InputNumber,
  Input,
  Select,
  Typography,
  Checkbox,
  Empty,
} from "antd";
import { ShoppingCartOutlined, GiftOutlined } from "@ant-design/icons";
import { getAllPriceProduct } from "../../untills/priceApi";
import { createDirectSaleBill } from "../../untills/api";
import { getAllActiveVouchers } from "../../services/voucherService";
import { formatCurrency } from "../../untills/formatCurrency";
import { AuthContext } from "../../untills/context/AuthContext";
import { getAllCustomers } from "../../untills/customersApi";
import { getEmployeeById } from "../../untills/employeesApi";
import CartTable from "./CartTable";
import VoucherDetail from "./VoucherDetail";
import PaymentMethodSelector from "./Payment";
import CustomerSelect from "./CustomerSelect";

const { Title, Text } = Typography;
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
  const [employeeId, setEmployeeId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchPhoneNumber, setSearchPhoneNumber] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [appliedVouchers, setAppliedVouchers] = useState([]);
  const { user } = useContext(AuthContext);
  const invoiceRef = useRef(null);

  

  useEffect(() => {
    const fetchEmployeeId = async () => {
      if (user?._id) {
        try {
          const employeeData = await getEmployeeById(user._id);
          setEmployeeId(employeeData._id);
        } catch (error) {
          console.error("Không thể lấy employeeId:", error);
        }
      }
    };
    fetchEmployeeId();
  }, [user]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getAllPriceProduct();
        if (data.success) {
          setPrices(data.prices);
          setFilteredPrices(data.prices);
          initializeProductState(data.prices);

          const uniqueCategories = [
            ...new Set(data.prices.map((item) => item.category)),
          ];
          setCategories(uniqueCategories);
        } else {
          setError(data.message);
        }
        const voucherData = await getAllActiveVouchers();
        setVouchers(Array.isArray(voucherData) ? voucherData : []);

        const customerData = await getAllCustomers();
        setCustomers(customerData);
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

  const removeFromCart = (productId, unitName) => {
    setIsRemoving(true);
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.productId === productId && item.unit === unitName)
      )
    );
    setIsRemoving(false);
  };


  const filterApplicableVouchers = () => {
    const voucherList = Array.isArray(vouchers)
      ? vouchers.filter((voucher) => voucher.isActive && !voucher.isDeleted)
      : [];
    
    const totalAmount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  
    const applicableVouchers = [];
    let bestBuyXGetYVoucher = null; // Voucher tặng quà tốt nhất
    let maxGiftQuantity = 0; // Số lượng quà tặng lớn nhất
  
    voucherList.forEach((voucher) => {
      let isApplicable = false;
  
      if (voucher.type === "PercentageDiscount" && voucher.conditions) {
        const condition = voucher.conditions;
        if (totalAmount >= condition.minOrderValue) {
          isApplicable = true;
        }
      } else if (voucher.type === "FixedDiscount" && voucher.conditions) {
        const condition = voucher.conditions;
        if (totalAmount >= condition.minOrderValue) {
          isApplicable = true;
        }
      } else if (voucher.type === "BuyXGetY" && voucher.conditions) {
        const buyCondition = voucher.conditions;
        const targetProduct = cart.find(
          (item) =>
            item.productId === buyCondition.productXId &&
            item.unit === buyCondition.unitX
        );
  
        if (targetProduct) {
          const applicableQuantity = Math.floor(
            targetProduct.quantity / buyCondition.quantityX
          );
  
          if (applicableQuantity > 0) {
            const totalGiftQuantity = applicableQuantity * buyCondition.quantityY;
            // Chỉ chọn voucher có số lượng quà tặng lớn nhất
            if (totalGiftQuantity > maxGiftQuantity) {
              maxGiftQuantity = totalGiftQuantity;
              bestBuyXGetYVoucher = {
                voucher,
                totalGiftQuantity,
              };
            }
          }
        }
      }
  
      if (isApplicable) {
        applicableVouchers.push(voucher);
      }
    });
  
    setApplicableVouchers(applicableVouchers);
  
    // Nếu có voucher BuyXGetY tốt nhất, cập nhật quà tặng vào giỏ hàng
    if (bestBuyXGetYVoucher) {
      const { voucher, totalGiftQuantity } = bestBuyXGetYVoucher;
      const giftProductId = voucher.conditions.productYId;
      const giftProductName = voucher.conditions.productYName;
      const giftUnit = voucher.conditions.unitY;
  
      const giftIndex = cart.findIndex(
        (item) => item.productId === giftProductId && item.isGift === true
      );
  
      if (giftIndex >= 0) {
        // Nếu quà tặng đã tồn tại, cập nhật số lượng
        setCart((prevCart) =>
          prevCart.map((item, index) =>
            index === giftIndex
              ? { ...item, quantity: totalGiftQuantity }
              : item
          )
        );
      } else {
        // Nếu chưa có quà tặng, thêm mới
        setCart((prevCart) => [
          ...prevCart,
          {
            productId: giftProductId,
            productName: giftProductName,
            unit: giftUnit,
            price: 0,
            quantity: totalGiftQuantity,
            isGift: true,
          },
        ]);
      }
    }
  
    // Áp dụng voucher giảm giá tốt nhất
    if (applicableVouchers.length > 0) {
      const bestVoucher = applicableVouchers.reduce((best, current) => {
        const currentDiscount = calculateVoucherDiscount(current, totalAmount);
        const bestDiscount = calculateVoucherDiscount(best, totalAmount);
        return currentDiscount > bestDiscount ? current : best;
      });
  
      setAppliedVouchers([
        bestVoucher,
        ...(bestBuyXGetYVoucher ? [bestBuyXGetYVoucher.voucher] : []),
      ]);
      const totalDiscount = calculateVoucherDiscount(bestVoucher, totalAmount);
      setDiscountAmount(totalDiscount);
    } else {
      setAppliedVouchers(bestBuyXGetYVoucher ? [bestBuyXGetYVoucher.voucher] : []);
      setDiscountAmount(0);
    }
  };
  
  
  

  const calculateVoucherDiscount = (voucher, totalAmount) => {
    if (voucher.type === "PercentageDiscount" && voucher.conditions) {
      const discount = Math.min(
        (totalAmount * voucher.conditions.discountPercentage) / 100,
        voucher.conditions.maxDiscountAmount
      );
      return discount;
    } else if (voucher.type === "FixedDiscount" && voucher.conditions) {
      return voucher.conditions.discountAmount;
    }
    return 0;
  };

  useEffect(() => {
    if (!isRemoving) {
      filterApplicableVouchers();
    }
  }, [cart, vouchers, isRemoving]);

  const addToCart = (product) => {
    const unitName = selectedUnit[product.productId];
    const unit = product.units.find((unit) => unit.unitName === unitName);
    const price = unit ? unit.price : 0;
    const quantity = inputQuantity[product.productId] || 1;
    const availableQuantity = selectedQuantity[product.productId];

    if (quantity > availableQuantity) {
      return message.error("Sản phẩm không còn đủ số lượng trong kho!");
    }

    if (!product.units.some((unit) => unit.price > 0)) {
      return message.warning("Sản phẩm này không có giá bán!");
    }

    if (availableQuantity === 0) {
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

    setSelectedQuantity((prevQuantities) => ({
      ...prevQuantities,
      [product.productId]: availableQuantity - quantity,
    }));
  };

  const handlePayment = async () => {
    if (!selectedCustomer) {
      return message.warning("Vui lòng chọn khách hàng trước khi thanh toán!");
    }
  
    if (cart.length === 0) {
      return message.warning("Giỏ hàng không có sản phẩm nào.");
    }
  
    const items = cart.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
      currentPrice: item.price,
      unit: item.unit,
    }));
  
    const payload = {
      paymentMethod,
      items,
      customerId: selectedCustomer._id,
      voucherCodes: appliedVouchers.map((voucher) => voucher.code), // Truyền mảng voucherCodes
      createBy: employeeId,
    };
  //  price: giftProductDetails.price || 0,
    console.log("Payload gửi đi:", payload);
  
    try {
      const response = await createDirectSaleBill(payload);
  
      if (response && response.bill) {
        const { bill } = response;
  
        if (bill.appliedVouchers && bill.appliedVouchers.length > 0) {
          message.success(
            `Thanh toán thành công! Vouchers áp dụng: ${bill.appliedVouchers.map((v) => v.code).join(", ")}. Giảm giá: ${bill.discountAmount}`
          );
        } else {
          message.warning("Hóa đơn tạo thành công nhưng không có voucher nào được áp dụng.");
        }
  
        setIsCheckoutModalOpen(false);
        setCart([]);
        setDiscountAmount(0);
        setAppliedVouchers([]);
        setSelectedCustomer(null);
        setSearchPhoneNumber("");
        handlePrintInvoice();
      } else {
        throw new Error(response.message || "Không thể tạo hóa đơn.");
      }
    } catch (error) {
      console.error("Error in handlePayment:", error);
      message.error(`Lỗi khi thanh toán: ${error.message}`);
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

  const handlePrintInvoice = () => {
    const printContent = invoiceRef.current.innerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h2 { text-align: center; margin-bottom: 5px; }
            .center-text { text-align: center; margin: 5px 0; }
            .header-section { text-align: left; font-weight: bold; margin-bottom: 10px; }
            .product-list, .total-section { margin: 20px; }
            .product-item { display: flex; border-bottom: 1px dashed #ccc; padding: 8px 0; }
            .product-item div { flex: 1; }
            .total-right { text-align: right; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      <div
        style={{
          flex: 1,
          height: "85vh",
          overflowY: "auto",
          border: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "#f5f5f5",
            zIndex: 1,
            paddingBottom: "10px",
            borderBottom: "2px solid #f0f0f0",
            border: "1px solid #f0f0f0",
          }}
        >
          <CustomerSelect
            onCustomerSelect={setSelectedCustomer}
            selectedCustomer={selectedCustomer}
          />

          <h3
            style={{ fontStyle: "italic",
              fontWeight: "bold",
              padding: "5px"
            }}
          >
            Sản phẩm
          </h3>

          <Input
            placeholder="Tìm kiếm sản phẩm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "40%",
              marginBottom: "10px",
              marginLeft: "10px"
            }}
          />
          <Select
            placeholder="Chọn danh mục"
            onChange={(value) => setSelectedCategory(value)}
            value={selectedCategory}
            style={{
              width: "40%",
              marginBottom: "10px",
              marginLeft: "10px"
            }}
          >
            <Option value={null}>Tất cả</Option>
            {categories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
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
                      style={{
                        width: "100px",
                        height: "100px",
                        marginRight: "15px",
                      }}
                    />
                    <div>
                      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {product.productName}
                      </h2>
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
        <Title style={{ fontWeight: "bold", fontStyle: "italic" }} level={2}>
          Giỏ hàng <ShoppingCartOutlined />
        </Title>
        <div style={{ minHeight: "50%" }}>
          <CartTable
            removeFromCart={removeFromCart}
            cart={cart}
            formatCurrency={formatCurrency}
          />
        </div>

        <VoucherDetail vouchers={vouchers} />
        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "right",
            marginRight: "20px",
          }}
        >
          Tổng tiền hàng:{" "}
          {formatCurrency(
            cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
          )}
        </p>

        <p
          style={{
            fontSize: "16px",
            textAlign: "right",
            marginRight: "20px",
            fontStyle: "italic",
          }}
        >
          Giảm giá: {formatCurrency(discountAmount)}
        </p>
        <p
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            textAlign: "right",
            marginRight: "20px",
          }}
        >
          Tổng cộng:{" "}
          {formatCurrency(
            cart.reduce((acc, item) => acc + item.price * item.quantity, 0) -
              discountAmount
          )}
        </p>

        <PaymentMethodSelector
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          style={{ position: "absolute", bottom: "20px", left: "20px" }}
        />
        <Button
          type="primary"
          onClick={() => setIsCheckoutModalOpen(true)}
          style={{
            width: "150px",
            height: "50px",
            position: "absolute",
            bottom: "20px",
            right: "20px",
          }}
        >
          Thanh toán
        </Button>


        <Modal
          visible={isCheckoutModalOpen}
          onCancel={() => setIsCheckoutModalOpen(false)}
          footer={null}
          centered
        >
          <div ref={invoiceRef}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h4 style={{ textAlign: "center", fontWeight: "bold" }}>
                Hóa Đơn Siêu Thị C'Mart
              </h4>
              <br />
              <p>Địa chỉ: 04 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
              <p>Hotline: 076 848 6006</p>
              <p>* * *</p>
            </div>

            <div
              className="header-section"
              style={{
                borderBottom: "1px solid #ccc",
                paddingBottom: "15px",
                marginBottom: "15px",
              }}
            >
              <p>
                <strong>NV bán hàng:</strong> {user ? user.fullName : "N/A"}
              </p>
              <p>
                <strong>Tên khách hàng:</strong>{" "}
                {selectedCustomer
                  ? selectedCustomer.fullName
                  : "Khách vãng lai"}
              </p>
              <p>
                <strong>Ngày tạo:</strong> {new Date().toLocaleString()}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                fontWeight: "bold",
                borderBottom: "1px dashed #ccc",
                paddingBottom: "8px",
                marginBottom: "10px",
              }}
            >
              <div style={{ flex: 2 }}>Tên sản phẩm</div>
              <div style={{ flex: 1 }}>Đơn vị</div>
              <div style={{ flex: 1 }}>Giá</div>
              <div style={{ flex: 1 }}>Số lượng</div>
              <div style={{ flex: 1 }}>Thành tiền</div>
            </div>

            {cart.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: "flex",
                  borderBottom: "1px dashed #ccc",
                  padding: "8px 0",
                }}
              >
                <div style={{ flex: 2 }}>{item.productName}</div>
                <div style={{ flex: 1 }}>{item.unit}</div>
                <div style={{ flex: 1 }}>{formatCurrency(item.price)}</div>
                <div style={{ flex: 1 }}>{item.quantity}</div>
                <div style={{ flex: 1 }}>
                  {formatCurrency(item.quantity * item.price)}
                </div>
              </div>
            ))}

            <div
              style={{ padding: "10px", marginTop: "10px", textAlign: "right" }}
            >
              <p>
                <strong>Thành tiền:</strong>{" "}
                {formatCurrency(
                  cart.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  )
                )}
              </p>
              <p>
                <strong>Chiết khấu:</strong> {formatCurrency(discountAmount)}
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {formatCurrency(
                  cart.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  ) - discountAmount
                )}
              </p>
            </div>
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontWeight: "bold",
              color: "#888",
            }}
          >
            Cảm ơn quý khách, hẹn gặp lại!
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <Button
              type="primary"
              onClick={handlePayment}
              style={{ width: "auto" }}
            >
              Xác nhận và In hóa đơn
            </Button>
          </div>
        </Modal>


      </div>
    </div>
  );
};

export default ProductPrices;