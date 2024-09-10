import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');

  // Nếu không có token, điều hướng đến trang đăng nhập
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Nếu có token, hiển thị nội dung của component con
  return children;
};

export default RequireAuth;
