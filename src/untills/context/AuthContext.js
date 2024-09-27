
import React, { createContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

export const AuthContext = createContext();

const SECRET_KEY = 'GvN1uJzWc3bIx8v5fA0KHQkY5+FZ3RkZ+oqFjTo6F0='; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const encryptedUser = localStorage.getItem('user');
    const encryptedToken = localStorage.getItem('token');
    if (encryptedUser && encryptedToken) {
      try {
        // Giải mã thông tin người dùng và token
        const bytesUser = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
        const decryptedUser = JSON.parse(bytesUser.toString(CryptoJS.enc.Utf8));
        
        const bytesToken = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
        const decryptedToken = bytesToken.toString(CryptoJS.enc.Utf8);
        
        setUser({ ...decryptedUser, token: decryptedToken });
      } catch (error) {
        console.error('Error decrypting user data:', error);
      }
    }
  }, []);

  const login = (userData) => {
    try {
      // Mã hóa thông tin người dùng và token
      const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(userData), SECRET_KEY).toString();
      const encryptedToken = CryptoJS.AES.encrypt(userData.token, SECRET_KEY).toString();
   
      
      setUser(userData);
      localStorage.setItem('user', encryptedUser);
      localStorage.setItem('token', encryptedToken);
   
    } catch (error) {
      console.error('Error encrypting user data:', error);
    }
  };
  
  

  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
