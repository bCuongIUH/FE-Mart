import axios from "axios";

const API_URL = "http://localhost:5000/api/voucher"; 

// Cấu hình cho axios với token từ localStorage
const config = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// API: Lấy danh sách voucher theo chương trình khuyến mãi
export const getVoucherByPromotionProgramId = async (promotionProgramId) => {
  try {
    const response = await axios.get(
      `${API_URL}/promotion/${promotionProgramId}`,
      config
    );
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách voucher");
  }
};
//lấy toàn bộ vocher đang hoạt động
export const getAllActiveVouchers = async () => {
  try {
    const response = await axios.get(`${API_URL}/promotion/list/active`, config);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách voucher đang hoạt động");
  }
};
// API: Tạo mới voucher
export const createVoucher = async (voucherData) => {
  try {
    const response = await axios.post(API_URL, voucherData, config);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi tạo voucher");
  }
};

// API: Cập nhật voucher
export const updateVoucher = async (id, voucherData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, voucherData, config);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi cập nhật voucher");
  }
};

// API: Xóa voucher
export const deleteVoucher = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi xóa voucher");
  }
};

// API: Thay đổi trạng thái voucher (isActive)
export const changeVoucherStatus = async (id, isActive) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}/status`,
      { isActive },
      config
    );
    return response.data;
  } catch (error) {
    throw new Error("Lỗi khi thay đổi trạng thái voucher");
  }
}