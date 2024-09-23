import React from 'react';
import styles from './WarehouseImport.module.css'

function WarehouseImport() {
  return (
    <div className={styles.warehouseImport}>
      <h2>Quản lý nhập kho</h2>
      <p>Đây là giao diện nhập kho code linh ta linh tinh vào đâyy plzs.</p>
     
      <button className={styles.importButton}>Tạo phiếu nhập kho</button>
    </div>
  );
}

export default WarehouseImport;
