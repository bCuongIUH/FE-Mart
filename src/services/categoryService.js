import axios from "axios";

const API_URL = "http://localhost:5000/api/categories"; // URL API cho categories

// Cấu hình cho axios với token từ localStorage
const config = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// API: Lấy tất cả danh mục
export const getAllCategories = async () => {
  try {
    const response = await axios.get(API_URL, config);
    return response.data.categories;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách danh mục");
  }
};

// API: Tạo mới danh mục
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(API_URL, categoryData, config);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi tạo danh mục");
  }
};

// API: Cập nhật danh mục
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, categoryData, config);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi cập nhật danh mục");
  }
};

// API: Xóa danh mục
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi xóa danh mục");
  }
};

// API: Thay đổi trạng thái danh mục (isActive)
export const changeCategoryStatus = async (id, isActive) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}/status`,
      { isActive },
      config
    );
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi thay đổi trạng thái danh mục");
  }
};