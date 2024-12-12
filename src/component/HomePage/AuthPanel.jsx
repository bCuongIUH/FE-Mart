import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { postLogin, postRegister, verifyOTP, resendOTP } from '../../untills/api';
import { notification } from 'antd';

function InputField({ label, type, value, onChange, onFocus, placeholder, required }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default function AuthPanel({ isOpen, onClose, onLoginSuccess }) {
  const [activeAuthTab, setActiveAuthTab] = useState('login');
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otpStep, setOtpStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpInputDisabled, setIsOtpInputDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerPhoneNumber, setRegisterPhoneNumber] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const resetError = () => {
    setErrorMessage('');
  };

  const resetAllInputs = () => {
    setLoginEmail('');
    setLoginPassword('');
    setConfirmPassword('');
    setFullName('');
    setPhoneNumber('');
    setOtp(['', '', '', '', '', '']);
    setErrorMessage('');
    setActiveAuthTab('login');
    setOtpStep(false);
    setIsSubmitting(false);
    setIsOtpInputDisabled(false);
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await postLogin({ email: loginEmail, password: loginPassword });
      const data = response.data;
      localStorage.setItem('token', data.token);
      onLoginSuccess(data.user);
      resetAllInputs();
      onClose();
    } catch (error) {
      setErrorMessage(
        error.response?.status === 400
          ? error.response.data.message || 'Sai mật khẩu'
          : 'Lỗi server'
      );
    }
  };
  
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const nameRegex = /^[A-Za-z\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/g;
    if (!nameRegex.test(registerFullName)) {
      setErrorMessage('Họ và tên chỉ chứa chữ cái, dấu cách, và ít nhất 2 ký tự.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(registerEmail)) {
      setErrorMessage('Email phải có định dạng đúng, ví dụ: abc@gmail.com');
      return;
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(registerPhoneNumber)) {
      setErrorMessage('Số điện thoại phải gồm 10 số và bắt đầu bằng 0.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,32}$/;
    if (!passwordRegex.test(registerPassword)) {
      setErrorMessage('Mật khẩu phải từ 8-32 ký tự, bao gồm cả chữ và số.');
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await postRegister({
        email: registerEmail,
        password: registerPassword,
        fullName: registerFullName,
        phoneNumber: registerPhoneNumber,
      });

      if (response.status === 201) {
        const otpResponse = await resendOTP({ email: registerEmail });
        if (otpResponse.status === 200) {
          setOtp(['', '', '', '', '', '']);
          setTimer(60);
          setIsResendDisabled(true);
          setOtpStep(true);
          notification.success({ message: 'Vui lòng kiểm tra email để xác minh OTP.' });
        } else {
          setErrorMessage('Không thể gửi mã OTP. Vui lòng thử lại.');
        }
      } else if (response.status === 409) {
        if (response.data.message.includes('email')) {
          setErrorMessage('Email đã được sử dụng.');
        } else if (response.data.message.includes('phone number')) {
          setErrorMessage('Số điện thoại đã tồn tại.');
        }
      } else {
        setErrorMessage(response.data.message || 'Có lỗi xảy ra khi đăng ký');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Lỗi server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOTP = async (otpCode) => {
    if (otpCode.length !== 6) {
      setErrorMessage('Vui lòng nhập đầy đủ 6 ký tự OTP.');
      return;
    }
    try {
      const response = await verifyOTP({ email: registerEmail, otp: otpCode });
      if (response.status === 200) {
        notification.success({ message: 'Xác minh thành công!' });
        resetAllInputs();
        onClose();
      } else {
        setErrorMessage(response.data.message || 'OTP không chính xác');
      }
    } catch (error) {
      setErrorMessage('OTP không chính xác');
    }
  };

  const handleResendOTP = async () => {
    setErrorMessage('');
    setOtp(['', '', '', '', '', '']);
    setIsLoading(true);
    try {
      const resendResponse = await resendOTP({ email: registerEmail });
      if (resendResponse.status === 200) {
        setTimer(60);
        setIsResendDisabled(true);
        setIsOtpInputDisabled(false);
        notification.success({ message: 'Mã OTP đã được gửi lại! Hãy kiểm tra email của bạn.' });
      } else {
        notification.error({ message: 'Không thể gửi lại mã OTP. Vui lòng thử lại sau.' });
      }
    } catch {
      notification.error({ message: 'Không thể gửi lại mã OTP, vui lòng thử lại sau.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetAllInputs();
    onClose();
  };

  return (
    <div
      className={`fixed top-0 right-0 w-full md:w-1/3 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tài Khoản</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {forgotPasswordStep === 0 && !otpStep ? (
          <>
            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                className={`flex-1 py-2 rounded-md ${activeAuthTab === 'login' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setActiveAuthTab('login')}
              >
                Đăng nhập
              </button>
              <button
                className={`flex-1 py-2 rounded-md ${activeAuthTab === 'signup' ? 'bg-white shadow-sm' : ''}`}
                onClick={() => setActiveAuthTab('signup')}
              >
                Đăng ký
              </button>
            </div>
            {activeAuthTab === 'login' && (
              <form onSubmit={handleSubmitLogin} className="space-y-4">
                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{errorMessage}</span>
                  </div>
                )}
                <InputField
                  label="Email"
                  type="email"
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  onFocus={resetError}
                  placeholder="Nhập địa chỉ email"
                  required
                />
                <InputField
                  label="Mật khẩu"
                  type="password"
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  onFocus={resetError}
                  placeholder="Nhập mật khẩu"
                  required
                />
                  <div className="text-right mt-4">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordStep(1)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Đăng nhập
                </button>
              </form>
            )}
            {activeAuthTab === 'signup' && (
              <form onSubmit={handleSubmitRegister} className="space-y-4">
                {errorMessage && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{errorMessage}</span>
                  </div>
                )}
                <InputField
                  label="Họ và tên"
                  type="text"
                  value={registerFullName} 
                  onChange={(e) => setRegisterFullName(e.target.value)} 
                  onFocus={resetError}
                  placeholder="Nhập đầy đủ họ và tên"
                  required
                />
                <InputField
                  label="Số điện thoại"
                  type="tel"
                  value={registerPhoneNumber} 
                  onChange={(e) => setRegisterPhoneNumber(e.target.value)} 
                  onFocus={resetError}
                  placeholder="Nhập số điện thoại"
                  required
                />
                <InputField
                  label="Email"
                  type="email"
                  value={registerEmail} 
                  onChange={(e) => setRegisterEmail(e.target.value)} 
                  onFocus={resetError}
                  placeholder="Nhập địa chỉ email"
                  required
                />
                <InputField
                  label="Mật khẩu"
                  type="password"
                  value={registerPassword} 
                  onChange={(e) => setRegisterPassword(e.target.value)} 
                  onFocus={resetError}
                  placeholder="Nhập mật khẩu"
                  required
                />
                <InputField
                  label="Xác nhận mật khẩu"
                  type="password"
                  value={registerConfirmPassword} 
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)} 
                  onFocus={resetError}
                  placeholder="Nhập lại mật khẩu"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Vui lòng chờ...' : 'Đăng ký'}
                </button>
              </form>
            )}
          </>
        ) : otpStep && (
          <div>
            <h3 className="text-lg font-bold text-gray-700">Nhập mã OTP từ email của bạn</h3>
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{errorMessage}</span>
              </div>
            )}
            <div>
              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-6 gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      value={digit}
                      onChange={(e) => {
                        if (isOtpInputDisabled) return;
                        const newOtp = [...otp];
                        newOtp[index] = e.target.value;
                        setOtp(newOtp);
                        setErrorMessage('');

                        if (e.target.value && index < otp.length - 1) {
                          document.getElementById(`otp-${index + 1}`).focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (isOtpInputDisabled) return;
                        if (e.key === 'Backspace' && digit === '' && index > 0) {
                          document.getElementById(`otp-${index - 1}`).focus();
                        }
                      }}
                      maxLength={1}
                      id={`otp-${index}`}
                      className={`w-full h-10 text-center border border-gray-300 rounded-md ${
                        isOtpInputDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      disabled={isOtpInputDisabled}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSubmitOTP(otp.join(''))}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                isOtpInputDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isOtpInputDisabled}
            >
              Xác minh OTP
            </button>
            <div className="flex justify-center items-center mt-4 w-full">
              {isResendDisabled ? (
                <span className="text-gray-600 text-center">Gửi lại sau {timer} giây</span>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className={`text-blue-600 text-center ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Gửi lại OTP'
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

AuthPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func.isRequired,
};