import React, { useContext, useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Button, Divider, Spin, Modal, Input, Form, message } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { AuthContext } from '../../untills/context/AuthContext';
import { getEmployeeById } from '../../untills/employeesApi';
import { changePassword } from '../../untills/api'; 
import styles from './UserProfile.module.css';

const { Title, Text } = Typography;

const UserProfile = () => {
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ context
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị của modal đổi mật khẩu

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        if (user && user._id) {
          const data = await getEmployeeById(user._id); // Gọi API để lấy thông tin nhân viên
          setEmployeeDetails(data);
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      } finally {
        setLoading(false); // Dừng loading sau khi lấy dữ liệu
      }
    };
    fetchEmployeeDetails();
  }, [user]);

  // Xử lý khi nhấn nút đổi mật khẩu
  const handlePasswordChange = async (values) => {
    try {
      await changePassword(user._id, values.oldPassword, values.newPassword);
      message.success('Đổi mật khẩu thành công');
      setIsModalVisible(false); // Đóng modal sau khi đổi mật khẩu thành công
    } catch (error) {
      message.error('Có lỗi xảy ra khi đổi mật khẩu');
    }
  };

  // Hiển thị loading nếu dữ liệu chưa có
  if (loading) {
    return <div className={styles.loadingContainer}><Spin size="large" /></div>;
  }

  // Kiểm tra nếu không có dữ liệu nhân viên
  if (!employeeDetails) {
    return <p>Không tìm thấy thông tin nhân viên</p>;
  }

  return (
    <div className={styles.profileContainer}>
      <Card className={styles.profileCard} bordered={false}>
        <div className={styles.header}>
          <Title level={3} style={{ marginTop: '10px' }}>{employeeDetails.fullName}</Title>
          <Text type="secondary">{user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</Text>
        </div>

        <Divider />

        <Row gutter={[16, 16]} className={styles.infoSection}>
          <Col span={12}>
            <Text strong>Mã NV:</Text>
            <p>{employeeDetails.MaNV}</p>
          </Col>
          <Col span={12}>
            <Text strong>Email:</Text>
            <p><MailOutlined /> {employeeDetails.email}</p>
          </Col>
          <Col span={12}>
            <Text strong>Số điện thoại:</Text>
            <p><PhoneOutlined /> {employeeDetails.phoneNumber}</p>
          </Col>
          <Col span={24}>
            <Text strong>Địa chỉ:</Text>
            <p>
              <EnvironmentOutlined />{' '}
              {employeeDetails.addressLines
                ? `${employeeDetails.addressLines.houseNumber}, ${employeeDetails.addressLines.ward}, ${employeeDetails.addressLines.district}, ${employeeDetails.addressLines.province}`
                : 'Không có địa chỉ'}
            </p>
          </Col>
          <Col span={12}>
            <Text strong>Ngày tham gia:</Text>
            <p>{new Date(employeeDetails.joinDate).toLocaleDateString('vi-VN')}</p>
          </Col>
          <Col span={12}>
            <Text strong>Trạng thái:</Text>
            <p>{employeeDetails.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}</p>
          </Col>
        </Row>

        <Divider />

        <div className={styles.actionButtons}>
          {/* <Button type="primary" style={{ marginRight: '10px' }}>Chỉnh sửa thông tin</Button> */}
          <Button type="primary" onClick={() => setIsModalVisible(true)}>Đổi mật khẩu</Button>
        </div>
      </Card>

      {/* Modal đổi mật khẩu */}
      <Modal
        title="Đổi mật khẩu"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handlePasswordChange} layout="vertical">
          <Form.Item
            label="Mật khẩu hiện tại"
            name="oldPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Xác nhận
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile;
