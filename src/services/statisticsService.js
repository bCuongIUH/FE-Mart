import axios from "axios";

const STATISTICS_API_URL = "http://localhost:5000/api/statistics"; // URL API cho statistics

// Cấu hình cho axios với token từ localStorage
const config = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// Lấy thống kê tổng quan
export const getStatistics = async () => {
  try {
    const response = await axios.get(STATISTICS_API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Có lỗi xảy ra khi lấy thống kê:", error);
    throw error;
  }
};

// Lấy doanh thu hàng ngày trong khoảng thời gian startDate đến endDate, lọc theo userId nếu có
export const getDailyRevenue = async (startDate, endDate, userId) => {
  try {
    const url = `${STATISTICS_API_URL}/daily-revenue`;
    const params = {
      startDate,
      endDate,
      ...(userId && { userId }), // Thêm userId vào params nếu có
    };
    const response = await axios.get(url, { ...config, params });
    return response.data;
  } catch (error) {
    console.error("Có lỗi xảy ra khi lấy doanh thu hàng ngày:", error);
    throw error;
  }
};

// Lấy thống kê theo khách hàng trong khoảng thời gian startDate đến endDate, lọc theo customerId
export const getCustomerStatistics = async (startDate, endDate, customerId) => {
  try {
    const url = `${STATISTICS_API_URL}/customer-statistics`;
    const params = {
      startDate,
      endDate,
      customerId,
    };
    const response = await axios.get(url, { ...config, params });
    return response.data;
  } catch (error) {
    console.error("Có lỗi xảy ra khi lấy thống kê theo khách hàng:", error);
    throw error;
  }
};
export const getVoucherStatistics = async (startDate, endDate, voucherType) => {
  try {
    const url = `${STATISTICS_API_URL}/voucher-statistics`;
    const params = {
      startDate,
      endDate,
      ...(voucherType && { voucherType }), // Thêm voucherType vào params nếu có
    };
    const response = await axios.get(url, { ...config, params });
    return response.data;
  } catch (error) {
    console.error("Có lỗi xảy ra khi lấy thống kê voucher:", error);
    throw error;
  }
};