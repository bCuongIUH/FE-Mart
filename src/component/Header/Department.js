import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscChevronRight } from "react-icons/vsc";
import { getAllCategories } from "../../services/categoryService"; // Import hàm API lấy danh sách categories

const Department = () => {
  const [categories, setCategories] = useState([]); // State để lưu dữ liệu danh mục
  const [showSidebarCategories, setShowSidebarCategories] = useState(true); // State để quản lý hiển thị sidebar
  const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading

  // Gọi API để lấy danh mục sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(); // Gọi API
        setCategories(data); // Lưu dữ liệu danh mục vào state
      } catch (error) {
        console.error("Lỗi khi lấy danh mục sản phẩm:", error);
      } finally {
        setLoading(false); // Tắt trạng thái loading sau khi hoàn thành
      }
    };

    fetchCategories();
  }, []);

  const handleToggleSidebar = () => {
    setShowSidebarCategories(!showSidebarCategories); // Đổi trạng thái hiển thị của sidebar
  };

  const handleCloseCategories = () => {
    setShowSidebarCategories(false); // Đóng sidebar
  };

  if (loading) {
    return <div>Đang tải danh mục...</div>; // Hiển thị trạng thái loading
  }

  return (
    <div className="department d-flex">
      <div className="icon" onClick={handleToggleSidebar}>
        <span>
          <GiHamburgerMenu />
        </span>
      </div>
      <div className="text">
        <h6>Danh mục sản phẩm</h6>
      </div>

      {showSidebarCategories && (
        <div className="title">
          <h6>Danh mục sản phẩm</h6>
          <button type="button" onClick={handleCloseCategories}>
            ✕
          </button>
        </div>
      )}

      {/* ===== Departments ===== */}
      {showSidebarCategories && (
        <ul className="departments">
          {categories.map((item) => (
            <li key={item._id}>
              <Link
                to={`/UIPage/${item._id}`} // Điều hướng đến UIPage với item._id làm tham số động
                onClick={handleCloseCategories}
                className="d-flex justify-content-between"
              >
                <p className="m-0 p-0">{item.name}</p>
                <span className="right-arrow">
                  <VscChevronRight />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Department;
