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
  updateProduct,
  getCategories,
  getAllSuppliers,
} from "../../untills/api";

const { Option } = Select;

const EditProduct = ({ visible, onCancel, product, fetchAllData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [conversionUnits, setConversionUnits] = useState([]);
  const [loading, setLoading] = useState(false); 

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

  useEffect(() => {
    if (visible && product) {
      form.setFieldsValue({
        code: product.code,
        name: product.name,
        barcode: product.barcode,
        description: product.description,
        categoryId: product.category,
        supplierId: product.supplier,
        "baseUnit.name": product.baseUnit.name,
        "baseUnit.conversionValue": product.baseUnit.conversionValue,
      });

      setFileList(
        product.image
          ? [{ url: product.image, name: "Current Image", status: "done" }]
          : []
      );
      setConversionUnits(product.conversionUnits || []);
    }
  }, [visible, product, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("code", values.code);
      formData.append("barcode", values.barcode);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("supplierId", values.supplierId);
      formData.append("categoryId", values.categoryId);
  
      formData.append("baseUnit[name]", values["baseUnit.name"]);
      formData.append("baseUnit[conversionValue]", values["baseUnit.conversionValue"] || 1);
  
      conversionUnits.forEach((unit, index) => {
        formData.append(`conversionUnits[${index}][name]`, unit.name);
        formData.append(`conversionUnits[${index}][conversionValue]`, unit.conversionValue);
        formData.append(`conversionUnits[${index}][barcode]`, unit.barcode);
      });
  
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }
  
      // Debug FormData content
      console.log("FormData before sending:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
  
      await updateProduct(product._id, formData);
      message.success("Cập nhật sản phẩm thành công!");
      fetchAllData();
      onCancel();
    } catch (error) {
      message.error("Có lỗi xảy ra: " + (error.response?.data.message || "Vui lòng thử lại!"));
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </div>
  );

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
      title="Chỉnh sửa sản phẩm"
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Cập nhật"
      cancelText="Hủy"
      confirmLoading={loading} 
      width={1000}
      maxheight={400}
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
                <Input  disabled={true} style={{ height: "40px" }} placeholder="Ví dụ: Lon"  />
              </Form.Item>
            </Col>
          </Row>

          {conversionUnits.map((unit, index) => (
            <Row key={index} gutter={8} style={{ marginBottom: "8px" }}>
              <Col span={8}>
                <Input
                  disabled={true}
                  style={{ height: "40px" }}
                  placeholder="Tên đơn vị"
                  value={unit.name}
                  onChange={(e) =>
                    handleConversionUnitChange(index, "name", e.target.value)
                  }
                />
              </Col>
              <Col span={8}>
                <Input 
                  disabled={true}
                  style={{ height: "40px" }}
                  placeholder="Giá trị quy đổi"
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
                 disabled={true}
                  style={{ height: "40px" }}
                  placeholder="Mã vạch"
                  value={unit.barcode}
                  onChange={(e) =>
                    handleConversionUnitChange(index, "barcode", e.target.value)
                  }
                />
              </Col>
              {/* <Col>
                <MinusCircleOutlined
                  onClick={() => removeConversionUnit(index)}
                />
              </Col> */}
            </Row>
          ))}
          {/* <Button
            type="dashed"
            onClick={() =>
              setConversionUnits([
                ...conversionUnits,
                { name: "", conversionValue: "", barcode: "" },
              ])
            }
            style={{ width: "10%" }}
          >
            Thêm đơn vị quy đổi
          </Button> */}
        </Card>
      </Form>
    </Modal>
  );
};

export default EditProduct;
