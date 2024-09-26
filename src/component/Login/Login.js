import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css'; 
import { AuthContext } from '../../untills/context/AuthContext';
import { postLogin } from '../../untills/api';

function Login({ onClose, onSwitchToRegister }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const modalRef = useRef(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postLogin({ email, password });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); 
        
        login(data.user);
        if (data.user.role === 'admin') {
          navigate('/UIManager');
        } else {
          navigate('/UIPage');
        }
      } else {
        setErrorMessage(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      setErrorMessage('Lỗi server');
    }
  };

  const handleClose = () => {
    // Gọi hàm onClose khi đóng modal
    if (onClose) {
      onClose();
    }
  };

  // Xử lý nhấn ra ngoài modal
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    // Thêm event listener để đóng modal khi nhấn ra ngoài
    document.addEventListener('mousedown', handleClickOutside);
    
    // Dọn dẹp event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.overlay + ' ' + styles.overlayShow}>
      <div className={styles.modal + ' ' + styles.modalShow} ref={modalRef}>
        <div className={styles.content}>
          <h2 className={styles.title}>Đăng Nhập</h2>
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className={styles.label}>Mật khẩu</label>
            <input
              type="password"
              className={styles.input}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className={styles.btnSubmit}>Đăng Nhập</button>
            <div className={styles.switchText}>
              <button type="button" className={styles.btnSwitch} onClick={onSwitchToRegister}>
                Chưa có tài khoản? Đăng Ký
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
