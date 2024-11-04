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
import ProductFilter from "./ProductFilter";
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
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const invoiceRef = useRef(null);
//lấy nhân vien
  useEffect(() => {
    const fetchEmployeeId = async () => {
      if (user?._id) {
        try {
          const employeeData = await getEmployeeById(user._id);
          setEmployeeId(employeeData._id); 
        } catch (error) {
          console.error('Không thể lấy employeeId:', error);
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
          setFilteredPrices(data.prices); //lọc
          initializeProductState(data.prices);

          const uniqueCategories = [...new Set(data.prices.map(item => item.category))];
          setCategories(uniqueCategories);
        } else {
          setError(data.message);
        }
        const voucherData = await getAllActiveVouchers();
        setVouchers(voucherData);

        const customerData = await getAllCustomers();
        setCustomers(customerData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchPrices();
  }, []);
  // Cập nhật danh sách sản phẩm đã lọc khi `searchText` hoặc `selectedCategory` thay đổi
  useEffect(() => {
    // Thực hiện lọc sản phẩm dựa vào tên và danh mục
    const filtered = prices.filter((product) => {
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchesSearch = product.productName.toLowerCase().includes(searchText.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    setFilteredPrices(filtered);
  }, [searchText, selectedCategory, prices]);
  //chọn khách hàng
  const handleCustomerSelect = (customer) => {
    if (!customer) {
      // Reset khi không có khách hàng nào được chọn
      setSelectedCustomer(null);
      setSearchPhoneNumber("");
    } else {
      // Cập nhật khi chọn khách hàng
      setSelectedCustomer(customer);
      setSearchPhoneNumber(customer.phoneNumber);
    }
  };


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
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.productId === productId && item.unit === unitName)
      )
    );
  };

  const filterApplicableVouchers = () => {
    const voucherList = Array.isArray(vouchers) ? vouchers : [];
    const totalAmount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  
    let bestVoucher = null;
    let maxDiscount = 0;
  
    // Tính mức giảm cho từng voucher và tìm voucher có mức giảm lớn nhất
    voucherList.forEach((voucher) => {
      let discount = 0;
      
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
      }
  
      if (discount > maxDiscount) {
        maxDiscount = discount;
        bestVoucher = voucher;
      }
    });
  
    setDiscountAmount(maxDiscount); 
    setSelectedVoucher(bestVoucher); 
  
    // Hiển thị thông báo nếu voucher hiện tại khác với voucher đã được áp dụng trước đó
    if (bestVoucher && bestVoucher._id !== (appliedVoucher ? appliedVoucher._id : null)) {
      message.destroy();  // Đóng tất cả các thông báo hiện tại
      message.success(`Áp dụng mã khuyến mãi ${bestVoucher.code} thành công!`);
      setAppliedVoucher(bestVoucher); // Cập nhật voucher đã được áp dụng
    }
  };
  
  
  // Cập nhật hàm useEffect để tự động áp dụng voucher tốt nhất khi có thay đổi giỏ hàng
  useEffect(() => {
    filterApplicableVouchers();
  }, [cart, vouchers]);
  
  // Cập nhật hàm useEffect để tự động áp dụng voucher tốt nhất khi có thay đổi giỏ hàng
  useEffect(() => {
    filterApplicableVouchers();
  }, [cart, vouchers]);
   // thêm sp vào giỏ hàng
   const addToCart = (product) => {
    const unitName = selectedUnit[product.productId];
    const unit = product.units.find((unit) => unit.unitName === unitName);
    const price = unit ? unit.price : 0;
    const quantity = inputQuantity[product.productId] || 1;
  
    // Kiểm tra nếu không có đơn vị nào có giá > 0
    if (!product.units.some((unit) => unit.price > 0)) {
      return message.warning("Sản phẩm này không có giá bán!");
    }
  
    // Kiểm tra nếu số lượng bằng 0
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
  
    // message.success("Sản phẩm đã được thêm vào giỏ hàng!");
  };
//nút xác nhận thanh toán
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

    // console.log("Items sent to createDirectSaleBill:", items);

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

  // Hàm tạo PDF từ hóa đơn
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
        <div style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#f5f5f5 ",
          zIndex: 1,
          paddingBottom: "10px",
          borderBottom: "2px solid #f0f0f0",
          border: "1px solid #f0f0f0",
          
        }}>
          <CustomerSelect
            onCustomerSelect={setSelectedCustomer}
            selectedCustomer={selectedCustomer}
          />

          <h3 style={{ fontStyle: "italic", fontWeight: "bold" , padding :"5px"}}>Sản phẩm</h3>

          <Input
            placeholder="Tìm kiếm sản phẩm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "40%", marginBottom: "10px" , marginLeft : '10px'}}
          />
          <Select
            placeholder="Chọn danh mục"
            onChange={(value) => setSelectedCategory(value)}
            value={selectedCategory}
            style={{ width: "40%", marginBottom: "10px", marginLeft : '10px' }}
          >
            <Option value={null}>Tất cả</Option>
            {categories.map((category) => (
              <Option key={category} value={category}>{category}</Option>
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
                      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>{product.productName}</h2>
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
          
          <Title style={{ fontWeight: 'bold', fontStyle: 'italic' }} level={2}> Giỏ hàng <ShoppingCartOutlined /></Title>
          <div style={{minHeight : '50%'}}> <CartTable
            removeFromCart={removeFromCart}
            cart={cart}
            formatCurrency={formatCurrency}
      
          /></div>
         
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
            style={{ fontSize: "16px", textAlign: "right", marginRight: "20px",  fontStyle: 'italic'  }}
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
            style={{ width: "150px", height: "50px", position: "absolute", bottom: "20px", right: "20px" }}
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
              <h4 style={{ textAlign: 'center', fontWeight: 'bold' }}>Hóa Đơn Siêu Thị C'Mart</h4><br />
                <p>Địa chỉ: 04 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
                <p>Hotline: 076 848 6006</p>
              <p>* * *</p>  
              </div>

              {/* Thông tin người tạo bill và khách hàng */}
              <div className="header-section" style={{ borderBottom: "1px solid #ccc", paddingBottom: "15px", marginBottom: "15px" }}>
                <p><strong>NV bán hàng:</strong> {user ? user.fullName : "N/A"}</p>
                <p><strong>Tên khách hàng:</strong> {selectedCustomer ? selectedCustomer.fullName : "Khách vãng lai"}</p>
                <p><strong>Ngày tạo:</strong> {new Date().toLocaleString()}</p>
              </div>

              {/* Sản phẩm mua - Tiêu đề */}
              <div style={{ display: "flex", fontWeight: "bold", borderBottom: "1px dashed #ccc", paddingBottom: "8px", marginBottom: "10px" }}>
                <div style={{ flex: 2 }}>Tên sản phẩm</div>
                <div style={{ flex: 1 }}>Đơn vị</div>
                <div style={{ flex: 1 }}>Giá</div>
                <div style={{ flex: 1 }}>Số lượng</div>
                <div style={{ flex: 1 }}>Thành tiền</div>
              </div>

              {/* Danh sách sản phẩm */}
              {cart.map((item) => (
                <div key={item.productId} style={{ display: "flex", borderBottom: "1px dashed #ccc", padding: "8px 0" }}>
                  <div style={{ flex: 2 }}>{item.productName}</div>
                  <div style={{ flex: 1 }}>{item.unit}</div>
                  <div style={{ flex: 1 }}>{formatCurrency(item.price)}</div>
                  <div style={{ flex: 1 }}>{item.quantity}</div>
                  <div style={{ flex: 1 }}>{formatCurrency(item.quantity * item.price)}</div>

                </div>
              ))}

              {/* Tổng tiền */}
              <div style={{ padding: "10px", marginTop: "10px", textAlign: "right" }}>
                <p><strong>Thành tiền:</strong> {formatCurrency(cart.reduce((acc, item) => acc + item.price * item.quantity, 0))}</p>
                <p><strong>Chiết khấu:</strong> {formatCurrency(discountAmount)}</p>
                <p><strong>Tổng tiền:</strong> {formatCurrency(cart.reduce((acc, item) => acc + item.price * item.quantity, 0) - discountAmount)}</p>
              </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold', color: '#888' }}>
            Cảm ơn quý khách, hẹn gặp lại!
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <Button type="primary" onClick={handlePayment} style={{ width: "auto" }}>
                Xác nhận và In hóa đơn
              </Button>
            </div>

          </Modal>

        </div>
      </div>
    );
  };

  export default ProductPrices;
