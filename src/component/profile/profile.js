import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext';
import './profile.css'; 

const Profile = () => {
    const { user, logout } = useContext(AuthContext);  
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleGoBack = () => {
        navigate(-1); 
    };

    const handleLogout = () => {
        logout(); 
        navigate('/'); 
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    if (!user) {
        return <p>Loading...</p>; 
    }
console.log('====================================');
console.log(user);
console.log('====================================');
    return (
        <div className="profile-page">
            <header className="profile-header">
                <button className="brand-name" onClick={handleGoBack}>SOPPE</button>
                <nav className="header-nav">
                    <a href="/">Trang Chủ</a>
                    <a href="/products">Giỏ Hàng</a>
                    <a href="/contact">Liên Hệ</a>
                    <div className="avatar-wrapper">
                        <img 
                            src={user.avatar || "https://res.cloudinary.com/dhpqoqtgx/image/upload/v1726249497/ke78gjlzmk0epm2mv77s.jpg"} 
                            alt="User Avatar" 
                            className="avatar" 
                            onClick={toggleDropdown} 
                        />
                        {dropdownOpen && (
                            <div className="dropdown-menu">
                                <ul>
                                    <li><a href="/profile">Thông Tin</a></li>
                                    <li><a href="/settings">Cài Đặt</a></li>
                                    <li><a href="/change-password">Cập Nhật Mật Khẩu</a></li>
                                    <li onClick={handleLogout}>Đăng Xuất</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </nav>
            </header>
            
            <main className="profile-content">
                <aside className="profile-sidebar">
                    <div className="profile-avatar">
                        <img src={user.avatar || "https://res.cloudinary.com/dhpqoqtgx/image/upload/v1726249497/ke78gjlzmk0epm2mv77s.jpg"} alt="User Avatar" />
                    </div>
                    <p className="user-name">{user.name}</p>
                    <div className="profile-buttons">
                        <button onClick={() => navigate('/user-info')}>Thông Tin Người Dùng</button>
                        <button onClick={() => navigate('/promotions')}>Chương Trình Khuyến Mãi</button>
                        <button onClick={() => navigate('/orders')}>Đơn Mua</button>
                        <button onClick={() => navigate('/notifications')}>Thông Báo</button>
                        <button onClick={() => navigate('/vouchers')}>Kho Voucher</button>
                    </div>
                </aside>

                <section className="profile-main">
                    <header className="main-header">
                        <nav className="info-options">
                            <a href="/info1">Tất Cả</a>
                            <a href="/info2">Chờ thanh toán</a>
                            <a href="/info3">Chờ vận chuyển</a>
                            <a href="/info4">Hoàn thành</a>
                            <a href="/info5">Hoàn trả</a>
                        </nav>
                        <div className="search-bar">
                            <input type="text" placeholder="Tìm kiếm..." />
                        </div>
                    </header>
                    <section className="placed-products">
                       <p>Đơn hàng code nằm ở đâyyyyyyyyy plz</p>
                    </section>
                </section>
            </main>
        </div>
    );
};

export default Profile;
