// src/components/Login.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ onClose, onSwitchToRegister }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        // Bạn có thể thêm logic kiểm tra thông tin đăng nhập tại đây
        // Ví dụ: gọi API để xác thực người dùng

        // Sau khi đăng nhập thành công, chuyển hướng đến trang chính
        navigate("/UIPage");
    };

    return (
        <div className="login-overlay show">
            <div className="login-modal show">
                <button className="close-btn" onClick={onClose}>×</button>
                <div className="login-content">
                    <h2>Đăng Nhập</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="email">Email:</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                        
                        <label htmlFor="password">Mật Khẩu:</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        
                        <a href="#forgot-password" className="forgot-password">Quên Mật Khẩu?</a>
                        
                        <button type="submit" className="btn-submit">Đăng Nhập</button>
                    </form>
                    <p className="switch-text">
                        Chưa có tài khoản? <button onClick={onSwitchToRegister} className="btn-switch">Đăng Ký</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
