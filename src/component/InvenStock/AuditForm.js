import React, { useState, useEffect, useContext } from "react";
import { Form, Input, DatePicker, Button, Select, Table, Space, notification } from "antd";
import { updateInventoryQuantities, getAllStocks } from "../../untills/stockApi";
import moment from "moment";
import { AuthContext } from "../../untills/context/AuthContext";

const { Option } = Select;

const AuditForm = ({ onClose }) => {
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ AuthContext
  const [form] = Form.useForm();
  const [stocks, setStocks] = useState([]);
  const [adjustments, setAdjustments] = useState([]);
  const [currentStockQuantity, setCurrentStockQuantity] = useState(null);
  const [selectedStockId, setSelectedStockId] = useState(null); // Lưu `stockId` của kho đã chọn
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await getAllStocks();
        if (Array.isArray(response.stocks)) {
          setStocks(response.stocks);
        }
      } catch (error) {
        notification.error({ message: "Lỗi khi lấy danh sách kho" });
      }
    };
  
    fetchStocks();
  }, []);

  // Xử lý khi chọn sản phẩm hoặc đơn vị tính
  const handleProductChange = (productId) => {
    form.setFieldsValue({ unit: undefined, quantity: undefined, reason: "" });
    setCurrentStockQuantity(null);
    setSelectedStockId(null); // Đặt lại `stockId` khi thay đổi sản phẩm
  };

  const handleUnitChange = (unit) => {
    const productId = form.getFieldValue("selectedProductId");

    // Tìm sản phẩm dựa trên `productId`
    const product = stocks.find((s) => s.productId === productId);

    if (!product) {
      notification.error({ message: "Không tìm thấy sản phẩm với ID đã chọn" });
      setSelectedStockId(null); // Đặt lại `selectedStockId`
      return;
    }

    // Tìm `stock` dựa trên `unit` đã chọn
    const stockItem = product.stocks.find((s) => s.unit === unit);

    if (!stockItem) {
      notification.error({ message: "Không tìm thấy kho với đơn vị tính đã chọn" });
      setSelectedStockId(null); // Đặt lại `selectedStockId` nếu không tìm thấy
      return;
    }

    // Cập nhật `selectedStockId` và `currentStockQuantity`
    setSelectedStockId(stockItem._id); // Gán `_id` của kho vào `selectedStockId`
    setCurrentStockQuantity(stockItem.quantity); // Lưu số lượng hiện tại của kho
};


  // Xử lý khi thêm điều chỉnh cho một sản phẩm
  const handleAddAdjustment = () => {
    const { selectedProductId, unit, actualQuantity, reason } = form.getFieldsValue();


    // Kiểm tra xem các thông tin cần thiết đã được chọn chưa
    if (!selectedProductId || !unit || actualQuantity == null) {
      notification.error({ message: "Vui lòng nhập đầy đủ thông tin trước khi thêm sản phẩm vào phiếu kiểm kê" });
      return;
    }

    if (!selectedStockId) {
      notification.error({ message: "Không tìm thấy kho phù hợp cho sản phẩm và đơn vị tính đã chọn" });
      return;
    }

    const adjustmentQuantity = actualQuantity - currentStockQuantity;
    const adjustmentType = adjustmentQuantity > 0 ? "increase" : "decrease";

    setAdjustments([
      ...adjustments,
      {
        stockId: selectedStockId, // Sử dụng `selectedStockId` đã lấy từ `handleUnitChange`
        adjustmentQuantity: Math.abs(adjustmentQuantity),
        adjustmentType,
        reason
      }
    ]);

    // Đặt lại các trường để chuẩn bị cho lần nhập tiếp theo
    form.resetFields(["selectedProductId", "unit", "actualQuantity", "reason"]);
    setCurrentStockQuantity(null);
    setSelectedStockId(null); // Đặt lại `selectedStockId`
};

  // Gửi yêu cầu tạo phiếu kiểm kê
  const handleSubmit = async (values) => {
    const { code, description } = values;

    const auditData = {
      code,
      description,
      auditDate: moment().toISOString(),
      auditedBy: user._id,
      adjustments: adjustments.map(({ stockId, adjustmentQuantity, reason, adjustmentType }) => ({
        stockId, 
        adjustmentQuantity,
        adjustmentType,
        reason
      }))
    };

    console.log("auditData to be sent:", JSON.stringify(auditData, null, 2));

    try {
      setLoading(true);
      await updateInventoryQuantities(auditData);
      notification.success({ message: "Tạo phiếu kiểm kê thành công" });
      form.resetFields();
      setAdjustments([]);
      onClose();
    } catch (error) {
      console.error("Error response:", error.response?.data);
      notification.error({ message: "Lỗi khi tạo phiếu kiểm kê" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ padding: 20 }}>
      <h2>Tạo Phiếu Kiểm Kê Kho</h2>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          code: `ST-${Date.now()}`, // Tự động tạo mã phiếu kiểm kê dựa trên thời gian
          description: "Phiếu kiểm kê tự động"
        }}
        onFinish={handleSubmit}
      >
        <Form.Item name="code" label="Mã phiếu kiểm kê" rules={[{ required: true, message: "Vui lòng nhập mã phiếu kiểm kê" }]}>
          <Input disabled />
        </Form.Item>

        <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
          <Input />
        </Form.Item>

        <h3>Danh sách sản phẩm cần kiểm kê</h3>
        <Table
          columns={[
            { title: "Sản phẩm", dataIndex: "productName", key: "productName" },
            { title: "Đơn vị", dataIndex: "unit", key: "unit" },
            { title: "Số lượng trong kho", dataIndex: "quantity", key: "quantity" },
            { title: "Số lượng thực tế", dataIndex: "actualQuantity", key: "actualQuantity" },
            { title: "Số lượng điều chỉnh", dataIndex: "adjustmentQuantity", key: "adjustmentQuantity" },
            { title: "Loại điều chỉnh", dataIndex: "adjustmentType", key: "adjustmentType" },
            { title: "Lý do", dataIndex: "reason", key: "reason" }
          ]}
          dataSource={adjustments}
          rowKey={(record) => `${record.stockId}-${record.unit}`}
          pagination={false}
        />

        <Space style={{ marginTop: 20 }}>
          <Form.Item name="selectedProductId" label="Sản phẩm">
            <Select placeholder="Chọn sản phẩm" onChange={handleProductChange}>
              {stocks.map((stock) => (
                <Option key={stock.productId} value={stock.productId}>
                  {stock.productName} ({stock.productCode})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="unit" label="Đơn vị">
            <Select placeholder="Chọn đơn vị" onChange={handleUnitChange}>
              {stocks.length > 0 &&
                stocks.find((stock) => stock.productId === form.getFieldValue("selectedProductId"))
                  ?.stocks.map((s) => (
                    <Option key={s.unit} value={s.unit}>
                      {s.unit}
                    </Option>
                  ))}
            </Select>
          </Form.Item>

          <Form.Item label="Số lượng trong kho">
            <Input value={currentStockQuantity || ""} readOnly />
          </Form.Item>

          <Form.Item name="actualQuantity" label="Số lượng thực tế">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="reason" label="Lý do">
            <Input />
          </Form.Item>

          <Button onClick={handleAddAdjustment}>Thêm</Button>
        </Space>

        <Form.Item style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu Phiếu Kiểm Kê
          </Button>
          <Button onClick={onClose} style={{ marginLeft: 8 }}>
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AuditForm;
