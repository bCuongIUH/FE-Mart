
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { postRegister } from '../../untills/api';
function Register({ onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      const response = await postRegister({ email, password, name, phoneNumber });

      if (response.status === 201) { // Nếu HTTP status là 201 Created
        console.log('Đăng ký thành công');
        // Điều hướng tới trang xác minh OTP và truyền email qua state
        navigate('/otp-verification', { state: { email } });
      } else {
        setErrorMessage(response.data.message || 'Có lỗi xảy ra khi đăng ký');
      }
    } catch (error) {
      setErrorMessage('Lỗi server');
    }
  };

  return (
    <div className="register-overlay show">
      <div className="register-modal show">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="register-content">
          <h2>Đăng Ký</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form className="register-form" onSubmit={handleSubmit}>
            <label>Họ tên</label>
            <input
              type="text"
              placeholder="Nhập họ tên của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Số điện thoại</label>
            <input
              type="text"
              placeholder="Nhập số điện thoại của bạn"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-submit">Đăng Ký</button>
            <div className="switch-text">
              <button type="button" className="btn-switch" onClick={onSwitchToLogin}>Đã có tài khoản? Đăng Nhập</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
