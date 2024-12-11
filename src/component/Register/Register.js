import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRegister } from '../../untills/api';
import { Modal, Input, Button, Typography, Alert, Form } from 'antd';

const { Title } = Typography;

function Register({ onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Regex để kiểm tra số điện thoại Việt Nam
  const phoneRegex = /^0\d{9}$/;

  // Regex để kiểm tra tên tiếng Việt
  const vietnameseNameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểễếìỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹỶ\s]+$/;
  
  const passwordRegex = /^[\s\S]{8,32}$/;


  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }
    if (!phoneRegex.test(phoneNumber)) {
      setErrorMessage('Số điện thoại không hợp lệ. Phải là 10 số và bắt đầu bằng 0.');
      return;
    }
    if (!vietnameseNameRegex.test(fullName)) {
      setErrorMessage('Tên không hợp lệ. Vui lòng nhập tên bằng tiếng Việt.');
      return;
    }
    if (!passwordRegex.test(password)) {
      setErrorMessage('Mật khẩu không hợp lệ. Mật khẩu phải có độ dài từ 8 đến 32 ký tự.');
      return;
    }

    try {
      const response = await postRegister({ email, password, fullName, phoneNumber });
      if (response.status === 201) {
        console.log('Đăng ký thành công');
        navigate('/otp-verification', { state: { email } });
      } else {
        setErrorMessage(response.data.message || 'Có lỗi xảy ra khi đăng ký');
      }
    } catch (error) {
      // Nếu Backend trả về lỗi, lấy thông báo lỗi
      setErrorMessage(error.response?.data?.message || 'Lỗi server');
    }
  };

  return (
    <Modal
      title={<Title level={4} style={{ textAlign: 'center' }}>Đăng Ký</Title>}
      visible
      onCancel={onClose}
      footer={null}
    >
      {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Họ tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
          <Input
            placeholder="Nhập họ tên của bạn"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
          <Input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
          <Input
            placeholder="Nhập số điện thoại của bạn"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Xác nhận mật khẩu" name="confirmPassword" rules={[{ required: true, message: 'Vui lòng nhập lại mật khẩu!' }]}>
          <Input.Password
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng Ký
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={onSwitchToLogin} block>
            Đã có tài khoản? Đăng Nhập
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Register;
