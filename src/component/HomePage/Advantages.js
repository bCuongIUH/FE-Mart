import React from "react";
import { BiRocket } from "react-icons/bi";
import { AiOutlineSync } from "react-icons/ai";
import { GoCreditCard } from "react-icons/go";
import { ImBubbles3, ImGift } from "react-icons/im";

const Advantages = () => {
  const AdvantagesData = [
    {
      id: 1,
      icon: <BiRocket />,
      title: "Miễn Phí Giao Hàng",
      paragraph: "Cho tất cả đơn hàng trên 2.000.000đ",
    },
    {
      id: 2,
      icon: <AiOutlineSync />,
      title: "Đổi Trả Trong 8 Giờ",
      paragraph: "Nếu sản phẩm có vấn đề",
    },
    {
      id: 3,
      icon: <GoCreditCard />,
      title: "Thanh Toán An Toàn",
      paragraph: "Bảo mật thanh toán 100%",
    },
    {
      id: 4,
      icon: <ImBubbles3 />,
      title: "Hỗ Trợ 24/7",
      paragraph: "Hỗ trợ tận tình",
    },
    {
      id: 5,
      icon: <ImGift />,
      title: "Dịch Vụ Quà Tặng",
      paragraph: "Hỗ trợ dịch vụ quà tặng",
    },
  ];

  return (
    <section id="advantages">
      <div className="container">
        <div className="advantages-items-wrapper">
          <ul>
            {AdvantagesData.map((item) => (
              <li key={item.id}>
                <div className="advantages-item">
                  <div className="icon-wrapper">
                    <span>{item.icon}</span>
                  </div>
                  <div className="text-wrapper">
                    <h5>{item.title}</h5>
                    <p>{item.paragraph}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
