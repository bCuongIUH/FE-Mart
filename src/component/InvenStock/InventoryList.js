import React, { useEffect, useState } from "react";
import { Table, Button, Space, Typography, message } from "antd";
import { getInventoryAdjustments } from "../../untills/stockApi";
import { PlusOutlined } from "@ant-design/icons";
import AuditForm from "../InvenStock/AuditForm"; 

const { Title } = Typography;

const InventoryList = () => {
  const [inventoryAdjustments, setInventoryAdjustments] = useState([]);
  const [error, setError] = useState(null);
  const [showAuditForm, setShowAuditForm] = useState(false);
  const [reload, setReload] = useState(false);
  // Hàm tải danh sách kiểm kê từ API
  const fetchInventoryAdjustments = async () => {
    try {
      const adjustments = await getInventoryAdjustments();
      setInventoryAdjustments(adjustments.sort((a, b) => new Date(b.auditDate) - new Date(a.auditDate)));
    } catch (err) {
      setError("Lỗi khi lấy danh sách kiểm kê kho");
    }
  };
  useEffect(() => {
    fetchInventoryAdjustments();
  }, [reload]);

  useEffect(() => {
    fetchInventoryAdjustments();
  }, []);

  // Hàm hiển thị form kiểm kê
  const handleShowAuditForm = () => setShowAuditForm(true);

  // Cập nhật danh sách với phiếu mới mà không cần tải lại toàn bộ danh sách
   const handleAuditFormClose = (newAdjustment) => {
    setShowAuditForm(false);
    if (newAdjustment) {
     
      setReload(prev => !prev); 
    }
  };

  const columns = [
    { title: "Mã phiếu", dataIndex: "code", key: "code" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
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
    { title: "Mã sản phẩm", key: "productCode", render: (_, record) => record.stockId?.productId?.code || "Không có mã sản phẩm" },
    { title: "Sản phẩm", key: "productName", render: (_, record) => record.stockId?.productId?.name || "Không có thông tin sản phẩm" },
    { title: "Đơn vị", key: "unit", render: (_, record) => record.stockId?.unit || "Không có đơn vị" },
    { title: "Số lượng ban đầu", dataIndex: "initialQuantity", key: "initialQuantity" },
    { title: "Số lượng thực tế", dataIndex: "updatedQuantity", key: "updatedQuantity" },
    { title: "Số lượng chênh lệch", dataIndex: "adjustmentQuantity", key: "adjustmentQuantity" },
    { title: "Điều chỉnh", dataIndex: "adjustmentType", key: "adjustmentType", render: (text) => (text === "increase" ? "Tăng" : "Giảm") },
    { title: "Lý do", dataIndex: "reason", key: "reason" },
  ];

  const expandedRowRender = (record) => (
    <Table columns={lineColumns} dataSource={record.lines} rowKey={(line) => line._id} pagination={false} />
  );

  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      {showAuditForm ? (
        <AuditForm onClose={(newAdjustment) => handleAuditFormClose(newAdjustment)} />
      ) : (
        <>
          <Space style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <Title style={{ fontWeight: 'bold', fontStyle: 'italic' }} level={2}>Danh sách kiểm kê kho</Title>
            <Button type="primary" danger icon={<PlusOutlined />} onClick={handleShowAuditForm}>
              Tạo phiếu kiểm kê
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={inventoryAdjustments}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 5 }}
            expandable={{ expandedRowRender }}
          />
        </>
      )}
    </div>
  );
};

export default InventoryList;
