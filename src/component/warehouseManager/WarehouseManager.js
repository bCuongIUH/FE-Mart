import React, { useEffect, useState } from 'react';
import { getAllSuppliers, getProductsBySupplier } from '../../untills/api'; 

const NhapKho = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [products, setProducts] = useState([]);
  const [entryCode, setEntryCode] = useState('');
  const [enteredBy, setEnteredBy] = useState('');
  const [entryProducts, setEntryProducts] = useState([]);

  useEffect(() => {
      const fetchSuppliers = async () => {
          try {
              const data = await getAllSuppliers();
              setSuppliers(data);
          } catch (error) {
              console.error('Lỗi khi lấy nhà cung cấp:', error);
          }
      };
      fetchSuppliers();
  }, []);

  useEffect(() => {
      const fetchProductsBySupplier = async () => {
          if (selectedSupplierId) {
              try {
                  const data = await getProductsBySupplier(selectedSupplierId);
                  console.log('Dữ liệu sản phẩm:', data); // Kiểm tra dữ liệu sản phẩm
                  setProducts(data);
                  setEntryProducts(data.map(product => ({ productId: product._id, quantity: 0, price: 0 }))); // Cập nhật entryProducts với sản phẩm đã lấy
              } catch (error) {
                  console.error('Lỗi khi lấy sản phẩm:', error);
              }
          } else {
              setProducts([]);
              setEntryProducts([]); // Reset entryProducts khi không có nhà cung cấp
          }
      };
      fetchProductsBySupplier();
  }, [selectedSupplierId]);

  const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Dữ liệu nhập kho:', {
          entryCode,
          enteredBy,
          entryProducts,
      });
      // Gửi dữ liệu nhập kho đến API ở đây
  };

  const handleProductChange = (product, quantity, price) => {
      const updatedProducts = entryProducts.map((p) => 
          p.productId === product._id ? { ...p, quantity, price } : p
      );
      setEntryProducts(updatedProducts);
  };

  return (
      <form onSubmit={handleSubmit}>
          <div>
              <label>Mã phiếu nhập:</label>
              <input type="text" value={entryCode} onChange={(e) => setEntryCode(e.target.value)} required />
          </div>
          <div>
              <label>Nhà cung cấp:</label>
              <select value={selectedSupplierId} onChange={(e) => setSelectedSupplierId(e.target.value)} required>
                  <option value="">Chọn nhà cung cấp</option>
                  {suppliers.map((supplier) => (
                      <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                  ))}
              </select>
          </div>
          <div>
              <label>Người nhập:</label>
              <input type="text" value={enteredBy} onChange={(e) => setEnteredBy(e.target.value)} required />
          </div>
          <h3>Sản phẩm thuộc nhà cung cấp đã chọn:</h3>
          {products.length > 0 ? (
              <table>
                  <thead>
                      <tr>
                          <th>Hình ảnh</th>
                          <th>Mã sản phẩm</th>
                          <th>Tên sản phẩm</th>
                          <th>Giá nhập</th>
                          <th>Số lượng nhập</th>
                      </tr>
                  </thead>
                  <tbody>
                      {products.map((product) => (
                          <tr key={product._id}>
                              <td>
                                  <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} />
                              </td>
                              <td>{product.code}</td>
                              <td>{product.name}</td>
                              <td>
                                  <input type="number" 
                                         onChange={(e) => handleProductChange(product, entryProducts.find(p => p.productId === product._id)?.quantity || 0, e.target.value)} 
                                         required 
                                  />
                              </td>
                              <td>
                                  <input type="number" 
                                         onChange={(e) => handleProductChange(product, e.target.value, entryProducts.find(p => p.productId === product._id)?.price || 0)} 
                                         required 
                                  />
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          ) : (
              <p>Không có sản phẩm nào thuộc nhà cung cấp này.</p>
          )}
          <button type="submit">Nhập kho</button>
      </form>
  );
};

export default NhapKho;
