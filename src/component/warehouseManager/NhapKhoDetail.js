import React, { useState, useEffect, useContext } from 'react';
import { getAllSuppliers, getProductsBySupplier, createWarehouseEntry, getAllUsers } from '../../untills/api';
import { AuthContext } from '../../untills/context/AuthContext';
import { Table, Input, Select, Button } from 'antd';
const { Option } = Select;

const WarehouseEntryForm = ({ onCancel }) => {
  const { user } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [products, setProducts] = useState([]);
  const [entryCode, setEntryCode] = useState('');
  const [entryProducts, setEntryProducts] = useState([]);
  const [enteredBy, setEnteredBy] = useState(user._id || '');

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out products with quantity <= 0 or price <= 0
    const validProducts = entryProducts.filter(product => product.quantity > 0 && product.price > 0);

    if (validProducts.length === 0) {
      console.error('Không có sản phẩm hợp lệ để tạo phiếu nhập kho.');
      return;
    }

    const entryData = {
      entryCode,
      enteredBy: user._id,
      supplierId: selectedSupplierId,
      products: validProducts,
    };

    try {
      const result = await createWarehouseEntry(entryData);
      console.log('Kết quả từ API:', result);
      onCancel(); // Close form after creating entry
    } catch (error) {
      console.error('Lỗi khi tạo phiếu nhập kho:', error);
    }
  };

  const handleProductChange = (productId, quantity, price) => {
    const updatedProducts = entryProducts.map((p) =>
      p.productId === productId ? { ...p, quantity: quantity || 0, price: price || 0 } : p
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
                title: 'STT',
                render: (text, product, index) => index + 1,
              },
              {
                title: 'Mã SP',
                dataIndex: 'productId',
                render: (text, product) => {
                  const productDetails = products.find(item => item._id === product.productId);
                  return <span>{productDetails ? productDetails.code : 'Không có mã'}</span>;
                },
              },
              {
                title: 'Hình ảnh',
                dataIndex: 'productId',
                render: (text, product) => {
                  const productDetails = products.find(item => item._id === product.productId);
                  return productDetails ? (
                    <img src={productDetails.image} alt={productDetails.name} style={{ width: '50px', height: '50px' }} />
                  ) : (
                    <span>Không có hình</span>
                  );
                },
              },
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
                    onChange={(e) => handleProductChange(product.productId, product.quantity, e.target.value)}
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
                    onChange={(e) => handleProductChange(product.productId, e.target.value, product.price)}
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
