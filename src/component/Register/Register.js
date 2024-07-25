import "./Register.css";
import React from 'react';

function Register({ onClose, onSwitchToLogin }) {
  return (
    <div className="register-overlay show">
      <div className="register-modal show">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="register-content">
          <h2>Đăng Ký</h2>
          <form className="register-form">
            <label>Email</label>
            <input type="email" placeholder="Nhập email của bạn" />
            <label>Mật khẩu</label>
            <input type="password" placeholder="Nhập mật khẩu" />
            <label>Xác Nhận Mật khẩu</label>
            <input type="password" placeholder="Nhập lại mật khẩu" />
            <button type="submit" className="btn-submit">Đăng Ký</button>
            <div className="switch-text">
              <button className="btn-switch" onClick={onSwitchToLogin}>Đã có tài khoản? Đăng Nhập</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
