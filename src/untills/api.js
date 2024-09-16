import axios from "axios";
const config = { withCredentials: true };
// const API_URL = "http://172.28.117.95:3050/api"; 
const API_URL = "http://localhost:5000/api";
// đăng nhập / đăng ký / xác thực người dùng

//đăng kí
export const postRegister = async (data) => {
    const res = axios.post(`${API_URL}/auth/register`, data, config)
    return res;
  }
  //xác minh email
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
  export const sendOTP = async ({ email }) => {
    try {
      const response = await axios.post(`${API_URL}/send-otp`, { email });
      return response;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error; // Để các phần khác có thể xử lý lỗi nếu cần
    }
  };
  //đăng nhập
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
      const response = await axios.get(`${API_URL}/auth/removeCookie`, config);
      return response; // Trả về response nếu thành công
    } catch (error) {
      throw error; // Ném lỗi để xử lý bên ngoài
    }
  }
  
  export const removeToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/removeToken`, config);
      return response; // Trả về response nếu thành công
    } catch (error) {
      throw error; // Ném lỗi để xử lý bên ngoài
    }
  };
  
  export const getToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/getToken`, config);
      return response; // Trả về response nếu thành công
    } catch (error) {
      throw error; // Ném lỗi để xử lý bên ngoài
    }
  }
  // Sản phẩm API

// Tạo sản phẩm mới
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, productData, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error.response?.data || error.message);
    throw error;
  }
};


// Lấy tất cả sản phẩm
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, productData, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xóa sản phẩm
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Mật khẩu
// Gửi yêu cầu quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email }, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Xác minh OTP và lấy token đặt lại mật khẩu
export const verifyForgotPasswordOTP = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp }, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/// Hàm đổi mật khẩu
export const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/auth/change-password`, { userId, oldPassword, newPassword }, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
