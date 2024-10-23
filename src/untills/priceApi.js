
import axios from "axios";
const config = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`, 
  },
};

// const API_URL = "http://172.28.117.95:5000/api"; 
const API_URL = "http://localhost:5000/api";

export const getPriceListDetails = async (priceListId) => {
    try {
      const response = await axios.get(`${API_URL}/price/all${priceListId}`);
      return response.data; // Trả về dữ liệu bảng giá
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết bảng giá theo Price List ID:", error);
      throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm
    }
  };


  export const createPriceListHeader = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/price/create-header`, data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo header bảng giá:", error);
        throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm
    }
};
export const addProductsToPriceList = async (priceListId, products) => {
    try {
        const response = await axios.post(`${API_URL}/price/add-products`, { priceListId, products });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào bảng giá:", error);
        throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm
    }
};
