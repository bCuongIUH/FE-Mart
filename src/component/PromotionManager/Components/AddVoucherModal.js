import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Switch } from "antd";
import { getAllProducts } from "../../../untills/api"; // Import hàm API để lấy danh sách sản phẩm

const AddVoucherModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [voucherType, setVoucherType] = useState(""); // State để lưu loại voucher
  const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm

  // Lấy danh sách sản phẩm khi component được mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm", error);
      }
    };
    fetchProducts();
  }, []);

  const handleOk = () => {
    form.submit();
  };

  // Điều kiện tương ứng dựa trên loại voucher
  const renderConditionsFields = () => {
    switch (voucherType) {
      case "BuyXGetY":
        return (
          <>
            <Form.Item
              name={["conditions", "productXId"]}
              label="Sản phẩm mua"
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm X" }]}
              style={{ marginBottom: "-50px" }}
            >
              <Select placeholder="Chọn sản phẩm mua">
                {products.map((product) => (
                  <Select.Option key={product._id} value={product._id}>
                    {product.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={["conditions", "quantityX"]}
              label="Số lượng mua"
              rules={[{ required: true, message: "Vui lòng nhập số lượng X" }]}
              style={{ marginBottom: "-50px" }}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name={["conditions", "productYId"]}
              label="Sản phẩm tặng"
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm tặng" }]}
              style={{ marginBottom: "-50px" }}
            >
              <Select placeholder="Chọn sản phẩm tặng">
                {products.map((product) => (
                  <Select.Option key={product._id} value={product._id}>
                    {product.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={["conditions", "quantityY"]}
              label="Số lượng tặng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng tặng" }]}
              style={{ marginBottom: "-30px" }}
            >
              <Input type="number" />
            </Form.Item>
          </>
        );
      case "FixedDiscount":
        return (
          <>
            <Form.Item
              name={["conditions", "minOrderValue"]}
              label="Giá trị đơn hàng tối thiểu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá trị đơn hàng tối thiểu",
                },
              ]}
              style={{ marginBottom: "-30px" }}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name={["conditions", "discountAmount"]}
              label="Số tiền giảm giá"
              rules={[
                { required: true, message: "Vui lòng nhập số tiền giảm giá" },
              ]}
              style={{ marginBottom: "-30px" }}
            >
              <Input type="number" />
            </Form.Item>
          </>
        );
      case "PercentageDiscount":
        return (
          <>
            <Form.Item
              name={["conditions", "minOrderValue"]}
              label="Giá trị đơn hàng tối thiểu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá trị đơn hàng tối thiểu",
                },
              ]}
              style={{ marginBottom: "-30px" }}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name={["conditions", "discountPercentage"]}
              label="Phần trăm giảm giá"
              rules={[
                { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
              ]}
              style={{ marginBottom: "-30px" }}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name={["conditions", "maxDiscountAmount"]}
              label="Số tiền giảm giá tối đa"
              style={{ marginBottom: "-30px" }}
            >
              <Input type="number" />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      title="Thêm Mới Voucher"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={handleOk}
      style={{ marginTop: '-90px' }}
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="code"
          label="Mã voucher"
          rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
          style={{ marginBottom: "-50px" }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại voucher"
          rules={[{ required: true, message: "Vui lòng chọn loại voucher" }]}
          style={{ marginBottom: "-50px" }}
        >
          <Select onChange={(value) => setVoucherType(value)}>
            <Select.Option value="BuyXGetY">Product promote</Select.Option>
            <Select.Option value="FixedDiscount">Fixed Discount</Select.Option>
            <Select.Option value="PercentageDiscount">
              Percentage Discount
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="isActive"
          label="Kích hoạt"
          valuePropName="checked"
          style={{ marginBottom: "-50px" }}
        >
          <Switch />
        </Form.Item>

        {/* Hiển thị các trường điều kiện dựa trên loại voucher */}
        {renderConditionsFields()}
      </Form>
    </Modal>
  );
};

export default AddVoucherModal;
