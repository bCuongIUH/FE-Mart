
import axios from "axios";
const config = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`, 
  },
};

// const API_URL = "http://172.28.117.95:5000/api"; 
const API_URL = "http://localhost:5000/api";

//thêm bảng giá header
export const createPriceList = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/price-list`, data);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data.message || 'Lỗi khi thêm bảng giá');
  }
};

//lấy ds bảng giá 
export const getAllPriceLists = async () => {
  try {
    const response = await axios.get(`${API_URL}/price-list`);
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data.message || 'Lỗi lấy bảng giá');
  }
};
// Thêm giá sản phẩm vào bảng giá
export const addPricesToPriceList = async (priceListId, products) => {
  try {
    const response = await axios.post(`${API_URL}/price-list/addprice`, {
      priceListId,
      products,
    });
    return response.data; 
  } catch (error) {
    throw new Error(error.response?.data.message || 'Lỗi cập nhập bảng giá');
  }
};
 export const getPriceListById = async (priceListId) => {
  try {
    const response = await axios.get(`${API_URL}/price-list/${priceListId}`);
    return response.data; // Đảm bảo rằng bạn trả về đúng dữ liệu
  } catch (error) {
    throw new Error(error.response?.data.message || 'Lỗi khi lấy thông tin bảng giá');
  }
};

//kích hoạt bảng giá
export const updateStatusPriceList = async (priceListId, newStatus) => {
  try {
    const response = await axios.post(`${API_URL}/price-list/status`, { priceListId, isActive: newStatus });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Lỗi khi kích hoạt bảng giá');
  }
};

// xóa bảng giá
export const deletePriceList = async (priceListId) => {
  try {
    const response = await axios.delete(`${API_URL}/price-list/delete/${priceListId}`);
    return response.data; // Trả về dữ liệu phản hồi từ API
  } catch (error) {
    throw new Error(error.response?.data.message || 'Lỗi khi xóa bảng giá'); 
  }
};
//cập nhật header bảng giá
export const updatePriceList = async (priceListId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/price-list/update/${priceListId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Lỗi khi cập nhật bảng giá');
  }
};