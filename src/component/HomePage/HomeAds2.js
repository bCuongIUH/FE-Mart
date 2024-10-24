import React from "react";
import { Link } from "react-router-dom";

const HomeAds2 = () => {
  return (
    <section id="ads-2">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {/* ======= Bed img ======= */}
            <div className="bed-img">
              <Link to="/shop">
                <img src={"https://nouthemes.net/html/martfury/img/slider/home-9/1.jpg"} alt="bed" />
              </Link>
            </div>
          </div>
          <div className="col-lg-4">
            {/* ======= Iphone img ======= */}
            <div className="iphone-img">
              <Link to="/shop">
                <img src={"https://nouthemes.net/html/martfury/img/promotions/home-9/2.jpg"} alt="iphonex" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAds2;
