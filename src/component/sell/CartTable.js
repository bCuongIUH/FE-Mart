import React from "react";
import { Table, Button } from "antd";

const CartTable = ({ cart, formatCurrency, removeFromCart }) => {
  return (
    <Table
      dataSource={cart}
      rowKey={(record) => `${record.productId}-${record.unit}`}
      pagination={{
        pageSize: 4, 
        showSizeChanger: false, 
      }}
      columns={[
        { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
        {
          title: "Giá",
          dataIndex: "price",
          key: "price",
          render: (text) => `${formatCurrency(text)}`,
        },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
        {
          title: "Đơn vị",
          dataIndex: "unit",
          key: "unit",
        },
        {
          title: "Thành tiền",
          key: "total",
          render: (_, record) => `${formatCurrency(record.price * record.quantity)}`,
        },
        {
          title: "",
          key: "action",
          render: (_, record) => (
            <Button onClick={() => removeFromCart(record.productId, record.unit)} danger>
              Xóa
            </Button>
          ),
        },
      ]}
    />
  );
};

export default CartTable;
