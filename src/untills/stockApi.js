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