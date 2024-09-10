import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register({ onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu không khớp');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Đăng ký thất bại');
        return;
      }
  
      const data = await response.json();
      setSuccessMessage('Đăng ký thành công! Hãy kiểm tra email để xác nhận.');
      setIsOtpSent(true);
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      setErrorMessage('Lỗi server');
    }
  };
  
  const handleOtpSubmit = async (otp) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp
        }),
      });

      const data = await response.json();

      if (response.status === 200) {
        navigate('/'); // Chuyển đến trang  sau khi xác minh thành công
      } else {
        setErrorMessage(data.message || 'Xác minh OTP thất bại');
      }
    } catch (error) {
      console.error('Lỗi xác minh OTP:', error);
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
          {successMessage && !isOtpSent && <p className="success-message">{successMessage}</p>}
          {!isOtpSent ? (
            <form className="register-form" onSubmit={handleSubmit}>
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
              <label>Xác Nhận Mật khẩu</label>
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
          ) : (
            <OtpVerification onOtpSubmit={handleOtpSubmit} />
          )}
        </div>
      </div>
    </div>
  );
}

const OtpVerification = ({ onOtpSubmit }) => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onOtpSubmit(otp);
  };

  return (
    <form className="otp-form" onSubmit={handleSubmit}>
      <label>Mã OTP</label>
      <input
        type="text"
        placeholder="Nhập mã OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button type="submit" className="btn-submit">Xác Minh</button>
    </form>
  );
};

export default Register;
