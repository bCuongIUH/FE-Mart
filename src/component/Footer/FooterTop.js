import React from "react";
import ContactUs from "./ContactUs";
import { Link } from "react-router-dom";

const FooterTop = () => {
  const LinksData = [
    {
      id: 1,
      title: "Quick links",
      links: [
        { id: 1, title: "Policy", href: "#/" },
        { id: 2, title: "Term & Condition", href: "#/" },
        { id: 3, title: "Shipping", href: "#/" },
        { id: 4, title: "Return", href: "#/" },
        { id: 5, title: "FAQs", href: "#/" },
      ],
    },
    {
      id: 2,
      title: "Company",
      links: [
        { id: 1, title: "About Us", href: "/about" },
        { id: 2, title: "Affilate", href: "#/" },
        { id: 3, title: "Career", href: "#/" },
        { id: 4, title: "Contact", href: "/contact" },
      ],
    },
    {
      id: 3,
      title: "Bussiness",
      links: [
        { id: 1, title: "Our Press", href: "#/" },
        { id: 2, title: "Checkout", href: "#/" },
        { id: 3, title: "Shipping", href: "#/" },
        { id: 4, title: "My Account", href: "#/" },
        { id: 5, title: "Shop", href: "#/" },
      ],
    },
  ];
  return (
    <div className="footer-top">
      <div className="row">
        <div className="col-lg-5 col-md-5">
          <div className="contact-us-wrapper">
            <ContactUs />
          </div>
        </div>
        <div className="col-lg-7 col-md-7">
          <div className="links-wrapper">
            <div className="row">
              {LinksData.map((item) => (
                <div key={item.id} className="col-lg-4 col-md-4 col-sm-4">
                  <div className="links-item">
                    <div className="title">
                      <h6>{item.title}</h6>
                    </div>
                    <ul className="links m-0">
                      {item.links.map((linkItem) => (
                        <li key={linkItem.id}>
                          <Link to={linkItem.href}>{linkItem.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterTop;
