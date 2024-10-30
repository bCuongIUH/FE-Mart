import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, message } from 'antd';
import moment from 'moment';
import { updateEmployee } from '../../untills/employeesApi';

const { Option } = Select;

const EditEmployeeModal = ({ visible, onClose, employeeData, onUpdateSuccess }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (employeeData) {
      form.setFieldsValue({
        ...employeeData,
        dateOfBirth: moment(employeeData.dateOfBirth),
        // Chuyển từng trường của addressLines nếu tồn tại
        'addressLines.houseNumber': employeeData.addressLines?.houseNumber || '',
        'addressLines.ward': employeeData.addressLines?.ward || '',
        'addressLines.district': employeeData.addressLines?.district || '',
        'addressLines.province': employeeData.addressLines?.province || '',
      });
    }
  }, [employeeData, form]);

  const handleUpdateEmployee = async () => {
    try {
      const values = await form.validateFields();
      values.dateOfBirth = values.dateOfBirth.format('YYYY-MM-DD');
      await updateEmployee(employeeData._id, values);
      message.success('Cập nhật thông tin nhân viên thành công');
      onUpdateSuccess();
      onClose();
    } catch (error) {
      message.error('Lỗi khi cập nhật nhân viên');
    }
  };

  return (
    <Modal
      title="Chỉnh sửa nhân viên"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdateEmployee}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mã Nhân Viên"
          name="MaNV"
          rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
        >
          <Select placeholder="Chọn giới tính">
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Ngày sinh"
          name="dateOfBirth"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input />
        </Form.Item>

        {/* Địa chỉ */}
        <Form.Item
          label="Số nhà"
          name="addressLines.houseNumber"
          rules={[{ required: true, message: 'Vui lòng nhập số nhà' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Xã/Phường"
          name="addressLines.ward"
          rules={[{ required: true, message: 'Vui lòng nhập xã/phường' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Quận/Huyện"
          name="addressLines.district"
          rules={[{ required: true, message: 'Vui lòng nhập quận/huyện' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Tỉnh/Thành phố"
          name="addressLines.province"
          rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditEmployeeModal;
