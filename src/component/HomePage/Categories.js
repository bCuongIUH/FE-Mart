import React, { useEffect, useState } from "react";
import TopCategoriesList from "./TopCategoriesList";
import { getAllCategories } from "../../services/categoryService"; // Import hàm API

const Categories = () => {
  const [categories, setCategories] = useState([]); // Không cần kiểu dữ liệu cụ thể
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(1, 6); // Gọi API lấy 6 danh mục

        // Thêm hình ảnh mẫu vào nếu không có hình ảnh trong phản hồi từ API
        const formattedCategories = data.map((category) => ({
          id: category._id,
          title: category.name,
          img:
            category.image || // Nếu có hình ảnh, sử dụng nó
            getDefaultImageForCategory(category.categoryName), // Nếu không có, sử dụng ảnh mẫu
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    // Hàm lấy hình ảnh mẫu dựa trên tên danh mục
    const getDefaultImageForCategory = (categoryName) => {
      const categoryImages = {
        Chuột: "https://via.placeholder.com/150/0000FF/808080?text=Mouse", // Ảnh mẫu cho "Chuột"
        "Bàn phím":
          "https://via.placeholder.com/150/FF0000/FFFFFF?text=Keyboard", // Ảnh mẫu cho "Bàn phím"
        "Tai nghe":
          "https://via.placeholder.com/150/00FF00/000000?text=Headphones", // Ảnh mẫu cho "Tai nghe"
        // Các hình ảnh mặc định khác cho các danh mục
        default: "https://via.placeholder.com/150/CCCCCC/000000?text=No+Image",
      };
      // Trả về ảnh phù hợp hoặc ảnh mặc định
      return categoryImages[categoryName] || categoryImages["default"];
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>; // Hiển thị spinner hoặc thông báo tải
  }

  return (
    <section id="categories">
      <div className="container">
        <TopCategoriesList categories={categories} />{" "}
        {/* Truyền categories qua props */}
      </div>
    </section>
  );
};

export default Categories;
