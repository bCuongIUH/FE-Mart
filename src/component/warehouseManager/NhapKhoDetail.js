import React, { useState, useEffect, useContext } from 'react';
import { getAllSuppliers, getProductsBySupplier, createWarehouseEntry } from '../../untills/api';
import { AuthContext } from '../../untills/context/AuthContext';
import { Table, Input, Select, Button, message } from 'antd';
const { Option } = Select;

const WarehouseEntryForm = ({ onCancel }) => {
  const { user } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [products, setProducts] = useState([]);
  const [entryCode, setEntryCode] = useState('');
  const [entryProducts, setEntryProducts] = useState([]);
  const [enteredBy] = useState(user._id || '');

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
          setEntryProducts(data.map(product => ({ productId: product._id, quantity: 0, price: product.price || 0 }))); // Initialize price
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

    // Filter products with quantity > 0
    const validProducts = entryProducts.filter(product => product.quantity > 0);

    if (validProducts.length === 0) {
      message.warning('Không có sản phẩm hợp lệ để tạo phiếu nhập kho.');
      return;
    }

    const entryData = {
      entryCode,
      enteredBy,
      supplierId: selectedSupplierId,
      products: validProducts,
    };

    try {
      const result = await createWarehouseEntry(entryData);
      message.success('Nhập kho thành công!');
      console.log('Kết quả từ API:', result);
      onCancel(); // Close form after creating entry
    } catch (error) {
      message.error('Lỗi khi tạo phiếu nhập kho.');
      console.error('Lỗi khi tạo phiếu nhập kho:', error);
    }
  };

  const handleProductChange = (productId, quantity, price) => {
    const updatedProducts = entryProducts.map((p) =>
      p.productId === productId 
        ? { ...p, quantity: quantity !== undefined ? quantity : p.quantity, price: price !== undefined ? price : p.price } 
        : p
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
                title: 'Số lượng tồn kho',
                dataIndex: 'productId',
                render: (text, product) => {
                  const productDetails = products.find(item => item._id === product.productId);
                  return <span>{productDetails ? productDetails.quantity : 'Không có số lượng'}</span>;
                },
              },
              {
                title: 'Giá nhập',
                dataIndex: 'price',
                render: (text, product) => (
                  <Input
                    type="number"
                    min={0}
                    value={entryProducts.find(p => p.productId === product.productId)?.price || 0}
                    onChange={(e) => handleProductChange(product.productId, undefined, e.target.value)}
                  />
                ),
              },
              {
                title: 'Số lượng nhập',
                dataIndex: 'quantity',
                render: (text, product) => (
                  <Input
                    type="number"
                    min={0}
                    value={entryProducts.find(p => p.productId === product.productId)?.quantity}
                    onChange={(e) => handleProductChange(product.productId, e.target.value)}
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
