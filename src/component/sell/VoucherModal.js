import React, { useState } from "react";
import { Modal, List, Typography, Button, Empty } from "antd";

const { Text } = Typography;

const VoucherModal = ({ vouchers, isModalVisible, onCancel }) => {
  // Đổi tên loại khuyến mãi sang tiếng Việt
  const getVoucherTypeInVietnamese = (type) => {
    switch (type) {
      case "FixedDiscount":
        return "Giảm giá hóa đơn";
      case "PercentageDiscount":
        return "Giảm giá % hóa đơn";
      case "BuyXGetY":
        return "Mua hàng tặng quà";
      default:
        return "Loại khuyến mãi không xác định";
    }
  };

  // Hàm format tiền tệ VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Modal
      title="Danh sách Khuyến mãi"
      visible={isModalVisible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
    >
      {vouchers &&
      vouchers.filter((voucher) => !voucher.isDeleted).length > 0 ? (
        <List
          dataSource={vouchers.filter((voucher) => !voucher.isDeleted)}
          renderItem={(voucher) => (
            <List.Item>
              <div style={{ padding: "10px" }}>
                <Text strong>{voucher.code || "N/A"}</Text> -{" "}
                <Text>{getVoucherTypeInVietnamese(voucher.type)}</Text>
                <br />
                {voucher.type === "FixedDiscount" && voucher.conditions && (
                  <div style={{ marginTop: "5px" }}>
                    <Text type="secondary">
                      Mức giảm giá: {formatCurrency(voucher.conditions?.discountAmount ?? 0)}
                      <br />
                      Yêu cầu đơn tối thiểu:{" "}
                      {formatCurrency(voucher.conditions?.minOrderValue ?? 0)}
                    </Text>
                  </div>
                )}
                {voucher.type === "PercentageDiscount" &&
                  voucher.conditions && (
                    <div style={{ marginTop: "5px" }}>
                      <Text type="secondary">
                        Mức giảm giá: {voucher.conditions?.discountPercentage ?? 0}%
                        <br />
                        Yêu cầu đơn tối thiểu:{" "}
                        {formatCurrency(voucher.conditions?.minOrderValue ?? 0)}
                        <br />
                        {voucher.conditions?.maxDiscountAmount && (
                          <>
                            Mức giảm tối đa:{" "}
                            {formatCurrency(voucher.conditions?.maxDiscountAmount)}
                          </>
                        )}
                      </Text>
                    </div>
                  )}
                {voucher.type === "BuyXGetY" && voucher.conditions && (
                  <div style={{ marginTop: "5px" }}>
                    <Text type="secondary">
                      Mua {voucher.conditions?.quantityX ?? 0}{" "}
                      {voucher.conditions?.unitX || "N/A"}{" "}
                      {voucher.conditions?.productXName || "N/A"}
                      <br />
                      Tặng {voucher.conditions?.quantityY ?? 0}{" "}
                      {voucher.conditions?.unitY || "N/A"}{" "}
                      {voucher.conditions?.productYName || "N/A"}
                    </Text>
                  </div>
                )}
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="Không có khuyến mãi nào khả dụng" />
      )}
    </Modal>
  );
};

export default VoucherModal;
