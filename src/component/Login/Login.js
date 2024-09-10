import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Bao gồm cookie trong yêu cầu
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Đăng nhập thành công');
        navigate('UIPage'); // Điều hướng sau khi đăng nhập thành công
      } else {
        setErrorMessage(data.message || 'Có lỗi xảy ra khi đăng nhập');
      }
    } catch (error) {
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
              <button type="button" className="btn-switch" onClick={onSwitchToRegister}>Chưa có tài khoản? Đăng Ký</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
