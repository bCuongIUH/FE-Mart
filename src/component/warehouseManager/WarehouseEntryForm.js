import React, { useState, useEffect, useContext } from 'react';
import { getAllSuppliers, getProductsBySupplier, createWarehouseEntry, getAllUsers, getAllProducts } from '../../untills/api';
import { AuthContext } from '../../untills/context/AuthContext';
import { Table, Input, Select, Button } from 'antd';
const { Option } = Select;

const initialWarehouseEntry = {
  entryCode: '',
  supplierId: '',
  enteredBy: '',
  totalAmount: 0,
  products: [],
};

const WarehouseEntryForm = ({ onCancel }) => {
  const { user } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [products, setProducts] = useState([]);
  const [entryCode, setEntryCode] = useState('');
  const [entryProducts, setEntryProducts] = useState([]);
  const [enteredBy, setEnteredBy] = useState(user._id || '');
  const [users, setUsers] = useState([]);

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
          setProducts(data);
          setEntryProducts(data.map(product => ({ productId: product._id, quantity: 0, price: 0 })));
        } catch (error) {
          console.error('Lỗi khi lấy sản phẩm:', error);
        }
      } else {
        setProducts([]);
        setEntryProducts([]);
      }
    };
    fetchProductsBySupplier();
  }, [selectedSupplierId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Lỗi khi lấy người dùng:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const entryData = {
      entryCode,
      enteredBy: user._id,
      supplierId: selectedSupplierId,
      products: entryProducts,
    };

    try {
      const result = await createWarehouseEntry(entryData);
      console.log('Kết quả từ API:', result);
      // Reset form or handle success
      onCancel(); // Đóng form sau khi tạo phiếu
    } catch (error) {
      console.error('Lỗi khi tạo phiếu nhập kho:', error);
    }
  };

  const handleProductChange = (product, quantity, price) => {
    const updatedProducts = entryProducts.map((p) =>
      p.productId === product._id ? { ...p, quantity: quantity || 0, price: price || 0 } : p
    );
    setEntryProducts(updatedProducts);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Mã phiếu nhập:</label>
          <Input type="text" value={entryCode} onChange={(e) => setEntryCode(e.target.value)} required />
        </div>
        <div>
          <label>Nhà cung cấp:</label>
          <Select value={selectedSupplierId} onChange={(value) => setSelectedSupplierId(value)} required>
            <Option value="">Chọn nhà cung cấp</Option>
            {suppliers.map((supplier) => (
              <Option key={supplier._id} value={supplier._id}>{supplier.name}</Option>
            ))}
          </Select>
        </div>
        <div>
          <label>Người nhập:</label>
          <span>{user.fullName}</span>
        </div>
        <h3>Sản phẩm thuộc nhà cung cấp đã chọn:</h3>
        {products.length > 0 ? (
          <Table
            columns={[
              {
                title: 'Tên sản phẩm',
                dataIndex: 'productId',
                render: (text, product) => {
                  const productDetails = products.find(item => item._id === product.productId);
                  return <span>{productDetails ? productDetails.name : 'Không có tên'}</span>;
                },
              },
              {
                title: 'Giá nhập',
                dataIndex: 'price',
                render: (text, product) => (
                  <Input
                    type="number"
                    min={0}
                    onChange={(e) => handleProductChange(product._id, product.quantity, e.target.value)}
                  />
                ),
              },
              {
                title: 'Số lượng',
                dataIndex: 'quantity',
                render: (text, product) => (
                  <Input
                    type="number"
                    min={0}
                    onChange={(e) => handleProductChange(product._id, e.target.value, product.price)}
                  />
                ),
              },
            ]}
            dataSource={entryProducts}
            rowKey="productId"
            pagination={false}
          />
        ) : (
          <p>Không có sản phẩm nào thuộc nhà cung cấp này.</p>
        )}
        <Button type="primary" htmlType="submit">Nhập kho</Button>
        <Button onClick={onCancel}>Hủy</Button>
      </form>
    </div>
  );
};

export default WarehouseEntryForm;
