import React from "react";
import { Link } from "react-router-dom";
import { TiSocialFacebook, TiSocialTwitter } from "react-icons/ti";
import { AiOutlineGooglePlus, AiOutlineInstagram } from "react-icons/ai";

const ContactUs = () => {
  const SocialMediaData = [
    { id: 1, href: "#/", icon: <TiSocialFacebook />, class: "facebook" },
    { id: 2, href: "#/", icon: <TiSocialTwitter />, class: "twitter" },
    { id: 3, href: "#/", icon: <AiOutlineGooglePlus />, class: "google" },
    { id: 4, href: "#/", icon: <AiOutlineInstagram />, class: "instagram" },
  ];

  return (
    <div className="contact-us">
      {/* ======= Tiêu đề ======= */}
      <div className="contact-us-title">
        <h6>Liên hệ với chúng tôi</h6>
      </div>
      <div className="contact-us-content">
        {/* ======= Nội dung - văn bản ======= */}
        <div className="text">
          <p>Gọi cho chúng tôi 24/7</p>
          <h3>1800 97 97 69</h3>
          <p>
            502 Đường Thiết Kế Mới, Melbourne, Úc
            <br />
            <Link to="#/">contact@martfury.co</Link>
          </p>
        </div>
        {/* ======= Nội dung - mạng xã hội ======= */}
        <div className="social-media">
          <ul>
            {SocialMediaData.map((item) => (
              <li key={item.id}>
                <Link to={item.href} className={item.class}>
                  {item.icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
