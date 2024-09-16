import React, { useState } from "react";
import styles from "./HomePage.module.css";
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
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <div className={styles.branding}>
          <h1>SOPPE</h1>
        </div>
        <div className={styles.additionalButtons}>
          <button className={styles.btnOutline}>Giới Thiệu</button>
          <button className={styles.btnOutline}>Thông Báo</button>
          <button className={styles.btnOutline}>Hỗ Trợ</button>
          <button className={styles.btnOutline}>Tiếng Việt</button>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.btnOutline} onClick={handleLoginClick}>
            Đăng Nhập
          </button>
          <button className={styles.btnOutline} onClick={handleRegisterClick}>
            Đăng Ký
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.introSection}>
          <h2>Chào Mừng Đến Với SOPPE!</h2>
          <p>
            Chào mừng bạn đến với SOPPE, điểm đến hoàn hảo cho những tín đồ thời
            trang! Tại SOPPE, chúng tôi không chỉ cung cấp những bộ sưu tập thời
            trang mới nhất và phong cách nhất, mà còn mang đến cho bạn một trải
            nghiệm mua sắm đầy cảm hứng và thú vị.
          </p>
        </section>

        <section className={styles.featuresSection}>
          <h2>Tính Năng Nổi Bật</h2>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <h3>Quản Lý Mua Sắm</h3>
              <p>
                Quản lý và theo dõi đơn hàng mua sắm của bạn một cách dễ dàng
              </p>
            </div>
            <div className={styles.featureItem}>
              <h3>Hợp Tác</h3>
              <p>
                Hợp tác với các nhà cung cấp uy tín để cung cấp sản phẩm chất
                lượng
              </p>
            </div>
            <div className={styles.featureItem}>
              <h3>ChatBot</h3>
              <p>Hỗ trợ trực tuyến 24/7</p>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>Tham Gia Ngay Hôm Nay!</h2>
          <p>Đăng ký để trải nghiệm mua sắm trực tuyến tuyệt vời tại SOPPE</p>
          <button className={styles.btnCta} onClick={handleRegisterClick}>
            Đăng Ký Ngay
          </button>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerSection}>
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

        <div className={styles.footerSection}>
          <h3>THANH TOÁN</h3>
          <img src="path/to/bank-logo1.png" alt="Bank Logo 1" />
          <img src="path/to/bank-logo2.png" alt="Bank Logo 2" />
          <img src="path/to/bank-logo3.png" alt="Bank Logo 3" />
        </div>

        <div className={styles.footerSection}>
          <h3>THEO DÕI CHÚNG TÔI TRÊN</h3>
          <a href="https://www.facebook.com/bachcuong2704">
            <img
              style={{ width: "20px", height: "20px" }}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUcP0ZcWRME2hXax1sPPgNtutzs7H0ZQv2vw&s"
              alt="Facebook"
            />
          </a>
          <a href="https://www.instagram.com/bcuowq._27/">
            <img src="path/to/instagram-logo.png" alt="Instagram" />
          </a>
          <a href="https://github.com/bCuongIUH">
            <img src="path/to/github-logo.png" alt="GitHub" />
          </a>
        </div>

        <div className={styles.footerSection}>
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
