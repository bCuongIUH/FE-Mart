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
// Lấy toàn bộ người dùng
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/all-user`, config);
    return response.data.users; // Trả về mảng người dùng
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};
// Cập nhật vai trò người dùng
export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await axios.patch(`${API_URL}/auth/users/update-role/${userId}`, { role: newRole });
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi cập nhật vai trò:', error);
    throw error;
  }
};

// Tạo mới ncc
export const createSuppliers = async (suppliersData) => {
  try {
    const response = await axios.post(`${API_URL}/suppliers/add`, suppliersData, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error.response?.data || error.message);
    throw error;
  }
};


// Lấy tất cả sản phẩm
export const getAllSuppliers = async () => {
  try {
    const response = await axios.get(`${API_URL}/suppliers`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//lấy tất cả ds sp trong kho
export const getAllWarehouse = async () => {
  try {
    const response = await axios.get(`${API_URL}/warehouses`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Tạo mới ncc
export const createCart = async (suppliersData) => {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, suppliersData, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error.response?.data || error.message);
    throw error;
  }
};


// Lấy tất cả sản phẩm
export const getAllCart = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Hàm cập nhật giỏ hàng
export const updateCart = async (cartId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/cart/update`, { cartId, status });
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi cập nhật giỏ hàng:', error);
    throw error;
  }
};