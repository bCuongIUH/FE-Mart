import React from "react";
import Slider from "./Slider";
import { Link } from "react-router-dom";

const Banner = () => {
  const BannerRightData = [
    {
      id: 1,
      img: "https://cooponline.vn/wp-content/uploads/ads/topright/1728874010-1000x1000%20hotline.jpg",
    },
    {
      id: 2,
      img: "https://cooponline.vn/wp-content/uploads/ads/topright/1729273859-minigame-lat-hinh-saigon-co-op-35-nam-phat-trien.jpg",
    },
  ];

  return (
    <section
      id="home-banner"
      style={{
        padding: "20px 0",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div className="container" style={{ display: "flex" }}>
        <div
          className="banner-slider-wrapper banner-left"
          style={{ flex: 1, marginRight: "20px" }}
        >
          <Slider />
        </div>

        <div className="banner-right-imgs">
          {BannerRightData.map((item) => (
            <div
              key={item.id}
              className="banner-img-wrapper"
              style={{
                width: "390px",
                height: "193px",
                marginBottom: "10px",
                overflow: "hidden",
              }}
            >
              <Link to="/UIPage">
                <img
                  src={item.img}
                  alt="banner-img"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Banner;
