import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OTPVerification.css';
import { verifyOTP } from '../../untills/api';
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
      const response = await verifyOTP({ email, otp });

      if (response.status === 200) { // Nếu HTTP status là 200 OK
        localStorage.setItem('token', response.data.token); // Lưu token vào localStorage
        navigate('/'); // Điều hướng tới trang chính
      } else {
        setErrorMessage(response.data.message || 'Xác minh OTP thất bại');
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
