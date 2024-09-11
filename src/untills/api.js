import axios from "axios";
const config = { withCredentials: true };
// const API_URL = "http://172.28.117.95:3050/api"; 
const API_URL = "http://localhost:5000/api";
// đăng nhập / đăng ký / xác thực người dùng


export const postRegister = async (data) => {
    const res = axios.post(`${API_URL}/auth/register`, data, config)
    return res;
  }
  export const verifyOTP = async (data) => {
  
    return new Promise((reject, resolve) => {
      axios.post(`${API_URL}/auth/verify-otp`, data, config)
        .then(res => {
          reject(res);
        })
        .catch(err => {
          resolve(err)
        })
    })
  
  }
  export const postLogin = async (data) => {
  
    return new Promise((rejects, resolve) => {
      axios.post(`${API_URL}/auth/login`, data, config)
        .then(res => {
          rejects(res)
        })
        .catch(err => {
          resolve(err)
        })
    })
  
  }
  //token và session
  export const removeCookie = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/removeCookie`, config);
      return response; // Trả về response nếu thành công
    } catch (error) {
      throw error; // Ném lỗi để xử lý bên ngoài
    }
  }
  
  export const removeToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/removeToken`, config);
      return response; // Trả về response nếu thành công
    } catch (error) {
      throw error; // Ném lỗi để xử lý bên ngoài
    }
  }
  
  export const getToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/getToken`, config);
      return response; // Trả về response nếu thành công
    } catch (error) {
      throw error; // Ném lỗi để xử lý bên ngoài
    }
  }