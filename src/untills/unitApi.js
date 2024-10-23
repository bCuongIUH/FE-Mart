
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
      const response = await axios.post(`${API_URL}/units/unit-headers`, data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo bảng đơn vị tính:', error.response?.data || error.message);
      throw error;
    }
  };

  export const createUnitLine = async (lineData) => {
    try {
      const response = await axios.post(`${API_URL}/units/unit-lines`, lineData);
      console.log('Tạo dòng đơn vị thành công:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo dòng đơn vị:', error.response.data);
    }
  };
  // chi tiết đơn vị 
  export const createUnitDetail = async (detailData) => {
    try {
      const response = await axios.post(`${API_URL}/units/unit-details`, detailData);
      console.log('Tạo chi tiết đơn vị thành công:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo chi tiết đơn vị:', error.response.data);
    }
  };
  export const updateUnitDetail = async (id, detailData) => {
    try {
        const response = await axios.put(`${API_URL}/units/crud/details/${id}`, detailData);
        console.log('Cập nhật chi tiết đơn vị thành công:', response.data);
        return response.data; // Trả về dữ liệu chi tiết đã cập nhật
    } catch (error) {
        console.error('Lỗi khi cập nhật chi tiết đơn vị:', error.response.data);
        throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
    }
};



export const deleteUnitDetail = async (id) => {
  try {
      const response = await axios.delete(`${API_URL}/units/crud/details/${id}`);
      console.log('Xóa chi tiết đơn vị thành công:', response.data);
      return response.data; // Trả về thông điệp thành công
  } catch (error) {
      console.error('Lỗi khi xóa chi tiết đơn vị:', error.response.data);
      throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
  }
};


  
// Hàm lấy tất cả UnitHeader
export const getAllUnitHeaders = async () => {
  try {
    const response = await axios.get(`${API_URL}/units/crud/unit-headers`, config);
    console.log('Lấy tất cả UnitHeader:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tất cả UnitHeader:', error.response?.data || error.message);
    throw error;
  }
};

// Hàm lấy tất cả UnitLine
export const getAllUnitLines = async () => {
  try {
    const response = await axios.get(`${API_URL}/units/crud/unit-lines`, config);
    console.log('Lấy tất cả UnitLine:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tất cả UnitLine:', error.response?.data || error.message);
    throw error;
  }
};

// Hàm lấy tất cả UnitDetail
export const getAllUnitDetails = async () => {
  try {
    const response = await axios.get(`${API_URL}/units/crud/unit-details`, config);
    console.log('Lấy tất cả UnitDetail:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy tất cả UnitDetail:', error.response?.data || error.message);
    throw error;
  }
};

export const getDetailsByLineId = async (lineId) => {
  try {
    const response = await axios.get(`${API_URL}/units/crud/lines/${lineId}/details`); 
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết theo Line ID:", error);
    throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm
  }
};


//lấy line theo header
export const getUnitLinesByHeaderId = async (headerId) => {
  const response = await axios.get(`${API_URL}/units/crud/unit-lines/header/${headerId}`);
  return response.data;
};



