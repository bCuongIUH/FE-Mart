// import React, { createContext, useState } from 'react';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // Trạng thái người dùng

//   const login = (userData) => {
//     setUser(userData); // Lưu thông tin người dùng khi đăng nhập
//   };

//   const logout = () => {
//     setUser(null); // Đặt lại trạng thái người dùng khi đăng xuất
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// // import  { createContext } from "react";

// // export const AuthContext = createContext({
// //   user: undefined,
// //   updateAuthUser: () => {},
// //   //signOut: () => {}, 
// // });

import React, { createContext, useState } from 'react';

// Tạo AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Quản lý thông tin người dùng

  const login = (userData) => {
    setUser(userData); // Cập nhật trạng thái người dùng sau khi đăng nhập
  };

  const logout = () => {
    setUser(null); // Xóa thông tin người dùng khi đăng xuất
    localStorage.removeItem('token'); // Xóa token khỏi localStorage
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
