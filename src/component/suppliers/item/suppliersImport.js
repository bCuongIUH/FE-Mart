import React ,{useState, useEffect}from 'react';
import styles from './suppliersimport.module.css'
import { createSuppliers, getAllSuppliers } from '../../../untills/api';

function Suppliersimport() {
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        async function fetchSuppliers() {
          try {
            const suppliersList = await getAllSuppliers();
            setSuppliers(suppliersList);
          } catch (error) {
            console.error('Lỗi khi lấy danh sách ncc:', error);
          }
        }
        fetchSuppliers();
      }, []);
  return (
    <div className={styles.suppliersimport}>
      <h2>Quản lý nhà cung cấp</h2>
      <p>Đây là giao diện nhập nhà cung cấp code linh ta linh tinh vào đâyy plzs.</p>
     
      <button className={styles.importButton}>nhấn zô</button>
    </div>
  );
}

export default Suppliersimport;
