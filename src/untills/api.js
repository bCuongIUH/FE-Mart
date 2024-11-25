import axios from "axios";
// const needsContentType = true;
const token = localStorage.getItem('token');
const config = {
  withCredentials: true,
  headers: {
    ...(token && { Authorization: `Bearer ${token}` }),
  },
};

// const API_URL = "http://172.28.117.95:5000/api"; 
const API_URL = "http://localhost:5000/api";
// đăng nhập / đăng ký / xác thực người dùng

//đăng kí
export const postRegister = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, data, config);
    return res;
  } catch (error) {
    console.error("Error during registration:", error.response?.data || error.message);
    throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm
  }
};
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
  export const resendOTP = async ({ email }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/resend-otp`, { email });
      return response;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error; // Để các phần khác có thể xử lý lỗi nếu cần
    }
  };
  //đăng nhập
  export const postLogin = async (data) => {
    return new Promise((resolve, reject) => {
      axios.post(`${API_URL}/auth/login`, data, config)
        .then(res => {
          resolve(res); // Gọi `resolve` khi thành công
        })
        .catch(err => {
          reject(err); // Gọi `reject` khi thất bại
        });
    });
  };
  
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
export const getProductByCode = async (code) => {
  try {
    const response = await axios.get(`${API_URL}/products/code/${code}`, config); 
    return response.data; // Trả về dữ liệu sản phẩm
  } catch (error) {
    console.error('Error fetching product by code:', error); // Ghi log lỗi
    throw error; // Ném lỗi ra nếu có lỗi xảy ra
  }
};

export const getAllProductsPOP = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/pop`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/products/category/${categoryId}`);
    return response.data; // Trả về danh sách sản phẩm
  } catch (error) {
    throw new Error(error.response?.data.message || 'Lỗi khi lấy danh sách sản phẩm theo danh mục');
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/product${id}`, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_URL}/products/update/${id}`, productData, config);
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
// cập nhật trạng thái
export const updateProductStatus = async (id, newStatus) => {
  try {
      const response = await axios.put(`${API_URL}/products/status/${id}`, {
          isAvailable: newStatus, 
      });
      console.log('Cập nhật trạng thái thành công:', response.data);
  } catch (error) {
      console.error('Lỗi khi cập nhật:', error.response?.data?.message || error.message);
  }
};



// Mật khẩu
// Gửi yêu cầu quên mật khẩull
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
// Cập nhật nhà cung cấp
export const updateSupplier = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/suppliers/${id}`, updatedData, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật nhà cung cấp:', error.response?.data || error.message);
    throw error;
  }
};

// Xóa nhà cung cấp (chuyển isDeleted thành true)
export const deleteSupplier = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/suppliers/${id}`, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi xóa nhà cung cấp:', error.response?.data || error.message);
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
//tạo header kho
export const createPhieuKho = async (warehouseData) => {
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
// Hàm lấy sản phẩm theo nhà cung cấp
export const getProductsBySupplier = async (supplierId) => {
  try {
      const response = await axios.get(`${API_URL}/warehouses/supplier/${supplierId}`, config);
      console.log('Dữ liệu trả về từ API:', response.data); 
      // Kiểm tra xem có thuộc tính products hay không
      if (response.data.products && Array.isArray(response.data.products)) {
          return response.data.products; 
      } else {
          console.error('Dữ liệu không phải là mảng:', response.data);
          return []; 
      }
  } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error); 
      throw error; 
  }
};


// Hàm tạo phiếu nhập kho
export const createWarehouseEntry = async (entryData) => {
  try {
      const response = await axios.post(`${API_URL}/warehouses/add`, entryData);
      return response.data; // Trả về kết quả từ API
  } catch (error) {
      throw error; 
  }
};




// Tạo mới ncc
export const addToCartForUser = async (userId,productId,quantity,currentPrice,unit, unitValue ) => {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, {
      userId,
      productId,
      quantity,
      currentPrice, 
      unit, // Bổ sung unit vào request body
      unitValue, // Bổ sung unitValue vào request body
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    throw error;
  }
};
// Hàm thêm sản phẩm vào giỏ hàng
export const getAddToCart = async (userId, productId, quantity,currentPrice ) => {
  try {
    const response = await axios.post(`${API_URL}/cart/add`, {
      userId,
      productId,
      quantity,
      currentPrice 
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
//lấy toàn bộ sp trừ thằng đg chờ thanh toán
export const getAllCartPending = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart/allpending`, config); 
    return response.data;
  } catch (error) {
    throw error;
  }
}

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
export const updateCart = async (cartId, status, userId) => {//userID là id người thay đổi giỏ hàng - nhân viên
  try {
    console.log('Thông tin gửi đến:', { cartId, status, userId });
    const response = await axios.put(`${API_URL}/cart/update`, { cartId, status, userId }, config);
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
export const gettAllBillReturnOnline = async () => {
  try {
    const response = await axios.get(`${API_URL}/return`, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo hóa đơn:', error);
    throw error;
  }
};
export const updateBillStatusOnl = async (billId, action) => {
  try {
    const response = await axios.post(`${API_URL}/return/update-status`, {
      billId,
      action,
    });
    return response.data; // Phản hồi thành công từ Backend
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error.response?.data || error.message);
    throw error; 
  }
};

//tạo hóa đơn trực tiếp
// export const createDirectSaleBill = async (paymentMethod, items) => {
//   try {
//     const response = await axios.post(`${API_URL}/bill/create-buy-directly`, { paymentMethod, items });
//     return response.data;
//   } catch (error) {
//     console.error('Lỗi khi tạo hóa đơn bán hàng trực tiếp:', error);
//     throw error;
//   }
// };
// export const createDirectSaleBill = async ({ paymentMethod, items, customerId,phoneNumber, voucherCodes, createBy }) => {
//   try {
//     console.log("Sending payload:", { paymentMethod, items, customerId,phoneNumber, voucherCodes, createBy });
//     const response = await axios.post(
//       `${API_URL}/bill/create-buy-directly`,
//       { paymentMethod, items, customerId,phoneNumber, voucherCodes, createBy },
//       {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Response from server:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Detailed error from createDirectSaleBill:", {
//       message: error.message,
//       responseData: error.response?.data,
//       status: error.response?.status,
//       headers: error.response?.headers,
//     });
//     throw error;
//   }
// };

export const createDirectSaleBill = async ({
  paymentMethod,
  items,
  customerId,
  phoneNumber,
  voucherCodes,
  createBy,
  status,
  orderCode,
}) => {
  try {
    console.log("Sending payload:", {
      paymentMethod,
      items,
      customerId,
      phoneNumber,
      voucherCodes,
      createBy,
      status,
      orderCode,
    });
    const response = await axios.post(
      `${API_URL}/bill/create-buy-directly`,
      {
        paymentMethod,
        items,
        customerId,
        phoneNumber,
        voucherCodes,
        createBy,
        status,
        orderCode,
      },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response from server:", response.data);
    return response.data;
  } catch (error) {
    console.error("Detailed error from createDirectSaleBill:", {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
    });
    throw error;
  }
};


//lấy toàn bộ bill của người dùng
export const getAllBills = async () => {
  try {
    const response = await axios.get(`${API_URL}/bill/all`); 
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tất cả hóa đơn:', error);
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
//bill hàng mua trực tiếp ở quầy
export const getBillOffline = async () => {
  try {
    const response = await axios.get(`${API_URL}/bill/offline`); 
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy hóa đơn offline:', error);
    throw error; 
  }
};
//bill hàng mua onl 
export const getBillOnline = async () => {
  try {
    const response = await axios.get(`${API_URL}/bill/online`); 
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy hóa đơn offline:', error);
    throw error; 
  }
};

//hoàn trả bill
export const returnPurchaseBill = async (billId, returnedItems) => {
  try {
    const response = await axios.post(`${API_URL}/bill/return-bill`, {
      billId,
      returnedItems,
    });
    return response.data; // Trả về dữ liệu từ server
  } catch (error) {
    console.error('Lỗi khi trả hóa đơn:', error.response?.data || error.message);
    throw error; // Ném lỗi để xử lý phía trên nếu cần
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
// Hàm lấy danh sách danh mục
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`, config);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error);
    throw error;
  }
};
// Hàm thêm danh mục
export const addCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_URL}/categories/add`, categoryData, config);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi thêm danh mục:', error);
    throw error;
  }
};
// Hàm cập nhật danh mục
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axios.patch(`${API_URL}/categories/${categoryId}`, categoryData, config);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi cập nhật danh mục:', error);
    throw error;
  }
};
// Hàm xóa danh mục
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`${API_URL}/categories/${categoryId}`, config);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi xóa danh mục:', error);
    throw error;
  }
};
// đơn vị tính
// Hàm thêm đơn vị tính
export const addUnit = async (unitData) => {
  try {
    const response = await axios.post(`${API_URL}/units`, unitData, config);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi thêm đơn vị tính:', error);
    throw error;
  }
};

// Hàm lấy tất cả đơn vị tính
export const getUnits = async () => {
  try {
    const response = await axios.get(`${API_URL}/units`, config);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn vị tính:', error);
    throw error;
  }
};

// Hàm cập nhật đơn vị tính
export const updateUnit = async (unitId, unitData) => {
  try {
    const response = await axios.put(`${API_URL}/units/${unitId}`, unitData, config);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi cập nhật đơn vị tính:', error);
    throw error;
  }
};

// Hàm xóa đơn vị tính
export const deleteUnit = async (unitId) => {
  try {
    const response = await axios.delete(`${API_URL}/units/${unitId}`, config);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi xóa đơn vị tính:', error);
    throw error;
  }
};
//nhập hàng
export const addWarehouseEntry = async (warehouseEntryData) => {
  try {
    const response = await axios.post(`${API_URL}/warehouses/add`, warehouseEntryData, config);
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    console.error('Lỗi khi nhập hàng:', error.response?.data || error.message);
    throw error; 
  }
};
//chương trình khuyến mãi
export const addPromotion = async (promotionData) => {
  try {
    const response = await axios.post(`${API_URL}/promotions`, promotionData, config);
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi thêm chương trình khuyến mãi:', error.response?.data || error.message);
    throw error; 
  }
};
// Hàm lấy danh sách chương trình khuyến mãi
export const getPromotions = async () => {
  try {
    const response = await axios.get(`${API_URL}/promotions`, config);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách chương trình khuyến mãi:', error.response?.data || error.message);
    throw error; 
  }
};
// Hàm cập nhật chương trình khuyến mãi
export const updatePromotion = async (promotionId, promotionData) => {
  try {
    const response = await axios.put(`${API_URL}/promotions/${promotionId}`, promotionData, config);
    return response.data; 
  } catch (error) {
    console.error(`Lỗi khi cập nhật chương trình khuyến mãi với ID ${promotionId}:`, error.response?.data || error.message);
    throw error; 
  }
};
// Hàm xóa chương trình khuyến mãi
export const deletePromotion = async (promotionId) => {
  try {
    const response = await axios.delete(`${API_URL}/promotions/${promotionId}`, config);
    return response.data; 
  } catch (error) {
    console.error(`Lỗi khi xóa chương trình khuyến mãi với ID ${promotionId}:`, error.response?.data || error.message);
    throw error;
  }
};
export const updateBillStatusByCode = async (orderCode, status) => {
  try {
    const response = await axios.put(`${API_URL}/bill/update-status-by-code`, {
      orderCode,
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
    throw error;
  }
}