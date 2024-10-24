import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col, Card, Upload, message } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { createProduct, getCategories, getAllSuppliers } from '../../untills/api'; 
import './AddProduct.css'; 
import { getAllUnitLines } from '../../untills/unitApi';

const { Option } = Select;

const AddProduct = ({ onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]); 
  const [unitLines, setUnitLines] = useState([]); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (Array.isArray(response.categories)) {
          setCategories(response.categories);
        } else {
          message.error('Dữ liệu danh mục không hợp lệ!');
        }
      } catch (error) {
        message.error('Lỗi khi lấy danh mục: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const suppliersList = await getAllSuppliers();
        setSuppliers(suppliersList);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhà cung cấp:', error);
      }
    }
    fetchSuppliers();
  }, []);

  // Hàm lấy tất cả đơn vị dòng
  useEffect(() => {
    const fetchUnitLines = async () => {
      try {
        const response = await getAllUnitLines(); // Gọi hàm lấy dữ liệu đơn vị dòng
        if (Array.isArray(response)) {
          setUnitLines(response); // Lưu dữ liệu vào state
        } else {
          message.error('Dữ liệu đơn vị dòng không hợp lệ!');
        }
      } catch (error) {
        message.error('Lỗi khi lấy đơn vị dòng: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
      }
    };

    fetchUnitLines();
  }, []);

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('code', values.code);
      formData.append('barcode', values.barcode);
      formData.append('categoryId', values.categoryId);
      formData.append('supplierId', values.supplierId); // Thêm ID nhà cung cấp
      formData.append('unitLineId', values.unitLineId); // Thêm ID đơn vị dòng
      formData.append('description', values.description);

      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      const data = await createProduct(formData);
      message.success(data.message);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Có lỗi xảy ra: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
    }
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {/* Thông tin chung */}
      <Card title="Thông tin sản phẩm">
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[{ required: true, message: 'Nhập tên!' }]}
              className="form-item"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="code"
              label="Mã sản phẩm"
              rules={[{ required: true, message: 'Nhập mã!' }]}
              className="form-item"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="barcode"
              label="Mã vạch"
              rules={[{ required: true, message: 'Nhập mã vạch!' }]}
              className="form-item"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item
              name="categoryId"
              label="Loại sản phẩm"
              rules={[{ required: true, message: 'Chọn loại!' }]}
              className="form-item"
            >
              <Select placeholder="Chọn loại">
                {categories.map(category => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="supplierId" 
              label="Nhà cung cấp"
              rules={[{ required: true, message: 'Chọn nhà cung cấp!' }]}
              className="form-item"
            >
              <Select placeholder="Chọn nhà cung cấp">
                {suppliers.map(supplier => ( 
                  <Option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="unitLineId" // Thêm trường cho đơn vị dòng
              label="Đơn vị dòng"
              rules={[{ required: true, message: 'Chọn đơn vị dòng!' }]}
              className="form-item"
            >
              <Select placeholder="Chọn đơn vị dòng">
                {unitLines.map(unitLine => (
                  <Option key={unitLine._id} value={unitLine._id}>
                    {unitLine.name} {/* Hiển thị tên đơn vị dòng */}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="description"
              label="Mô tả sản phẩm"
              rules={[{ required: true, message: 'Nhập mô tả sản phẩm!' }]}
              className="form-item"
            >
              <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Tải hình ảnh */}
      <Card title="Tải hình ảnh" style={{ marginTop: '16px' }}>
        <Upload
          listType="picture-circle"
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={() => false} 
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
      </Card>

      {/* Nút thêm và hủy */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Thêm
        </Button>
        <Button style={{ margin: '0 8px' }} onClick={onCancel}>
          Hủy
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddProduct;
