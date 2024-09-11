// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Register.css';

// function Register({ onClose, onSwitchToLogin }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:5000/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log('Đăng ký thành công');
//         // Điều hướng tới màn hình OTP và truyền email qua state
//         navigate('/otp-verification', { state: { email } });
//       } else {
//         setErrorMessage(data.message || 'Có lỗi xảy ra khi đăng ký');
//       }
//     } catch (error) {
//       setErrorMessage('Lỗi server');
//     }
//   };

//   return (
//     <div className="register-overlay show">
//       <div className="register-modal show">
//         <button className="close-btn" onClick={onClose}>&times;</button>
//         <div className="register-content">
//           <h2>Đăng Ký</h2>
//           {errorMessage && <p className="error-message">{errorMessage}</p>}
//           <form className="register-form" onSubmit={handleSubmit}>
//             <label>Email</label>
//             <input
//               type="email"
//               placeholder="Nhập email của bạn"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <label>Mật khẩu</label>
//             <input
//               type="password"
//               placeholder="Nhập mật khẩu"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <label>Xác Nhận Mật khẩu</label>
//             <input
//               type="password"
//               placeholder="Nhập lại mật khẩu"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//             />
//             <button type="submit" className="btn-submit">Đăng Ký</button>
//             <div className="switch-text">
//               <button type="button" className="btn-switch" onClick={onSwitchToLogin}>Đã có tài khoản? Đăng Nhập</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Register;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register({ onClose, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Đăng ký thành công');
        // Navigate to OTP verification page and pass email through state
        navigate('/otp-verification', { state: { email } });
      } else {
        setErrorMessage(data.message || 'Có lỗi xảy ra khi đăng ký');
      }
    } catch (error) {
      setErrorMessage('Lỗi server');
    }
  };

  return (
    <div className="register-overlay show">
      <div className="register-modal show">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="register-content">
          <h2>Đăng Ký</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <form className="register-form" onSubmit={handleSubmit}>
            <label>Họ tên</label>
            <input
              type="text"
              placeholder="Nhập họ tên của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Số điện thoại</label>
            <input
              type="text"
              placeholder="Nhập số điện thoại của bạn"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-submit">Đăng Ký</button>
            <div className="switch-text">
              <button type="button" className="btn-switch" onClick={onSwitchToLogin}>Đã có tài khoản? Đăng Nhập</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
