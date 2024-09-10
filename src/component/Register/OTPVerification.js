import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OTPVerification.css';
function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || ''; // Lấy email từ state

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setSuccessMessage('Xác minh thành công! Bạn có thể đăng nhập.');
        // Điều hướng đến trang đăng nhập hoặc trang chính
        navigate('/login');
      } else {
        setErrorMessage(data.message || 'Xác minh OTP thất bại');
      }
    } catch (error) {
      console.error('Lỗi xác minh OTP:', error);
      setErrorMessage('Lỗi server');
    }
  };

  return (
    <div className="otp-verification-container">
      <button className="close-btn" onClick={() => navigate(-1)}>&times;</button>
      <h2>Xác minh OTP</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
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
