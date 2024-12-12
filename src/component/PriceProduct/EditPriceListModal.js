import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, message, DatePicker } from 'antd';
import { updatePriceList } from '../../untills/priceApi';
import moment from 'moment';

const EditPriceListModal = ({ visible, onClose, priceList, onPriceListUpdated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && priceList) {
      form.setFieldsValue({
        code: priceList.code,
        name: priceList.name,
        description: priceList.description,
        isActive: priceList.isActive,
        startDate: moment(priceList.startDate),
        endDate: moment(priceList.endDate),
      });
    }
  }, [visible, priceList, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (priceList.isActive) {
        const { isActive, endDate } = values;
        await updatePriceList(priceList._id, { 
          isActive, 
          endDate: endDate.toISOString() 
        });
        message.success('Trạng thái hoạt động và ngày kết thúc đã được cập nhật!');
      } else {
        const updatedValues = {
          ...values,
          endDate: values.endDate.toISOString(),
        };
        await updatePriceList(priceList._id, updatedValues);
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

  const disabledDate = (current) => {
    // Allow selecting current date and time
    if (current && current.isSame(moment(), 'day')) {
      return false;
    }
    // Disable dates before the start date
    return current && current.isBefore(moment(priceList.startDate), 'day');
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
         disabled={true}
          label="Mã bảng giá"
          name="code"
          rules={[{ required: true, message: 'Vui lòng nhập mã bảng giá' }]}
          style={{ display: priceList.isActive ? 'none' : 'block' }}
        >
          <Input  disabled={true} />
          
        </Form.Item>
        <Form.Item
          label="Tên bảng giá"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên bảng giá' }]}
          style={{ display: priceList.isActive ? 'none' : 'block' }}
        >
          
          <Input  disabled={priceList.isActive} />
        </Form.Item>
        <Form.Item 
          label="Mô tả" 
          name="description" 
          style={{ display: priceList.isActive ? 'none' : 'block' }}
        >
          <Input.TextArea rows={3} disabled={priceList.isActive} />
        </Form.Item>
        <Form.Item 
          label="Ngày bắt đầu" 
          name="startDate"
        >
          <DatePicker 
            disabled={true}
            // style={{ width: '100%' }}
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
          />
        </Form.Item>
        <Form.Item 
            label="Ngày kết thúc" 
            name="endDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
          >
            <DatePicker 
             disabled={true}
              // style={{ width: '100%' }}
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              disabledDate={disabledDate}
              showNow={true}
            />
          </Form.Item>
        <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
          <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng hoạt động" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPriceListModal;