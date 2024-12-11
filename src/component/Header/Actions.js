// import React, { useContext, useEffect, useState } from "react";
// import { FiBarChart2 } from "react-icons/fi";
// import { BsHeart, BsBag } from "react-icons/bs";
// import { IoIosSearch } from "react-icons/io";
// import { Link, useNavigate } from "react-router-dom";
// import { getAllCart } from "../../untills/api";
// import { AuthContext } from "../../untills/context/AuthContext";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Login from "../Login/Login";
// import Register from "../Register/Register";
// import  './Actions.css'
// const Actions = () => {
//   const [cart, setCart] = useState([]);
//   const [wishlist, setWishlist] = useState(
//     JSON.parse(localStorage.getItem("wishlist") || "[]")
//   );
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [isRegisterOpen, setIsRegisterOpen] = useState(false);

//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);

//   const handleLoginOpen = () => {
//     setIsLoginOpen(true);
//     setIsRegisterOpen(false);
//   };

//   const handleLoginClose = () => setIsLoginOpen(false);

//   const handleRegisterOpen = () => {
//     setIsRegisterOpen(true);
//     setIsLoginOpen(false);
//   };

//   const handleRegisterClose = () => setIsRegisterOpen(false);

//   const handleSwitchToRegister = () => {
//     setIsLoginOpen(false);
//     setIsRegisterOpen(true);
//   };

//   const handleSwitchToLogin = () => {
//     setIsRegisterOpen(false);
//     setIsLoginOpen(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/");
//     window.location.reload();
//   };

//   return (
//     <div className="header-top-actions d-flex">
//       <div className="left-actions">
//         <ul>
//           <li>
//             <button type="button" className="search-btnn">
//               <IoIosSearch />
//             </button>
//           </li>
//         </ul>
//       </div>
//       <div className="right-actions d-flex">
//         <div className="user-icon">
//           {user ? (
//             <Link to="/">
//               <img
//                 src={user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s"}
//                 // alt={user.fullName}
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                   borderRadius: "50%",
//                   objectFit: "cover",
//                 }}
//               />
//             </Link>
//           ) : (
//             <img
//               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s"
//               alt="User Icon"
//               style={{
//                 width: "40px",
//                 height: "40px",
//                 borderRadius: "50%",
//                 objectFit: "cover",
//                 cursor: "pointer",
//               }}
//               onClick={handleLoginOpen}
//             />
//           )}
//         </div>

//              <div className="auth-links">
//   {user ? (
//     <>
//       <span className="auth-username">{user.fullName}</span>
//       <button onClick={handleLogout} className="auth-button">
//         Đăng xuất
//       </button>
//     </>
//   ) : (
//     <>
//       <button onClick={handleLoginOpen} className="auth-button">
//         Đăng nhập
//       </button>
//       <button onClick={handleRegisterOpen} className="auth-button">
//         Đăng ký
//       </button>
//     </>
//   )}
// </div>


//       </div>

//       {/* Hiển thị modal Login */}
//       {isLoginOpen && (
//         <Login onClose={handleLoginClose} onSwitchToRegister={handleSwitchToRegister} />
//       )}

//       {/* Hiển thị modal Register */}
//       {isRegisterOpen && (
//         <Register onClose={handleRegisterClose} onSwitchToLogin={handleSwitchToLogin} />
//       )}
//     </div>
//   );
// };

// export default Actions;
import React, { useContext, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../untills/context/AuthContext";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Login from "../Login/Login";
import Register from "../Register/Register";
import './Actions.css';

const Actions = () => {
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
          {/* Không cần kiểm tra `user`, luôn hiển thị login */}
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
        </div>

        <div className="auth-links">
          {/* Luôn hiển thị các nút đăng nhập và đăng ký */}
          <button onClick={handleLoginOpen} className="auth-button">
            Đăng nhập
          </button>
          <button onClick={handleRegisterOpen} className="auth-button">
            Đăng ký
          </button>
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
