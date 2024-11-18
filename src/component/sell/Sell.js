import React, { useState, useRef, useEffect, useContext } from "react";
import { Search, Plus, MapPin, Maximize2, RotateCcw, Home, HelpCircle, Trash2, CreditCard } from 'lucide-react';
import { Button, Form, Table, Card, Modal, InputGroup, Dropdown } from 'react-bootstrap';
import { message } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllPriceProduct } from "../../untills/priceApi";
import { getAllActiveVouchers } from "../../services/voucherService";
import { getAllCustomers } from "../../untills/customersApi";
import { getEmployeeById } from "../../untills/employeesApi";
import { createDirectSaleBill } from "../../untills/api";
import { AuthContext } from "../../untills/context/AuthContext";
import VoucherModal from "./VoucherModal";

const Sell = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [cart, setCart] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const { user } = useContext(AuthContext);
  const [employeeId, setEmployeeId] = useState(null);
  const suggestionsRef = useRef(null);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [applicableVouchers, setApplicableVouchers] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const invoiceRef = useRef(null);
  const cartRef = useRef(cart);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
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
    const fetchData = async () => {
      try {
        const productsData = await getAllPriceProduct();
        if (productsData.success) {
          setProducts(productsData.prices || []);
        } else {
          console.error("Failed to fetch products:", productsData.message);
        }

        const vouchersData = await getAllActiveVouchers();
        setVouchers(vouchersData || []);

        const customersData = await getAllCustomers();
        setCustomers(customersData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Tìm thông tin chi tiết của sản phẩm quà tặng
  const findGiftProductDetails = (productId, unitName) => {
    const product = products.find((prod) => prod.productId === productId);
    if (!product) return null;
  
    const unit = product.units.find((u) => u.unitName === unitName);
    if (!unit) return null;
  
    return {
      code: product.code,
      productName: product.productName,
      barcode: unit.barcode,
      unitName: unit.unitName,
      price: unit.price,
      quantity: unit.quantity,
      conversionValue: unit.conversionValue, 
    };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = products.flatMap(product => 
        product.units.filter(unit => 
          unit.barcode.includes(value) ||
          product.code.toLowerCase().includes(value.toLowerCase()) ||
          product.productName.toLowerCase().includes(value.toLowerCase())
        ).map(unit => ({ ...product, selectedUnit: unit }))
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const updatedCart = [...prev];
  
      const existing = updatedCart.find(
        (item) =>
          item.productId === product.code && item.unit === product.selectedUnit.unitName
      );
  
      if (existing) {
        existing.quantity += 1;
      } else {
        updatedCart.push({
          code: product.code,
          productId: product.productId,
          productName: product.productName,
          price: product.selectedUnit.price,
          quantity: 1,
          unit: product.selectedUnit.unitName,
          barcode: product.selectedUnit.barcode,
          isGift: false, // Sản phẩm thêm mới không phải quà tặng
        });
      }
  
      // Kiểm tra và cập nhật quà tặng nếu đủ điều kiện
      return updateGiftItems(updatedCart);
    });
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
  };
  
  const removeFromCart = (productId, unit) => {
    setIsRemoving(true);
  
    setCart((prev) => {
      let updatedCart = prev.filter((item) => !(item.productId === productId && item.unit === unit));
  
      // Loại bỏ quà tặng nếu không còn đáp ứng điều kiện
      return updateGiftItems(updatedCart);
    });
  
    setIsRemoving(false);
  };
  
  // Hàm cập nhật các quà tặng
  const updateGiftItems = (cart) => {
    const updatedCart = [...cart];
  
    // Lấy danh sách các voucher áp dụng được
    const voucherList = Array.isArray(vouchers)
      ? vouchers.filter((voucher) => voucher.isActive && !voucher.isDeleted)
      : [];
  
    // Duyệt qua các voucher loại "BuyXGetY"
    voucherList.forEach((voucher) => {
      if (voucher.type === "BuyXGetY" && voucher.conditions) {
        const buyCondition = voucher.conditions;
  
        // Tìm sản phẩm X trong giỏ hàng
        const productX = updatedCart.find(
          (item) =>
            item.productId === buyCondition.productXId &&
            item.unit === buyCondition.unitX &&
            !item.isGift
        );
  
        const applicableQuantity = productX
          ? Math.floor(productX.quantity / buyCondition.quantityX)
          : 0;
  
        // Tìm quà tặng Y trong giỏ hàng
        const giftIndex = updatedCart.findIndex(
          (item) =>
            item.productId === buyCondition.productYId &&
            item.unit === buyCondition.unitY &&
            item.isGift
        );
  
        if (applicableQuantity > 0) {
          // Nếu có đủ điều kiện, thêm hoặc cập nhật số lượng quà tặng
          const effectiveQuantity = applicableQuantity * buyCondition.quantityY;
  
          if (giftIndex >= 0) {
            // Cập nhật số lượng quà tặng
            updatedCart[giftIndex].quantity = effectiveQuantity;
          } else {
            // Thêm mới quà tặng vào giỏ hàng
            const giftProductDetails = findGiftProductDetails(
              buyCondition.productYId,
              buyCondition.unitY
            );
            if (giftProductDetails) {
              updatedCart.push({
                productId: buyCondition.productYId,
                productName: giftProductDetails.productName,
                code: giftProductDetails.code,
                barcode: giftProductDetails.barcode,
                unit: giftProductDetails.unitName,
                price: giftProductDetails.price || 0, 
                quantity: effectiveQuantity,
                isGift: true,
              });
            }
          }
        } else if (giftIndex >= 0) {
          // Nếu không đủ điều kiện, xóa quà tặng khỏi giỏ hàng
          updatedCart.splice(giftIndex, 1);
        }
      }
    });
  
    return updatedCart;
  };
  

  const updateQuantity = (productId, unit, newQuantity) => {
    if (newQuantity < 1) return;
  
    setCart((prev) => {
      // Cập nhật số lượng sản phẩm trong giỏ hàng
      const updatedCart = prev.map((item) =>
        item.productId === productId && item.unit === unit
          ? { ...item, quantity: newQuantity }
          : item
      );
  
      // Kiểm tra và cập nhật lại quà tặng
      return updateGiftItems(updatedCart);
    });
  };
  

  const handleCustomerSearch = (value) => {
    setCustomerSearchTerm(value);
    const customer = customers.find(c => c.phoneNumber === value);
    setSelectedCustomer(customer || null);
  };

  const handleVoucherModal = () => {
    setShowVoucherModal(true);
  };

  const closeVoucherModal = () => {
    setShowVoucherModal(false);
  };

  const total = cart
    .filter((item) => !item.isGift) 
    .reduce((sum, item) => sum + item.price * item.quantity, 0);


    const filterApplicableVouchers = () => {
      const voucherList = Array.isArray(vouchers)
        ? vouchers.filter((voucher) => voucher.isActive && !voucher.isDeleted)
        : [];
    
        const totalAmount = cart
        .filter((item) => !item.isGift) // Loại bỏ sản phẩm khuyến mãi
        .reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    
      let bestVoucher = null;
      let maxDiscount = 0;
    
      // Lọc qua tất cả voucher để tìm voucher có mức giảm giá tốt nhất
      voucherList.forEach((voucher) => {
        const discount = calculateVoucherDiscount(voucher, totalAmount);
    
        if (discount > maxDiscount) {
          maxDiscount = discount;
          bestVoucher = voucher;
        }
      });
    
      // Áp dụng voucher tốt nhất (nếu có)
      const applicableVouchers = bestVoucher ? [bestVoucher] : [];
      setSelectedVouchers(applicableVouchers);
    
      // Tính tổng giảm giá
      setDiscountAmount(maxDiscount);
    
      // Quà tặng (nếu có Buy X Get Y)
      const buyXGetYResults = [];
      const updatedCart = [...cart];
    
      voucherList.forEach((voucher) => {
        if (voucher.type === "BuyXGetY" && voucher.conditions) {
          const buyCondition = voucher.conditions;
    
          cart.forEach((cartItem) => {
            if (
              cartItem.productId === buyCondition.productXId &&
              cartItem.unit === buyCondition.unitX &&
              !cartItem.isGift
            ) {
              const applicableQuantity = Math.floor(
                cartItem.quantity / buyCondition.quantityX
              );
    
              if (applicableQuantity > 0) {
                buyXGetYResults.push({
                  voucher,
                  totalGiftQuantity: applicableQuantity * buyCondition.quantityY,
                  giftProductId: buyCondition.productYId,
                  giftUnit: buyCondition.unitY,
                  conversionValue: buyCondition.conversionValueY,
                });
              }
            }
          });
        }
      });
    
      // Thêm quà tặng vào giỏ hàng
      buyXGetYResults.forEach((result) => {
        const giftProductDetails = findGiftProductDetails(
          result.giftProductId,
          result.giftUnit
        );
    
        if (giftProductDetails) {
          const effectiveQuantity = result.totalGiftQuantity * (result.conversionValue || 1);
    
          if (giftProductDetails.quantity >= effectiveQuantity) {
            const giftIndex = updatedCart.findIndex(
              (item) =>
                item.productId === result.giftProductId &&
                item.unit === result.giftUnit &&
                item.isGift
            );
    
            if (giftIndex >= 0) {
              const currentGift = updatedCart[giftIndex];
              if (currentGift.quantity !== effectiveQuantity) {
                updatedCart[giftIndex] = {
                  ...currentGift,
                  quantity: effectiveQuantity,
                };
              }
            } else {
              updatedCart.push({
                productId: result.giftProductId,
                productName: giftProductDetails.productName,
                code: giftProductDetails.code,
                barcode: giftProductDetails.barcode,
                unit: giftProductDetails.unitName,
                price: giftProductDetails.price || 0,
                quantity: effectiveQuantity,
                isGift: true,
              });
            }
          } else {
            console.warn(
              `Quà tặng không đủ tồn kho: ${result.giftProductId} (Yêu cầu: ${effectiveQuantity}, Có sẵn: ${giftProductDetails.quantity})`
            );
          }
        } else {
          console.error(
            `Không tìm thấy thông tin sản phẩm quà tặng: ${result.giftProductId}`
          );
        }
      });
    
      // Cập nhật giỏ hàng nếu thay đổi
      if (JSON.stringify(updatedCart) !== JSON.stringify(cart)) {
        setCart(updatedCart);
      }
    };
    
    
    
    const calculateVoucherDiscount = (voucher, totalAmount) => {
      if (voucher.type === "PercentageDiscount" && voucher.conditions) {
        const discount = Math.min(
          (totalAmount * voucher.conditions.discountPercentage) / 100,
          voucher.conditions.maxDiscountAmount || totalAmount
        );
        return totalAmount >= voucher.conditions.minOrderValue ? discount : 0;
      } else if (voucher.type === "FixedDiscount" && voucher.conditions) {
        return totalAmount >= voucher.conditions.minOrderValue
          ? voucher.conditions.discountAmount
          : 0;
      }
      return 0;
    };
    

    
    useEffect(() => {
      if (!isRemoving) {
        filterApplicableVouchers();
      }
    }, [JSON.stringify(cart), vouchers]);
    
  const handleShowCheckoutModal = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleHideCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };

  const validateCart = () => {
    const invalidItems = cart.filter((item) => item.quantity <= 0 || item.price <= 0);
    
    if (invalidItems.length > 0) {
      const errorMessages = invalidItems.map(
        (item) =>
          `Sản phẩm ${item.productName} :\n` +
          (item.quantity <= 0 ? " - Số lượng phải lớn hơn 0.\n" : "") +
          (item.price <= 0 ? " - Đơn giá phải lớn hơn 0.\n" : "")
      ).join("\n");
  
      message.error(`Lỗi trong giỏ hàng:\n${errorMessages}`);
      return false;
    }
  
    return true;
  };
  
  // xác nhận thanh toán 
  const confirmPayment = async () => {
    // Kiểm tra khách hàng được chọn
    if (!selectedCustomer) {
      message.warning("Vui lòng chọn khách hàng trước khi thanh toán.");
      return;
    }
  
    // Xác minh giỏ hàng hợp lệ
    if (!validateCart()) {
      return;
    }
  
    // Tạo payload từ dữ liệu giỏ hàng và thông tin khách hàng
    const payload = {
      paymentMethod,
      items: cart.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        unit: item.unit,
        currentPrice: item.isGift || item.discountedPrice === 0 
          ? 0 
          : (item.discountedPrice || item.price),
      })),
      createBy: employeeId,
      customerId: selectedCustomer._id,
      voucherCodes: selectedVouchers.map((voucher) => voucher.code),
    };
  
    try {
      // Gọi API để tạo hóa đơn
      const response = await createDirectSaleBill(payload);
  
      // Xử lý kết quả trả về từ API
      if (response && response.bill) {
        message.success("Thanh toán thành công!");
  
        // Lấy mã hóa đơn từ phản hồi API
        const billCode = response.bill.billCode;
  
        // Đóng modal thanh toán và đặt lại trạng thái
        setIsCheckoutModalOpen(false);
        setCart([]); // Xóa giỏ hàng sau khi thanh toán thành công
        setDiscountAmount(0); // Đặt lại giảm giá
        setSelectedCustomer(null); // Xóa khách hàng đã chọn
  
        // In hóa đơn với mã hóa đơn (billCode)
        handlePrintInvoice(billCode);
      } else {
        // Nếu không trả về hóa đơn hợp lệ, hiển thị lỗi
        throw new Error(response.message || "Không thể tạo hóa đơn.");
      }
    } catch (error) {
      // Xử lý lỗi nếu xảy ra
      console.error("Error during payment confirmation:", error);
      message.error(`Đã xảy ra lỗi khi thanh toán: ${error.message}`);
    }
  };
  
  
  

  const handlePrintInvoice = (billCode) => {
    const printContent = `
      <html>
        <head>
          <title>Hóa đơn</title>
          <style>
            @page {
              size: 100mm auto; /* Kích thước giấy */
              margin: 0; /* Xóa margin */
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              margin: 0;
              padding: 0;
              width: 100mm; /* Chiều rộng hóa đơn */
            }
            .bill-container {
              padding: 5px;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              margin-bottom: 10px;
            }
            .header h4 {
              margin: 0;
              font-size: 14px;
              font-weight: bold;
            }
            .header p {
              margin: 2px 0;
            }
            .bill-details {
              margin: 10px 0;
            }
            .bill-details div {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0;
            }
            table thead th {
              text-align: left;
              border-bottom: 1px dashed #000;
              padding: 5px 0;
            }
            table tbody td {
              padding: 5px 0;
              vertical-align: top;
            }
            table tbody tr:not(:last-child) td {
              border-bottom: 1px dashed #000;
            }
            .col-name {
              width: 50%; /* Tên hàng chiếm 50% chiều rộng */
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            .col-unit {
              width: 10%;
              text-align: center;
              white-space: nowrap; /* Không cho xuống dòng */
            }
            .col-price,
            .col-quantity,
            .col-total {
              width: 10%;
              text-align: right;
              white-space: nowrap;
            }
            .total-section {
              margin: 10px 0;
            }
            .total-section div {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 10px;
              font-size: 12px;
              font-weight: bold;
            }
            .promo-note {
              color: red;
              font-style: italic;
              display: block;
            }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <div class="header">
              <h4>Hóa Đơn Siêu Thị C'Mart</h4>
              <p>Địa chỉ: 04 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
              <p>Hotline: 076 848 6006</p>
              <p>---</p>
            </div>
            <div class="bill-details">
              <div><span><strong>Mã hóa đơn:</strong></span> <span>${billCode}</span></div>
              <div><span><strong>Nhân viên lập:</strong></span> <span>${user ? user.fullName : "N/A"}</span></div>
              <div><span><strong>Khách hàng:</strong></span> <span>${selectedCustomer ? selectedCustomer.fullName : "Khách vãng lai"}</span></div>
              <div><span><strong>Ngày:</strong></span> <span>${new Date().toLocaleString()}</span></div>
            </div>
            <table>
              <thead>
                <tr>
                  <th class="col-name">Tên hàng</th>
                  <th class="col-unit">Đ.Vị</th>
                  <th class="col-price">Đ.Gía</th>
                  <th class="col-quantity">SL</th>
                  <th class="col-total">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${cart.map(item => `
                  <tr>
                    <td class="col-name">
                      ${item.productName} 
                      ${item.isGift ? '<span class="promo-note">(Khuyến mãi)</span>' : ''}
                    </td>
                    <td class="col-unit">${item.unit}</td>
                    <td class="col-price">${item.price.toLocaleString()}đ</td>
                    <td class="col-quantity">${item.quantity}</td>
                    <td class="col-total">${(item.quantity * item.price).toLocaleString()}đ</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="total-section">
              <div><span><strong>Thành tiền:</strong></span> <span>${total.toLocaleString()}đ</span></div>
              <div><span><strong>Chiết khấu:</strong></span> <span>${discountAmount.toLocaleString()}đ</span></div>
              <div><span><strong>Tổng cộng:</strong></span> <span>${(total - discountAmount).toLocaleString()}đ</span></div>
            </div>
            <div class="footer">
              <p>Cảm ơn quý khách, hẹn gặp lại!</p>
            </div>
          </div>
        </body>
      </html>
    `;
  
    const printWindow = window.open("", "_blank", "width=100,height=auto");
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  
    setTimeout(() => printWindow.print(), 500);
  };
  
  
  
  
  
  

  

  const totalDiscounted = total - discountAmount;

  return (
    <div className="d-flex h-100">
      {/* Left Panel */}
      <div className="flex-grow-1 d-flex flex-column border-end">
        {/* Top Bar */}
        <div className="p-3 border-bottom d-flex align-items-center gap-2">
          <div className="flex-grow-1 position-relative">
            <Form.Control
              type="text"
              placeholder="Thêm sản phẩm vào đơn"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="position-absolute w-100 bg-white border rounded shadow-sm mt-1"
              >
                {suggestions.map((product, index) => (
                  <div
                    key={`${product.code}-${product.selectedUnit.unitName}-${index}`}
                    className="p-2 hover-bg-light cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    {product.productName} - {product.code} -{" "}
                    {product.selectedUnit.unitName} - {product.selectedUnit.barcode}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button variant="light">
            <MapPin size={16} />
          </Button>
          <Button variant="light">
            <Plus size={16} />
          </Button>
          <Button variant="light">
            <Maximize2 size={16} />
          </Button>
          <Button variant="light">
            <RotateCcw size={16} />
          </Button>
          <Button variant="light">
            <Home size={16} />
          </Button>
          <Button variant="light">
            <HelpCircle size={16} />
          </Button>
        </div>
  
        {/* Cart Table */}
        <div className="flex-grow-1 overflow-auto">
          <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "50px" }}>STT</th>
              <th style={{ width: "80px" }}>Mã SP</th>
              <th style={{ width: "150px" }}>Tên sản phẩm</th>
              <th style={{ width: "80px" }}>Đơn vị</th>
              <th style={{ width: "120px" }}>Barcode</th>
              <th style={{ width: "100px" }}>Đơn giá</th>
              <th style={{ width: "80px" }}>Số lượng</th>
              <th style={{ width: "80px" }}>Thành tiền</th>
              <th style={{ width: "100px" }}>Ghi chú</th>
              <th style={{ width: "50px" }}></th>
            </tr>
          </thead>

            <tbody>
              {cart.map((item, index) => (
                <tr key={`${item.code}-${item.unit}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{item.code || "Không có mã"}</td>
                  <td>{item.productName}</td>
                  <td>{item.unit}</td>
                  <td>{item.barcode || "Không có barcode"}</td>
                  <td className="text-end">{item.price.toLocaleString()}đ</td>
                  <td>
                    <Form.Control
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.productId,
                          item.unit,
                          parseInt(e.target.value)
                        )
                      }
                      min={1}
                      className="w-75"
                    />
                  </td>
                  <td className="text-end">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </td>
                  <td>{item.isGift ? "Hàng khuyến mãi" : ""}</td>
                  <td>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => removeFromCart(item.productId, item.unit)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
  
        {/* Bottom Toolbar */}
        <div className="p-3 border-top bg-light">
          <div className="row row-cols-4 g-2">
            <div className="col">
              <Button
                variant="secondary"
                className="w-100"
                onClick={handleVoucherModal}
              >
                Khuyến mãi 
              </Button>
            </div>
            <div className="col">
              <Button variant="secondary" className="w-100">
                Thêm dịch vụ 
              </Button>
            </div>
            <div className="col">
              <Button variant="secondary" className="w-100">
                Chiết khấu đơn
              </Button>
            </div>
            <div className="col">
              <Button variant="secondary" className="w-100">
                Đổi quà
              </Button>
            </div>
            <div className="col">
              <Button variant="secondary" className="w-100">
                Ghi chú đơn hàng
              </Button>
            </div>
            <div className="col">
              <Button variant="secondary" className="w-100">
                Đổi giá bán hàng
              </Button>
            </div>
            <div className="col">
              <Button variant="secondary" className="w-100">
                Xem báo cáo
              </Button>
            </div>
            <div className="col">
              <Button variant="secondary" className="w-100">
                Danh sách thao tác
              </Button>
            </div>
          </div>
        </div>
      </div>
  
      {/* Right Panel */}
      <div className="w-25 d-flex flex-column">
        <div className="p-3 border-bottom">
        <InputGroup>
            <Form.Control
              placeholder="Thêm khách hàng vào đơn "
              value={customerSearchTerm}
              onChange={(e) => handleCustomerSearch(e.target.value)}
            />
            <Button variant="light" style={{marginLeft: 10, borderRadius : 5}}>
              <Plus size={16} />
            </Button>
          </InputGroup>
          
          {selectedCustomer && (
            <div className="mt-2">
              <strong>Khách hàng: </strong> {selectedCustomer.fullName}
            </div>
          )}
         
        </div>
  
        <div className="flex-grow-1 p-3">
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Số lượng sản phẩm</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tổng tiền</span>
                <span>{total.toLocaleString()}đ</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-danger">
                <span>Chiết khấu</span>
                <span>-{discountAmount.toLocaleString()}đ</span>
              </div>
              <div className="d-flex justify-content-between mb-2 fw-bold">
                <span>Khách phải trả</span>
                <span>{totalDiscounted.toLocaleString()}đ</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tiền khách đưa</span>
                <span>{totalDiscounted.toLocaleString()}đ</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Tiền thừa</span>
                <span>0đ</span>
              </div>
            </Card.Body>
          </Card>
        </div>
  
        <div className="p-3 border-top">
        <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-payment-method">
                {paymentMethod === "Cash" ? <CreditCard size={16} /> : <CreditCard size={16} />}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handlePaymentMethodChange("Cash")}>Tiền mặt</Dropdown.Item>
                <Dropdown.Item onClick={() => handlePaymentMethodChange("Card")}>Thẻ</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button
              variant="primary"
              size="lg"
              className="flex-grow-1"
              onClick={handleShowCheckoutModal}
            >
              Thanh toán ({paymentMethod === "Cash" ? "Tiền mặt" : "Thẻ"})
            </Button>
          </div>

        </div>
      </div>
  
      {/* Voucher Modal */}
      {showVoucherModal && (
        <VoucherModal
          vouchers={vouchers}
          isModalVisible={showVoucherModal}
          onCancel={closeVoucherModal}
          onSelectVouchers={setSelectedVouchers}
        />
      )}
  
      {/* Confirmation Modal */}
      <Modal show={isCheckoutModalOpen} onHide={handleHideCheckoutModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={invoiceRef}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h4 style={{ textAlign: "center", fontWeight: "bold" }}>Hóa Đơn Siêu Thị C'Mart</h4>
              <br />
              <p>Địa chỉ: 04 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
              <p>Hotline: 076 848 6006</p>
              <p>* * *</p>
            </div>
            <div className="header-section" style={{ borderBottom: "1px solid #ccc", paddingBottom: "15px", marginBottom: "15px" }}>
           
              <p><strong>Người tạo đơn:</strong> {user ? user.fullName : "N/A"}</p>
              <p><strong>Tên khách hàng:</strong> {selectedCustomer ? selectedCustomer.fullName : "Khách vãng lai"}</p>
              <p><strong>Ngày tạo:</strong> {new Date().toLocaleString()}</p>
            </div>
            <div style={{ display: "flex", fontWeight: "bold", borderBottom: "1px dashed #ccc", paddingBottom: "8px", marginBottom: "10px" }}>
              <div style={{ flex: 2 }}>Tên hàng</div>
              <div style={{ flex: 1 }}>Đơn Vị</div>
              <div style={{ flex: 1 }}>Đ.Giá</div>
              <div style={{ flex: 1 }}>SL</div>
              <div style={{ flex: 1 }}>Thành tiền</div>
            </div>
            {/* {cart.map((item) => (
              <div key={item.productId} style={{ display: "flex", borderBottom: "1px dashed #ccc", padding: "8px 0" }}>
                <div style={{ flex: 2 }}>
                  {item.productName}<br />
                  {item.isGift && <span style={{ color: "red", marginLeft: "10px" }}>khuyến mãi</span>}
                </div>
                <div style={{ flex: 1 }}>{item.unit}</div>
                <div style={{ flex: 1 }}>{item.price.toLocaleString()}đ</div>
                <div style={{ flex: 1 }}>{item.quantity}</div>
                <div style={{ flex: 1 }}>{(item.quantity * item.price).toLocaleString()}đ</div>
              </div>
            ))} */}
{cart.map((item) => (
  <React.Fragment key={item.productId}>
    {/* Nếu là sản phẩm khuyến mãi */}
    {item.isGift && (
      <div style={{ display: "flex", borderBottom: "1px dashed #ccc", padding: "8px 0", fontStyle: "italic", color: "red" }}>
        <div style={{ flex: 2 }}>Khuyến mãi:</div>
        <div style={{ flex: 1 }}>-</div>
        <div style={{ flex: 1 }}>-</div>
        <div style={{ flex: 1 }}>-</div>
        <div style={{ flex: 1 }}>-</div>
      </div>
    )}
    {/* Hiển thị sản phẩm */}
    <div style={{ display: "flex", borderBottom: "1px dashed #ccc", padding: "8px 0" }}>
      <div style={{ flex: 2 }}>{item.productName}</div>
      <div style={{ flex: 1 }}>{item.unit}</div>
      <div style={{ flex: 1 }}>{item.price.toLocaleString()}đ</div>
      <div style={{ flex: 1 }}>{item.quantity}</div>
      <div style={{ flex: 1 }}>{(item.quantity * item.price).toLocaleString()}đ</div>
    </div>
  </React.Fragment>
))}

            <div style={{ padding: "10px", marginTop: "10px", textAlign: "right" }}>
              <p><strong>Thành tiền:</strong> {total.toLocaleString()}đ</p>
              <p><strong>Chiết khấu:</strong> {discountAmount.toLocaleString()}đ</p>
              <p><strong>Tổng tiền:</strong> {(total - discountAmount).toLocaleString()}đ</p>
            </div>
          </div>
          <p style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold", color: "#888" }}>
            Cảm ơn quý khách, hẹn gặp lại!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHideCheckoutModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={confirmPayment}>
            Xác nhận và In hóa đơn
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sell;