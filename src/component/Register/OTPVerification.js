import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './OTPVerification.module.css'; // Import the CSS Module
import { verifyOTP } from '../../untills/api';

function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy email từ state được truyền qua navigate
  const email = location.state?.email || '';

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input field
      if (index < 5 && value) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }

      // Check if OTP is complete
      if (newOtp.join('').length === 6) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await verifyOTP({ email, otp: otp.join('') });

      if (response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          localStorage.setItem('token', response.data.token);
          navigate('/');
        }, 3000); // Show success GIF for 3 seconds
      } else {
        setErrorMessage(response.data.message || 'Xác minh OTP thất bại');
      }
    } catch (error) {
      setErrorMessage('Lỗi server');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Xác minh OTP</h2>
      {showSuccess && (
        <div className={styles.success}>
          <img src="/Success Micro-interaction.gif" alt="Success" />
        </div>
      )}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className={styles.otpFields}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              className={styles.otpInput}
            />
          ))}
        </div>
        <button type="button" className={styles.submitButton} onClick={handleSubmit}>
          Xác Minh
        </button>
      </form>
    </div>
  );
}

export default OTPVerification;
