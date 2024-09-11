
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 
import { AuthContext } from '../../untills/context/AuthContext';

import { postLogin } from '../../untills/api';

function Login({ onClose, onSwitchToRegister }) {
  const { login } = useContext(AuthContext); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postLogin({ email, password });

      if (response.status === 200) {
        const data = response.data; // Dữ liệu trả về từ API

        // Lưu token vào localStorage
        localStorage.setItem('token', data.token);
        
        // Lưu thông tin người dùng vào AuthContext
        login(data.user);

        // Log thông tin người dùng và token
        console.log('User Data:', data.user);
        console.log('Token:', localStorage.getItem('token'));

        navigate('/UIPage'); // Điều hướng sau khi đăng nhập thành công
      } else {
        setErrorMessage(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      setErrorMessage('Lỗi server');
    }
  };

  return (
    <div className="login-overlay show">
      <div className="login-modal show">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="login-content">
          <h2>Đăng Nhập</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-submit">Đăng Nhập</button>
            <div className="switch-text">
              <button type="button" className="btn-switch" onClick={onSwitchToRegister}>
                Chưa có tài khoản? Đăng Ký
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
