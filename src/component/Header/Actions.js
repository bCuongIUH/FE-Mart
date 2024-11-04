// import React, { useContext, useEffect, useState } from "react";
// // import DropdownCart from "./DropdownCart";
// import { FiBarChart2 } from "react-icons/fi";
// import { BsHeart, BsBag } from "react-icons/bs";
// import { IoIosSearch } from "react-icons/io";
// import { Link, useNavigate } from "react-router-dom";
// import { getAllCart } from "../../untills/api";
// import { AuthContext } from "../../untills/context/AuthContext";

// const Actions = () => {
//   const [cart, setCart] = useState([]); // State cho giỏ hàng
//   const [wishlist, setWishlist] = useState(
//     JSON.parse(localStorage.getItem("wishlist") || "[]")
//   );
//   const [compare, setCompare] = useState(
//     JSON.parse(localStorage.getItem("compare") || "[]")
//   );
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ AuthContext

//   const UserIcon =
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s";

//   // Hàm lấy giỏ hàng từ API
//   useEffect(() => {
//     if (user && user._id) {
//       // Kiểm tra user trước khi gọi API
//       const fetchCart = async () => {
//         try {
//           const cartData = await getAllCart(user._id); // Sử dụng user._id từ AuthContext
//           setCart(cartData.items); // Cập nhật state giỏ hàng với dữ liệu từ API
//         } catch (error) {
//           console.error("Error fetching cart data:", error);
//         }
//       };

//       fetchCart(); // Gọi hàm fetchCart khi user tồn tại
//     }
//   }, [user]); // Chạy lại effect khi user thay đổi

//   const showOrHideDropCart = (e) => {
//     // Logic mở/đóng dropdown giỏ hàng (có thể sử dụng state tại đây nếu cần)
//   };

//   const ActionsData = [
//     {
//       id: 2,
//       href: "/wishlist",
//       sup: wishlist.length, // Tính số lượng sản phẩm trong wishlist
//       icon: <BsHeart />,
//       class: "second-link",
//     },
//     {
//       id: 3,
//       href: "/ShoppingCart",
//       sup: cart.length, // Tính số lượng sản phẩm trong giỏ hàng từ API
//       icon: <BsBag />,
//       class: "third-link",
//       //   dropdownContent: <DropdownCart />, // Hiển thị dropdown cart nếu cần
//       func: showOrHideDropCart,
//     },
//   ];

//   // Hàm xử lý đăng xuất
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/"); 
//     window.location.reload();
//   };

//   const handleCustomAction = () => {  

//   }

//   return (
//     <div className="header-top-actions d-flex">
//       <div className="left-actions">
//         <ul>
//           <li>
//             <button
//               type="button"
//               className="search-btnn"
//               onClick={() => {
//                 // Logic hiển thị thanh tìm kiếm
//               }}
//             >
//               <IoIosSearch />
//             </button>
//           </li>
//           {ActionsData.map((item) => (
//             <li key={item.id}>
//               <Link to={item.href} className={item.class} onClick={item.func}>
//                 {item.icon}
//                 <sup>{item.sup}</sup>
//               </Link>
//               {item.dropdownContent}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="right-actions d-flex">
//         <div className="user-icon">
//           {/* Kiểm tra nếu có user và avatar */}
//           {user ? (
//             <Link to="/profile">
//               <img
//                 src={
//                   user.avatar ||
//                   "https://res.cloudinary.com/dhpqoqtgx/image/upload/v1726249497/ke78gjlzmk0epm2mv77s.jpg"
//                 }
//                 alt={user.fullName}
//                 style={{
//                   width: "40px", // Kích thước của avatar
//                   height: "40px", // Kích thước của avatar
//                   borderRadius: "50%", // Làm cho avatar thành hình tròn
//                   objectFit: "cover", // Đảm bảo hình ảnh bao phủ toàn bộ khung
//                 }}
//               />
//             </Link>
//           ) : (
//             <Link to="/user-info">
//               <img
//                 src={UserIcon}
//                 alt="User Icon"
//                 style={{
//                   width: "40px", // Kích thước của avatar
//                   height: "40px", // Kích thước của avatar
//                   borderRadius: "50%", // Làm cho avatar thành hình tròn
//                   objectFit: "cover", // Đảm bảo hình ảnh bao phủ toàn bộ khung
//                 }}
//               />
//             </Link>
//           )}
//         </div>

//         <div
//             className="links"
//             style={{ display: "flex", alignItems: "center" }}
//           >
//             {/* Nếu user đã đăng nhập */}
//             {user ? (
//               <>
//                 <span
//                   style={{
//                     fontWeight: "bold",
//                     maxWidth: "150px",
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {user.fullName}
//                 </span>
//                 <button
//                   onClick={handleLogout}
//                   style={{
//                     marginLeft: "10px",
//                     padding: "5px 10px",
//                     fontSize: "14px",
//                     cursor: "pointer",
//                     width: "150px",
//                   }}
//                 >
//                   Đăng xuất
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link
//                   style={{
//                     fontWeight: "bold",
//                     maxWidth: "150px",
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                   to="/login"
//                 >
//                   Đăng nhập
//                 </Link>
//                 <Link to="/register">Đăng ký</Link>
//               </>
//             )}
         

//           </div>

//       </div>
//     </div>
//   );
// };

// export default Actions;
import React, { useContext, useEffect, useState } from "react";
import { FiBarChart2 } from "react-icons/fi";
import { BsHeart, BsBag } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { getAllCart } from "../../untills/api";
import { AuthContext } from "../../untills/context/AuthContext";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Login from "../Login/Login";
import Register from "../Register/Register";
import  './Actions.css'
const Actions = () => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist") || "[]")
  );
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleLoginOpen = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
  };

  const handleLoginClose = () => setIsLoginOpen(false);

  const handleRegisterOpen = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
  };

  const handleRegisterClose = () => setIsRegisterOpen(false);

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="header-top-actions d-flex">
      <div className="left-actions">
        <ul>
          <li>
            <button type="button" className="search-btnn">
              <IoIosSearch />
            </button>
          </li>
        </ul>
      </div>
      <div className="right-actions d-flex">
        <div className="user-icon">
          {user ? (
            <Link to="/">
              <img
                src={user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s"}
                // alt={user.fullName}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </Link>
          ) : (
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s"
              alt="User Icon"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={handleLoginOpen}
            />
          )}
        </div>

             <div className="auth-links">
  {user ? (
    <>
      <span className="auth-username">{user.fullName}</span>
      <button onClick={handleLogout} className="auth-button">
        Đăng xuất
      </button>
    </>
  ) : (
    <>
      <button onClick={handleLoginOpen} className="auth-button">
        Đăng nhập
      </button>
      <button onClick={handleRegisterOpen} className="auth-button">
        Đăng ký
      </button>
    </>
  )}
</div>


      </div>

      {/* Hiển thị modal Login */}
      {isLoginOpen && (
        <Login onClose={handleLoginClose} onSwitchToRegister={handleSwitchToRegister} />
      )}

      {/* Hiển thị modal Register */}
      {isRegisterOpen && (
        <Register onClose={handleRegisterClose} onSwitchToLogin={handleSwitchToLogin} />
      )}
    </div>
  );
};

export default Actions;