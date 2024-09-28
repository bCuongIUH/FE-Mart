import React from 'react';
import styles from './WarehouseImport.module.css'

function WarehouseImport() {



//   {
//     "sellingPrice": 5555,
//     "status": "on sale",
//     "quantityToTake": 20,
//     "description": "Mô tả mới",
//     "image": "URL_hình_ảnh_mới"
//      items :{id} _ id tương đương loại sp nào
// }

  return (
    <div className={styles.warehouseImport}>
      <h2>Quản lý nhập kho</h2>
      <p>Đây là giao diện nhập kho code linh ta linh tinh vào đâyy plzs.</p>
     
      <button className={styles.importButton}>Tạo phiếu nhập kho</button>
    </div>
  );
}

export default WarehouseImport;
