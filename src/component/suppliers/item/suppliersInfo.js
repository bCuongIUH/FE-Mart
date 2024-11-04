import React, { useEffect, useState } from 'react';
import { getAllSuppliers, updateSupplier, deleteSupplier } from '../../../untills/api';
import { Button, Table, message, Modal, Space, Input, Form } from 'antd';
import SuppliersAddModal from './SuppliersAddModal';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';

function SuppliersInfo() {
  const [suppliers, setSuppliers] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const suppliersList = await getAllSuppliers();
      setSuppliers(suppliersList);
    } catch (error) {
      message.error('Không thể tải danh sách nhà cung cấp.');
    }
  };

  const handleAddSupplierSuccess = () => {
    fetchSuppliers();  // Cập nhật danh sách sau khi thêm thành công
    setIsAddModalVisible(false);  // Đóng modal
    message.success('Nhà cung cấp đã được thêm thành công!');
  };

  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    form.setFieldsValue(supplier);  // Điền dữ liệu vào form
    setIsEditModalVisible(true);
  };

  const handleUpdateSupplier = async () => {
    try {
      const values = await form.validateFields();
      await updateSupplier(selectedSupplier._id, values);
      message.success('Cập nhật nhà cung cấp thành công');
      setIsEditModalVisible(false);
      fetchSuppliers();  // Tải lại danh sách sau khi cập nhật
    } catch (error) {
      message.error('Lỗi khi cập nhật nhà cung cấp');
    }
  };

  const confirmDeleteSupplier = (supplierId) => {
    Modal.confirm({
      title: "Xác nhận xóa nhà cung cấp",
      content: "Bạn có chắc chắn muốn xóa nhà cung cấp này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
      onOk: () => handleDeleteSupplier(supplierId),
    });
  };

  const handleDeleteSupplier = async (supplierId) => {
    try {
      await deleteSupplier(supplierId);
      message.success('Nhà cung cấp đã được xóa thành công!');
      fetchSuppliers();  // Tải lại danh sách sau khi xóa
    } catch (error) {
      message.error('Lỗi khi xóa nhà cung cấp');
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số ĐT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Thông tin liên hệ',
      dataIndex: 'contactInfo',
      key: 'contactInfo',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<FaEdit />}
            onClick={() => handleEditSupplier(record)}
          >
            Sửa
          </Button>
          <Button
            type="text"
            icon={<FaTrash />}
            onClick={() => confirmDeleteSupplier(record._id)}
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#f0f2f5',
          borderRadius: '8px',
        }}
      >
          <Title style={{ fontWeight: 'bold', fontStyle: 'italic' }} level={2}>Quản lí nhà cung cấp</Title>

        <Button danger type="primary" onClick={() => setIsAddModalVisible(true)}>
          Thêm nhà cung cấp
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 5 }}
      />

      <SuppliersAddModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddSuccess={handleAddSupplierSuccess}
      />

      {/* Modal chỉnh sửa nhà cung cấp */}
      <Modal
        title="Chỉnh sửa nhà cung cấp"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleUpdateSupplier}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên nhà cung cấp"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên nhà cung cấp' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Thông tin liên hệ"
            name="contactInfo"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SuppliersInfo;
