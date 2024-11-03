import axios from "axios";
const config = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`, 
  },
};

// const API_URL = "http://172.28.117.95:5000/api"; 
const API_URL = "http://localhost:5000/api";
//lấy tồn kho
export const getAllStocks = async () => {
    try {
      const response = await axios.get(`${API_URL}/stock`, config); 
      return response.data;
    } catch (error) {
      throw error; 
    }
  };

// Gửi yêu cầu cập nhật kiểm kê tồn kho
export const updateInventoryQuantities = async (auditData) => {
  try {
    const response = await axios.post(`${API_URL}/stock/invenstock/update`, auditData, config); 
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi cập nhật tồn kho:', error);
    throw error;
  }
};

//lấy ds kiểm kê
export const getInventoryAdjustments = async () => {
  try {
 
    const response = await axios.get(`${API_URL}/stock/invenstock`, config);
    return response.data; 
  } catch (error) {
    console.error("Lỗi khi lấy danh sách kiểm kê kho:", error);
    throw error;
  }
};

// Lấy tất cả các giao dịch
export const getAllTransactions = async () => {
  try {
    const response = await axios.get(`${API_URL}/transactions`, config); 
    return response.data; 
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giao dịch:", error);
    throw error;
  }
};