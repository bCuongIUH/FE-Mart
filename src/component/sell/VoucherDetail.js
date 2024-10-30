import React from "react";

// Hàm định dạng tiền tệ
const formatCurrency = (value) => 
  value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }).replace("₫", "VNĐ");

const VoucherDetail = ({ voucher }) => (
  <div style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "8px" }}>
    <strong>
      {voucher.type === "BuyXGetY"
        ? "Mua sản phẩm tặng quà"
        : voucher.type === "FixedDiscount"
        ? "Khuyến mãi hóa đơn"
        : voucher.type === "PercentageDiscount"
        ? "Khuyến mãi theo phần trăm"
        : "Loại khuyến mãi không xác định"}
    </strong>
    <p>Mã: {voucher.code}</p>
    
    {/* Kiểm tra điều kiện trước khi gọi map */}
    {voucher.type === "BuyXGetY" && voucher.conditions && (
      <div>
        {voucher.conditions.map((condition, idx) => (
          <p key={idx}>
            Mua {condition.quantityX} sản phẩm ID: {condition.productXId} để nhận{" "}
            {condition.quantityY} sản phẩm miễn phí ID: {condition.productYId}
          </p>
        ))}
      </div>
    )}
    
    {voucher.type === "FixedDiscount" && voucher.conditions && (
      <div>
        {voucher.conditions.map((condition, idx) => (
          <p key={idx}>
            Giảm {formatCurrency(condition.discountAmount)} cho hóa đơn tối thiểu{" "}
            {formatCurrency(condition.minOrderValue)}
          </p>
        ))}
      </div>
    )}
    
    {voucher.type === "PercentageDiscount" && voucher.conditions && (
      <div>
        {voucher.conditions.map((condition, idx) => (
          <p key={idx}>
            Giảm {condition.discountPercentage}% cho hóa đơn tối thiểu{" "}
            {formatCurrency(condition.minOrderValue)}{" "}
            {condition.maxDiscountAmount &&
              `(giảm tối đa ${formatCurrency(condition.maxDiscountAmount)})`}
          </p>
        ))}
      </div>
    )}
  </div>
);

export default VoucherDetail;