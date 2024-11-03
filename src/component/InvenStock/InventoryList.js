import React, { useEffect, useState } from "react";
import { Table, Button, Space, Typography } from "antd";
import { getInventoryAdjustments } from "../../untills/stockApi";
import { PlusOutlined } from "@ant-design/icons";
import AuditForm from "../InvenStock/AuditForm"; 

const { Title } = Typography;

const InventoryList = () => {
  const [inventoryAdjustments, setInventoryAdjustments] = useState([]);
  const [error, setError] = useState(null);
  const [showAuditForm, setShowAuditForm] = useState(false); // Trạng thái để kiểm soát hiển thị

  useEffect(() => {
    const fetchInventoryAdjustments = async () => {
      try {
        const adjustments = await getInventoryAdjustments();
        setInventoryAdjustments(adjustments);
      } catch (err) {
        setError("Lỗi khi lấy danh sách kiểm kê kho");
      }
    };

    fetchInventoryAdjustments();
  }, []);

  // Xử lý sự kiện hiển thị AuditForm
  const handleShowAuditForm = () => setShowAuditForm(true);

  // Xử lý khi lưu hoặc hủy tạo phiếu kiểm kê
  const handleCloseAuditForm = () => setShowAuditForm(false);

  const columns = [
    {
      title: "Mã phiếu",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày kiểm kê",
      dataIndex: "auditDate",
      key: "auditDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Người kiểm kê",
      key: "auditedBy",
      render: (_, record) => record.auditedBy?.fullName || "Không có thông tin",
    }
  ];

  const lineColumns = [
    {
      title: "Mã sản phẩm",
      key: "productCode",
      render: (_, record) => record.stockId?.productId?.code || "Không có mã sản phẩm",
    },
    {
      title: "Sản phẩm",
      key: "productName",
      render: (_, record) => record.stockId?.productId?.name || "Không có thông tin sản phẩm",
    },
    {
      title: "Đơn vị",
      key: "unit",
      render: (_, record) => record.stockId?.unit || "Không có đơn vị", 
    },
    {
      title: "Số lượng ban đầu",
      dataIndex: "initialQuantity",
      key: "initialQuantity",
    },
    {
      title: "Số lượng chênh lệch",
      dataIndex: "adjustmentQuantity",
      key: "adjustmentQuantity",
    },
    {
      title: "Số lượng thực tế",
      dataIndex: "updatedQuantity",
      key: "updatedQuantity",
    },
    {
      title: "Điều chỉnh",
      dataIndex: "adjustmentType",
      key: "adjustmentType",
      render: (text) => (text === "increase" ? "Tăng" : "Giảm"),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    }
  ];

  const expandedRowRender = (record) => {
    return (
      <Table
        columns={lineColumns}
        dataSource={record.lines}
        rowKey={(line) => line._id}
        pagination={false}
      />
    );
  };

  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      {showAuditForm ? (
        <AuditForm onClose={handleCloseAuditForm} />
      ) : (
        <>
          <Space style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <Title level={2}>Danh sách kiểm kê kho</Title>
            <Button type="primary" icon={<PlusOutlined />} danger onClick={handleShowAuditForm}>
              Tạo phiếu kiểm kê
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={inventoryAdjustments}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 5 }}
            expandable={{
              expandedRowRender,
            }}
          />
        </>
      )}
    </div>
  );
};

export default InventoryList;
