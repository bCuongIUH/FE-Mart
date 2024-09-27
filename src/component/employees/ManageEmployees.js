import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../untills/context/AuthContext";
import { getAllUsers, updateUserRole } from "../../untills/api"; 
import { useNavigate } from "react-router-dom";
import styles from './ManageEmployees.module.css';

function ManageEmployees() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        console.log(users);
        
      } catch (error) {
        console.error("Lỗi khi lấy người dùng:", error);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);
console.log(user);

  // Hàm xử lý khi thay đổi vai trò của người dùng
  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    try {
      const updatedUser = await updateUserRole(userId, newRole);
      setUsers(users.map(user => user._id === userId ? updatedUser.user : user));
    } catch (error) {
      console.error('Lỗi khi cập nhật vai trò:', error);
      setErrorMessage('Lỗi khi cập nhật vai trò');
    }
  };
  //
  const adminUsers = Array.isArray(users) ? users.filter(user => user.role === 'admin') : [];
  const normalUsers = Array.isArray(users) ? users.filter(user => user.role === 'user') : [];

  return (
    <div className={styles.manageEmployeesContainer}>
      <h1 className={styles.managerName}>Quản lí nhân viên</h1>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        Quay lại
      </button>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <h2>Nhân viên</h2>
          {adminUsers.length > 0 ? (
            <ul>
              {adminUsers.map(admin => (
                <li key={admin._id}>
                  {admin.fullName} - {admin.phoneNumber} 
                  <button onClick={() => handleRoleChange(admin._id, admin.role)}>
                    Chuyển thành Khách hàng
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có người dùng admin nào.</p>
          )}
          <h2>Khách hàng</h2>
          {normalUsers.length > 0 ? (
            <ul>
              {normalUsers.map(user => (
                <li key={user._id}>
                  {user.fullName} - {user.phoneNumber} 
                  <button onClick={() => handleRoleChange(user._id, user.role)}>
                    Chuyển thành Nhân viên
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có người dùng nào.</p>
          )}
        </>
      )}
    </div>
  );
}

export default ManageEmployees;
