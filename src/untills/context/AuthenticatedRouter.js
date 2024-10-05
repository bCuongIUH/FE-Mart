import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');


  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RequireAuth;
