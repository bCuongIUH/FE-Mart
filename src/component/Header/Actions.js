import React, { useContext, useEffect, useState } from "react";
// import DropdownCart from "./DropdownCart";
import { FiBarChart2 } from "react-icons/fi";
import { BsHeart, BsBag } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { getAllCart } from "../../untills/api"; // Import API call
import { AuthContext } from "../../untills/context/AuthContext";

const Actions = () => {
  const [cart, setCart] = useState([]); // State cho giỏ hàng
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist") || "[]")
  );
  const [compare, setCompare] = useState(
    JSON.parse(localStorage.getItem("compare") || "[]")
  );
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ AuthContext

  const UserIcon =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s";

  // Hàm lấy giỏ hàng từ API
  useEffect(() => {
    if (user && user._id) {
      // Kiểm tra user trước khi gọi API
      const fetchCart = async () => {
        try {
          const cartData = await getAllCart(user._id); // Sử dụng user._id từ AuthContext
          setCart(cartData.items); // Cập nhật state giỏ hàng với dữ liệu từ API
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      };

      fetchCart(); // Gọi hàm fetchCart khi user tồn tại
    }
  }, [user]); // Chạy lại effect khi user thay đổi

  const showOrHideDropCart = (e) => {
    // Logic mở/đóng dropdown giỏ hàng (có thể sử dụng state tại đây nếu cần)
  };

  const ActionsData = [
    {
      id: 2,
      href: "/wishlist",
      sup: wishlist.length, // Tính số lượng sản phẩm trong wishlist
      icon: <BsHeart />,
      class: "second-link",
    },
    {
      id: 3,
      href: "/ShoppingCart",
      sup: cart.length, // Tính số lượng sản phẩm trong giỏ hàng từ API
      icon: <BsBag />,
      class: "third-link",
      //   dropdownContent: <DropdownCart />, // Hiển thị dropdown cart nếu cần
      func: showOrHideDropCart,
    },
  ];

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/"); // Chuyển hướng về trang login sau khi đăng xuất
  };

  return (
    <div className="header-top-actions d-flex">
      <div className="left-actions">
        <ul>
          <li>
            <button
              type="button"
              className="search-btnn"
              onClick={() => {
                // Logic hiển thị thanh tìm kiếm
              }}
            >
              <IoIosSearch />
            </button>
          </li>
          {ActionsData.map((item) => (
            <li key={item.id}>
              <Link to={item.href} className={item.class} onClick={item.func}>
                {item.icon}
                <sup>{item.sup}</sup>
              </Link>
              {item.dropdownContent}
            </li>
          ))}
        </ul>
      </div>
      <div className="right-actions d-flex">
        <div className="user-icon">
          {/* Kiểm tra nếu có user và avatar */}
          {user ? (
            <Link to="/profile">
              <img
                src={
                  user.avatar ||
                  "https://res.cloudinary.com/dhpqoqtgx/image/upload/v1726249497/ke78gjlzmk0epm2mv77s.jpg"
                }
                alt={user.fullName}
                style={{
                  width: "40px", // Kích thước của avatar
                  height: "40px", // Kích thước của avatar
                  borderRadius: "50%", // Làm cho avatar thành hình tròn
                  objectFit: "cover", // Đảm bảo hình ảnh bao phủ toàn bộ khung
                }}
              />
            </Link>
          ) : (
            <Link to="/user-info">
              <img
                src={UserIcon}
                alt="User Icon"
                style={{
                  width: "40px", // Kích thước của avatar
                  height: "40px", // Kích thước của avatar
                  borderRadius: "50%", // Làm cho avatar thành hình tròn
                  objectFit: "cover", // Đảm bảo hình ảnh bao phủ toàn bộ khung
                }}
              />
            </Link>
          )}
        </div>

        <div
          className="links"
          style={{ display: "flex", alignItems: "center" }}
        >
          {/* Nếu user đã đăng nhập */}
          {user ? (
            <>
              <span
                style={{
                  fontWeight: "bold",
                  maxWidth: "150px", // Giới hạn chiều rộng để đảm bảo fullName nằm trong 1 dòng
                  whiteSpace: "nowrap", // Ngăn không cho text xuống dòng
                  overflow: "hidden", // Ẩn phần vượt quá chiều rộng
                  textOverflow: "ellipsis", // Hiển thị dấu 3 chấm nếu text bị cắt
                }}
              >
                {user.fullName}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  marginLeft: "10px",
                  padding: "5px 10px",
                  fontSize: "14px",
                  cursor: "pointer",
                  width: "150px",
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                style={{
                  fontWeight: "bold",
                  maxWidth: "150px", // Giới hạn chiều rộng để đảm bảo fullName nằm trong 1 dòng
                  whiteSpace: "nowrap", // Ngăn không cho text xuống dòng
                  overflow: "hidden", // Ẩn phần vượt quá chiều rộng
                  textOverflow: "ellipsis", // Hiển thị dấu 3 chấm nếu text bị cắt
                }}
                to="/login"
              >
                Đăng nhập
              </Link>
              <Link to="/register">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Actions;
