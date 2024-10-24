import axios from "axios";

const API_URL = "http://localhost:5000/api/promotion-program"; // URL API

// Cấu hình cho axios với token từ localStorage
const config = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// Thêm chương trình khuyến mãi mới
export const createPromotionProgram = async (data) => {
  try {
    const response = await axios.post(API_URL, data, config);
    return response.data;
  } catch (error) {
    console.error("Có lỗi xảy ra khi tạo chương trình khuyến mãi:", error);
    throw error;
  }
};

// Cập nhật chương trình khuyến mãi theo ID
export const updatePromotionProgram = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, config);
    return response.data;
  } catch (error) {
    console.error("Có lỗi xảy ra khi cập nhật chương trình khuyến mãi:", error);
    throw error;
  }
};

// Xóa chương trình khuyến mãi theo ID
export const deletePromotionProgram = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Có lỗi xảy ra khi xóa chương trình khuyến mãi:", error);
    throw error;
  }
};

// Lấy tất cả các chương trình khuyến mãi
export const getAllPromotionPrograms = async () => {
  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi lấy danh sách chương trình khuyến mãi:",
      error
    );
    throw error;
  }
};

// Thay đổi trạng thái của chương trình khuyến mãi theo ID
export const changePromotionStatus = async (id, isActive) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}/status`,
      { isActive },
      config
    );
    return response.data;
  } catch (error) {
    console.error(
      "Có lỗi xảy ra khi thay đổi trạng thái của chương trình khuyến mãi:",
      error
    );
    throw error;
  }
};

// Lấy danh sách các chương trình khuyến mãi đang hoạt động
export const getActivePromotionPrograms = async () => {
  try {
    const response = await axios.get(`${API_URL}/active`, config);
    return response.data;
  } catch (error) {
    console.error("Có lỗi xảy ra khi lấy danh sách chương trình khuyến mãi đang hoạt động:", error);
    throw error;
  }
};