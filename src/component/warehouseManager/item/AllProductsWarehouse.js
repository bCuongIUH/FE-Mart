import React, { useEffect, useState, useContext } from 'react';
import { deleteProductWarehouse, getAllUsers, getAllWarehouse } from '../../../untills/api';
import { FaTrash } from 'react-icons/fa';
import styles from './AllProductsWarehouse.module.css'; 
import { AuthContext } from '../../../untills/context/AuthContext';

function AllProductsWarehouse() {
  const [warehouses, setWarehouse] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const { user } = useContext(AuthContext); 
  const [users, setUsers] = useState([]); 

  useEffect(() => {
    async function fetchWarehouse() {
      try {
        const warehousesList = await getAllWarehouse();
        setWarehouse(warehousesList);
        // warehousesList.forEach(warehouse => {
        //   console.log(`Product Name: ${warehouse.productName}, Created By:`, warehouse.createdBy);
        // });
      } catch (error) {
        console.error('Lỗi lấy sản phẩm trong kho', error);
      }
    }
    const fetchUsers = async () => {
      try {
          const userList = await getAllUsers(); 
          setUsers(userList);
      } catch (error) {
          console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
  };
    fetchWarehouse();
    fetchUsers();
  }, []);
  const showProductDetails = (product) => {
    setSelectedProduct(product);
  };

  // Hàm để đóng modal
  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleDelete = async (id) => {
    console.log(`Deleting product with ID: ${id}`); 
    try {
        await deleteProductWarehouse(id); 
        setWarehouse(warehouses.filter(warehouse => warehouse._id !== id)); 
        if (selectedProduct && selectedProduct._id === id) {
            closeModal(); 
        }
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
    }
};
//chức năng phân trang
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 8;
const totalPages = Math.ceil(warehouses.length / itemsPerPage);
const sortedWarehouses = warehouses.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate));
const paginatedWarehouses = sortedWarehouses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
);

const handlePreviousPage = () => {
    if (currentPage > 1) {
        setCurrentPage(prev => prev - 1);
    }
};

const handleNextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage(prev => prev + 1);
    }
};

return (
  <div className={styles.container}>
    <h1 className={styles.title}>Danh sách sản phẩm trong kho</h1>
    {warehouses.length > 0 ? (
      <ul className={styles.productList}>
        {paginatedWarehouses.map((warehouse) => (
          <li key={warehouse._id} className={styles.productItem} onClick={() => showProductDetails(warehouse)}>
            <div className={styles.productDetails}>
              <span className={styles.productName}>{warehouse.productName}</span>
              <span className={styles.productQuantity} title={`Số lượng: ${warehouse.quantity}`}>({`x${warehouse.quantity}`})</span>
            </div>
            <button className={styles.deleteButton} onClick={(e) => { e.stopPropagation(); handleDelete(warehouse._id); }}>
              <FaTrash /> 
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p>Không có sản phẩm nào</p>
    )}

    {/* Nút điều hướng */}
    <div className={styles.pagination}>
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>Trước</button>
      <span>Trang {currentPage} / {totalPages}</span>
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>Tiếp</button>
    </div>

    {/* Modal thông tin sản phẩm */}
    {selectedProduct && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>{selectedProduct.productName}</h2>
          <p>Số lượng: {selectedProduct.quantity}</p>
          <p>Giá nhập: {selectedProduct.purchasePrice}</p>
          <p>Ngày nhập: {new Date(selectedProduct.entryDate).toLocaleDateString('vi-VN')}</p> 
          <p>Người nhập:  {users.find(user => user._id === selectedProduct.createdBy)?.fullName || 'Không xác định'}</p>
          <button onClick={closeModal}>Đóng</button>
        </div>
      </div>
    )}
  </div>
);
}

export default AllProductsWarehouse;