
import axios from "axios";
const config = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`, 
  },
};

// const API_URL = "http://172.28.117.95:5000/api"; 
const API_URL = "http://localhost:5000/api";
// đăng nhập / đăng ký / xác thực người dùng

// Tạo bảng đơn vị tính

export const createUnitList = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/units/unit-lists`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo bảng đơn vị tính:', error.response?.data || error.message);
      throw error;
    }
  };
  
  // Tạo đơn vị tính mới
  export const createUnit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/units`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo đơn vị tính:', error.response?.data || error.message);
      throw error;
    }
  };
  
  // Thêm đơn vị tính vào bảng đơn vị tính
  export const addUnitToList = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/units/unit-lists/add-unit`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm đơn vị tính vào bảng:', error.response?.data || error.message);
      throw error;
    }
  };
  
  // Quy đổi giữa các đơn vị
  export const convertUnit = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/units/convert`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi quy đổi giữa các đơn vị:', error.response?.data || error.message);
      throw error;
    }
  };
  
  // Cập nhật quy đổi giữa các đơn vị
  export const updateConversionRate = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/units/conversion-rate`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật quy đổi:', error.response?.data || error.message);
      throw error;
    }
  };
  
  // Thêm đơn vị vào sản phẩm
  export const addUnitToProduct = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/units/add-unit-to-product`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm đơn vị vào sản phẩm:', error.response?.data || error.message);
      throw error;
    }
  };
  
  // Quy đổi số lượng theo đơn vị tính
  export const getConvertedQuantity = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/units/products/get-converted-quantity`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi quy đổi số lượng:', error.response?.data || error.message);
      throw error;
    }
  };
  
 
// Lấy tất ds unit
export const getAllUnitList = async () => {
    try {
      const response = await axios.get(`${API_URL}/units`, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Lấy danh sách đơn vị theo unitListId
export const getUnitsByUnitListId = async (unitListId) => {
    try {
        const response = await axios.post(`${API_URL}/units/getUnit`, { unitListId });
        return response.data;
    } catch (error) {
        throw error;
    }
};
//
export const addConversionUnitToList = async (data) => {
    const response = await axios.post(`${API_URL}/units/add-conversion-unit`, data);
    return response.data;
};


export const getConversionRatesByUnitListId = async (unitListId) => {
  try {
      const response = await axios.post(`${API_URL}/units/getUnit/all`, { unitListId });
      return response.data; // Trả về dữ liệu nhận được từ server
  } catch (error) {
      console.error('Lỗi khi lấy danh sách quy đổi:', error);
      throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm này
  }
};