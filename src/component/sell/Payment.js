import React, { useState } from "react";
import { Radio, InputNumber, Button, Typography, Modal } from "antd";
import { CreditCardOutlined, DollarOutlined } from "@ant-design/icons";

const { Text } = Typography;

const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod}) => {

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };




  return (
    <div style={{ marginBottom: "10px" }}>
      <h3>Chọn hình thức thanh toán</h3>
      <Radio.Group
        onChange={handlePaymentMethodChange}
        value={paymentMethod}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <Radio value="Cash">
          <DollarOutlined style={{ marginRight: "8px", fontSize: "18px", color: "#52c41a" }} />
          Tiền mặt
        </Radio>
        <Radio value="Card">
          <CreditCardOutlined style={{ marginRight: "8px", fontSize: "18px", color: "#1890ff" }} />
          Thẻ
        </Radio>
      </Radio.Group>

 
    </div>
  );
};

export default PaymentMethodSelector;
