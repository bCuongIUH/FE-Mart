import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Card,
  Upload,
  message,
  Modal,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  createProduct,
  getCategories,
  getAllSuppliers,
} from "../../untills/api";


const { Option } = Select;

const AddProduct = ({ visible, onCancel, fetchAllData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [conversionUnits, setConversionUnits] = useState([]);
  const [showConversionUnits, setShowConversionUnits] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm state loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, suppliersData] = await Promise.all([
          getCategories(),
          getAllSuppliers(),
        ]);

        setCategories(categoriesData.categories || []);
        setSuppliers(suppliersData || []);
      } catch (error) {
        message.error(
          "Lỗi khi lấy dữ liệu: " +
            (error.response?.data.message || "Vui lòng thử lại!")
        );
      }
    };

    fetchData();
  }, []);

  const onFinish = async (values) => {
    setLoading(true); // Bắt đầu loading
    try {
      const formData = new FormData();
      formData.append("code", values.code);
      formData.append("barcode", values.barcode);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("categoryId", values.categoryId);
      formData.append("supplierId", values.supplierId);

      formData.append("baseUnit[name]", values["baseUnit.name"]);
      formData.append(
        "baseUnit[conversionValue]",
        values["baseUnit.conversionValue"] || 1
      );

      conversionUnits.forEach((unit, index) => {
        formData.append(`conversionUnits[${index}][name]`, unit.name);
        formData.append(
          `conversionUnits[${index}][conversionValue]`,
          unit.conversionValue
        );
        formData.append(`conversionUnits[${index}][barcode]`, unit.barcode);
      });

      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      }

      await createProduct(formData);
      message.success("Thêm sản phẩm thành công!");
      fetchAllData();
      form.resetFields();
      setFileList([]);
      setConversionUnits([]);
      setShowConversionUnits(false);
      onCancel();
    } catch (error) {
      message.error(
        "Có lỗi xảy ra khi thêm sản phẩm: " +
          (error.response?.data.message || "Vui lòng thử lại!")
      );
    } finally {
      setLoading(false); // Kết thúc loading sau khi API xử lý xong
    }
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

  const addConversionUnit = () => {
    setConversionUnits([
      ...conversionUnits,
      { name: "", conversionValue: "", barcode: "" },
    ]);
    setShowConversionUnits(true);
  };

  const handleConversionUnitChange = (index, field, value) => {
    const newUnits = [...conversionUnits];
    newUnits[index][field] = value;
    setConversionUnits(newUnits);
  };

  const removeConversionUnit = (index) => {
    const newUnits = conversionUnits.filter((_, i) => i !== index);
    setConversionUnits(newUnits);
  };

  return (
    <Modal
      visible={visible}
      title="Thêm sản phẩm mới"
      onCancel={onCancel}
      onOk={() => form.submit()} // Kích hoạt form submit khi nhấn OK
      okText="Thêm sản phẩm"
      cancelText="Hủy"
      confirmLoading={loading} // Áp dụng loading cho nút "Thêm sản phẩm"
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title="Thông tin sản phẩm">
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item
                name="code"
                label="Mã sản phẩm"
                rules={[{ required: true, message: "Nhập mã!" }]}
              >
                <Input style={{ height: "40px" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="categoryId"
                label="Loại sản phẩm"
                rules={[{ required: true, message: "Chọn loại!" }]}
              >
                <Select placeholder="Chọn loại" style={{ height: "40px" }}>
                  {categories.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={8}>
              <Form.Item
                name="barcode"
                label="Mã vạch"
                rules={[{ required: true, message: "Nhập mã vạch!" }]}
              >
                <Input style={{ height: "40px" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="supplierId"
                label="Nhà cung cấp"
                rules={[{ required: true, message: "Chọn nhà cung cấp!" }]}
              >
                <Select
                  placeholder="Chọn nhà cung cấp"
                  style={{ height: "40px" }}
                >
                  {suppliers.map((supplier) => (
                    <Option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: "Nhập tên!" }]}
              >
                <Input style={{ height: "40px" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="description"
                label="Mô tả sản phẩm"
                rules={[{ required: true, message: "Nhập mô tả sản phẩm!" }]}
              >
                <Input.TextArea
                  style={{ height: "40px" }}
                  rows={1}
                  placeholder="Nhập mô tả sản phẩm"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card title="Tải hình ảnh" style={{ marginTop: "16px" }}>
          <Upload
            listType="picture-circle"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={() => false}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Card>

        <Card title="Bảng Đơn Vị" style={{ marginTop: "16px" }}>
          <Row gutter={8}>
            <Col span={5}>
              <Form.Item
                name="baseUnit.name"
                label="Tên đơn vị cơ bản"
                rules={[{ required: true, message: "Nhập tên đơn vị!" }]}
              >
                <Input placeholder="Ví dụ: Lon" style={{ height: "40px" }} />
              </Form.Item>
            </Col>
          </Row>

          {showConversionUnits &&
            conversionUnits.map((unit, index) => (
              <Row key={index} gutter={8} style={{ marginBottom: "8px" }}>
                <Col span={8}>
                  <Input
                    placeholder="Tên đơn vị"
                    value={unit.name}
                    style={{ height: "40px" }}
                    onChange={(e) =>
                      handleConversionUnitChange(index, "name", e.target.value)
                    }
                  />
                </Col>
                <Col span={8}>
                  <Input
                    placeholder="Giá trị quy đổi"
                    style={{ height: "40px" }}
                    value={unit.conversionValue}
                    onChange={(e) =>
                      handleConversionUnitChange(
                        index,
                        "conversionValue",
                        e.target.value
                      )
                    }
                  />
                </Col>
                <Col span={8}>
                  <Input
                    style={{ height: "40px" }}
                    placeholder="Mã vạch"
                    value={unit.barcode}
                    onChange={(e) =>
                      handleConversionUnitChange(
                        index,
                        "barcode",
                        e.target.value
                      )
                    }
                  />
                </Col>
                <Col>
                  <MinusCircleOutlined
                    onClick={() => removeConversionUnit(index)}
                  />
                </Col>
              </Row>
            ))}
          <Button
            type="dashed"
            onClick={addConversionUnit}
            style={{ width: "10%" }}
          >
            Thêm đơn vị quy đổi
          </Button>
        </Card>
      </Form>
    </Modal>
  );
};

export default AddProduct;
