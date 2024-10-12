import React, { useState, useEffect, useContext } from "react";
import { getAllSuppliers, addProductToWarehouse, getAllWarehouse, getAllUsers } from "../../../untills/api"; 
import styles from "./WarehouseImport.module.css";
import { AuthContext } from "../../../untills/context/AuthContext";

const WarehouseImport = () => {
  const { user } = useContext(AuthContext); 
  const [suppliers, setSuppliers] = useState([]);
  const [productData, setProductData] = useState({
    productName: "",
    quantity: 0,
    purchasePrice: 0,
    supplier: "", 
  });
  const [confirmData, setConfirmData] = useState(null);
  const [step, setStep] = useState(1);
  const [users, setUsers] = useState([]); 
  //10/9 lấy list phiếu nhập kho
  const [warehouseProducts, setWarehouseProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [page, setPage] = useState(1);

console.log("đây",warehouseProducts);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const supplierList = await getAllSuppliers();
        setSuppliers(supplierList);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
      }
    };
    const fetchWarehouseProducts = async () => {
      try {
        const products = await getAllWarehouse();
        setWarehouseProducts(products);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm trong kho:", error);
      }
    };
    const fetchUsers = async () => {
      try {
          const userList = await getAllUsers(); 
          setUsers(userList);
      } catch (error) {
          console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
  };
    fetchSuppliers();
    fetchWarehouseProducts();
    fetchUsers();
    }, []);

// console.log(warehouseProducts);


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
        // console.log(response);
        resetForm();
        
        // Cập nhật lại danh sách sản phẩm trong kho sau khi thêm mới
        const updatedProducts = await getAllWarehouse();
        setWarehouseProducts(updatedProducts);
        
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error.response.data);
      }
    }
  };

  //phân trang <..1..>
  const handleNextPage = () => {
    if (currentPage < Math.ceil(warehouseProducts.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const displayedProducts = warehouseProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  

  const resetForm = () => {
    setProductData({ productName: "", quantity: 0, purchasePrice: 0, supplier: "" });
    setConfirmData(null);
    setStep(1);
  };


  return (
    <>
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
      <div className={styles.warehouseList}>
    <h3>Danh sách phiếu nhập kho</h3>
    <table className={styles.warehouseTable}>
        <thead>
            <tr>
                <th>Mã</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá nhập</th>
                <th>Người nhập</th>
                <th>Ngày nhập</th>
            </tr>
        </thead>
        <tbody>
            {displayedProducts.map((product) => (
                <tr key={product._id}>
                    <td>{product.warehouseCode}</td>
                    <td>{product.productName}</td>
                    <td>{product.quantity}</td>
                    <td>{product.purchasePrice}</td>
                    <td>
                       {users.find(user => user._id === product.createdBy)?.fullName || 'Không xác định'}
                    </td>
                    <td>{new Date(product.entryDate).toLocaleDateString()}</td>
                </tr>
            ))}
        </tbody>
    </table>
    <div className={styles.pagination}>
        {currentPage > 1 && (
            <button onClick={handlePreviousPage}>Trang trước</button>
        )}
        {warehouseProducts.length > currentPage * itemsPerPage && (
            <button onClick={handleNextPage}>Trang sau</button>
        )}
    </div>
</div>

    </>
  );
};

export default WarehouseImport;