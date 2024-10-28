import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, message } from 'antd';
import { updatePriceList } from '../../untills/priceApi';

const EditPriceListModal = ({ visible, onClose, priceList, onPriceListUpdated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  console.log("priceList", priceList);

  // Cập nhật dữ liệu vào form khi modal mở
  useEffect(() => {
    if (visible && priceList) {
      form.setFieldsValue({
        code: priceList.code,
        name: priceList.name,
        description: priceList.description,
        isActive: priceList.isActive,
      });
    }
  }, [visible, priceList, form]);

  // Xử lý lưu dữ liệu khi nhấn nút "Lưu"
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Kiểm tra trạng thái isActive của priceList
      if (priceList.isActive) {
        // Chỉ cho phép cập nhật trạng thái hoạt động
        const { isActive } = values;
        await updatePriceList(priceList._id, { isActive }); // Chỉ gửi isActive
        message.success('Trạng thái hoạt động đã được cập nhật!');
      } else {
        // Nếu không hoạt động, cho phép cập nhật tất cả
        await updatePriceList(priceList._id, values);
        message.success('Cập nhật bảng giá thành công!');
      }

      onPriceListUpdated();
      onClose();
    } catch (error) {
      message.error(error.message || 'Không thể cập nhật bảng giá.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa bảng giá"
      visible={visible}
      onOk={handleSave}
      onCancel={onClose}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã bảng giá"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã bảng giá' }]}
          style={{ display: priceList.isActive ? 'none' : 'block' }} // Ẩn nếu đang hoạt động
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tên bảng giá"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên bảng giá' }]}
          style={{ display: priceList.isActive ? 'none' : 'block' }} // Ẩn nếu đang hoạt động
        >
          <Input />
        </Form.Item>
        <Form.Item label="Mô tả" name="description" style={{ display: priceList.isActive ? 'none' : 'block' }}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng hoạt động" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPriceListModal;
