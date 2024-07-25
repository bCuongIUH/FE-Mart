import React, { useState } from "react";
import "./HomePage.css";
import Login from "../Login/Login";
import Register from "../Register/Register";

function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="branding">
          <h1>SOPPE</h1>
        </div>
        <div className="additional-buttons">
          <button className="btn-outline intro-btn">Giới Thiệu</button>
          <button className="btn-outline">Thông Báo</button>
          <button className="btn-outline">Hỗ Trợ</button>
          <button className="btn-outline">Tiếng Việt</button>
        </div>
        <div className="button-group">
          <button className="btn-outline" onClick={handleLoginClick}>
            Đăng Nhập
          </button>
          <button className="btn-outline" onClick={handleRegisterClick}>
            Đăng Ký
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="intro-section">
          <h2>Chào Mừng Đến Với SOPPE!</h2>
          <p>
            Chào mừng bạn đến với SOPPE, điểm đến hoàn hảo cho những tín đồ thời
            trang! Tại SOPPE, chúng tôi không chỉ cung cấp những bộ sưu tập thời
            trang mới nhất và phong cách nhất, mà còn mang đến cho bạn một trải
            nghiệm mua sắm đầy cảm hứng và thú vị.
          </p>
        </section>

        <section className="features-section">
          <h2>Tính Năng Nổi Bật</h2>
          <div className="features">
            <div className="feature-item">
              <h3>Quản Lý Mua Sắm</h3>
              <p>
                Quản lý và theo dõi đơn hàng mua sắm của bạn một cách dễ dàng
              </p>
            </div>
            <div className="feature-item">
              <h3>Hợp Tác</h3>
              <p>
                Hợp tác với các nhà cung cấp uy tín để cung cấp sản phẩm chất
                lượng
              </p>
            </div>
            <div className="feature-item">
              <h3>ChatBot</h3>
              <p>Hỗ trợ trực tuyến 24/7 thông qua ChatBot thông minh</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Tham Gia Ngay Hôm Nay!</h2>
          <p>Đăng ký để trải nghiệm mua sắm trực tuyến tuyệt vời tại SOPPE</p>
          <button className="btn-cta" onClick={handleRegisterClick}>
            Đăng Ký Ngay
          </button>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-section">
          <h3>VỀ SOPEE</h3>
          <a href="#gioi-thieu">Giới Thiệu Về Shopee Việt Nam</a>
          <a href="#tuyen-dung">Tuyển Dụng</a>
          <a href="#dieu-khoan">Điều Khoản Shopee</a>
          <a href="#chinh-sach">Chính Sách Bảo Mật</a>
          <a href="#chinh-hang">Chính Hãng</a>
          <a href="#kenh-nguoi-ban">Kênh Người Bán</a>
          <a href="#flash-sales">Flash Sales</a>
          <a href="#marketing">Chương Trình Tiếp Thị Liên Kết Shopee</a>
          <a href="#truyen-thong">Liên Hệ Với Truyền Thông</a>
        </div>

        <div className="footer-section">
          <h3>THANH TOÁN</h3>
          <img src="path/to/bank-logo1.png" alt=" " />
          <img src="path/to/bank-logo2.png" alt=" " />
          <img src="path/to/bank-logo3.png" alt=" " />
        </div>

        <div className="footer-section ">
          <h3>THEO DÕI CHÚNG TÔI TRÊN</h3> 
          <a href="https://facebook.com">
            <img src="path/to/facebook-logo.png" alt="Facebook" />
          </a>
          <a href="https://instagram.com">
            <img src="path/to/instagram-logo.png" alt="Instagram" />
          </a>
          <a href="https://github.com">
            <img src="path/to/github-logo.png" alt="GitHub" />
          </a>
          
        </div>

        <div className="footer-section">
          <h3>TẢI ỨNG DỤNG SHOPEE NGAY THÔI</h3>
          <a href="#download-app">Tải Ngay</a>
        </div>
      </footer>

      {showLogin && (
        <Login
          onClose={handleCloseLogin}
          onSwitchToRegister={handleRegisterClick}
        />
      )}
      {showRegister && (
        <Register
          onClose={handleCloseRegister}
          onSwitchToLogin={handleLoginClick}
        />
      )}
    </div>
  );
}

export default HomePage;
