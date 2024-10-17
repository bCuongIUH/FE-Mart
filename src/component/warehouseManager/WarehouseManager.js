import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Input } from 'antd';
import { getAllProducts, getAllSuppliers, getAllUsers, getAllWarehouse } from '../../untills/api';
import WarehouseEntryForm from './NhapKhoDetail';
import { AuthContext } from '../../untills/context/AuthContext';
import './WarehouseManager.module.css';

const NhapKho = () => {
  const { user } = useContext(AuthContext);
  const [warehouseEntries, setWarehouseEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [enteredBy, setEnteredBy] = useState(user ? user._id : '');
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  
  // Fetch các phiếu nhập kho
  useEffect(() => {
    const fetchWarehouseEntries = async () => {
      try {
        const data = await getAllWarehouse();
        setWarehouseEntries(data);
      } catch (error) {
        console.error('Lỗi khi lấy phiếu nhập kho:', error);
      }
    };
    fetchWarehouseEntries();
  }, []);

  // Fetch sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu sản phẩm');
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch người dùng
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

  // Fetch nhà cung cấp
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

  const getSupplierNameById = (id) => {
    const supplier = suppliers.find(supplier => supplier._id === id);
    return supplier ? supplier.name : 'Không có nhà cung cấp';
  };

  // Hàm tìm tên người dùng từ danh sách users
  const getUserNameById = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.fullName : 'Không xác định';
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(7);

  const expandedRowRender = (record) => {
    const { products } = record;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    return (
      <>
        <Table
          columns={[
            {
              title: 'Mã sản phẩm',
              render: (text, product) => {
                const { code } = getProductDetails(product.productId);
                return code;
              },
              onHeaderCell: () => ({
                style: {
                  backgroundColor: '#ffc4a4',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
            },
            {
              title: 'Tên sản phẩm',
              render: (text, product) => {
                const { name } = getProductDetails(product.productId);
                return name;
              },
              onHeaderCell: () => ({
                style: {
                  backgroundColor: '#ffc4a4',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
            },
            {
              title: 'Hình ảnh',
              render: (text, product) => {
                const productDetails = getProductDetails(product.productId);
                return productDetails && productDetails.image ? (
                  <img
                    src={productDetails.image}
                    alt={productDetails.name}
                    style={{ width: '50px', height: '50px' }}
                  />
                ) : (
                  <span>Không có hình</span>
                );
              },
              onHeaderCell: () => ({
                style: {
                  backgroundColor: '#ffc4a4',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
            },
            {
              title: 'Số lượng',
              dataIndex: 'quantity',
              onHeaderCell: () => ({
                style: {
                  backgroundColor: '#ffc4a4',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
            },
            {
              title: 'Giá nhập',
              dataIndex: 'price',
              onHeaderCell: () => ({
                style: {
                  backgroundColor: '#ffc4a4',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
            },
          ]}
          dataSource={currentProducts}
          pagination={false} // Tắt phân trang mặc định
          rowKey="productId"
        />
        <div style={{ marginTop: 16 }}>
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trang trước
          </Button>
          <span style={{ margin: '0 8px' }}>
            Trang {currentPage} của {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Trang sau
          </Button>
        </div>
      </>
    );
  };

  // Hàm lấy thông tin chung của sản phẩm
  const getProductDetails = (productId) => {
    const product = products.find((item) => item._id === productId);
    return product ? { name: product.name, code: product.code, image: product.image } : { name: 'Không tìm thấy', code: 'Không tìm thấy', image: null };
  };

  return (
    <div>
      {showAddEntry ? (
        <WarehouseEntryForm onCancel={() => setShowAddEntry(false)} />
      ) : (
        <>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Input
              placeholder="Tìm kiếm sản phẩm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 500 }}
            />
            <Button type="primary" onClick={() => setShowAddEntry(true)}>
              Tạo phiếu nhập kho mới
            </Button>
          </div>
          <h3>Danh sách phiếu nhập kho:</h3>
          <Table
            columns={[
              {
                title: 'Mã phiếu',
                dataIndex: 'entryCode',
                onHeaderCell: () => ({
                  style: {
                    backgroundColor: '#F5F5DC',
                    color: '#333',
                    fontWeight: 'bold',
                  },
                }),
              },
              {
                title: 'Nhà cung cấp',
                dataIndex: 'supplier',
                render: (supplierId, record) => {
                  return getSupplierNameById(supplierId);
                },
                onHeaderCell: () => ({
                  style: {
                    backgroundColor: '#F5F5DC',
                    color: '#333',
                    fontWeight: 'bold',
                  },
                }),
              },
              {
                title: 'Người nhập',
                dataIndex: 'enteredBy',
                render: (enteredBy) => getUserNameById(enteredBy),
                onHeaderCell: () => ({
                  style: {
                    backgroundColor: '#F5F5DC',
                    color: '#333',
                    fontWeight: 'bold',
                  },
                }),
              },
              {
                title: 'Ngày nhập',
                dataIndex: 'createdAt',
                render: (text) => new Date(text).toLocaleString(),
                onHeaderCell: () => ({
                  style: {
                    backgroundColor: '#F5F5DC',
                    color: '#333',
                    fontWeight: 'bold',
                  },
                }),
              },
            ]}
            dataSource={warehouseEntries}
            rowKey="_id"
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => record.products && record.products.length > 0,
            }}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default NhapKho;
