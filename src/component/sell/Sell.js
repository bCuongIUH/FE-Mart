// import React, { useState, useRef, useEffect, useContext } from "react";
// import { Search, Plus, MapPin, Maximize2, RotateCcw, Home, HelpCircle, Trash2, CreditCard } from 'lucide-react';
// import { Button, Form, Table, Card, Modal, InputGroup, Dropdown } from 'react-bootstrap';
// import { message } from 'antd';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { getAllPriceProduct } from "../../untills/priceApi";
// import { getAllActiveVouchers } from "../../services/voucherService";
// import { getAllCustomers } from "../../untills/customersApi";
// import { getEmployeeById } from "../../untills/employeesApi";
// import { createDirectSaleBill } from "../../untills/api";
// import { AuthContext } from "../../untills/context/AuthContext";
// import VoucherModal from "./VoucherModal";

// const Sell = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [vouchers, setVouchers] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [customerSearchTerm, setCustomerSearchTerm] = useState("");
//   const [showVoucherModal, setShowVoucherModal] = useState(false);
//   const { user } = useContext(AuthContext);
//   const [employeeId, setEmployeeId] = useState(null);
//   const suggestionsRef = useRef(null);
//   const [selectedVouchers, setSelectedVouchers] = useState([]);
//   const [applicableVouchers, setApplicableVouchers] = useState([]);
//   const [isRemoving, setIsRemoving] = useState(false);
//   const [discountAmount, setDiscountAmount] = useState(0);
//   const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("Cash");
//   const invoiceRef = useRef(null);
//   const cartRef = useRef(cart);

//   const handlePaymentMethodChange = (method) => {
//     setPaymentMethod(method);
//   };
//   useEffect(() => {
//     const fetchEmployeeId = async () => {
//       if (user?._id) {
//         try {
//           const employeeData = await getEmployeeById(user._id);
//           setEmployeeId(employeeData._id);
//         } catch (error) {
//           console.error("Không thể lấy employeeId:", error);
//         }
//       }
//     };
//     fetchEmployeeId();
//   }, [user]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const productsData = await getAllPriceProduct();
//         if (productsData.success) {
//           setProducts(productsData.prices || []);
//         } else {
//           console.error("Failed to fetch products:", productsData.message);
//         }

//         const vouchersData = await getAllActiveVouchers();
//         // setVouchers(vouchersData || []);
//         setVouchers(Array.isArray(vouchersData) ? vouchersData : []);

//         const customersData = await getAllCustomers();
//         setCustomers(customersData || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, []);

  
//   // Tìm thông tin chi tiết của sản phẩm quà tặng
//   const findGiftProductDetails = (productId, unitName) => {
//     const product = products.find((prod) => prod.productId === productId);
//     if (!product) return null;
  
//     const unit = product.units.find((u) => u.unitName === unitName);
//     if (!unit) return null;
  
//     return {
//       code: product.code,
//       productName: product.productName,
//       barcode: unit.barcode,
//       unitName: unit.unitName,
//       price: unit.price,
//       quantity: unit.quantity,
//       conversionValue: unit.conversionValue, 
//     };
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
//         setShowSuggestions(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     if (value.length > 0) {
//       const filtered = products.flatMap(product => 
//         product.units.filter(unit => 
//           unit.barcode.includes(value) ||
//           product.code.toLowerCase().includes(value.toLowerCase()) ||
//           product.productName.toLowerCase().includes(value.toLowerCase())
//         ).map(unit => ({ ...product, selectedUnit: unit }))
//       );
//       setSuggestions(filtered);
//       setShowSuggestions(true);
//     } else {
//       setSuggestions([]);
//       setShowSuggestions(false);
//     }
//   };

//   const addToCart = (product) => {
//     setCart((prev) => {
//       const updatedCart = [...prev];
  
//       const existing = updatedCart.find(
//         (item) =>
//           item.productId === product.code && item.unit === product.selectedUnit.unitName
//       );
  
//       if (existing) {
//         existing.quantity += 1;
//       } else {
//         updatedCart.push({
//           code: product.code,
//           productId: product.productId,
//           productName: product.productName,
//           price: product.selectedUnit.price,
//           quantity: 1,
//           unit: product.selectedUnit.unitName,
//           barcode: product.selectedUnit.barcode,
//           isGift: false, // Sản phẩm thêm mới không phải quà tặng
//         });
//       }
  
//       // Kiểm tra và cập nhật quà tặng nếu đủ điều kiện
//       return updateGiftItems(updatedCart);
//     });
//     setSearchTerm("");
//     setSuggestions([]);
//     setShowSuggestions(false);
//   };
  
//   const removeFromCart = (productId, unit) => {
//     setIsRemoving(true);
  
//     setCart((prev) => {
//       let updatedCart = prev.filter((item) => !(item.productId === productId && item.unit === unit));
  
//       // Loại bỏ quà tặng nếu không còn đáp ứng điều kiện
//       return updateGiftItems(updatedCart);
//     });
  
//     setIsRemoving(false);
//   };
  
//   // Hàm cập nhật các quà tặng
//   const updateGiftItems = (cart) => {
//     const updatedCart = [...cart];
  
//     // Lấy danh sách các voucher áp dụng được
//     const voucherList = Array.isArray(vouchers)
//       ? vouchers.filter((voucher) => voucher.isActive && !voucher.isDeleted)
//       : [];
  
//     // Duyệt qua các voucher loại "BuyXGetY"
//     voucherList.forEach((voucher) => {
//       if (voucher.type === "BuyXGetY" && voucher.conditions) {
//         const buyCondition = voucher.conditions;
  
//         // Tìm sản phẩm X trong giỏ hàng
//         const productX = updatedCart.find(
//           (item) =>
//             item.productId === buyCondition.productXId &&
//             item.unit === buyCondition.unitX &&
//             !item.isGift
//         );
  
//         const applicableQuantity = productX
//           ? Math.floor(productX.quantity / buyCondition.quantityX)
//           : 0;
  
//         // Tìm quà tặng Y trong giỏ hàng
//         const giftIndex = updatedCart.findIndex(
//           (item) =>
//             item.productId === buyCondition.productYId &&
//             item.unit === buyCondition.unitY &&
//             item.isGift
//         );
  
//         if (applicableQuantity > 0) {
//           // Nếu có đủ điều kiện, thêm hoặc cập nhật số lượng quà tặng
//           const effectiveQuantity = applicableQuantity * buyCondition.quantityY;
  
//           if (giftIndex >= 0) {
//             // Cập nhật số lượng quà tặng
//             updatedCart[giftIndex].quantity = effectiveQuantity;
//           } else {
//             // Thêm mới quà tặng vào giỏ hàng
//             const giftProductDetails = findGiftProductDetails(
//               buyCondition.productYId,
//               buyCondition.unitY
//             );
//             if (giftProductDetails) {
//               updatedCart.push({
//                 productId: buyCondition.productYId,
//                 productName: giftProductDetails.productName,
//                 code: giftProductDetails.code,
//                 barcode: giftProductDetails.barcode,
//                 unit: giftProductDetails.unitName,
//                 price: giftProductDetails.price || 0, 
//                 quantity: effectiveQuantity,
//                 isGift: true,
//               });
//             }
//           }
//         } else if (giftIndex >= 0) {
//           // Nếu không đủ điều kiện, xóa quà tặng khỏi giỏ hàng
//           updatedCart.splice(giftIndex, 1);
//         }
//       }
//     });
  
//     return updatedCart;
//   };
  

//   const updateQuantity = (productId, unit, newQuantity) => {
//     if (newQuantity < 1) return;
  
//     setCart((prev) => {
//       // Cập nhật số lượng sản phẩm trong giỏ hàng
//       const updatedCart = prev.map((item) =>
//         item.productId === productId && item.unit === unit
//           ? { ...item, quantity: newQuantity }
//           : item
//       );
  
//       // Kiểm tra và cập nhật lại quà tặng
//       return updateGiftItems(updatedCart);
//     });
//   };
  


//   const handleCustomerSearch = (value) => {
//     setCustomerSearchTerm(value);
  
//     const phoneRegex = /^0\d{9}$/;
//     if (!phoneRegex.test(value)) {
//       setSelectedCustomer(null);
//       // message.warning("Vui lòng nhập số điện thoại hợp lệ (bắt đầu bằng 0 và có 10 chữ số).");
//       return;
//     }
  
//     const customer = customers.find((c) => c.phoneNumber === value);
  
//     if (customer) {
//       setSelectedCustomer(customer);
//       message.success(`Đã tìm thấy khách hàng: ${customer.fullName}`);
//     } else {
//       setSelectedCustomer({
//         fullName: "Khách vãng lai",
//         phoneNumber: value,
//         _id: null, // Khách vãng lai không có ID
//       });
//       message.info(`Đã thêm khách hàng vãng lai với số điện thoại: ${value}`);
//     }
//   };
  
  
  
//   const handleVoucherModal = () => {
//     setShowVoucherModal(true);
//   };

//   const closeVoucherModal = () => {
//     setShowVoucherModal(false);
//   };

//   const total = cart
//     .filter((item) => !item.isGift) 
//     .reduce((sum, item) => sum + item.price * item.quantity, 0);

//     // const filterApplicableVouchers = () => {
//     //   const voucherList = Array.isArray(vouchers)
//     //     ? vouchers.filter((voucher) => voucher.isActive && !voucher.isDeleted)
//     //     : [];
    
//     //   const totalAmount = cart
//     //     .filter((item) => !item.isGift) // Loại bỏ sản phẩm khuyến mãi
//     //     .reduce((acc, item) => acc + item.price * item.quantity, 0);
    
//     //   let bestDiscountVoucher = null; // Voucher giảm giá tốt nhất
//     //   let maxDiscount = 0;
//     //   const buyXGetYResults = [];
//     //   const updatedCart = [...cart];
    
//     //   // Lọc voucher giảm giá
//     //   voucherList.forEach((voucher) => {
//     //     if (voucher.type === "PercentageDiscount" || voucher.type === "FixedDiscount") {
//     //       const discount = calculateVoucherDiscount(voucher, totalAmount);
//     //       if (discount > maxDiscount) {
//     //         maxDiscount = discount;
//     //         bestDiscountVoucher = voucher;
//     //       }
//     //     }
//     //   });
    
//     //   // Lọc voucher "Buy X Get Y"
//     //   voucherList.forEach((voucher) => {
//     //     if (voucher.type === "BuyXGetY" && voucher.conditions) {
//     //       const buyCondition = voucher.conditions;
    
//     //       cart.forEach((cartItem) => {
//     //         if (
//     //           cartItem.productId === buyCondition.productXId &&
//     //           cartItem.unit === buyCondition.unitX &&
//     //           !cartItem.isGift
//     //         ) {
//     //           const applicableQuantity = Math.floor(
//     //             cartItem.quantity / buyCondition.quantityX
//     //           );
    
//     //           if (applicableQuantity > 0) {
//     //             buyXGetYResults.push({
//     //               voucher,
//     //               totalGiftQuantity: applicableQuantity * buyCondition.quantityY,
//     //               giftProductId: buyCondition.productYId,
//     //               giftUnit: buyCondition.unitY,
//     //               conversionValue: buyCondition.conversionValueY,
//     //             });
//     //           }
//     //         }
//     //       });
//     //     }
//     //   });
    
//     //   // Thêm quà tặng vào giỏ hàng
//     //   buyXGetYResults.forEach((result) => {
//     //     const giftProductDetails = findGiftProductDetails(result.giftProductId, result.giftUnit);
    
//     //     if (giftProductDetails) {
//     //       const effectiveQuantity = result.totalGiftQuantity * (result.conversionValue || 1);
    
//     //       if (giftProductDetails.quantity >= effectiveQuantity) {
//     //         const giftIndex = updatedCart.findIndex(
//     //           (item) =>
//     //             item.productId === result.giftProductId &&
//     //             item.unit === result.giftUnit &&
//     //             item.isGift
//     //         );
    
//     //         if (giftIndex >= 0) {
//     //           const currentGift = updatedCart[giftIndex];
//     //           if (currentGift.quantity !== effectiveQuantity) {
//     //             updatedCart[giftIndex] = {
//     //               ...currentGift,
//     //               quantity: effectiveQuantity,
//     //             };
//     //           }
//     //         } else {
//     //           updatedCart.push({
//     //             productId: result.giftProductId,
//     //             productName: giftProductDetails.productName,
//     //             code: giftProductDetails.code,
//     //             barcode: giftProductDetails.barcode,
//     //             unit: giftProductDetails.unitName,
//     //             price: giftProductDetails.price || 0,
//     //             quantity: effectiveQuantity,
//     //             isGift: true,
//     //           });
//     //         }
//     //       } else {
//     //         console.warn(
//     //           `Quà tặng không đủ tồn kho: ${result.giftProductId} (Yêu cầu: ${effectiveQuantity}, Có sẵn: ${giftProductDetails.quantity})`
//     //         );
//     //       }
//     //     } else {
//     //       console.error(
//     //         `Không tìm thấy thông tin sản phẩm quà tặng: ${result.giftProductId}`
//     //       );
//     //     }
//     //   });
    
//     //   // Chọn voucher "BuyXGetY" đầu tiên (chỉ lấy 1 voucher)
//     //   const selectedBuyXGetYVoucher = buyXGetYResults.length > 0 ? buyXGetYResults[0].voucher : null;
    
//     //   // Cập nhật danh sách voucher đã chọn
//     //   const finalVouchers = [
//     //     ...(bestDiscountVoucher ? [bestDiscountVoucher] : []),
//     //     ...(selectedBuyXGetYVoucher ? [selectedBuyXGetYVoucher] : []),
//     //   ];
//     //   setSelectedVouchers(finalVouchers);
    
//     //   // Cập nhật giảm giá
//     //   setDiscountAmount(maxDiscount);
    
//     //   // Cập nhật giỏ hàng nếu thay đổi
//     //   if (JSON.stringify(updatedCart) !== JSON.stringify(cart)) {
//     //     setCart(updatedCart);
//     //   }
    
//     //   console.log("Selected Vouchers:", finalVouchers);
//     // };
//     const filterApplicableVouchers = () => {
//       const voucherList = Array.isArray(vouchers)
//         ? vouchers.filter((voucher) => voucher.isActive && !voucher.isDeleted)
//         : [];
    
//       const totalAmount = cart
//         .filter((item) => !item.isGift) // Loại bỏ sản phẩm khuyến mãi
//         .reduce((acc, item) => acc + item.price * item.quantity, 0);
    
//       let bestDiscountVoucher = null; // Voucher giảm giá tốt nhất
//       let maxDiscount = 0;
//       const buyXGetYResults = [];
//       const updatedCart = [...cart];
    
//       // Lọc voucher giảm giá
//       voucherList.forEach((voucher) => {
//         if (voucher.type === "PercentageDiscount" || voucher.type === "FixedDiscount") {
//           const discount = calculateVoucherDiscount(voucher, totalAmount);
//           if (discount > maxDiscount) {
//             maxDiscount = discount;
//             bestDiscountVoucher = voucher;
//           }
//         }
//       });
    
//       // Lọc voucher "Buy X Get Y"
//       voucherList.forEach((voucher) => {
//         if (voucher.type === "BuyXGetY" && voucher.conditions) {
//           const buyCondition = voucher.conditions;
    
//           cart.forEach((cartItem) => {
//             if (
//               cartItem.productId === buyCondition.productXId &&
//               cartItem.unit === buyCondition.unitX &&
//               !cartItem.isGift
//             ) {
//               const applicableQuantity = Math.floor(
//                 cartItem.quantity / buyCondition.quantityX
//               );
    
//               if (applicableQuantity > 0) {
//                 buyXGetYResults.push({
//                   voucher,
//                   totalGiftQuantity: applicableQuantity * buyCondition.quantityY,
//                   giftProductId: buyCondition.productYId,
//                   giftUnit: buyCondition.unitY,
//                   conversionValue: buyCondition.conversionValueY,
//                 });
//               }
//             }
//           });
//         }
//       });
    
//       // Nhóm kết quả theo `giftProductId` và `giftUnit` để chọn giá trị quy đổi lớn nhất
//       const optimizedBuyXGetYResults = Object.values(
//         buyXGetYResults.reduce((acc, result) => {
//           const key = `${result.giftProductId}-${result.giftUnit}`;
//           if (!acc[key] || acc[key].conversionValue < result.conversionValue) {
//             acc[key] = result;
//           }
//           return acc;
//         }, {})
//       );
    
//       // Thêm quà tặng vào giỏ hàng
//       optimizedBuyXGetYResults.forEach((result) => {
//         const giftProductDetails = findGiftProductDetails(result.giftProductId, result.giftUnit);
    
//         if (giftProductDetails) {
//           const effectiveQuantity = result.totalGiftQuantity * (result.conversionValue || 1);
    
//           if (giftProductDetails.quantity >= effectiveQuantity) {
//             const giftIndex = updatedCart.findIndex(
//               (item) =>
//                 item.productId === result.giftProductId &&
//                 item.unit === result.giftUnit &&
//                 item.isGift
//             );
    
//             if (giftIndex >= 0) {
//               const currentGift = updatedCart[giftIndex];
//               if (currentGift.quantity !== effectiveQuantity) {
//                 updatedCart[giftIndex] = {
//                   ...currentGift,
//                   quantity: effectiveQuantity,
//                 };
//               }
//             } else {
//               updatedCart.push({
//                 productId: result.giftProductId,
//                 productName: giftProductDetails.productName,
//                 code: giftProductDetails.code,
//                 barcode: giftProductDetails.barcode,
//                 unit: giftProductDetails.unitName,
//                 price: giftProductDetails.price || 0,
//                 quantity: effectiveQuantity,
//                 isGift: true,
//               });
//             }
//           } else {
//             console.warn(
//               `Quà tặng không đủ tồn kho: ${result.giftProductId} (Yêu cầu: ${effectiveQuantity}, Có sẵn: ${giftProductDetails.quantity})`
//             );
//           }
//         } else {
//           console.error(
//             `Không tìm thấy thông tin sản phẩm quà tặng: ${result.giftProductId}`
//           );
//         }
//       });
    
//       // Cho phép áp dụng nhiều voucher khác nhau khi mua các sản phẩm khác nhau
//       const appliedVouchers = optimizedBuyXGetYResults.map((result) => result.voucher);
    
//       // Cập nhật danh sách voucher đã chọn
//       const finalVouchers = [
//         ...(bestDiscountVoucher ? [bestDiscountVoucher] : []),
//         ...appliedVouchers,
//       ];
//       setSelectedVouchers(finalVouchers);
    
//       // Cập nhật giảm giá
//       setDiscountAmount(maxDiscount);
    
//       // Cập nhật giỏ hàng nếu thay đổi
//       if (JSON.stringify(updatedCart) !== JSON.stringify(cart)) {
//         setCart(updatedCart);
//       }
    
//       console.log("Selected Vouchers:", finalVouchers);
//     };
    
    
//     const calculateVoucherDiscount = (voucher, totalAmount) => {
//       if (voucher.type === "PercentageDiscount" && voucher.conditions) {
//         const discount = Math.min(
//           (totalAmount * voucher.conditions.discountPercentage) / 100,
//           voucher.conditions.maxDiscountAmount || totalAmount
//         );
//         return totalAmount >= voucher.conditions.minOrderValue ? discount : 0;
//       } else if (voucher.type === "FixedDiscount" && voucher.conditions) {
//         return totalAmount >= voucher.conditions.minOrderValue
//           ? voucher.conditions.discountAmount
//           : 0;
//       }
//       return 0;
//     };
    

    
//     useEffect(() => {
//       if (!isRemoving) {
//         filterApplicableVouchers();
//       }
//     }, [JSON.stringify(cart), vouchers]);
    
//   const handleShowCheckoutModal = () => {
//     setIsCheckoutModalOpen(true);
//   };

//   const handleHideCheckoutModal = () => {
//     setIsCheckoutModalOpen(false);
//   };

//   const validateCart = () => {
//     const invalidItems = cart.filter((item) => item.quantity <= 0 || item.price <= 0);
    
//     if (invalidItems.length > 0) {
//       const errorMessages = invalidItems.map(
//         (item) =>
//           `Sản phẩm ${item.productName} :\n` +
//           (item.quantity <= 0 ? " - Số lượng phải lớn hơn 0.\n" : "") +
//           (item.price <= 0 ? " - Đơn giá phải lớn hơn 0.\n" : "")
//       ).join("\n");
  
//       message.error(`Lỗi trong giỏ hàng:\n${errorMessages}`);
//       return false;
//     }
  
//     return true;
//   };
  
//   // xác nhận thanh toán 

  
//   const confirmPayment = async () => {
//     // Kiểm tra khách hàng được chọn hoặc số điện thoại hợp lệ
//     if (!selectedCustomer || !selectedCustomer.phoneNumber) {
//       message.warning("Vui lòng nhập số điện thoại cho khách hàng vãng lai.");
//       return;
//     }
  
//     // Xác minh giỏ hàng hợp lệ
//     if (!validateCart()) {
//       return;
//     }
  
//     // Tạo payload từ dữ liệu giỏ hàng và thông tin khách hàng
//     const payload = {
//       paymentMethod,
//       items: cart.map((item) => ({
//         product: item.productId,
//         quantity: item.quantity,
//         unit: item.unit,
//         currentPrice: item.isGift || item.discountedPrice === 0
//           ? 0
//           : (item.discountedPrice || item.price),
//       })),
//       createBy: employeeId,
//       customerId: selectedCustomer._id || null,
//       phoneNumber: selectedCustomer ? selectedCustomer.phoneNumber : customerSearchTerm, 
//       voucherCodes: selectedVouchers.map((voucher) => voucher.code),
//     };
  


//     try {
//       // Gọi API để tạo hóa đơn
//       const response = await createDirectSaleBill(payload);
  
//       if (response && response.bill) {
//         message.success("Thanh toán thành công!");
  
//         const billCode = response.bill.billCode;
  
//         // Đóng modal thanh toán và đặt lại trạng thái
//         setIsCheckoutModalOpen(false);
//         setCart([]);
//         setDiscountAmount(0);
//         setSelectedCustomer(null);
  
//         handlePrintInvoice(billCode);
//       } else {
//         throw new Error(response.message || "Không thể tạo hóa đơn.");
//       }
//     } catch (error) {
//       // Xử lý lỗi nếu xảy ra
//       if (error.response?.data?.message) {
//         message.error(error.response.data.message);
//       } else {
//         message.error(`Đã xảy ra lỗi khi thanh toán: ${error.message}`);
//       }
//       console.error("Lỗi khi thanh toán:", error);
//     }
//   };
  
  
  
  

//   const handlePrintInvoice = (billCode) => {
//     const printContent = `
//       <html>
//         <head>
//           <title>Hóa đơn</title>
//           <style>
//             @page {
//               size: 100mm auto; /* Kích thước giấy */
//               margin: 0; /* Xóa margin */
//             }
//             body {
//               font-family: Arial, sans-serif;
//               font-size: 12px;
//               margin: 0;
//               padding: 0;
//               width: 100mm; /* Chiều rộng hóa đơn */
//             }
//             .bill-container {
//               padding: 5px;
//               box-sizing: border-box;
//             }
//             .header {
//               text-align: center;
//               margin-bottom: 10px;
//             }
//             .header h4 {
//               margin: 0;
//               font-size: 14px;
//               font-weight: bold;
//             }
//             .header p {
//               margin: 2px 0;
//             }
//             .bill-details {
//               margin: 10px 0;
//             }
//             .bill-details div {
//               display: flex;
//               justify-content: space-between;
//               margin-bottom: 5px;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin: 10px 0;
//             }
//             table thead th {
//               text-align: left;
//               border-bottom: 1px dashed #000;
//               padding: 5px 0;
//             }
//             table tbody td {
//               padding: 5px 0;
//               vertical-align: top;
//             }
//             table tbody tr:not(:last-child) td {
//               border-bottom: 1px dashed #000;
//             }
//             .col-name {
//               width: 50%; /* Tên hàng chiếm 50% chiều rộng */
//               word-wrap: break-word;
//               overflow-wrap: break-word;
//             }
//             .col-unit {
//               width: 10%;
//               text-align: center;
//               white-space: nowrap; /* Không cho xuống dòng */
//             }
//             .col-price,
//             .col-quantity,
//             .col-total {
//               width: 10%;
//               text-align: right;
//               white-space: nowrap;
//             }
//             .total-section {
//               margin: 10px 0;
//             }
//             .total-section div {
//               display: flex;
//               justify-content: space-between;
//               margin-bottom: 5px;
//             }
//             .footer {
//               text-align: center;
//               margin-top: 10px;
//               font-size: 12px;
//               font-weight: bold;
//             }
//             .promo-note {
//               color: red;
//               font-style: italic;
//               display: block;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="bill-container">
//             <div class="header">
//               <h4>Hóa Đơn Siêu Thị C'Mart</h4>
//               <p>Địa chỉ: 12 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
//               <p>Hotline: 076 848 6006</p>
//               <p>---</p>
//             </div>
//             <div class="bill-details">
//               <div><span><strong>Mã hóa đơn:</strong></span> <span>${billCode}</span></div>
//               <div><span><strong>Nhân viên lập:</strong></span> <span>${user ? user.fullName : "N/A"}</span></div>
//               <div><span><strong>Khách hàng:</strong></span> <span>${selectedCustomer ? selectedCustomer.fullName : "Khách vãng lai"}</span></div>
//               <div><span><strong>Ngày:</strong></span> <span>${new Date().toLocaleString()}</span></div>
//             </div>
//             <table>
//               <thead>
//                 <tr>
//                   <th class="col-name">Tên hàng</th>
//                   <th class="col-unit">Đ.Vị</th>
//                   <th class="col-price">Đ.Gía</th>
//                   <th class="col-quantity">SL</th>
//                   <th class="col-total">Thành tiền</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${cart.map(item => `
//                   <tr>
//                     <td class="col-name">
//                       ${item.productName} 
//                       ${item.isGift ? '<span class="promo-note">(Khuyến mãi)</span>' : ''}
//                     </td>
//                     <td class="col-unit">${item.unit}</td>
//                     <td class="col-price">${item.price.toLocaleString()}đ</td>
//                     <td class="col-quantity">${item.quantity}</td>
//                     <td class="col-total">${(item.quantity * item.price).toLocaleString()}đ</td>
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>
//             <div class="total-section">
//               <div><span><strong>Thành tiền:</strong></span> <span>${total.toLocaleString()}đ</span></div>
//               <div><span><strong>Chiết khấu:</strong></span> <span>${discountAmount.toLocaleString()}đ</span></div>
//               <div><span><strong>Tổng cộng:</strong></span> <span>${(total - discountAmount).toLocaleString()}đ</span></div>
//             </div>
//             <div class="footer">
//               <p>Cảm ơn quý khách, hẹn gặp lại!</p>
//             </div>
//           </div>
//         </body>
//       </html>
//     `;
  
//     const printWindow = window.open("", "_blank", "width=100,height=auto");
//     printWindow.document.open();
//     printWindow.document.write(printContent);
//     printWindow.document.close();
  
//     setTimeout(() => printWindow.print(), 500);
//   };
  

//   const totalDiscounted = total - discountAmount;

//   return (
//     <div className="d-flex h-100">
//       {/* Left Panel */}
//       <div className="flex-grow-1 d-flex flex-column border-end">
//         {/* Top Bar */}
//         <div className="p-3 border-bottom d-flex align-items-center gap-2">
//           <div className="flex-grow-1 position-relative">
//             <Form.Control
//               type="text"
//               placeholder="Thêm sản phẩm vào đơn"
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//             />
//             {showSuggestions && suggestions.length > 0 && (
//               <div
//                 ref={suggestionsRef}
//                 className="position-absolute w-100 bg-white border rounded shadow-sm mt-1"
//               >
//                 {suggestions.map((product, index) => (
//                   <div
//                     key={`${product.code}-${product.selectedUnit.unitName}-${index}`}
//                     className="p-2 hover-bg-light cursor-pointer"
//                     onClick={() => addToCart(product)}
//                   >
//                     {product.productName} - {product.code} -{" "}
//                     {product.selectedUnit.unitName} - {product.selectedUnit.barcode}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//           <Button variant="light">
//             <MapPin size={16} />
//           </Button>
//           <Button variant="light">
//             <Plus size={16} />
//           </Button>
//           <Button variant="light">
//             <Maximize2 size={16} />
//           </Button>
//           <Button variant="light">
//             <RotateCcw size={16} />
//           </Button>
//           <Button variant="light">
//             <Home size={16} />
//           </Button>
//           <Button variant="light">
//             <HelpCircle size={16} />
//           </Button>
//         </div>
  
//         {/* Cart Table */}
//         <div className="flex-grow-1 overflow-auto">
//           <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th style={{ width: "50px" }}>STT</th>
//               <th style={{ width: "80px" }}>Mã SP</th>
//               <th style={{ width: "150px" }}>Tên sản phẩm</th>
//               <th style={{ width: "80px" }}>Đơn vị</th>
//               <th style={{ width: "120px" }}>Barcode</th>
//               <th style={{ width: "100px" }}>Đơn giá</th>
//               <th style={{ width: "80px" }}>Số lượng</th>
//               <th style={{ width: "80px" }}>Thành tiền</th>
//               <th style={{ width: "100px" }}>Ghi chú</th>
//               <th style={{ width: "50px" }}></th>
//             </tr>
//           </thead>

//             <tbody>
//               {cart.map((item, index) => (
//                 <tr key={`${item.code}-${item.unit}-${index}`}>
//                   <td>{index + 1}</td>
//                   <td>{item.code || "Không có mã"}</td>
//                   <td>{item.productName}</td>
//                   <td>{item.unit}</td>
//                   <td>{item.barcode || "Không có barcode"}</td>
//                   <td className="text-end">{item.price.toLocaleString()}đ</td>
//                   <td>
//                     <Form.Control
//                       type="number"
//                       value={item.quantity}
//                       onChange={(e) =>
//                         updateQuantity(
//                           item.productId,
//                           item.unit,
//                           parseInt(e.target.value)
//                         )
//                       }
//                       min={1}
//                       className="w-75"
//                     />
//                   </td>
//                   <td className="text-end">
//                     {(item.price * item.quantity).toLocaleString()}đ
//                   </td>
//                   <td>{item.isGift ? "Hàng khuyến mãi" : ""}</td>
//                   <td>
//                     <Button
//                       variant="light"
//                       size="sm"
//                       onClick={() => removeFromCart(item.productId, item.unit)}
//                     >
//                       <Trash2 size={16} />
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
  
//         {/* Bottom Toolbar */}
//         <div className="p-3 border-top bg-light">
//           <div className="row row-cols-4 g-2">
//             <div className="col">
//               <Button
//                 variant="secondary"
//                 className="w-100"
//                 onClick={handleVoucherModal}
//               >
//                 Khuyến mãi 
//               </Button>
//             </div>
//             <div className="col">
//               <Button variant="secondary" className="w-100">
//                 Thêm dịch vụ 
//               </Button>
//             </div>
//             <div className="col">
//               <Button variant="secondary" className="w-100">
//                 Chiết khấu đơn
//               </Button>
//             </div>
//             <div className="col">
//               <Button variant="secondary" className="w-100">
//                 Đổi quà
//               </Button>
//             </div>
//             <div className="col">
//               <Button variant="secondary" className="w-100">
//                 Ghi chú đơn hàng
//               </Button>
//             </div>
//             <div className="col">
//               <Button variant="secondary" className="w-100">
//                 Đổi giá bán hàng
//               </Button>
//             </div>
//             <div className="col">
//               <Button variant="secondary" className="w-100">
//                 Xem báo cáo
//               </Button>
//             </div>
//             <div className="col">
//               <Button variant="secondary" className="w-100">
//                 Danh sách thao tác
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
  
//       {/* Right Panel */}
//       <div className="w-25 d-flex flex-column">
//         {/* <div className="p-3 border-bottom">
//         <InputGroup>
//             <Form.Control
//               placeholder="Thêm khách hàng vào đơn "
//               value={customerSearchTerm}
//               onChange={(e) => handleCustomerSearch(e.target.value)}
//             />
//             <Button variant="light" style={{marginLeft: 10, borderRadius : 5}}>
//               <Plus size={16} />
//             </Button>
//           </InputGroup>
          
//           {selectedCustomer && (
//             <div className="mt-2">
//               <strong>Khách hàng: </strong> {selectedCustomer.fullName}
//             </div>
//           )}
         
//         </div>
//    */}
//   <div className="p-3 border-bottom">
//   <InputGroup>
//   <Form.Control
//       placeholder="Thêm khách hàng vào đơn"
//       value={customerSearchTerm}
//       onChange={(e) => {
//         const value = e.target.value;
//         // Kiểm tra nếu giá trị hợp lệ: bắt đầu bằng 0 và chỉ chứa số
//         if (/^0\d*$/.test(value) || value === "") {
//           handleCustomerSearch(value);
//         } else {
//           message.warning("Số điện thoại phải bắt đầu bằng 0 và chỉ chứa số.");
//         }
//       }}
//       maxLength={10} // Giới hạn tối đa 10 ký tự
//     />


//     <Button variant="light" style={{ marginLeft: 10, borderRadius: 5 }}>
//       <Plus size={16} />
//     </Button>
//   </InputGroup>

//   {selectedCustomer && (
//     <div className="mt-2">
//       <strong>Khách hàng: </strong> 
//       {selectedCustomer.fullName} <br />
//       <strong>Số điện thoại: </strong> {selectedCustomer.phoneNumber || "N/A"}
//     </div>
//   )}
// </div>


//         <div className="flex-grow-1 p-3">
//           <Card className="mb-3">
//             <Card.Body>
//               <div className="d-flex justify-content-between mb-2">
//                 <span>Số lượng sản phẩm</span>
//                 <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
//               </div>
//               <div className="d-flex justify-content-between mb-2">
//                 <span>Tổng tiền</span>
//                 <span>{total.toLocaleString()}đ</span>
//               </div>
//               <div className="d-flex justify-content-between mb-2 text-danger">
//                 <span>Chiết khấu</span>
//                 <span>-{discountAmount.toLocaleString()}đ</span>
//               </div>
//               <div className="d-flex justify-content-between mb-2 fw-bold">
//                 <span>Khách phải trả</span>
//                 <span>{totalDiscounted.toLocaleString()}đ</span>
//               </div>
//               <div className="d-flex justify-content-between mb-2">
//                 <span>Tiền khách đưa</span>
//                 <span>{totalDiscounted.toLocaleString()}đ</span>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <span>Tiền thừa</span>
//                 <span>0đ</span>
//               </div>
//             </Card.Body>
//           </Card>
//         </div>
  
//         <div className="p-3 border-top">
//         <div className="d-flex gap-2">
//             <Dropdown>
//               <Dropdown.Toggle variant="secondary" id="dropdown-payment-method">
//                 {paymentMethod === "Cash" ? <CreditCard size={16} /> : <CreditCard size={16} />}
//               </Dropdown.Toggle>

//               <Dropdown.Menu>
//                 <Dropdown.Item onClick={() => handlePaymentMethodChange("Cash")}>Tiền mặt</Dropdown.Item>
//                 <Dropdown.Item onClick={() => handlePaymentMethodChange("Card")}>Thẻ</Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//             <Button
//               variant="primary"
//               size="lg"
//               className="flex-grow-1"
//               onClick={handleShowCheckoutModal}
//             >
//               Thanh toán ({paymentMethod === "Cash" ? "Tiền mặt" : "Thẻ"})
//             </Button>
//           </div>

//         </div>
//       </div>
  
//       {/* Voucher Modal */}
//       {showVoucherModal && (
//         <VoucherModal
//           vouchers={vouchers}
//           isModalVisible={showVoucherModal}
//           onCancel={closeVoucherModal}
//           onSelectVouchers={setSelectedVouchers}
//         />
//       )}
  
//       {/* Confirmation Modal */}
//       <Modal show={isCheckoutModalOpen} onHide={handleHideCheckoutModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Xác nhận thanh toán</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div ref={invoiceRef}>
//             <div style={{ textAlign: "center", marginBottom: "20px" }}>
//               <h4 style={{ textAlign: "center", fontWeight: "bold" }}>Hóa Đơn Siêu Thị C'Mart</h4>
//               <br />
//               <p>Địa chỉ: 12 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
//               <p>Hotline: 076 848 6006</p>
//               <p>* * *</p>
//             </div>
//             <div className="header-section" style={{ borderBottom: "1px solid #ccc", paddingBottom: "15px", marginBottom: "15px" }}>
           
//               <p><strong>Người tạo đơn:</strong> {user ? user.fullName : "N/A"}</p>
//               <p><strong>Tên khách hàng:</strong> {selectedCustomer ? selectedCustomer.fullName : "Khách vãng lai"}</p>
//               <p><strong>Ngày tạo:</strong> {new Date().toLocaleString()}</p>
//             </div>
//             <div style={{ display: "flex", fontWeight: "bold", borderBottom: "1px dashed #ccc", paddingBottom: "8px", marginBottom: "10px" }}>
//               <div style={{ flex: 2 }}>Tên hàng</div>
//               <div style={{ flex: 1 }}>Đơn Vị</div>
//               <div style={{ flex: 1 }}>Đ.Giá</div>
//               <div style={{ flex: 1 }}>SL</div>
//               <div style={{ flex: 1 }}>Thành tiền</div>
//             </div>
//             {cart.map((item) => (
//               <div key={item.productId} style={{ display: "flex", borderBottom: "1px dashed #ccc", padding: "8px 0" }}>
//                 <div style={{ flex: 2 }}>
//                   {item.productName}<br />
//                   {item.isGift && <span style={{ color: "red", marginLeft: "10px" }}>khuyến mãi</span>}
//                 </div>
//                 <div style={{ flex: 1 }}>{item.unit}</div>
//                 <div style={{ flex: 1 }}>{item.price.toLocaleString()}đ</div>
//                 <div style={{ flex: 1 }}>{item.quantity}</div>
//                 <div style={{ flex: 1 }}>{(item.quantity * item.price).toLocaleString()}đ</div>
//               </div>
//             ))}

//             <div style={{ padding: "10px", marginTop: "10px", textAlign: "right" }}>
//               <p><strong>Thành tiền:</strong> {total.toLocaleString()}đ</p>
//               <p><strong>Chiết khấu:</strong> {discountAmount.toLocaleString()}đ</p>
//               <p><strong>Tổng tiền:</strong> {(total - discountAmount).toLocaleString()}đ</p>
//             </div>
//           </div>
//           <p style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold", color: "#888" }}>
//             Cảm ơn quý khách, hẹn gặp lại!
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleHideCheckoutModal}>
//             Hủy
//           </Button>
//           <Button variant="primary" onClick={confirmPayment}>
//             Xác nhận và In hóa đơn
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Sell;
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Search,
  Plus,
  MapPin,
  Maximize2,
  RotateCcw,
  Home,
  HelpCircle,
  Trash2,
  CreditCard,
} from "lucide-react";
import {
  Button,
  Form,
  Table,
  Card,
  Modal,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import { message } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllPriceProduct } from "../../untills/priceApi";
import { getAllActiveVouchers } from "../../services/voucherService";
import { getAllCustomers } from "../../untills/customersApi";
import { getEmployeeById } from "../../untills/employeesApi";
import {
  createDirectSaleBill,
  updateBillStatusByCode,
} from "../../untills/api";
import { createVNPayPayment } from "../../services/vnpayService";
import { AuthContext } from "../../untills/context/AuthContext";
import VoucherModal from "./VoucherModal";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

const Sell = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [bankTransferUrl, setBankTransferUrl] = useState("");
  const cartRef = useRef(cart);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const params = queryString.parse(location.search);

      if (
        params.vnp_TransactionStatus === "00" && // Giao dịch thành công
        params.vnp_OrderInfo // Đảm bảo có `orderCode`
      ) {
        try {
          const orderCode = params.vnp_OrderInfo;
          await updateBillStatusByCode(orderCode, "HoanThanh");
          message.success("Hóa đơn thanh toán thành công!");

          // Xóa các tham số sau khi cập nhật thành công
          navigate(location.pathname, { replace: true });
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
          // message.error("Hóa đơn thanh toán thất bại.");
        }
      }
    };

    // Chỉ gọi khi có tham số trong URL
    if (location.search) {
      checkPaymentStatus();
    }
  }, [location.search, navigate]);
  
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
        // setVouchers(vouchersData || []);
        setVouchers(Array.isArray(vouchersData) ? vouchersData : []);

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
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = products.flatMap((product) =>
        product.units
          .filter(
            (unit) =>
              unit.barcode.includes(value) ||
              product.code.toLowerCase().includes(value.toLowerCase()) ||
              product.productName.toLowerCase().includes(value.toLowerCase())
          )
          .map((unit) => ({ ...product, selectedUnit: unit }))
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
          item.productId === product.code &&
          item.unit === product.selectedUnit.unitName
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
      let updatedCart = prev.filter(
        (item) => !(item.productId === productId && item.unit === unit)
      );

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
          // Nếu có đủ điều kiện, kiểm tra tồn kho của quà tặng
          const giftProductDetails = findGiftProductDetails(
            buyCondition.productYId,
            buyCondition.unitY
          );
  
          if (
            giftProductDetails &&
            giftProductDetails.quantity >=
              applicableQuantity * buyCondition.quantityY
          ) {
            // Nếu tồn kho đủ, thêm hoặc cập nhật số lượng quà tặng
            const effectiveQuantity =
              applicableQuantity * buyCondition.quantityY;
  
            if (giftIndex >= 0) {
              // Cập nhật số lượng quà tặng
              updatedCart[giftIndex].quantity = effectiveQuantity;
            } else {
              // Thêm mới quà tặng vào giỏ hàng
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
          } else {
            console.warn(
              `Quà tặng không đủ tồn kho: ${buyCondition.productYId} (Yêu cầu: ${
                applicableQuantity * buyCondition.quantityY
              }, Có sẵn: ${
                giftProductDetails ? giftProductDetails.quantity : 0
              })`
            );
  
            // Nếu không đủ tồn kho, xóa quà tặng khỏi giỏ hàng
            if (giftIndex >= 0) {
              updatedCart.splice(giftIndex, 1);
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

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(value)) {
      setSelectedCustomer(null);
      // message.warning("Vui lòng nhập số điện thoại hợp lệ (bắt đầu bằng 0 và có 10 chữ số).");
      return;
    }

    const customer = customers.find((c) => c.phoneNumber === value);

    if (customer) {
      setSelectedCustomer(customer);
      message.success(`Đã tìm thấy khách hàng: ${customer.fullName}`);
    } else {
      setSelectedCustomer({
        fullName: "Khách vãng lai",
        phoneNumber: value,
        _id: null, // Khách vãng lai không có ID
      });
      message.info(`Đã thêm khách hàng vãng lai với số điện thoại: ${value}`);
    }
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
    
      let bestDiscountVoucher = null; // Voucher giảm giá tốt nhất
      let maxDiscount = 0;
      const buyXGetYResults = [];
      const updatedCart = [...cart];
    
      // Lọc voucher giảm giá
      voucherList.forEach((voucher) => {
        if (voucher.type === "PercentageDiscount" || voucher.type === "FixedDiscount") {
          const discount = calculateVoucherDiscount(voucher, totalAmount);
          if (discount > maxDiscount) {
            maxDiscount = discount;
            bestDiscountVoucher = voucher;
          }
        }
      });
    
      // Lọc voucher "Buy X Get Y"
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
                const giftProductDetails = findGiftProductDetails(
                  buyCondition.productYId,
                  buyCondition.unitY
                );
    
                // Kiểm tra tồn kho của sản phẩm tặng
                if (
                  giftProductDetails &&
                  giftProductDetails.quantity >=
                    applicableQuantity * buyCondition.quantityY
                ) {
                  buyXGetYResults.push({
                    voucher,
                    totalGiftQuantity: applicableQuantity * buyCondition.quantityY,
                    giftProductId: buyCondition.productYId,
                    giftUnit: buyCondition.unitY,
                    conversionValue: buyCondition.conversionValueY,
                  });
                } else {
                  console.warn(
                    `Voucher bị loại bỏ do sản phẩm quà tặng không đủ tồn kho: ${buyCondition.productYId}`
                  );
                }
              }
            }
          });
        }
      });
    
      // Nhóm kết quả theo `giftProductId` và `giftUnit` để chọn giá trị quy đổi lớn nhất
      const optimizedBuyXGetYResults = Object.values(
        buyXGetYResults.reduce((acc, result) => {
          const key = `${result.giftProductId}-${result.giftUnit}`;
          if (!acc[key] || acc[key].conversionValue < result.conversionValue) {
            acc[key] = result;
          }
          return acc;
        }, {})
      );
    
      // Thêm quà tặng vào giỏ hàng
      optimizedBuyXGetYResults.forEach((result) => {
        const giftProductDetails = findGiftProductDetails(result.giftProductId, result.giftUnit);
    
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
        }
      });
    
      // Cho phép áp dụng nhiều voucher khác nhau khi mua các sản phẩm khác nhau
      const appliedVouchers = optimizedBuyXGetYResults.map((result) => result.voucher);
    
      // Cập nhật danh sách voucher đã chọn
      const finalVouchers = [
        ...(bestDiscountVoucher ? [bestDiscountVoucher] : []),
        ...appliedVouchers,
      ];
      setSelectedVouchers(finalVouchers);
    
      // Cập nhật giảm giá
      setDiscountAmount(maxDiscount);
    
      // Cập nhật giỏ hàng nếu thay đổi
      if (JSON.stringify(updatedCart) !== JSON.stringify(cart)) {
        setCart(updatedCart);
      }
    
      console.log("Selected Vouchers:", finalVouchers);
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
    const invalidItems = cart.filter(
      (item) => item.quantity <= 0 || item.price <= 0
    );

    if (invalidItems.length > 0) {
      const errorMessages = invalidItems
        .map(
          (item) =>
            `Sản phẩm ${item.productName} :\n` +
            (item.quantity <= 0 ? " - Số lượng phải lớn hơn 0.\n" : "") +
            (item.price <= 0 ? " - Đơn giá phải lớn hơn 0.\n" : "")
        )
        .join("\n");

      message.error(`Lỗi trong giỏ hàng:\n${errorMessages}`);
      return false;
    }

    return true;
  };
  const generateOrderCode = () => {
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // Tạo mã 8 số ngẫu nhiên
    return `ORD${randomNumber}`;
  };
  const handleBankTransferPayment = async (orderCode) => {
    try {
      const VNPAY_URL = "http://localhost:3000/UIManager";
      // Gọi API createOrder từ service
      const paymentUrl = await createVNPayPayment(
        totalDiscounted, // Tổng tiền cần thanh toán
        orderCode, // Thông tin đơn hàng
        VNPAY_URL // URL trả về sau thanh toán
      );

      if (paymentUrl) {
        // Lưu URL để sử dụng (nếu cần)
        setBankTransferUrl(paymentUrl);

        // Mở URL trong tab mới
        window.location.href = paymentUrl;
      } else {
        message.error("Không thể tạo giao dịch chuyển khoản!");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán chuyển khoản:", error);
      message.error("Đã xảy ra lỗi khi xử lý thanh toán chuyển khoản.");
    }
  };
  // xác nhận thanh toán

  const confirmPayment = async () => {
    try {
      // Kiểm tra khách hàng được chọn hoặc số điện thoại hợp lệ
      if (!selectedCustomer || !selectedCustomer.phoneNumber) {
        message.warning("Vui lòng nhập số điện thoại cho khách hàng vãng lai.");
        return;
      }

      // Xác minh giỏ hàng hợp lệ
      if (!validateCart()) {
        return;
      }
      const orderCode = generateOrderCode();
      if (paymentMethod === "BankTransfer") {
        // Nếu phương thức thanh toán là chuyển khoản, gọi hàm handleBankTransferPayment
        await handleBankTransferPayment(orderCode);
      }

      // Nếu không phải BankTransfer, tiếp tục xử lý thanh toán trực tiếp
      const payload = {
        paymentMethod,
        items: cart.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          unit: item.unit,
          currentPrice:
            item.isGift || item.discountedPrice === 0
              ? 0
              : item.discountedPrice || item.price,
        })),
        createBy: employeeId,
        orderCode: orderCode,
        customerId: selectedCustomer._id || null,
        phoneNumber: selectedCustomer
          ? selectedCustomer.phoneNumber
          : customerSearchTerm,
        voucherCodes: selectedVouchers.map((voucher) => voucher.code),
        status:
          paymentMethod === "BankTransfer" ? "ChuaThanhToan" : "HoanThanh",
      };

      const response = await createDirectSaleBill(payload);

      if (response && response.bill) {
        // message.success("Thanh toán thành công!");

        const billCode = response.bill.billCode;

        // Đóng modal thanh toán và đặt lại trạng thái
        setIsCheckoutModalOpen(false);
        setCart([]);
        setDiscountAmount(0);
        setSelectedCustomer(null);

        handlePrintInvoice(billCode);
      } else {
        throw new Error(response.message || "Không thể tạo hóa đơn.");
      }
    } catch (error) {
      // Xử lý lỗi nếu xảy ra
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error(`Đã xảy ra lỗi khi thanh toán: ${error.message}`);
      }
      console.error("Lỗi khi thanh toán:", error);
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
              <p>Địa chỉ: 12 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
              <p>Hotline: 076 848 6006</p>
              <p>---</p>
            </div>
            <div class="bill-details">
              <div><span><strong>Mã hóa đơn:</strong></span> <span>${billCode}</span></div>
              <div><span><strong>Nhân viên lập:</strong></span> <span>${
                user ? user.fullName : "N/A"
              }</span></div>
              <div><span><strong>Khách hàng:</strong></span> <span>${
                selectedCustomer ? selectedCustomer.fullName : "Khách vãng lai"
              }</span></div>
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
                ${cart
                  .map(
                    (item) => `
                  <tr>
                    <td class="col-name">
                      ${item.productName} 
                      ${
                        item.isGift
                          ? '<span class="promo-note">(Khuyến mãi)</span>'
                          : ""
                      }
                    </td>
                    <td class="col-unit">${item.unit}</td>
                    <td class="col-price">${item.price.toLocaleString()}đ</td>
                    <td class="col-quantity">${item.quantity}</td>
                    <td class="col-total">${(
                      item.quantity * item.price
                    ).toLocaleString()}đ</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            <div class="total-section">
              <div><span><strong>Thành tiền:</strong></span> <span>${total.toLocaleString()}đ</span></div>
              <div><span><strong>Chiết khấu:</strong></span> <span>${discountAmount.toLocaleString()}đ</span></div>
              <div><span><strong>Tổng cộng:</strong></span> <span>${(
                total - discountAmount
              ).toLocaleString()}đ</span></div>
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
                    {product.selectedUnit.unitName} -{" "}
                    {product.selectedUnit.barcode}
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
        {/* <div className="p-3 border-bottom">
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
   */}
        <div className="p-3 border-bottom">
          <InputGroup>
            <Form.Control
              placeholder="Thêm khách hàng vào đơn"
              value={customerSearchTerm}
              onChange={(e) => {
                const value = e.target.value;
                // Kiểm tra nếu giá trị hợp lệ: bắt đầu bằng 0 và chỉ chứa số
                if (/^0\d*$/.test(value) || value === "") {
                  handleCustomerSearch(value);
                } else {
                  message.warning(
                    "Số điện thoại phải bắt đầu bằng 0 và chỉ chứa số."
                  );
                }
              }}
              maxLength={10} // Giới hạn tối đa 10 ký tự
            />

            <Button variant="light" style={{ marginLeft: 10, borderRadius: 5 }}>
              <Plus size={16} />
            </Button>
          </InputGroup>

          {selectedCustomer && (
            <div className="mt-2">
              <strong>Khách hàng: </strong>
              {selectedCustomer.fullName} <br />
              <strong>Số điện thoại: </strong>{" "}
              {selectedCustomer.phoneNumber || "N/A"}
            </div>
          )}
        </div>

        <div className="flex-grow-1 p-3">
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Số lượng sản phẩm</span>
                <span>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
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
                {paymentMethod === "Cash"
                  ? "Tiền mặt"
                  : paymentMethod === "Card"
                  ? "Thẻ"
                  : "Thẻ"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => handlePaymentMethodChange("Cash")}
                >
                  Tiền mặt
                </Dropdown.Item>
                {/* <Dropdown.Item
                  onClick={() => handlePaymentMethodChange("Card")}
                >
                  Thẻ
                </Dropdown.Item> */}
                <Dropdown.Item
                  onClick={() => handlePaymentMethodChange("BankTransfer")}
                >
                  Thẻ
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button
              variant="primary"
              size="lg"
              className="flex-grow-1"
              onClick={() => {
                if (paymentMethod === "BankTransfer") {
                  handleShowCheckoutModal(); // Gọi hàm xử lý chuyển khoản
                } else {
                  handleShowCheckoutModal(); // Xử lý cho Tiền mặt hoặc Thẻ
                }
              }}
            >
              Thanh toán (
              {paymentMethod === "Cash"
                ? "Tiền mặt"
                : paymentMethod === "Card"
                ? "Thẻ"
                : "Thẻ"}
              )
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
      <Modal
        show={isCheckoutModalOpen}
        onHide={handleHideCheckoutModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={invoiceRef}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h4 style={{ textAlign: "center", fontWeight: "bold" }}>
                Hóa Đơn Siêu Thị C'Mart
              </h4>
              <br />
              <p>Địa chỉ: 12 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
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
                <strong>Người tạo đơn:</strong> {user ? user.fullName : "N/A"}
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
              <div style={{ flex: 2 }}>Tên hàng</div>
              <div style={{ flex: 1 }}>Đơn Vị</div>
              <div style={{ flex: 1 }}>Đ.Giá</div>
              <div style={{ flex: 1 }}>SL</div>
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
                <div style={{ flex: 2 }}>
                  {item.productName}
                  <br />
                  {item.isGift && (
                    <span style={{ color: "red", marginLeft: "10px" }}>
                      khuyến mãi
                    </span>
                  )}
                </div>
                <div style={{ flex: 1 }}>{item.unit}</div>
                <div style={{ flex: 1 }}>{item.price.toLocaleString()}đ</div>
                <div style={{ flex: 1 }}>{item.quantity}</div>
                <div style={{ flex: 1 }}>
                  {(item.quantity * item.price).toLocaleString()}đ
                </div>
              </div>
            ))}

            <div
              style={{ padding: "10px", marginTop: "10px", textAlign: "right" }}
            >
              <p>
                <strong>Thành tiền:</strong> {total.toLocaleString()}đ
              </p>
              <p>
                <strong>Chiết khấu:</strong> {discountAmount.toLocaleString()}đ
              </p>
              <p>
                <strong>Tổng tiền:</strong>{" "}
                {(total - discountAmount).toLocaleString()}đ
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
