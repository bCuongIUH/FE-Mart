// import React, { useEffect, useState } from 'react';
// import { Form, Input, Button, Select, Row, Col, Card, Upload, message } from 'antd';
// import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
// import { createProduct, getCategories } from '../../untills/api';
// import './AddProduct.css'; 

// const { Option } = Select;

// const AddProduct = ({ onCancel }) => {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await getCategories();
//         if (Array.isArray(response.categories)) {
//           setCategories(response.categories);
//         } else {
//           message.error('Dữ liệu danh mục không hợp lệ!');
//         }
//       } catch (error) {
//         message.error('Lỗi khi lấy danh mục: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
//       }
//     };

//     fetchCategories();
//   }, []);

//   const onFinish = async (values) => {
//     try {
//       const formData = new FormData();
//       formData.append('name', values.name);
//       formData.append('code', values.code);
//       formData.append('barcode', values.barcode);
//       formData.append('categoryId', values.categoryId);
//       formData.append('description', values.description);
//       formData.append('quantity', values.quantity); 
//       formData.append('price', values.price); 

//       if (fileList.length > 0) {
//         formData.append('image', fileList[0].originFileObj);
//       }

//       const data = await createProduct(formData);
//       message.success(data.message);
//       form.resetFields();
//       setFileList([]);
//     } catch (error) {
//       message.error('Có lỗi xảy ra: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
      
//     }
//   };

//   const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

//   const uploadButton = (
//     <div>
//       <PlusOutlined />
//       <div style={{ marginTop: 8 }}>Upload</div>
//     </div>
//   );

//   return (
//     <Form form={form} layout="vertical" onFinish={onFinish}>
//       {/* Thông tin chung */}
//       <Card title="Thông tin sản phẩm">
//         <Row gutter={8} > {/* Giảm gutter */}
//           <Col span={8}>
//             <Form.Item
//               name="name"
//               label="Tên sản phẩm"
//               rules={[{ required: true, message: 'Nhập tên!' }]}
//               className="form-item" // Thêm class cho styling
//             >
//               <Input />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item
//               name="code"
//               label="Mã sản phẩm"
//               rules={[{ required: true, message: 'Nhập mã!' }]}
//               className="form-item" // Thêm class cho styling
              
//             >
//               <Input />
//             </Form.Item>
//           </Col>
//           <Col span={8}>
//             <Form.Item
//               name="barcode"
//               label="Mã vạch"
//               rules={[{ required: true, message: 'Nhập mã vạch!' }]}
//               className="form-item" // Thêm class cho styling
//             >
//               <Input />
//             </Form.Item>
//           </Col>
//         </Row>
//         <Row gutter={8}> {/* Giảm gutter */}
//           <Col span={8}>
//             <Form.Item
//               name="categoryId"
//               label="Loại sản phẩm"
//               rules={[{ required: true, message: 'Chọn loại!' }]}
//               className="form-item" // Thêm class cho styling
//             >
//               <Select placeholder="Chọn loại">
//                 {categories.map(category => (
//                   <Option key={category._id} value={category._id}>
//                     {category.name}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>
//           </Col>
//           <Col span={16}>
//             <Form.Item
//               name="description"
//               label="Mô tả sản phẩm"
//               rules={[{ required: true, message: 'Nhập mô tả sản phẩm!' }]}
//               className="form-item" 
//             >
//               <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
//             </Form.Item>
//           </Col>
//         </Row>
      
//       </Card>

//       {/* Tải hình ảnh */}
//       <Card title="Tải hình ảnh" style={{ marginTop: '16px' }}>
//         <Upload
//           listType="picture-circle"
//           fileList={fileList}
//           onChange={handleChange}
//           beforeUpload={() => false} 
//         >
//           {fileList.length >= 1 ? null : uploadButton}
//         </Upload>
//       </Card>

//       {/* Nút thêm và hủy */}
//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Thêm
//         </Button>
//         <Button style={{ margin: '0 8px' }} onClick={onCancel}>
//           Hủy
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default AddProduct;
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Row, Col, Card, Upload, message, Modal } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { createProduct, getCategories } from '../../untills/api';
import './AddProduct.css';

const { Option } = Select;

const AddProduct = ({ onCancel }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState([]);

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

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('code', values.code);
      formData.append('barcode', values.barcode);
      formData.append('categoryId', values.categoryId);
      formData.append('description', values.description);
      formData.append('quantity', values.quantity); // Thêm số lượng
      formData.append('price', values.price); // Thêm giá

      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      const data = await createProduct(formData);
      message.success(data.message);
      form.resetFields();
      setFileList([]);

      // Đóng modal sau khi thêm sản phẩm
      onCancel();
    } catch (error) {
      message.error('Có lỗi xảy ra: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
    }
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16} style={{ marginBottom: "-60px" }}>
          <Col span={12}>
            <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Mã sản phẩm" name="code" rules={[{ required: true, message: 'Vui lòng nhập mã sản phẩm!' }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: "-60px" }}>
          <Col span={12}>
            <Form.Item label="Barcode" name="barcode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Danh mục" name="categoryId" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
              <Select placeholder="Chọn danh mục">
                {categories.map(category => (
                  <Option key={category._id} value={category._id}>{category.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: "-60px" }}>
          <Col span={24}>
            <Form.Item label="Mô tả" name="description">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginBottom: "-60px" }}>
          <Col span={12}>
            <Form.Item label="Hình ảnh">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={() => false} // Ngăn chặn tự động upload
              >
                {fileList.length < 1 && <div><PlusOutlined /><div style={{ marginTop: 8 }}>Tải lên</div></div>}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12} style={{ marginTop: "60px" }}>
            <Form.Item >
              <Button type="primary" htmlType="submit">Thêm sản phẩm</Button>
              <Button style={{ marginLeft: 8 }} onClick={onCancel}>Hủy</Button>
            </Form.Item>
          </Col>
        </Row>

      </Form>
    </Card>

  );
};

export default AddProduct;
