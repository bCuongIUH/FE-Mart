import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Switch, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"; // Icons for add/remove
import { getAllProducts } from "../../../untills/api"; // Import API để lấy danh sách sản phẩm

const EditVoucherModal = ({ visible, onCancel, onSubmit, editingVoucher }) => {
  const [form] = Form.useForm();
  const [voucherType, setVoucherType] = useState(""); // State để lưu loại voucher
  const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm

  // Lấy danh sách sản phẩm chỉ khi Modal hiển thị
  useEffect(() => {
    if (visible) {
      const fetchProducts = async () => {
        try {
          const data = await getAllProducts();
          setProducts(data);
        } catch (error) {
          console.error("Lỗi khi tải danh sách sản phẩm", error);
        }
      };
      fetchProducts();
    }
  }, [visible]);

  // Set giá trị ban đầu của form và voucher type khi editingVoucher thay đổi
  useEffect(() => {
    if (editingVoucher && visible) {
      form.setFieldsValue({
        code: editingVoucher.code,
        type: editingVoucher.type,
        isActive: editingVoucher.isActive,
        conditions: editingVoucher.conditions || [{}],
      });
      setVoucherType(editingVoucher.type); // Đặt loại voucher ban đầu
    }
  }, [editingVoucher, visible]);

  const handleOk = () => {
    form.submit();
  };

  // Điều kiện tương ứng dựa trên loại voucher
  const renderConditionsFields = () => {
    switch (voucherType) {
      case "BuyXGetY":
        return (
          <Form.List name="conditions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div>
                    <Form.Item
                      {...restField}
                      name={[name, "productXId"]}
                      fieldKey={[fieldKey, "productXId"]}
                      label="Sản phẩm X"
                      rules={[
                        { required: true, message: "Vui lòng chọn sản phẩm X" },
                      ]}
                    >
                      <Select placeholder="Chọn sản phẩm X">
                        {products.map((product) => (
                          <Select.Option key={product._id} value={product._id}>
                            {product.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantityX"]}
                      fieldKey={[fieldKey, "quantityX"]}
                      label="Số lượng X"
                      rules={[
                        { required: true, message: "Vui lòng nhập số lượng X" },
                      ]}
                    >
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "productYId"]}
                      fieldKey={[fieldKey, "productYId"]}
                      label="Sản phẩm Y"
                      rules={[
                        { required: true, message: "Vui lòng chọn sản phẩm Y" },
                      ]}
                    >
                      <Select placeholder="Chọn sản phẩm Y">
                        {products.map((product) => (
                          <Select.Option key={product._id} value={product._id}>
                            {product.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantityY"]}
                      fieldKey={[fieldKey, "quantityY"]}
                      label="Số lượng Y"
                      rules={[
                        { required: true, message: "Vui lòng nhập số lượng Y" },
                      ]}
                    >
                      <Input type="number" />
                    </Form.Item>
                  </div>
                ))}
              </>
            )}
          </Form.List>
        );
      case "FixedDiscount":
        return (
          <>
            <Form.List name="conditions">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <div>
                      <Form.Item
                        {...restField}
                        name={[name, "minOrderValue"]}
                        fieldKey={[fieldKey, "minOrderValue"]}
                        label="Giá trị đơn hàng tối thiểu"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập giá trị đơn hàng tối thiểu",
                          },
                        ]}
                      >
                        <Input type="number" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "discountAmount"]}
                        fieldKey={[fieldKey, "discountAmount"]}
                        label="Số tiền giảm giá"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số tiền giảm giá",
                          },
                        ]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </>
        );
      case "PercentageDiscount":
        return (
          <>
            <Form.List name="conditions">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <div>
                      <Form.Item
                        {...restField}
                        name={[name, "minOrderValue"]}
                        fieldKey={[fieldKey, "minOrderValue"]}
                        label="Giá trị đơn hàng tối thiểu"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập giá trị đơn hàng tối thiểu",
                          },
                        ]}
                      >
                        <Input type="number" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "discountPercentage"]}
                        fieldKey={[fieldKey, "discountPercentage"]}
                        label="Phần trăm giảm giá"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập phần trăm giảm giá",
                          },
                        ]}
                      >
                        <Input type="number" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "maxDiscountAmount"]}
                        fieldKey={[fieldKey, "maxDiscountAmount"]}
                        label="Số tiền giảm giá tối đa"
                      >
                        <Input type="number" />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      title="Sửa khuyến mãi"
      okText="Sửa"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="code"
          label="Mã khuyến mãi"
          rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi" }]}
          style={{ marginBottom: "30px" }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại khuyến mãi"
          rules={[{ required: true, message: "Vui lòng chọn loại khuyến mãi" }]}
          style={{ marginBottom: "30px" }}
        >
          <Select onChange={(value) => setVoucherType(value)}>
            <Select.Option value="BuyXGetY">Mua hàng tặng quà</Select.Option>
            <Select.Option value="FixedDiscount">Tặng tiền theo hóa đơn</Select.Option>
            <Select.Option value="PercentageDiscount">
              Giảm %
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="isActive"
          label="Kích hoạt"
          valuePropName="checked"
          style={{ marginBottom: "30px" }}
        >
          <Switch />
        </Form.Item>

        {/* Hiển thị các trường điều kiện dựa trên loại voucher */}
        {renderConditionsFields()}
      </Form>
    </Modal>
  );
};

export default EditVoucherModal;
