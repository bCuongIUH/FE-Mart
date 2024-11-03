import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { createSuppliers } from '../../../untills/api';

function SuppliersAddModal({ visible, onClose, onAddSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAddSupplier = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const response = await createSuppliers(values);

      if (response) { 
        // message.success('Thêm nhà cung cấp thành công');
        onAddSuccess(response);  // Gọi hàm onAddSuccess để cập nhật danh sách
        form.resetFields();
        onClose();  // Đóng modal
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi thêm nhà cung cấp');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm nhà cung cấp"
      visible={visible}
      onCancel={onClose}
      onOk={handleAddSupplier}
      confirmLoading={loading}
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
  );
}

export default SuppliersAddModal;
