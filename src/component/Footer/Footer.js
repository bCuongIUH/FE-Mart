import React from "react";
import FooterTop from "./FooterTop";
import FooterBottom from "./FooterBottom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="footer-top-wrapper">
          <FooterTop />
        </div>

        <div className="footer-bottom-wrapper">
          <FooterBottom />
        </div>
      </div>
    </div>
  );
};

export default Footer;
