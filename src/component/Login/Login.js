// import React, { useState, useContext, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from './login.module.css'; 
// import { AuthContext } from '../../untills/context/AuthContext';
// import { postLogin } from '../../untills/api';

// function Login({ onClose, onSwitchToRegister }) {
//   const { login } = useContext(AuthContext);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();
//   const modalRef = useRef(null); 

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await postLogin({ email, password });
  
//       if (response.status === 200) {
//         const data = response.data;
//         localStorage.setItem('token', data.token);
//         const token = localStorage.getItem('token');
//         console.log('Token from localStorage:', token); 
  
//         login(data.user);
//         if (data.user.role === 'admin') {
//           navigate('/UIManager');
//         } else {
//           navigate('/');
//         }
//       } else {
//         setErrorMessage(response.data.message || 'Đăng nhập thất bại');
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         setErrorMessage(error.response.data.message || 'Sai mật khẩu');
//       } else {
//         setErrorMessage('Lỗi server');
//       }
//     }
//   };
  

//   const handleClose = () => {
//     // Gọi hàm onClose khi đóng modal
//     if (onClose) {
//       onClose();
//     }
//   };

//   // Xử lý nhấn ra ngoài modal
//   const handleClickOutside = (e) => {
//     if (modalRef.current && !modalRef.current.contains(e.target)) {
//       handleClose();
//     }
//   };

//   useEffect(() => {
   
//     document.addEventListener('mousedown', handleClickOutside);
    
    
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className={styles.overlay + ' ' + styles.overlayShow}>
//       <div className={styles.modal + ' ' + styles.modalShow} ref={modalRef}>
//         <div className={styles.content}>
//           <h2 className={styles.title}>Đăng Nhập</h2>
//           {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
//           <form className={styles.form} onSubmit={handleSubmit}>
//             <label className={styles.label}>Email</label>
//             <input
//               type="email"
//               className={styles.input}
//               placeholder="Nhập email của bạn"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <label className={styles.label}>Mật khẩu</label>
//             <input
//               type="password"
//               className={styles.input}
//               placeholder="Nhập mật khẩu"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <button type="submit" className={styles.btnSubmit}>Đăng Nhập</button>
//             <div className={styles.switchText}>
//               <button type="button" className={styles.btnSwitch} onClick={onSwitchToRegister}>
//                 Chưa có tài khoản? Đăng Ký
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext';
import { postLogin } from '../../untills/api';
import { Modal, Input, Button, Typography, Alert, Form } from 'antd';

const { Title, Text } = Typography;

function Login({ onClose, onSwitchToRegister }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await postLogin({ email, password });
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        login(data.user);
        data.user.role === 'admin' ? navigate('/UIManager') : navigate('/UIPage');
      } else {
        setErrorMessage(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.status === 400
          ? error.response.data.message || 'Sai mật khẩu'
          : 'Lỗi server'
      );
    }
  };

  return (
    <Modal
      title={<Title level={4} style={{ textAlign: 'center' }}>Đăng Nhập</Title>}
      visible
      onCancel={onClose}
      footer={null}
    >
      {errorMessage && <Alert message={errorMessage} type="error" showIcon style={{ marginBottom: 16 }} />}
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button  type="primary" htmlType="submit" block>
            Đăng Nhập
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={onSwitchToRegister} block>
            Chưa có tài khoản? Đăng Ký
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Login;
