
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext';
import { postLogin } from '../../untills/api';
import { Modal, Input, Button, Typography, Alert, Form } from 'antd';

const { Title, Text } = Typography;

function Login({ onClose, onSwitchToRegister }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await postLogin({ email, password });
  
      const data = response.data;
      localStorage.setItem('token', data.token);
      login(data.user);
  
      if (data.user.role === 'admin') {
        navigate('/UIManager');
      } else {
        navigate('/UIPage');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.status === 400
          ? error.response.data.message || 'Sai mật khẩu'
          : 'Lỗi server'
      );
    }
  };
  

  return (
    <Modal
      title={<Title level={4} style={{ textAlign: 'center' }}>Đăng Nhập</Title>}
      visible
      onCancel={onClose}
      footer={null}
    >
      {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button  type="primary" htmlType="submit" block>
            Đăng Nhập
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={onSwitchToRegister} block>
            Chưa có tài khoản? Đăng Ký
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Login;
