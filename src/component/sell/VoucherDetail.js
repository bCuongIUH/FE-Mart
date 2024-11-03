import React, { useState } from "react";
import { Modal, List, Typography, Button, Empty } from "antd";
import { GiftOutlined } from "@ant-design/icons";

const { Text } = Typography;

const VoucherModal = ({ vouchers }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // tên type
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

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
      <GiftOutlined 
        style={{ fontSize: "20px", marginRight: "8px", color: "#ff85c0", cursor: "pointer" }} 
        onClick={showModal}
      />
      <Text style={{ cursor: "pointer" }} onClick={showModal}></Text>

      <Modal 
        title="Danh sách Khuyến mãi"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
        {vouchers && vouchers.length > 0 ? (
          <List
            dataSource={vouchers}
            renderItem={(voucher) => (
              <List.Item>
                <div style={{ padding: "10px" }}>
                  <Text strong>{voucher.code || "N/A"}</Text> - <Text>{getVoucherTypeInVietnamese(voucher.type)}</Text>
                  <br />
                  {voucher.conditions?.map((condition, index) => (
                    <div key={index} style={{ marginTop: "5px" }}>
                      <Text type="secondary">
                        Mức giảm giá:{" "}
                        {voucher.type === "FixedDiscount"
                          ? `${condition.discountAmount || 0} VND`
                          : `${condition.discountPercentage || 0}%`}{" "}
                        <br />
                        Yêu cầu đơn tối thiểu: {condition.minOrderValue || 0} VND
                        <br />
                        {voucher.type === "PercentageDiscount" && condition.maxDiscountAmount && (
                          <span>Mức giảm tối đa: {condition.maxDiscountAmount} VND</span>
                        )}
                      </Text>
                    </div>
                  ))}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty description="Không có khuyến mãi nào khả dụng" />
        )}
      </Modal>
    </div>
  );
};

export default VoucherModal;
