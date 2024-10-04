
import React, { useEffect, useState } from 'react';
import { getAllSuppliers } from '../../../untills/api';
import styles from './suppliersInfo.module.css';
import { FaTrash } from 'react-icons/fa';


function SuppliersInfo() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const suppliersList = await getAllSuppliers();
        setSuppliers(suppliersList);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhà cung cấp:', error);
      }
    }
    fetchSuppliers();
  }, []);

  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const closeModal = () => {
    setSelectedSupplier(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Danh sách nhà cung cấp</h1>
      {suppliers.length > 0 ? (
        <ul className={styles.supplierList}>
          {suppliers.map((supplier) => (
            <li
              key={supplier._id}
              className={styles.supplierItem}
              onClick={() => handleSupplierClick(supplier)}
            >
              <div className='supplierDetail'>
                <span className={styles.supplierName}>{supplier.name}</span>
                {/* <span className={styles.supplierContactInfo}>{supplier.contactInfo}</span> */}
              </div>
              <button className={styles.deleteButton} >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có nhà cung cấp nào</p>
      )}

      {/* Modal thông tin nhà cung cấp */}
      {selectedSupplier && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{selectedSupplier.name}</h2>
            <p>Thông tin liên hệ: {selectedSupplier.contactInfo}</p>
            <p>Email: {selectedSupplier.email}</p>
            <p>Số điện thoại: {selectedSupplier.phoneNumber}</p>
            <button onClick={closeModal}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuppliersInfo;
