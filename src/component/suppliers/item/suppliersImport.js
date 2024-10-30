import React, { useEffect, useState } from 'react';
import { getAllSuppliers } from '../../../untills/api';
import { Button, Modal } from 'antd';
import SuppliersAddModal from './SuppliersAddModal';
import styles from './suppliersInfo.module.css';
import { FaTrash } from 'react-icons/fa';

function SuppliersInfo() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const suppliersList = await getAllSuppliers();
        setSuppliers(suppliersList || []); // Nếu suppliersList là undefined, gán thành mảng trống
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

  const handleAddSupplierSuccess = (newSupplier) => {
    setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
    setIsAddModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Danh sách nhà cung cấp</h1>
        <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ float: 'right' }}>
          Thêm nhà cung cấp
        </Button>
      </div>

      {suppliers?.length > 0 ? (
        <ul className={styles.supplierList}>
          {suppliers.map((supplier) => (
            supplier && (
              <li
                key={supplier._id}
                className={styles.supplierItem}
                onClick={() => handleSupplierClick(supplier)}
              >
                <div className={styles.supplierDetail}>
                  <span className={styles.supplierName}><strong>Tên:</strong> {supplier.name || 'Không có tên'}</span>
                  <span className={styles.supplierContactInfo}><strong>Email:</strong> {supplier.email || 'Không có email'}</span>
                  <span className={styles.supplierContactInfo}><strong>Số ĐT:</strong> {supplier.phoneNumber || 'Không có số điện thoại'}</span>
                  <span className={styles.supplierContactInfo}><strong>Thông tin liên hệ:</strong> {supplier.contactInfo || 'Không có thông tin liên hệ'}</span>
                </div>
                <button className={styles.deleteButton}>
                  <FaTrash />
                </button>
              </li>
            )
          ))}
        </ul>
      ) : (
        <p>Không có nhà cung cấp nào</p>
      )}

      {/* Modal chi tiết nhà cung cấp */}
      {selectedSupplier && (
        <Modal
          visible={selectedSupplier !== null}
          onCancel={closeModal}
          footer={null}
          title="Thông tin nhà cung cấp"
        >
          <h2>{selectedSupplier.name || 'Không có tên'}</h2>
          <p><strong>Thông tin liên hệ:</strong> {selectedSupplier.contactInfo || 'Không có thông tin'}</p>
          <p><strong>Email:</strong> {selectedSupplier.email || 'Không có email'}</p>
          <p><strong>Số điện thoại:</strong> {selectedSupplier.phoneNumber || 'Không có số điện thoại'}</p>
        </Modal>
      )}

      {/* Modal thêm nhà cung cấp */}
      <SuppliersAddModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddSuccess={handleAddSupplierSuccess}
      />
    </div>
  );
}

export default SuppliersInfo;
