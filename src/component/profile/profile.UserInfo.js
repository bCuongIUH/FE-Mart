import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext'; // Cập nhật đường dẫn nếu cần
import './UserInfo.css'; // Đảm bảo rằng CSS được liên kết đúng cách

const UserInfo = () => {
    const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ AuthContext
    const navigate = useNavigate(); // Hook để điều hướng

    const handleGoBack = () => {
        navigate(-1); // Quay lại trang trước đó
    };

    if (!user) {
        return <p>Loading...</p>; 
    }
console.log(user);

    return (
        <div className="user-info-page">
            <header className="user-info-header">
                <button className="back-button" onClick={handleGoBack}>SOPPE</button>
                {/* <h1 className="brand-name" onClick={() => navigate('/')}>SOPPE</h1> */}
            </header>

            <main className="user-info-content">
                <div className="user-info-avatar">
                    <img
                        src={user.avatar || "https://res.cloudinary.com/dhpqoqtgx/image/upload/v1726249497/ke78gjlzmk0epm2mv77s.jpg"}
                        alt="User Avatar"
                    />
                </div>

                <div className="user-info-details">
                    <p><strong>Họ và Tên:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Số Điện Thoại:</strong> {user.phoneNumber}</p>
                </div>
            </main>
        </div>
    );
};

export default UserInfo;
