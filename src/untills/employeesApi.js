import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; 
const config = {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`, 
    },
};

// API để lấy danh sách nhân viên
export const getAllEmployee = async () => {
  try {
    const response = await axios.get(`${API_URL}/employees`, config); 
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhân viên:', error);
    throw new Error('Không thể lấy danh sách nhân viên');
  }
};
// Lấy nhân viên theo ID
export const getEmployeeById = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/employees/by/${employeeId}`, config); 
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin nhân viên:', error);
    throw new Error('Không thể lấy thông tin nhân viên');
  }
};
// API để thêm một nhân viên mới
export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${API_URL}/employees/add-employee`, employeeData, config);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      // Trả về lỗi cụ thể từ Backend
      throw new Error(error.response.data.message);
    } else {
      console.error('Lỗi khi thêm nhân viên:', error);
      throw new Error('Không thể thêm nhân viên');
    }
  }
};

// Hàm API xóa nhân viên
export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axios.delete(`${API_URL}/employees/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa nhân viên:', error);
    throw new Error(error.response?.data?.message || 'Không thể xóa nhân viên');
  }
};

// API sửa nhân viên
export const updateEmployee = async (employeeId, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/employees/${employeeId}`, updateData, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi sửa nhân viên:', error);
    throw new Error(error.response?.data?.message || 'Không thể sửa nhân viên');
  }
};
//xác thực nhân viên
export const verifyEmployeeOtp = async (otpData) => {
    try {
      const response = await axios.post(`${API_URL}/employees/verify-otp`, otpData, config); 
      return response.data; // Kết quả xác minh OTP
    } catch (error) {
      console.error('Lỗi khi xác minh OTP:', error);
      throw new Error('OTP không hợp lệ hoặc đã hết hạn');
    }
  };