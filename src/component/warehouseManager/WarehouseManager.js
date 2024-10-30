import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Input, message } from 'antd';
import { getAllProducts, getAllSuppliers, getAllUsers, getAllWarehouse, createWarehouseEntry } from '../../untills/api';
import WarehouseEntryForm from './NhapKhoDetail';
import WarehouseEntryDetailModal from './WarehouseEntryDetailModal';
import { AuthContext } from '../../untills/context/AuthContext';
import './WarehouseManager.module.css';

const NhapKho = () => {
  const { user } = useContext(AuthContext);
  const [warehouseEntries, setWarehouseEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
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
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setWarehouseEntries(sortedData);
        setFilteredEntries(sortedData); // Khởi tạo danh sách đã lọc
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

  const getUserNameById = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.fullName : 'Không xác định';
  };

  // Thêm phiếu nhập kho
  const handleAddEntry = async (entryData) => {
    try {
      const response = await createWarehouseEntry(entryData);
      message.success(response.message);

      // Thêm phiếu nhập kho mới vào đầu danh sách và sắp xếp lại
      setWarehouseEntries(prevEntries => {
        const updatedEntries = [response.warehouseEntry, ...prevEntries];
        return updatedEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp mới nhất lên đầu
      });
      
      // Cập nhật danh sách đã lọc
      setFilteredEntries(prevEntries => [response.warehouseEntry, ...prevEntries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
      setShowAddEntry(false);
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi tạo phiếu nhập kho');
    }
  };

  // Hàm để mở modal chi tiết
  const showDetail = (entry) => {
    setSelectedEntry(entry);
    setShowDetailModal(true);
  };

  // Hàm lọc danh sách theo mã phiếu
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = warehouseEntries.filter(entry => 
      entry.entryCode.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEntries(filtered);
  };

  return (
    <div>
      {showAddEntry ? (
        <WarehouseEntryForm 
          onCancel={() => setShowAddEntry(false)} 
          onCreate={handleAddEntry} 
          suppliers={suppliers} 
          products={products} 
          enteredBy={enteredBy} 
        />
      ) : (
        <>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Input
              placeholder="Tìm kiếm phiếu nhập kho"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)} // Gọi hàm lọc khi thay đổi
              style={{ width: 500 }}
            />
            <Button type="primary" onClick={() => setShowAddEntry(true)}
                 style={{ marginTop: 16 }}
                 danger
              >
              Tạo phiếu nhập kho mới
            </Button>
          </div>
       
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
              dataSource={filteredEntries} 
              rowKey="_id"
              onRow={(record) => ({
                onClick: () => showDetail(record), 
              })}
            />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          {/* Hiển thị modal chi tiết */}
          <WarehouseEntryDetailModal 
                visible={showDetailModal} 
                onCancel={() => setShowDetailModal(false)} 
                entry={selectedEntry} 
                getSupplierNameById={getSupplierNameById} 
                getUserNameById={getUserNameById} 
                products={products}
              />
        </>
      )}
    </div>
  );
};

export default NhapKho;
