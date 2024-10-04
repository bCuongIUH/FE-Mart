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
      return response; 
    } catch (error) {
      throw error; 
    }
  }
  
  export const removeToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/removeToken`, config);
      return response; 
    } catch (error) {
      throw error; 
    }
  };
  
  export const getToken = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/getToken`, config);
      return response; 
    } catch (error) {
      throw error; 
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
// export const getAllUsers = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/auth/all-user`, config);
//     return response.data.users; 
//   } catch (error) {
//     console.error('Lỗi khi lấy danh sách người dùng:', error);
//     throw error; // Ném lỗi để xử lý ở nơi khác
//   }
// };
export const getAllUsers = async () => {
  try {
    const config = {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Thêm token vào header
      },
    };

    const response = await axios.get(`${API_URL}/auth/all-user`, config);
    return response.data.users; 
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


// Lấy tất cả ncc
export const getAllSuppliers = async () => {
  try {
    const response = await axios.get(`${API_URL}/suppliers`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//thêm sp vào kho
export const addProductToWarehouse = async (warehouseData) => {
  try {
    const response = await axios.post(`${API_URL}/warehouses/add`, warehouseData, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào kho:', error.response?.data || error.message);
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

//update sp -> lấy từ kho ra product
export const updateWarehouseEntry = async (id, warehouseData) => {
  try {
      const response = await axios.put(`${API_URL}/warehouses/update/${id}`, warehouseData);
      return response.data;
  } catch (error) {
      console.error('Lỗi khi cập nhật phiếu nhập kho:', error.response?.data || error.message);
      throw error;
  }
};
// xóa phiếu nhập kho
export const deleteProductWarehouse = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/warehouses/delete/${id}`);
    console.log(response.data);
    return response.data; 
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
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
// Hàm thêm sản phẩm vào giỏ hàng
export const getAddToCart = async (userId, productId, quantity) => {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, {
      userId,
      productId,
      quantity
    });
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    throw error;
  }
};

// Lấy tất cả sản phẩm
export const getAllCart = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/cart?userId=${userId}`, config); 
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Hàm lấy giỏ hàng trạng thái 'Shipper'
export const getShipperCart = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/cart/shipper?userId=${userId}`, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng của shipper:', error);
    throw error;
  }
};

// Hàm lấy giỏ hàng trạng thái 'Đã Mua'
export const getDamuaCart = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/cart/damua?userId=${userId}`, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng đã mua:', error);
    throw error;
  }
};

// Hàm lấy giỏ hàng trạng thái 'Hoàn Trả'
export const getHoanTraCart = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/cart/hoantra?userId=${userId}`, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng hoàn trả:', error);
    throw error;
  }
}

// Hàm cập nhật giỏ hàng
export const updateCart = async (cartId, status, adminId) => {
  try {
    const response = await axios.patch(`${API_URL}/cart/update`, { cartId, status, adminId }, config);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi cập nhật giỏ hàng:', error);
    throw error;
  }
};

// Hàm xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (cartId, productId) => {
  try {
    const response = await axios.delete(`${API_URL}/cart/remove`, {
      data: { cartId, productId }, 
      ...config
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
    throw error;
  }
};

// Hàm lấy toàn bộ giỏ hàng của admin
export const getAllCartsForAdmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart/all`, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy toàn bộ giỏ hàng của admin:', error);
    throw error;
  }
};
// BILL--------------------------
// Tạo hóa đơn
export const createBill = async (userId, paymentMethod) => {
  try {
    const response = await axios.post(`${API_URL}/bill/create`, { userId, paymentMethod });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo hóa đơn:', error);
    throw error;
  }
};

// Lấy danh sách hóa đơn theo người dùng
export const getBillsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/bill/user`, { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy hóa đơn:', error);
    throw error;
  }
};

// Lấy danh sách hóa đơn theo trạng thái
export const getBillsByStatus = async (status) => {
  try {
    const response = await axios.get(`${API_URL}/bill/status`, { params: { status } });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy hóa đơn theo trạng thái:', error);
    throw error;
  }
};

// Cập nhật trạng thái hóa đơn
export const updateBillStatus = async (billId, status) => {
  try {
    const response = await axios.patch(`${API_URL}/bill/update`, { billId, status });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái hóa đơn:', error);
    throw error;
  }
};
