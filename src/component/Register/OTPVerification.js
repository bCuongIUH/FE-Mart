// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Box, TextField, Typography, Button, Alert, Snackbar } from '@mui/material';
// import { verifyOTP } from '../../untills/api';

// function OTPVerification() {
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showFailure, setShowFailure] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const email = location.state?.email || '';

//   const handleChange = (e, index) => {
//     const { value } = e.target;
//     const newOtp = [...otp];

//     if (value.length <= 1 && /^[0-9]*$/.test(value)) {
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (index < 5 && value) {
//         document.getElementById(`otp-input-${index + 1}`).focus();
//       }

//       if (newOtp.join('').length === 6) {
//         handleSubmit(newOtp.join(''));
//       }
//     } else if (value === '' && index > 0) {
//       newOtp[index] = '';
//       setOtp(newOtp);
//       document.getElementById(`otp-input-${index - 1}`).focus();
//     }
//   };

//   const handleSubmit = async (otpCode) => {
//     try {
//       const response = await verifyOTP({ email, otp: otpCode });

//       if (response.status === 200) {
//         setShowSuccess(true);
//         setShowFailure(false); 
//         setTimeout(() => {
//           localStorage.setItem('token', response.data.token);
//           navigate('/');
//         }, 3000); 
//       } else {
//         setShowFailure(true);
//         setErrorMessage(response.data.message || 'Xác minh OTP thất bại');
//       }
//     } catch (error) {
//       setErrorMessage('Lỗi server');
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
//       <Typography variant="h4" gutterBottom>
//         Xác minh OTP
//       </Typography>
//       {showSuccess && (
//         <Snackbar open={showSuccess} autoHideDuration={3000} onClose={() => setShowSuccess(false)}>
//           <Alert severity="success">Xác minh thành công!</Alert>
//         </Snackbar>
//       )}
//       {showFailure && (
//         <Snackbar open={showFailure} autoHideDuration={3000} onClose={() => setShowFailure(false)}>
//           <Alert severity="error">{errorMessage}</Alert>
//         </Snackbar>
//       )}
//       <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
//         {otp.map((digit, index) => (
//           <TextField
//             key={index}
//             id={`otp-input-${index}`}
//             type="text"
//             inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: '1.5rem' } }}
//             value={digit}
//             onChange={(e) => handleChange(e, index)}
//             onFocus={(e) => e.target.select()}
//             variant="outlined"
//             sx={{ width: 50, height: 50 }}
//           />
//         ))}
//       </Box>
//       {errorMessage && (
//         <Typography color="error" variant="body2" sx={{ mt: 1 }}>
//           {errorMessage}
//         </Typography>
//       )}
//       <Button
//         onClick={() => handleSubmit(otp.join(''))}
//         variant="contained"
//         color="primary"
//         sx={{ mt: 3 }}
//       >
//         Xác nhận OTP
//       </Button>
//     </Box>
//   );
// }

// export default OTPVerification;
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, Typography, Button, Alert, notification, Row, Col } from 'antd';
import { verifyOTP, resendOTP } from '../../untills/api';

const { Title, Text } = Typography;

function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || '';

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  // Handle OTP input change
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

  // Handle OTP verification
  const handleSubmit = async (otpCode) => {
    try {
      const response = await verifyOTP({ email, otp: otpCode });

      if (response.status === 200) {
        notification.success({ message: 'Xác minh thành công!' });
        localStorage.setItem('token', response.data.token);
        navigate('/');
      } else {
        setErrorMessage(response.data.message || 'Xác minh OTP thất bại');
      }
    } catch (error) {
      setErrorMessage('Lỗi server');
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      await resendOTP({ email });
      setOtp(['', '', '', '', '', '']);
      setTimer(60);
      setIsResendDisabled(true);
      notification.success({ message: 'Mã OTP đã được gửi lại!' });
    } catch {
      notification.error({ message: 'Không thể gửi lại mã OTP, vui lòng thử lại sau.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <Title level={3}>Xác minh OTP</Title>
      <Text>Vui lòng nhập mã OTP đã được gửi đến email: {email}</Text>

      <Row gutter={8} style={{ marginTop: '20px' }}>
        {otp.map((digit, index) => (
          <Col key={index}>
            <Input
              id={`otp-input-${index}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              style={{
                width: '50px',
                height: '50px',
                textAlign: 'center',
                fontSize: '1.5rem',
                pointerEvents: timer > 0 ? 'auto' : 'none', 
              }}
            />
          </Col>
        ))}
      </Row>

      {errorMessage && (
        <Alert message={errorMessage} type="error" showIcon style={{ marginTop: '15px' }} />
      )}

      <Button
        type="primary"
        onClick={() => handleSubmit(otp.join(''))}
        style={{ marginTop: '20px' }}
        disabled={otp.join('').length < 6 || timer === 0}
      >
        Xác nhận OTP
      </Button>

      <div style={{ marginTop: '20px' }}>
        {timer > 0 ? (
          <Text type="secondary">Gửi lại mã sau: {timer}s</Text>
        ) : (
          <Button type="link" onClick={handleResendOTP} disabled={isResendDisabled}>
            Gửi lại mã OTP
          </Button>
        )}
      </div>
    </div>
  );
}

export default OTPVerification;
