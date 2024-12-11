import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { verifyOTP, resendOTP } from '../../untills/api';

function OTPVerification({ email, onSuccess }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];

    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5 && value) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }

      if (newOtp.join('').length === 6) {
        handleSubmit(newOtp.join(''));
      }
    }
  };

  const handleSubmit = async (otpCode) => {
    try {
      const response = await verifyOTP({ email, otp: otpCode });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        onSuccess();
      } else {
        setErrorMessage(response.data.message || 'Xác minh OTP thất bại');
      }
    } catch (error) {
      setErrorMessage('Lỗi server');
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP({ email });
      setOtp(['', '', '', '', '', '']);
      setTimer(60);
      setIsResendDisabled(true);
    } catch {
      setErrorMessage('Không thể gửi lại mã OTP, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-2xl font-semibold mb-4 text-center">Xác minh OTP</h3>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Vui lòng nhập mã OTP đã được gửi đến email: {email}
        </p>
        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              id={`otp-input-${index}`}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              maxLength={1}
              className="w-12 h-12 text-center text-2xl border rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
            />
          ))}
        </div>
        {errorMessage && <p className="text-red-500 text-sm mb-4 text-center">{errorMessage}</p>}
        <button
          onClick={() => handleSubmit(otp.join(''))}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
          disabled={otp.join('').length < 6}
        >
          Xác nhận OTP
        </button>
        <div className="text-center">
          {timer > 0 ? (
            <p className="text-sm text-gray-500">Gửi lại mã sau: {timer}s</p>
          ) : (
            <button
              onClick={handleResendOTP}
              className="text-blue-600 hover:underline text-sm"
              disabled={isResendDisabled}
            >
              Gửi lại mã OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

OTPVerification.propTypes = {
  email: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default OTPVerification;

