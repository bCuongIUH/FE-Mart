import React from "react";
import { Link } from "react-router-dom";

const HomeAds1 = () => {
  const AdsData1 = [
    {
      id: 1,
      img: "https://cooponline.vn/wp-content/uploads/ads/homebottomrighttop/1675238330-327-x-200.jpg",
    },
    {
      id: 2,
      img: "https://cooponline.vn/wp-content/uploads/ads/homebottomlefttop/1669282562-327x200.jpg",
    },
    {
      id: 3,
      img: "https://cooponline.vn/wp-content/uploads/ads/homebottomrightbottom/1665645501-mua-nhieu-uu-dai-lon.jpg",
    },
  ];

  const imgStyle = {
    width: "410px",
    height: "223px",
    objectFit: "cover",
  };

  return (
    <section id="ads-1">
      <div className="container">
        <div className="row">
          {AdsData1.map((item) => (
            <div key={item.id} className="col-lg-4">
              <div className="ads-img">
                <Link to="/shop">
                  <img src={item.img} alt="ads-img" style={imgStyle} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeAds1;
