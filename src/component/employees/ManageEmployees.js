import React, { useEffect, useState } from 'react';
import { List, Button, Modal, Input, message, Form, Select, DatePicker } from 'antd';
import { addEmployee, verifyEmployeeOtp, getAllEmployee } from '../../untills/employeesApi';
import moment from 'moment';

const { Option } = Select;

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployee();
        setEmployees(response);
      } catch (error) {
        message.error('Lỗi khi lấy danh sách nhân viên');
      }
    };

    fetchEmployees();
  }, []);

  const showAddEmployeeModal = () => {
    setIsAddModalVisible(true);
  };

  const handleCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields();
  };

  const handleAddEmployee = async () => {
    try {
      const values = await form.validateFields();
      // Định dạng dateOfBirth trước khi gửi
      values.dateOfBirth = values.dateOfBirth.format('YYYY-MM-DD');
      setLoading(true);
      const response = await addEmployee(values);
      message.success(response.message);
      setEmail(values.email);
      setIsAddModalVisible(false);
      setIsOtpModalVisible(true);
    } catch (error) {
      message.error(error.response?.data?.message || 'Đã xảy ra lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyEmployeeOtp({ email, otp });
      message.success(response.message);
      setIsOtpModalVisible(false);
      setOtp(''); // Reset OTP field after successful verification

      // Làm mới danh sách nhân viên
      const updatedEmployees = await getAllEmployee();
      setEmployees(updatedEmployees);
    } catch (error) {
      setOtp(''); 
      message.error('OTP không hợp lệ hoặc đã hết hạn');
    }
  };

  return (
    <div>
      <h2>Quản lý nhân viên</h2>
      <Button type="primary" onClick={showAddEmployeeModal} style={{ marginBottom: '20px' }}>
        Thêm nhân viên
      </Button>
      
      {/* Danh sách nhân viên */}
      <List
        bordered
        dataSource={employees}
        renderItem={(employee) => (
          <List.Item>
            <List.Item.Meta
              title={employee.fullName}
              description={`Email: ${employee.email}, SĐT: ${employee.phoneNumber}, Địa chỉ: ${employee.address}`}
            />
          </List.Item>
        )}
      />

      {/* Modal Thêm Nhân Viên */}
      <Modal
        title="Thêm Nhân Viên Mới"
        visible={isAddModalVisible}
        onCancel={handleCancel}
        onOk={handleAddEmployee}
        confirmLoading={loading}
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

          {/* Địa chỉ */}
          <Form.Item
            label="Số nhà"
            name={['addressLines', 'houseNumber']}
            rules={[{ required: true, message: 'Vui lòng nhập số nhà' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Xã/Phường"
            name={['addressLines', 'ward']}
            rules={[{ required: true, message: 'Vui lòng nhập xã/phường' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Quận/Huyện"
            name={['addressLines', 'district']}
            rules={[{ required: true, message: 'Vui lòng nhập quận/huyện' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tỉnh/Thành phố"
            name={['addressLines', 'province']}
            rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Xác Minh OTP */}
      <Modal
        title="Xác minh OTP"
        visible={isOtpModalVisible}
        onCancel={() => setIsOtpModalVisible(false)}
        footer={[
          <Button key="verify" type="primary" onClick={handleVerifyOtp}>
            Xác minh
          </Button>,
        ]}
      >
        <p>Mã OTP đã được gửi tới email của bạn. Vui lòng nhập OTP để xác minh:</p>
        <Input
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ManageEmployees;
