import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col, Card, Upload, message } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { createProduct, getCategories, getAllSuppliers } from '../../untills/api';
import { getAllUnitLines } from '../../untills/unitApi';
import './AddProduct.css';

const { Option } = Select;

const AddProduct = ({ onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [conversionUnits, setConversionUnits] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);
  const [showConversionUnits, setShowConversionUnits] = useState(false);

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
        message.error('Lỗi khi lấy dữ liệu: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
      }
    };

    fetchData();
  }, []);

  // Kiểm tra sự trùng lặp mã sản phẩm và mã vạch
  const isDuplicate = (code, barcode, name) => {
    // Kiểm tra mã sản phẩm phải bắt đầu bằng "SP"
   

    // Kiểm tra sự trùng lặp
    const isCodeDuplicate = addedProducts.some(product => product.code === code);
    const isBarcodeDuplicate = addedProducts.some(product => product.barcode === barcode);
    const isNameDuplicate = addedProducts.some(product => product.name === name);

    if (isCodeDuplicate) {
      message.error('Mã sản phẩm đã tồn tại!');
      return true;
    }
    
    if (isBarcodeDuplicate) {
      message.error('Mã vạch đã tồn tại!');
      return true;
    }
    if (isNameDuplicate) {
      message.error('Tên sản phẩm đã tồn tại!');
      return true;
    }

    return false;
  };

  const onFinish = async (values) => {
    if (isDuplicate(values.code, values.barcode,values.name)) return;

    try {
      const formData = new FormData();

      // Add standard fields
      formData.append('code', values.code);
      formData.append('barcode', values.barcode);
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('categoryId', values.categoryId);
      formData.append('supplierId', values.supplierId);

      // Manually structure `baseUnit` as an object
      formData.append('baseUnit[name]', values['baseUnit.name']);
      formData.append('baseUnit[conversionValue]', values['baseUnit.conversionValue'] || 1);

      // Handle conversionUnits array
      if (conversionUnits.length > 0) {
        conversionUnits.forEach((unit, index) => {
          if (unit.name || unit.barcode) {
            formData.append(`conversionUnits[${index}][name]`, unit.name);
            formData.append(`conversionUnits[${index}][conversionValue]`, unit.conversionValue);
            formData.append(`conversionUnits[${index}][barcode]`, unit.barcode);
          }
        });
      }

      // Handle image file
      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      const data = await createProduct(formData);
      message.success(data.message);

      // Cập nhật danh sách sản phẩm đã thêm
      setAddedProducts(prevProducts => [...prevProducts, { name: values.name, code: values.code, barcode: values.barcode }]);

      form.resetFields();
      setFileList([]);
      setConversionUnits([]);
      setShowConversionUnits(false); // Đặt lại hiển thị đơn vị quy đổi
    } catch (error) {
      message.error('Có lỗi xảy ra: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
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
    setConversionUnits([...conversionUnits, { name: '', conversionValue: '', barcode: '' }]);
    setShowConversionUnits(true); // Luôn hiển thị khi thêm đơn vị
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
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Card title="Thông tin sản phẩm">
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item name="code" label="Mã sản phẩm" rules={[{ required: true, message: 'Nhập mã!' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="categoryId" label="Loại sản phẩm" rules={[{ required: true, message: 'Chọn loại!' }]}>
              <Select placeholder="Chọn loại">
                {categories.map(category => (
                  <Option key={category._id} value={category._id}>{category.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item name="barcode" label="Mã vạch" rules={[{ required: true, message: 'Nhập mã vạch!' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="supplierId" label="Nhà cung cấp" rules={[{ required: true, message: 'Chọn nhà cung cấp!' }]}>
              <Select placeholder="Chọn nhà cung cấp">
                {suppliers.map(supplier => (
                  <Option key={supplier._id} value={supplier._id}>{supplier.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Nhập tên!' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="description" label="Mô tả sản phẩm" rules={[{ required: true, message: 'Nhập mô tả sản phẩm!' }]}>
              <Input.TextArea rows={1} placeholder="Nhập mô tả sản phẩm" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

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

      <Card title="Bảng Đơn Vị" style={{ marginTop: '16px' }}>
        <Row gutter={8}>
          <Col span={5}>
            <Form.Item name="baseUnit.name" label="Tên đơn vị cơ bản" rules={[{ required: true, message: 'Nhập tên đơn vị!' }]}>
              <Input placeholder="Ví dụ: Lon" />
            </Form.Item>
          </Col>
        </Row>

        {showConversionUnits && conversionUnits.map((unit, index) => (
          <Row key={index} gutter={8} style={{ marginBottom: '8px' }}>
            <Col span={8}>
              <Input
                placeholder="Tên đơn vị"
                value={unit.name}
                onChange={(e) => handleConversionUnitChange(index, 'name', e.target.value)}
              />
            </Col>
            <Col span={8}>
              <Input
                placeholder="Giá trị quy đổi"
                value={unit.conversionValue}
                onChange={(e) => handleConversionUnitChange(index, 'conversionValue', e.target.value)}
              />
            </Col>
            <Col span={8}>
              <Input
                placeholder="Mã vạch"
                value={unit.barcode}
                onChange={(e) => handleConversionUnitChange(index, 'barcode', e.target.value)}
              />
            </Col>
            <Col>
              <MinusCircleOutlined onClick={() => removeConversionUnit(index)} />
            </Col>
          </Row>
        ))}
        <Button type="dashed" onClick={addConversionUnit} style={{ width: '10%' }}>
          Thêm đơn vị quy đổi
        </Button>
      </Card>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>Thêm sản phẩm</Button>
        <Button type="default" style={{ marginTop: '16px', marginLeft: '8px' }} onClick={onCancel}>Hủy</Button>
      </Form.Item>
    </Form>
  );
};

export default AddProduct;
