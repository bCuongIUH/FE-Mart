import React, { createContext, useState, useEffect } from 'react';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Khôi phục thông tin người dùng
    }
  }, []);

  // Hàm login, lưu thông tin người dùng vào state và localStorage
  const login = (userData) => {
    setUser(userData); // Cập nhật trạng thái người dùng
    localStorage.setItem('user', JSON.stringify(userData)); // Lưu thông tin người dùng vào localStorage
    localStorage.setItem('token', userData.token); // Lưu token (nếu có) vào localStorage
  };

  // Hàm logout, xóa thông tin người dùng khỏi state và localStorage
  const logout = () => {
    setUser(null); // Xóa thông tin người dùng
    localStorage.removeItem('user');
    localStorage.removeItem('token'); 
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
