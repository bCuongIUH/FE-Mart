import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, Button, Alert, Snackbar } from '@mui/material';
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

    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5 && value) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }

      if (newOtp.join('').length === 6) {
        handleSubmit(newOtp.join(''));
      }
    } else if (value === '' && index > 0) {
      newOtp[index] = '';
      setOtp(newOtp);
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (otpCode) => {
    try {
      const response = await verifyOTP({ email, otp: otpCode });

      if (response.status === 200) {
        setShowSuccess(true);
        setShowFailure(false); 
        setTimeout(() => {
          localStorage.setItem('token', response.data.token);
          navigate('/');
        }, 3000); 
      } else {
        setShowFailure(true);
        setErrorMessage(response.data.message || 'Xác minh OTP thất bại');
      }
    } catch (error) {
      setErrorMessage('Lỗi server');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Xác minh OTP
      </Typography>
      {showSuccess && (
        <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)}>
          <Alert severity="success">Xác minh thành công!</Alert>
        </Snackbar>
      )}
      {showFailure && (
        <Snackbar open={showFailure} autoHideDuration={3000} onClose={() => setShowFailure(false)}>
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      )}
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        {otp.map((digit, index) => (
          <TextField
            key={index}
            id={`otp-input-${index}`}
            type="text"
            inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.5rem' } }}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onFocus={(e) => e.target.select()}
            variant="outlined"
            sx={{ width: 50, height: 50 }}
          />
        ))}
      </Box>
      {errorMessage && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {errorMessage}
        </Typography>
      )}
      <Button
        onClick={() => handleSubmit(otp.join(''))}
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
      >
        Xác nhận OTP
      </Button>
    </Box>
  );
}

export default OTPVerification;
