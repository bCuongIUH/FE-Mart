// import React, { createContext, useState, useContext, useEffect } from 'react';

// export const UserContext = createContext();
// // const UserContext = createContext();
// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const login = (userData) => {
//     setUser(userData); // Lưu thông tin người dùng khi đăng nhập
//   };
//   useEffect(() => {
    
//     const token = localStorage.getItem('token');
//     if (token) {
    
//     }
//   }, []);
  

//   return (
//     <UserContext.Provider value={{ user, setUser, login }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);
import React, { createContext, useState, useContext, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Lấy thông tin user từ localStorage
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      // Nếu có token và user, cập nhật state user
      setUser(JSON.parse(storedUser));
    }
  }, []);


  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
