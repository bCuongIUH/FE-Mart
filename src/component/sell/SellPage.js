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
} from "antd";
import { getAllPriceProduct } from "../../untills/priceApi";
import { createDirectSaleBill } from "../../untills/api";
import { GiftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import CartTable from "./CartTable";
import { getAllActiveVouchers } from "../../services/voucherService";
import { formatCurrency } from "../../untills/formatCurrency";
import { AuthContext } from "../../untills/context/AuthContext";
import { getAllCustomers } from "../../untills/customersApi";
import { getEmployeeById } from "../../untills/employeesApi";
import VoucherDetail from "./VoucherDetail";
import PaymentMethodSelector from "./Payment";
import CustomerSelect from "./CustomerSelect";
import Title from "antd/es/typography/Title";
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
  const [appliedVoucher, setAppliedVoucher] = useState([]);
  const { user } = useContext(AuthContext);
  const invoiceRef = useRef(null);

  //lấy nv bán hàng
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

  //useEffect lấy dữ liệu từ api
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
    setIsRemoving(false); // Đặt lại isRemoving thành false sau khi xóa
  };

  const filterApplicableVouchers = () => {
    const voucherList = Array.isArray(vouchers)
      ? vouchers.filter((voucher) => voucher.isActive && !voucher.isDeleted)
      : [];
    const totalAmount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  
    // Khởi tạo biến để lưu trữ voucher tốt nhất và mức giảm giá
    let bestVoucher = null;
    let maxDiscount = 0;
  
    // Danh sách các mã voucher 'Buy X Get Y' khả dụng
    const applicableBuyXGetYVouchers = [];
  
    voucherList.forEach((voucher) => {
      let discount = 0;
  
      // Kiểm tra điều kiện và tính giảm giá cho loại 'PercentageDiscount'
      if (voucher.type === "PercentageDiscount" && voucher.conditions) {
        const condition = voucher.conditions;
        if (totalAmount >= condition.minOrderValue) {
          discount = (totalAmount * condition.discountPercentage) / 100;
          if (discount > condition.maxDiscountAmount) {
            discount = condition.maxDiscountAmount;
          }
        }
      }
      // Kiểm tra điều kiện và tính giảm giá cho loại 'FixedDiscount'
      else if (voucher.type === "FixedDiscount" && voucher.conditions) {
        const condition = voucher.conditions;
        if (totalAmount >= condition.minOrderValue) {
          discount = condition.discountAmount;
        }
      }
      // Xử lý mã 'BuyXGetY'
      else if (voucher.type === "BuyXGetY" && voucher.conditions) {
        const buyCondition = voucher.conditions;
        const targetProduct = cart.find(
          (item) =>
            item.productId === buyCondition.productXId &&
            item.quantity >= buyCondition.quantityX &&
            item.unit === buyCondition.unitXName
        );
  
        if (targetProduct) {
          applicableBuyXGetYVouchers.push(voucher);
        }
      }
  
      // Lưu trữ voucher có mức giảm giá cao nhất
      if (discount > maxDiscount) {
        maxDiscount = discount;
        bestVoucher = voucher;
      }
    });
  
    // Xử lý voucher tốt nhất cho loại 'BuyXGetY'
    if (applicableBuyXGetYVouchers.length > 0) {
      const bestBuyXGetYVoucher = applicableBuyXGetYVouchers.reduce(
        (best, current) => {
          return current.conditions.quantityY > best.conditions.quantityY
            ? current
            : best;
        }
      );
  
      // Kiểm tra nếu sản phẩm tặng chưa có trong giỏ hàng
      const giftExists = cart.some(
        (item) =>
          item.productId === bestBuyXGetYVoucher.conditions.productYId &&
          item.isGift === true
      );
  
      if (!giftExists) {
        setCart((prevCart) => [
          ...prevCart,
          {
            productId: bestBuyXGetYVoucher.conditions.productYId,
            productName: bestBuyXGetYVoucher.conditions.productYName,
            unit: bestBuyXGetYVoucher.conditions.unitYName,
            price: 0,
            quantity: bestBuyXGetYVoucher.conditions.quantityY,
            isGift: true,
          },
        ]);
      }
    }
  
    // Cập nhật tổng mức giảm giá và voucher đã chọn
    setDiscountAmount(maxDiscount);
    setSelectedVoucher(bestVoucher);
  
    // Kiểm tra nếu không có voucher nào áp dụng được
    if (!bestVoucher && applicableBuyXGetYVouchers.length === 0) {
      setDiscountAmount(0);
      setSelectedVoucher(null);
      setAppliedVoucher(null);
    } else {
      // Thông báo nếu áp dụng voucher mới
      if (
        bestVoucher &&
        bestVoucher._id !== (appliedVoucher ? appliedVoucher._id : null)
      ) {
        message.destroy();
        message.success(`Áp dụng mã khuyến mãi ${bestVoucher.code} thành công!`);
        setAppliedVoucher(bestVoucher);
      }
    }
  };

  useEffect(() => {
    if (!isRemoving) {
      filterApplicableVouchers();
    }
  }, [cart, vouchers, isRemoving]);


  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    const unitName = selectedUnit[product.productId];
    const unit = product.units.find((unit) => unit.unitName === unitName);
    const price = unit ? unit.price : 0;
    const quantity = inputQuantity[product.productId] || 1;
    const availableQuantity = selectedQuantity[product.productId];

    // Kiểm tra nếu số lượng yêu cầu vượt quá số lượng tồn kho
    if (quantity > availableQuantity) {
      return message.error("Sản phẩm không còn đủ số lượng trong kho!");
    }

    // Kiểm tra nếu sản phẩm không có giá bán
    if (!product.units.some((unit) => unit.price > 0)) {
      return message.warning("Sản phẩm này không có giá bán!");
    }

    // Kiểm tra nếu đơn vị đã chọn hết hàng
    if (availableQuantity === 0) {
      return message.warning("Đơn vị đã chọn hết hàng!");
    }

    // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
    const itemInCart = cart.find(
      (item) => item.productId === product.productId && item.unit === unitName
    );

    if (itemInCart) {
      // Nếu sản phẩm đã có trong giỏ, cộng thêm số lượng
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === product.productId && item.unit === unitName
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Nếu sản phẩm chưa có trong giỏ, thêm sản phẩm mới
      setCart([...cart, { ...product, unit: unitName, price, quantity }]);
    }

    // Cập nhật lại số lượng tồn kho sau khi thêm vào giỏ
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

    try {
      await createDirectSaleBill({
        paymentMethod,
        items,
        customerId: selectedCustomer._id,
        voucherCode: selectedVoucher ? selectedVoucher.code : "",
        createBy: employeeId,
      });
      message.success("Thanh toán thành công!");

      setIsCheckoutModalOpen(false);
      setCart([]);
      setDiscountAmount(0);
      setSelectedVoucher(null);
      setSelectedCustomer(null);
      setSearchPhoneNumber("");
      handlePrintInvoice();
    } catch (error) {
      message.error("Lỗi khi thanh toán. Vui lòng thử lại.");
      console.error(error);
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
          // marginRight: "20px",
          height: "85vh",
          overflowY: "auto",
          border: "1px solid #f0f0f0",
        }}
      >
        {/* Header cố định */}
        <div
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "#f5f5f5 ",
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
            style={{ fontStyle: "italic", fontWeight: "bold", padding: "5px" }}
          >
            Sản phẩm
          </h3>

          <Input
            placeholder="Tìm kiếm sản phẩm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "40%", marginBottom: "10px", marginLeft: "10px" }}
          />
          <Select
            placeholder="Chọn danh mục"
            onChange={(value) => setSelectedCategory(value)}
            value={selectedCategory}
            style={{ width: "40%", marginBottom: "10px", marginLeft: "10px" }}
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
          {" "}
          Giỏ hàng <ShoppingCartOutlined />
        </Title>
        <div style={{ minHeight: "50%" }}>
          {" "}
          <CartTable
            removeFromCart={removeFromCart}
            cart={cart}
            formatCurrency={formatCurrency}
          />
        </div>

        {/* hộp qà */}
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
            // color: "#1890ff",
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

        {/* giao diện xác nhân */}
        <Modal
          visible={isCheckoutModalOpen}
          onCancel={() => setIsCheckoutModalOpen(false)}
          footer={null}
        >
          <div ref={invoiceRef}>
            {/* Thông tin tiêu đề và siêu thị */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h4 style={{ textAlign: "center", fontWeight: "bold" }}>
                Hóa Đơn Siêu Thị C'Mart
              </h4>
              <br />
              <p>Địa chỉ: 04 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
              <p>Hotline: 076 848 6006</p>
              <p>* * *</p>
            </div>

            {/* Thông tin người tạo bill và khách hàng */}
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

            {/* Sản phẩm mua - Tiêu đề */}
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

            {/* Danh sách sản phẩm */}
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

            {/* Tổng tiền */}
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
