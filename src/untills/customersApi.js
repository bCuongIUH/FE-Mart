import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const config = {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, 
    },
};

// Hàm gọi API để lấy danh sách khách hàng đang hoạt động
export const getAllCustomers = async () => {
    try {
        const response = await axios.get(`${API_URL}/customers/`, config);
        return response.data; 
    } catch (error) {
        console.error("Error fetching active customers:", error);
        throw error;
    }
};
