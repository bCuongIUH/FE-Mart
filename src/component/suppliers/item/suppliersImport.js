
import React, { useState } from 'react';
import styles from './suppliersimport.module.css';
import { createSuppliers } from '../../../untills/api';

function SuppliersImport() {
  const [supplierData, setSupplierData] = useState({
    name: '',
    contactInfo: '',
    email: '',
    phoneNumber: '',
  });
  const [confirmData, setConfirmData] = useState(null); // Lưu dữ liệu để xác nhận
  const [step, setStep] = useState(1); // Quản lý bước hiển thị
  const [message, setMessage] = useState('');

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Hàm xử lý submit form bước 1
  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      // Xác nhận dữ liệu và chuyển qua bước 2
      setConfirmData({
        ...supplierData,
        entryDate: new Date().toISOString(),
      });
      setStep(2);
    } else if (step === 2) {
      handleConfirmSubmit();
    }
  };

  // Hàm xử lý submit form bước 2
  const handleConfirmSubmit = async () => {
    try {
      const response = await createSuppliers(confirmData);
      setMessage(response.message); // Hiển thị thông báo thêm thành công
      resetForm();
    } catch (error) {
      setMessage('Lỗi khi thêm nhà cung cấp: ' + error.response.data.message);
    }
  };

  // Reset form sau khi thêm thành công
  const resetForm = () => {
    setSupplierData({
      name: '',
      contactInfo: '',
      email: '',
      phoneNumber: '',
    });
    setConfirmData(null);
    setStep(1);
  };

  return (
    <div className={styles.suppliersImport}>
      <h2>Nhập nhà cung cấp mới</h2>

      {step === 1 ? (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tên nhà cung cấp</label>
            <input
              type="text"
              name="name"
              value={supplierData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Thông tin liên hệ</label>
            <input
              type="text"
              name="contactInfo"
              value={supplierData.contactInfo}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={supplierData.email}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={supplierData.phoneNumber}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Tiếp tục
          </button>
        </form>
      ) : (
        <div className={styles.confirmContainer}>
          <h3>Xác nhận thông tin nhà cung cấp</h3>
          <p><strong>Tên nhà cung cấp:</strong> {confirmData.name}</p>
          <p><strong>Thông tin liên hệ:</strong> {confirmData.contactInfo}</p>
          <p><strong>Email:</strong> {confirmData.email}</p>
          <p><strong>Số điện thoại:</strong> {confirmData.phoneNumber}</p>
          <p><strong>Ngày nhập:</strong> {new Date(confirmData.entryDate).toLocaleDateString()}</p>

          <button type="submit" onClick={handleSubmit} className={styles.confirmButton}>
            Xác nhận
          </button>
          <button type="button" className={styles.cancelButton} onClick={resetForm}>
            Hủy
          </button>
        </div>
      )}

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

export default SuppliersImport;

