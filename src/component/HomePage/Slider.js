// import React, { useState } from "react";
// import { VscChevronRight, VscChevronLeft } from "react-icons/vsc";
// import { Link } from "react-router-dom";

// const Slider = () => {
//   const SliderData = [
//     {
//       id: 1,
//       img: "https://cooponline.vn/wp-content/uploads/ads/topleft/1729128158-dua-mua-sam-hang-nhan-rieng-2000x670.jpg",
//     },
//     {
//       id: 2,
//       img: "https://cooponline.vn/wp-content/uploads/ads/topleft/1729493645-uu-dai-dac-biet-danh-cho-bot-rua-rau-cu-thit-ca-ion-canxi-umikai-2000-670.jpg",
//     },
//     {
//       id: 3,
//       img: "https://cooponline.vn/wp-content/uploads/ads/topleft/1729233573-Lux-Halloween-Banner_2000x670.jpg",
//     },
//   ];

//   const [tabIndex, setTabIndex] = useState(1);

//   const handleRightBtnClick = () => {
//     setTabIndex(tabIndex + 1);
//     if (tabIndex >= 3) setTabIndex(1);
//   };

//   const handleLeftBtnClick = () => {
//     setTabIndex(tabIndex - 1);
//     if (tabIndex <= 1) setTabIndex(3);
//   };

//   return (
//     <div style={{ position: "relative", height: "416px" }}>
//       {/* ======= Slide item ======= */}
//       {SliderData.map((item) => (
//         <div
//           key={item.id}
//           style={{
//             display: item.id === tabIndex ? "block" : "none",
//             width: "100%",
//             height: "100%",
//             overflow: "hidden",
//           }}
//         >
//           <Link to="/shop">
//             <img
//               src={item.img}
//               alt="slide-img"
//               style={{
//                 width: "100%",
//                 height: "100%",
//                 objectFit: "cover",
//               }}
//             />
//           </Link>
//         </div>
//       ))}
//       {/* ======= Slider buttons ======= */}
//       <div
//         style={{
//           position: "absolute",
//           top: "50%",
//           left: "10px",
//           transform: "translateY(-50%)",
//         }}
//       >
//         <button onClick={handleLeftBtnClick} style={buttonStyle}>
//           <VscChevronLeft />
//         </button>
//       </div>
//       <div
//         style={{
//           position: "absolute",
//           top: "50%",
//           right: "10px",
//           transform: "translateY(-50%)",
//         }}
//       >
//         <button onClick={handleRightBtnClick} style={buttonStyle}>
//           <VscChevronRight />
//         </button>
//       </div>
//     </div>
//   );
// };

// // Button styles
// const buttonStyle = {
//   backgroundColor: "rgba(0, 0, 0, 0.5)",
//   color: "#fff",
//   border: "none",
//   borderRadius: "50%",
//   cursor: "pointer",
//   fontSize: "24px",
// };

// export default Slider;
import React, { useState, useEffect } from "react";
import { VscChevronRight, VscChevronLeft } from "react-icons/vsc";
import { Link } from "react-router-dom";

const Slider = () => {
  const SliderData = [
    {
      id: 1,
      img: "https://cooponline.vn/wp-content/uploads/ads/topleft/1729128158-dua-mua-sam-hang-nhan-rieng-2000x670.jpg",
    },
    {
      id: 2,
      img: "https://cooponline.vn/wp-content/uploads/ads/topleft/1729493645-uu-dai-dac-biet-danh-cho-bot-rua-rau-cu-thit-ca-ion-canxi-umikai-2000-670.jpg",
    },
    {
      id: 3,
      img: "https://cooponline.vn/wp-content/uploads/ads/topleft/1729233573-Lux-Halloween-Banner_2000x670.jpg",
    },
  ];

  const [tabIndex, setTabIndex] = useState(1);

  // Tự động di chuyển slider
  useEffect(() => {
    const interval = setInterval(() => {
      setTabIndex((prevIndex) => (prevIndex >= SliderData.length ? 1 : prevIndex + 1));
    }, 2000); // Chuyển sau mỗi 3 giây

    return () => clearInterval(interval); // Xóa interval khi component unmount
  }, []);

  const handleRightBtnClick = () => {
    setTabIndex(tabIndex + 1);
    if (tabIndex >= SliderData.length) setTabIndex(1);
  };

  const handleLeftBtnClick = () => {
    setTabIndex(tabIndex - 1);
    if (tabIndex <= 1) setTabIndex(SliderData.length);
  };

  return (
    <div style={{ position: "relative", height: "416px" }}>
      {/* ======= Slide item ======= */}
      {SliderData.map((item) => (
        <div
          key={item.id}
          style={{
            display: item.id === tabIndex ? "block" : "none",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Link to="/shop">
            <img
              src={item.img}
              alt="slide-img"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Link>
        </div>
      ))}
      {/* ======= Slider buttons ======= */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
        }}
      >
        <button onClick={handleLeftBtnClick} style={buttonStyle}>
          <VscChevronLeft />
        </button>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
        }}
      >
        <button onClick={handleRightBtnClick} style={buttonStyle}>
          <VscChevronRight />
        </button>
      </div>
    </div>
  );
};

// Button styles
const buttonStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "24px",
};

export default Slider;

