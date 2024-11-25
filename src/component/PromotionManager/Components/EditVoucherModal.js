import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Switch } from "antd";
import { getAllProducts } from "../../../untills/api";

const EditVoucherModal = ({ visible, onCancel, onSubmit, editingVoucher }) => {
  const [form] = Form.useForm();
  const [voucherType, setVoucherType] = useState(""); // State để lưu loại voucher
  const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
  const [unitsX, setUnitsX] = useState([]); // Đơn vị cho sản phẩm X
  const [unitsY, setUnitsY] = useState([]); // Đơn vị cho sản phẩm Y

  // Lấy danh sách sản phẩm khi Modal hiển thị
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

      // Nạp đơn vị cho sản phẩm X nếu tồn tại
      if (editingVoucher.conditions?.[0]?.productXId) {
        handleProductXChange(editingVoucher.conditions[0].productXId);
      }

      // Nạp đơn vị cho sản phẩm Y nếu tồn tại
      if (editingVoucher.conditions?.[0]?.productYId) {
        handleProductYChange(editingVoucher.conditions[0].productYId);
      }
    }
  }, [editingVoucher, visible]);

  const handleOk = () => {
    form.submit();
  };

  // Cập nhật đơn vị khi chọn sản phẩm X
  const handleProductXChange = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      const availableUnits = [product.baseUnit, ...product.conversionUnits];
      setUnitsX(availableUnits);
    }
  };

  // Cập nhật đơn vị khi chọn sản phẩm Y
  const handleProductYChange = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      const availableUnits = [product.baseUnit, ...product.conversionUnits];
      setUnitsY(availableUnits);
    }
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
                  <div key={key}>
                    <Form.Item
                      {...restField}
                      name={[name, "productXId"]}
                      fieldKey={[fieldKey, "productXId"]}
                      label="Sản phẩm mua"
                      rules={[
                        { required: true, message: "Vui lòng chọn sản phẩm" },
                      ]}
                    >
                      <Select
                        placeholder="Chọn sản phẩm"
                        onChange={(value) => {
                          handleProductXChange(value);
                          form.setFieldValue(
                            ["conditions", key, "productXId"],
                            value
                          );
                        }}
                      >
                        {products.map((product) => (
                          <Select.Option key={product._id} value={product._id}>
                            {product.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "unitX"]}
                      fieldKey={[fieldKey, "unitX"]}
                      label="Đơn vị sản phẩm mua"
                      rules={[
                        { required: true, message: "Vui lòng chọn đơn vị mua" },
                      ]}
                    >
                      <Select placeholder="Chọn đơn vị sản phẩm mua">
                        {unitsX.map((unit) => (
                          <Select.Option key={unit._id} value={unit._id}>
                            {unit.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantityX"]}
                      fieldKey={[fieldKey, "quantityX"]}
                      label="Số lượng "
                      rules={[
                        { required: true, message: "Vui lòng nhập số lượng" },
                      ]}
                    >
                      <Input type="number" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "productYId"]}
                      fieldKey={[fieldKey, "productYId"]}
                      label="Sản phẩm tặng"
                      rules={[
                        { required: true, message: "Vui lòng chọn sản phẩm" },
                      ]}
                    >
                      <Select
                        placeholder="Chọn sản phẩm"
                        onChange={(value) => {
                          handleProductYChange(value);
                          form.setFieldValue(
                            ["conditions", key, "productYId"],
                            value
                          );
                        }}
                      >
                        {products.map((product) => (
                          <Select.Option key={product._id} value={product._id}>
                            {product.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "unitY"]}
                      fieldKey={[fieldKey, "unitY"]}
                      label="Đơn vị sản phẩm"
                      rules={[
                        { required: true, message: "Vui lòng chọn đơn vị" },
                      ]}
                    >
                      <Select placeholder="Chọn đơn vị sản phẩm">
                        {unitsY.map((unit) => (
                          <Select.Option key={unit._id} value={unit._id}>
                            {unit.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "quantityY"]}
                      fieldKey={[fieldKey, "quantityY"]}
                      label="Số lượng"
                      rules={[
                        { required: true, message: "Vui lòng nhập số lượng" },
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
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại khuyến mãi"
          rules={[{ required: true, message: "Vui lòng chọn loại khuyến mãi" }]}
        >
          <Select onChange={(value) => setVoucherType(value)}>
            <Select.Option value="BuyXGetY">Mua hàng tặng quà</Select.Option>
            <Select.Option value="FixedDiscount">
              Tặng tiền theo hóa đơn
            </Select.Option>
            <Select.Option value="PercentageDiscount">Giảm %</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
          <Switch />
        </Form.Item>

        {/* Hiển thị các trường điều kiện dựa trên loại voucher */}
        {renderConditionsFields()}
      </Form>
    </Modal>
  );
};

export default EditVoucherModal;
