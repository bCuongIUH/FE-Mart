import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { postRegister } from '../../untills/api';

function Register({ onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const modalRef = useRef(null); 

//nút đăng kí
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      const response = await postRegister({ email, password, fullName, phoneNumber });

      if (response.status === 201) {
        console.log('Đăng ký thành công');
        navigate('/otp-verification', { state: { email } });
      } else {
        setErrorMessage(response.data.message || 'Có lỗi xảy ra khi đăng ký');
      }
    } catch (error) {
      setErrorMessage('Lỗi server');
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`${styles.registerOverlay} ${styles.registerOverlayShow}`}>
      <div ref={modalRef} className={`${styles.registerModal} ${styles.registerModalShow}`}>
        <div className={styles.registerContent}>
          <h2 className={styles.registerModalHeading}>Đăng Ký</h2>
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          <form className={styles.registerForm} onSubmit={handleSubmit}>
            <label className={styles.registerFormLabel}>Họ tên</label>
            <input
              type="text"
              placeholder="Nhập họ tên của bạn"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={styles.registerFormInput}
            />
            <label className={styles.registerFormLabel}>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.registerFormInput}
            />
            <label className={styles.registerFormLabel}>Số điện thoại</label>
            <input
              type="text"
              placeholder="Nhập số điện thoại của bạn"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className={styles.registerFormInput}
            />
            <label className={styles.registerFormLabel}>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.registerFormInput}
            />
            <label className={styles.registerFormLabel}>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.registerFormInput}
            />
            <button type="submit" className={styles.btnSubmit}>Đăng Ký</button>
            <div className={styles.switchText}>
              <button type="button" className={styles.btnSwitch} onClick={onSwitchToLogin}>Đã có tài khoản? Đăng Nhập</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
