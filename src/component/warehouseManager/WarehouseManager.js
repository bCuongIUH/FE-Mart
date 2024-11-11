import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Input, message } from 'antd';
import { getAllProducts, getAllSuppliers, getAllUsers, getAllWarehouse, createWarehouseEntry } from '../../untills/api';
import WarehouseEntryForm from './NhapKhoDetail';
import WarehouseEntryDetailModal from './WarehouseEntryDetailModal';
import { AuthContext } from '../../untills/context/AuthContext';
import './WarehouseManager.module.css';
import Title from 'antd/es/typography/Title';

const NhapKho = () => {
  const { user } = useContext(AuthContext);
  const [warehouseEntries, setWarehouseEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [enteredBy, setEnteredBy] = useState(user ? user._id : '');
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

   // Hàm để lấy dữ liệu phiếu nhập kho
   const fetchWarehouseEntries = async () => {
    try {
      const data = await getAllWarehouse();
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setWarehouseEntries(sortedData);
      setFilteredEntries(sortedData); 
    } catch (error) {
      console.error('Lỗi khi lấy phiếu nhập kho:', error);
    }
  };

  useEffect(() => {
    fetchWarehouseEntries();
  }, []);

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

  const handleAddEntry = async (entryData) => {
    try {
      const response = await createWarehouseEntry(entryData);
      message.success(response.message);

      setWarehouseEntries(prevEntries => {
        const updatedEntries = [response.warehouseEntry, ...prevEntries];
        return updatedEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
      });
      
      setFilteredEntries(prevEntries => [response.warehouseEntry, ...prevEntries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      
      setShowAddEntry(false);
    } catch (error) {
      message.error(error.response?.data?.message || 'Lỗi khi tạo phiếu nhập kho');
    }
  };

  const showDetail = (entry) => {
    setSelectedEntry(entry); 
    setIsModalVisible(true); 
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = warehouseEntries.filter(entry => 
      entry.entryCode.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEntries(filtered);
  };

  return (
    <div>
      <Title style={{ fontWeight: 'bold', fontStyle: 'italic' }} level={2}>Quản lí nhập kho</Title>
      {showAddEntry ? (
        <WarehouseEntryForm 
          onCancel={() => setShowAddEntry(false)} 
          onCreate={handleAddEntry} 
          suppliers={suppliers} 
          products={products} 
          enteredBy={enteredBy}
          onEntryCreated={fetchWarehouseEntries}  
        />
      ) : (
        <>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Input
              placeholder="Tìm kiếm phiếu nhập kho"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
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

          <WarehouseEntryDetailModal
              visible={isModalVisible}
              onCancel={() => {
                setIsModalVisible(false);
                setSelectedEntry(null);
              }}
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
