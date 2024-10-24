import React from "react";

const FooterBottom = () => {
  const PaymentData = [
    {
      id: 1,
      img: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
    },
    {
      id: 2,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLeYoMVenMbgWL1FxDJPKuQvJD6R0KdnXE7A&s",
    },
    { id: 3, img: "https://cdn.tgdd.vn/2020/04/GameApp/image-180x180.png" },
    {
      id: 4,
      img: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ShopeePay-V.png",
    },
  ];

  return (
    <div className="footer-bottom">
      <div className="row">
        <div className="col-lg-4 col-md-12">
          {/* ======= Bản quyền ======= */}
          <div className="copyright">
            <p>
              © 2024 SOPEE. Được phát triển bởi
              <a href="" target="__blank">
                Khắc Cường và Bạch Cường
              </a>
            </p>
          </div>
        </div>
        <div className="col-lg-8 col-md-12">
          {/* ======= Phương thức thanh toán ======= */}
          <div className="payment">
            <div className="payment-text">
              <p>Chúng tôi sử dụng các phương thức thanh toán an toàn:</p>
            </div>
            <div className="payment-cards">
              <ul>
                {PaymentData.map((item) => (
                  <li key={item.id}>
                    <img src={item.img} alt="phương thức thanh toán" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
