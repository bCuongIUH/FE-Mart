import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm vào để chuyển hướng
import { changePassword, removeToken } from '../../untills/api'; 
import './ChangePassword.css'; 
import { AuthContext } from '../../untills/context/AuthContext';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate(); // Khai báo useNavigate để chuyển hướng

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
        return;
      }
  
      try {
        if (!user || !user.id) {
          setError('Không thể xác định người dùng');
          return;
        }

        // Gọi API đổi mật khẩu
        const response = await changePassword(user.id, oldPassword, newPassword);
        setSuccess(response.message);

        // Xóa token và chuyển hướng đến trang đăng nhập
        await removeToken();
        navigate('/login'); // Thay đổi đường dẫn nếu cần

      } catch (err) {
        setError(err.response?.data.message || 'Có lỗi xảy ra');
      }
    };
  
    return (
      <div className="change-password-container">
        <h2>Đổi Mật Khẩu</h2>
        {error && <div className="error-message">{error}</div>}
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
