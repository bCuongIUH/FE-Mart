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



  return (
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
    >
      <GiftOutlined
        style={{
          fontSize: "20px",
          color: "#ff85c0",
          cursor: "pointer",
          marginLeft: "10px",
        }}
        onClick={showModal}
      />
      <Text style={{ cursor: "pointer" }} onClick={showModal}>
        Danh sách khuyến mãi
      </Text>

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
                        Mức giảm giá: {voucher.conditions?.discountAmount ?? 0}{" "}
                        VND
                        <br />
                        Yêu cầu đơn tối thiểu:{" "}
                        {voucher.conditions?.minOrderValue ?? 0} VND
                      </Text>
                    </div>
                  )}
                  {voucher.type === "PercentageDiscount" &&
                    voucher.conditions && (
                      <div style={{ marginTop: "5px" }}>
                        <Text type="secondary">
                          Mức giảm giá:{" "}
                          {voucher.conditions?.discountPercentage ?? 0}%
                          <br />
                          Yêu cầu đơn tối thiểu:{" "}
                          {voucher.conditions?.minOrderValue ?? 0} VND
                          <br />
                          {voucher.conditions?.maxDiscountAmount && (
                            <>
                              Mức giảm tối đa:{" "}
                              {voucher.conditions?.maxDiscountAmount} VND
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
    </div>
  );
};

export default VoucherModal;
