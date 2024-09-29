import React, { useState, useEffect, useContext } from "react";
import { getAllSuppliers, addProductToWarehouse } from "../../../untills/api"; 
import styles from "./WarehouseImport.module.css";
import { AuthContext } from "../../../untills/context/AuthContext";

const WarehouseImport = () => {
  const { user } = useContext(AuthContext); 
  const [suppliers, setSuppliers] = useState([]);
  const [productData, setProductData] = useState({
    productName: "",
    quantity: 0,
    purchasePrice: 0,
    supplier: "", // chỉ lưu ID của nhà cung cấp
  });
  const [confirmData, setConfirmData] = useState(null);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const supplierList = await getAllSuppliers();
        setSuppliers(supplierList);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      const supplier = suppliers.find(sup => sup._id === productData.supplier);
      setConfirmData({
        ...productData,
        entryDate: new Date().toISOString(),
        createdBy: user._id,
        creatorName: user.fullName,
        supplierName: supplier ? supplier.name : "", 
      });
      setStep(2);
    } else if (step === 2) {
      try {
        const response = await addProductToWarehouse(confirmData);
        alert("Sản phẩm đã được thêm vào kho thành công!");
        console.log(response);
        resetForm();
      } catch (error) {
        // console.error("Lỗi khi thêm sản phẩm:", error);
        console.error("Lỗi khi thêm sản phẩm:", error.response.data);
      }
    }
  };

  const resetForm = () => {
    setProductData({ productName: "", quantity: 0, purchasePrice: 0, supplier: "" });
    setConfirmData(null);
    setStep(1);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {step === 1 ? (
        <>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tên sản phẩm</label>
            <input
              type="text"
              name="productName"
              value={productData.productName}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Số lượng</label>
            <input
              type="number"
              name="quantity"
              value={productData.quantity}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Giá mua</label>
            <input
              type="number"
              name="purchasePrice"
              value={productData.purchasePrice}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Chọn nhà cung cấp</label>
            <select
              name="supplier"
              value={productData.supplier}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Chọn nhà cung cấp</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles.submitButton}>
            Tiếp tục
          </button>
        </>
      ) : (
        <div className={styles.confirmContainer}>
          <h3>Xác nhận thông tin sản phẩm</h3>
          <p><strong>Tên sản phẩm:</strong> {confirmData.productName}</p>
          <p><strong>Số lượng:</strong> {confirmData.quantity}</p>
          <p><strong>Giá mua:</strong> {confirmData.purchasePrice}</p>
          <p><strong>Nhà cung cấp:</strong> {confirmData.supplierName}</p> 
          <p><strong>Ngày nhập:</strong> {new Date(confirmData.entryDate).toLocaleDateString()}</p>
          <p><strong>Người lập phiếu:</strong> {confirmData.creatorName}</p>
          <button type="submit" className={styles.confirmButton}>
            Xác nhận
          </button>
          <button type="button" className={styles.cancelButton} onClick={resetForm}>
            Hủy
          </button>
        </div>
      )}
    </form>
  );
};

export default WarehouseImport;
