import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Switch, message } from "antd";
import { getAllProducts } from "../../../untills/api";

const AddVoucherModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [voucherType, setVoucherType] = useState("");
  const [products, setProducts] = useState([]);
  const [unitsX, setUnitsX] = useState([]);
  const [unitsY, setUnitsY] = useState([]);

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

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleProductXChange = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      const availableUnits = [
        { _id: product.baseUnit._id, name: product.baseUnit.name },
        ...product.conversionUnits.map((unit) => ({
          _id: unit._id,
          name: unit.name,
        })),
      ];
      setUnitsX(availableUnits);
    }
  };
  
  const handleProductYChange = (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product) {
      const availableUnits = [
        { _id: product.baseUnit._id, name: product.baseUnit.name },
        ...product.conversionUnits.map((unit) => ({
          _id: unit._id,
          name: unit.name,
        })),
      ];
      setUnitsY(availableUnits);
    }
  };
  

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        form.resetFields();
      })
      .catch((info) => {
        console.error("Lỗi khi thêm khuyến mãi:", info);
      });
  };

  const renderConditionsFields = () => {
    switch (voucherType) {
      case "BuyXGetY":
        return (
          <>
            <Form.Item
              name={["conditions", "productXId"]}
              label="Sản phẩm mua"
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm X" }]}
              style={{ marginBottom: "30px" }}
            >
              <Select
                placeholder="Chọn sản phẩm mua"
                onChange={handleProductXChange}
              >
                {products.map((product) => (
                  <Select.Option key={product._id} value={product._id}>
                    {product.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={["conditions", "unitX"]}
              label="Đơn vị sản phẩm mua"
              rules={[{ required: true, message: "Vui lòng chọn đơn vị X" }]}
              style={{ marginBottom: "30px" }}
            >
              <Select placeholder="Chọn đơn vị sản phẩm mua">
                {unitsX.map((unit) => (
                  <Select.Option key={unit._id} value={unit.name}>
                    {unit.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={["conditions", "quantityX"]}
              label="Số lượng mua"
              rules={[{ required: true, message: "Vui lòng nhập số lượng X" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item
              name={["conditions", "productYId"]}
              label="Sản phẩm tặng"
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm Y" }]}
              style={{ marginBottom: "30px" }}
            >
              <Select
                placeholder="Chọn sản phẩm tặng"
                onChange={handleProductYChange}
              >
                {products.map((product) => (
                  <Select.Option key={product._id} value={product._id}>
                    {product.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
                name={["conditions", "unitY"]}
                label="Đơn vị sản phẩm tặng"
                rules={[{ required: true, message: "Vui lòng chọn đơn vị Y" }]}
                style={{ marginBottom: "30px" }}
              >
                <Select placeholder="Chọn đơn vị sản phẩm tặng">
                  {unitsY.map((unit) => (
                    <Select.Option key={unit._id} value={unit.name}>
                      {unit.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            <Form.Item
              name={["conditions", "quantityY"]}
              label="Số lượng tặng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng Y" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </>
        );
      case "FixedDiscount":
        return (
          <>
            <Form.Item
              name={["conditions", "minOrderValue"]}
              label="Giá trị đơn hàng tối thiểu"
              rules={[{ required: true, message: "Vui lòng nhập giá trị đơn hàng tối thiểu" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item
              name={["conditions", "discountAmount"]}
              label="Số tiền giảm giá"
              rules={[
                { required: true, message: "Vui lòng nhập số tiền giảm giá" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const minOrderValue = Number(getFieldValue(["conditions", "minOrderValue"]));
                    const discountAmount = Number(value);
                    if (!value || discountAmount <= minOrderValue) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Số tiền giảm giá phải nhỏ hơn hoặc bằng giá trị đơn hàng tối thiểu")
                    );
                  },
                }),
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </>
        );
      case "PercentageDiscount":
        return (
          <>
            <Form.Item
              name={["conditions", "minOrderValue"]}
              label="Giá trị đơn hàng tối thiểu"
              rules={[{ required: true, message: "Vui lòng nhập giá trị đơn hàng tối thiểu" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" min={1} />
            </Form.Item>
            <Form.Item
              name={["conditions", "discountPercentage"]}
              label="Phần trăm giảm giá"
              rules={[
                { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
                {
                  validator(_, value) {
                    const discountPercentage = Number(value);
                    if (discountPercentage >= 1 && discountPercentage <= 100) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Phần trăm giảm giá phải nằm trong khoảng từ 1% đến 100%")
                    );
                  },
                },
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" min={1} max={100} />
            </Form.Item>
            <Form.Item
              name={["conditions", "maxDiscountAmount"]}
              label="Số tiền giảm giá tối đa"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const minOrderValue = Number(getFieldValue(["conditions", "minOrderValue"]));
                    const maxDiscountAmount = Number(value);
                    if (!value || maxDiscountAmount <= minOrderValue) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Số tiền giảm giá tối đa phải nhỏ hơn hoặc bằng giá trị đơn hàng tối thiểu")
                    );
                  },
                }),
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" min={0} />
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
      title="Thêm Mới khuyến mãi"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={handleOk}
      style={{ marginTop: "20px" }}
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="code"
          label="Mã khuyến mãi"
          rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi" }]}
          style={{ marginBottom: "50px" }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại khuyến mãi"
          rules={[{ required: true, message: "Vui lòng chọn loại khuyến mãi" }]}
          style={{ marginBottom: "50px" }}
        >
          <Select onChange={(value) => setVoucherType(value)}>
            <Select.Option value="BuyXGetY">Mua hàng tặng quà</Select.Option>
            <Select.Option value="FixedDiscount">
              Tặng tiền theo hóa đơn
            </Select.Option>
            <Select.Option value="PercentageDiscount">Giảm %</Select.Option>
          </Select>
        </Form.Item>
        {/* <Form.Item
          name="isActive"
          label="Kích hoạt"
          valuePropName="checked"
          style={{ marginBottom: "50px" }}
        >
          <Switch />
        </Form.Item> */}
        {renderConditionsFields()}
      </Form>
    </Modal>
  );
};

export default AddVoucherModal;
