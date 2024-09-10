import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OTPVerification.css';

function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy email từ state được truyền qua navigate
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem('token', data.token);  // Lưu token vào localStorage
        navigate('/');  // Điều hướng tới trang chính
      } else {
        setErrorMessage(data.message || 'Xác minh OTP thất bại');
      }
    } catch (error) {
      setErrorMessage('Lỗi server');
    }
  };

  return (
    <div className="otp-verification-container">
      <h2>Xác minh OTP</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>Nhập mã OTP</label>
        <input
          type="text"
          placeholder="Nhập mã OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Xác Minh</button>
      </form>
    </div>
  );
}

export default OTPVerification;
