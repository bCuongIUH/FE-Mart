import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext';
import './shoppingCart.module.css'; 
import AllCart from './item/AllCart';
import ShipperCart from './item/ShipperCart';
import CompletedCart from './item/completedCart';
import ReturnedCart from './item/ReturnedCart';

const ShoppingCart = () => {
    const { user, logout } = useContext(AuthContext);  
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeComponent, setActiveComponent] = useState('all'); 
    console.log(user);
    
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

    const handleComponentChange = (component) => {
        setActiveComponent(component); 
    };
// //mua sp theo số lượng
// // {
// //     "userId" :"66ec5996073fa0a23b3c2834",
// //     "productId" : "66f1dae68412a467ee5fc772",
// //     "quantity" :15
// // }
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
                            <a href="#" onClick={() => handleComponentChange('all')}>Tất Cả</a>
                            <a href="#" onClick={() => handleComponentChange('pending')}>Chờ thanh toán</a>
                            <a href="#" onClick={() => handleComponentChange('shipping')}>Chờ vận chuyển</a>
                            <a href="#" onClick={() => handleComponentChange('completed')}>Hoàn thành</a>
                            <a href="#" onClick={() => handleComponentChange('refund')}>Hoàn trả</a>
                        </nav>
                        <div className="search-bar">
                            <input type="text" placeholder="Tìm kiếm..." />
                        </div>
                    </header>
                    <section className="placed-products">
                        {activeComponent === 'all' && <AllCart/>}
                        {activeComponent === 'pending' && <div>Đây là sản phẩm chờ thanh toán</div>}
                        {activeComponent === 'shipping' && <ShipperCart/>}
                        {activeComponent === 'completed' && <CompletedCart/>}
                        {activeComponent === 'refund' && <ReturnedCart/>}
                    </section>
                </section>
            </main>
        </div>
    );
};

export default ShoppingCart;
