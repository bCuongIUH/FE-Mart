import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import BrandLogo from "../../assets/img/brand/brand.png";
import Search from "./Search";
import Actions from "./Actions";
import Department from "./Department";
import { NavLinksData } from "./NavLinksData";

const Header = () => {
  const [showDepartments, setShowDepartments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  // Xử lý ẩn/hiện các thành phần khi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setShowDepartments(true);
      } else {
        setShowDepartments(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="header">
      {/* ======= Header-top ======= */}
      <div className="header-top-wrapper">
        <div className="header-top">
          <div className="container">
            <div className="header-top-content">
              <div
                className={showDepartments ? "department-wrapper" : "d-none"}
              >
                <Department />
              </div>
              <div className={showDepartments ? "d-none" : "brand"}>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <h1
                    style={{
                      fontWeight: "bold",
                      fontSize: "32px",
                      color: "#fff",
                    }}
                  >
                    SOPPE
                  </h1>
                </Link>
              </div>

              <div className={showSearch ? "search-wrapper w-100" : "d-none"}>
                <Search />
              </div>
              <div className="header-top-actions-wrapper">
                <Actions />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======= Header-bottom ======= */}
      <div className="header-bottom-wrapper">
        <div className="container">
          <div className="header-bottom">
            {/* Menu department */}
            <div className="department-wrapper">
              <Department />
            </div>
            {/* Navigation menu */}
            <div className="nav-links-wrapper">
              <div className="title">
                <h6>MENU</h6>
                <button type="button" onClick={() => setShowMenu(false)}>
                  ✕
                </button>
              </div>
              <ul className="d-flex">
                {NavLinksData.map((link) => (
                  <li key={link.id}>
                    <Link to={link.href} className={link.class}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Ngôn ngữ và đơn vị tiền tệ */}
            <div className="lang-and-monetary-unit-wrapper">
              {/* <LangAndMonetaryUnit /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
