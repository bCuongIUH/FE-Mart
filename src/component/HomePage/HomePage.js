import React, { useState, useEffect, useRef } from "react";
import styles from "./HomePage.module.css";
import Login from "../Login/Login";
import Register from "../Register/Register";

function HomePage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const modalRef = useRef(null); 

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

  // Xử lý nhấp chuột bên ngoài modal
  const handleClickOutside = (event) => {
    // Kiểm tra nếu nhấp chuột nằm ngoài modal
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleCloseLogin();
      handleCloseRegister();
    }
  };

  useEffect(() => {
    // Thêm event listener cho nhấp chuột
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Dọn dẹp event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <div className={styles.branding}>
          <h1>C'Mart</h1>
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
          <h2>Chào Mừng Đến Với C'Mart!</h2>
          <div className={styles.bannerContainer}>
            <img src="https://mediamart.vn/images/uploads/2024/e936628a-2a81-4d08-8da9-0f642189954f.png" alt="Banner 1" className={styles.bannerImage} />
            <img src="https://mediamart.vn/images/uploads/2024/6ef7aaab-7c07-4832-a8de-9f5333ad8976.png" alt="Banner 2" className={styles.bannerImage} />
            <img src="https://mediamart.vn/images/uploads/2024/b6fcf615-8d55-4758-9608-25934b75a61e.png" alt="Banner 3" className={styles.bannerImage} />
            <img src="https://mediamart.vn/images/uploads/2024/e936628a-2a81-4d08-8da9-0f642189954f.png" alt="Banner 4" className={styles.bannerImage} />
          </div>
        </section>

        <section className={styles.featuresSection}>
          <h2>Tính Năng Nổi Bật</h2>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <h3>Quản Lý Mua Sắm</h3>
              <p>Quản lý và theo dõi đơn hàng mua sắm của bạn một cách dễ dàng</p>
            </div>
            <div className={styles.featureItem}>
              <h3>Hợp Tác</h3>
              <p>Hợp tác với các nhà cung cấp uy tín để cung cấp sản phẩm chất lượng</p>
            </div>
            <div className={styles.featureItem}>
              <h3>ChatBot</h3>
              <p>Hỗ trợ trực tuyến 24/7</p>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>Tham Gia Ngay Hôm Nay!</h2>
          <p>Đăng ký để trải nghiệm mua sắm trực tuyến tuyệt vời tại C'Mart</p>
          <button className={styles.btnCta} onClick={handleRegisterClick}>
            Đăng Ký Ngay
          </button>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerSection}>
          <h3>VỀ C'Mart</h3>
          <a href="#gioi-thieu">Giới Thiệu Về C'Mart Việt Nam</a>
          <a href="#tuyen-dung">Tuyển Dụng</a>
          <a href="#dieu-khoan">Điều Khoản C'Mart</a>
          <a href="#chinh-sach">Chính Sách Bảo Mật</a>
          <a href="#chinh-hang">Chính Hãng</a>
          <a href="#kenh-nguoi-ban">Kênh Người Bán</a>
          <a href="#flash-sales">Flash Sales</a>
          <a href="#marketing">Chương Trình Tiếp Thị Liên Kết C'Mart</a>
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
            <img style={{ width: "20px", height: "20px" }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUcP0ZcWRME2hXax1sPPgNtutzs7H0ZQv2vw&s" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/bcuowq._27/">
            <img src="path/to/instagram-logo.png" alt="Instagram" />
          </a>
          <a href="https://github.com/bCuongIUH">
            <img src="path/to/github-logo.png" alt="GitHub" />
          </a>
        </div>

        <div className={styles.footerSection}>
          <h3>TẢI ỨNG DỤNG C'Mart NGAY THÔI</h3>
          <a href="#download-app">Tải Ngay</a>
        </div>
      </footer>

      {/* Modal Đăng Nhập */}
      {showLogin && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} ref={modalRef}>
            <Login
              onClose={handleCloseLogin}
              onSwitchToRegister={handleRegisterClick}
            />
          </div>
        </div>
      )}

      {/* Modal Đăng Ký */}
      {showRegister && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} ref={modalRef}>
            <Register
              onClose={handleCloseRegister}
              onSwitchToLogin={handleLoginClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
