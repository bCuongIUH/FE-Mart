import React, { useEffect, useState } from "react";
import Countdown from "./Countdown";
import Slider from "react-slick";
import ProductCard from "../ProductCard/ProductCard";
import { getAllProductsPOP } from "../../untills/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DealOfTheDay = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const filteredProducts = await getAllProductsPOP();
        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm Deal trong ngày", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (products.length === 0) {
    return <div>Không có sản phẩm nào</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true, // Thêm autoplay
    autoplaySpeed: 2000, // Tự động di chuyển sau mỗi 3 giây
    responsive: [
      {
        breakpoint: 1400,
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 1000,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 500,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 0,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section id="deal-of-the-day">
      <div className="container">
        <div className="section-header-wrapper">
          <div className="section-header">
            <div className="left-side d-flex">
              <div className="title">
                <h4>Ưu đãi trong ngày</h4>
              </div>
              <div className="countdown-wrapper">
                <Countdown />
              </div>
            </div>
          </div>
        </div>
        <div className="slider-wrapper">
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product._id} className="item">
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default DealOfTheDay;
