import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './OTPVerification.module.css'; 
import { verifyOTP } from '../../untills/api';

function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const email = location.state?.email || '';

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];

    // Nếu nhập một ký tự hợp lệ
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      newOtp[index] = value;
      setOtp(newOtp);

      // Tự động chuyển sang ô tiếp theo
      if (index < 5 && value) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
      
      // Kiểm tra nếu đã nhập đủ 6 số
      if (newOtp.join('').length === 6) {
        handleSubmit(newOtp.join(''));
      }
    } 

    else if (value === '' && index > 0) {
      newOtp[index] = '';
      setOtp(newOtp);
      document.getElementById(`otp-input-${index - 1}`).focus(); 
    }
  };
// chức năng otp
  const handleSubmit = async (otpCode) => {
    try {
      const response = await verifyOTP({ email, otp: otpCode });

      if (response.status === 200) {
        setShowSuccess(true);
        setShowFailure(false); 
        setTimeout(() => {
          localStorage.setItem('token', response.data.token);
          navigate('/');
        }, 3000); // Hiện GIF thành công trong 3 giây
      } else {
        setShowFailure(true);
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
          <img src="Success Micro-interaction.gif" alt="Success" />
        </div>
      )}
      {showFailure && (
        <div className={styles.failure}>
          <img src="Failure Micro-interaction.gif" alt="Failure" />
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
              onFocus={(e) => e.target.select()} 
              className={styles.otpInput}
            />
          ))}
        </div>
      </form>
    </div>
  );
}

export default OTPVerification;
