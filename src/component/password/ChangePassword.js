import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../untills/api'; // Giả định là bạn đã có API này
// import './ChangePassword.css'; 
import { AuthContext } from '../../untills/context/AuthContext'; // Context cho xác thực

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); 

  // Hàm xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra mật khẩu mới và xác nhận có khớp không
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      // Kiểm tra người dùng có hợp lệ không
      if (!user || !user._id) {
        setError('Không thể xác định người dùng');
        return;
      }

      // Gọi API để đổi mật khẩu
      const response = await changePassword(user._id, oldPassword, newPassword);
      setSuccess(response.message); // Hiển thị thông báo thành công

      // Sau khi đổi mật khẩu, logout và điều hướng về trang đăng nhập
      logout();
      navigate('/'); 

    } catch (err) {
      setError(err.response?.data.message || 'Có lỗi xảy ra'); // Xử lý lỗi trả về từ API
    }
  };

  return (
    <div className="change-password-container">
      <h2>Đổi Mật Khẩu</h2>
      
      {/* Hiển thị thông báo lỗi nếu có */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Hiển thị thông báo thành công nếu có */}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="oldPassword">Mật khẩu cũ</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="newPassword">Mật khẩu mới</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Đổi Mật Khẩu</button>
      </form>
    </div>
  );
};

export default ChangePassword;
