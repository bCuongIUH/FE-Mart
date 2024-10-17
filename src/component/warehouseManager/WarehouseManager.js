import React, { useEffect, useState, useContext } from 'react';
import { getAllSuppliers, getProductsBySupplier, createWarehouseEntry, getAllWarehouse, getAllUsers } from '../../untills/api';
import { AuthContext } from '../../untills/context/AuthContext';
import { Table, Input, Select, Button, Drawer, Modal } from 'antd';
const { Option } = Select;

const NhapKho = () => {
  const { user } = useContext(AuthContext);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [products, setProducts] = useState([]);
  const [entryCode, setEntryCode] = useState('');
  const [entryProducts, setEntryProducts] = useState([]);
  const [enteredBy, setEnteredBy] = useState(user._id || '');
  const [warehouseEntries, setWarehouseEntries] = useState([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [users, setUsers] = useState([]);

  // Fetch suppliers
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

  // Fetch products by selected supplier
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

  // Fetch warehouse entries
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const entryData = {
      entryCode,
      enteredBy: user._id,
      supplierId: selectedSupplierId,
      products: entryProducts,
    };

    console.log('Dữ liệu nhập kho:', entryData);
    try {
      const result = await createWarehouseEntry(entryData);
      console.log('Kết quả từ API:', result);
      setEntryCode('');
      setSelectedSupplierId('');
      setEntryProducts([]);
      setShowEntryForm(false);
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

  const columns = [
    {
      title: 'Mã phiếu',
      dataIndex: 'entryCode',
    },
    {
      title: 'Người nhập',
      dataIndex: 'enteredBy',
      render: (enteredBy) => getUserNameById(enteredBy),
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

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

  // Hàm tìm tên người dùng từ danh sách users
  const getUserNameById = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.fullName : 'Không xác định';
  };

  return (
    <div>
      {!showEntryForm && (
       <div>
       {!showEntryForm && (
         <>
           <h3>Danh sách phiếu nhập kho:</h3>
           <Table
             columns={columns}
             dataSource={warehouseEntries}
             rowKey="_id"
             pagination={false}
             expandable={{
               expandedRowRender: record => (
                 <Table
                   columns={[
                     {
                       title: 'Mã sản phẩm',
                       dataIndex: 'productId',
                     },
                     {
                       title: 'Số lượng',
                       dataIndex: 'quantity',
                     },
                     {
                       title: 'Giá',
                       dataIndex: 'price',
                     },
                   ]}
                   dataSource={record.products}
                   pagination={false}
                   rowKey="productId" 
                 />
               ),
               rowExpandable: record => true, 
             }}
           />
         </>
       )}
     </div>
     
      )}
      <Button
        type="primary"
        style={{ position: 'fixed', top: 100, right: 20 }}
        onClick={() => setShowEntryForm(true)}
      >
        Tạo phiếu nhập kho mới
      </Button>

      <Modal
        width={1000}
        title="Tạo phiếu nhập kho mới"
        visible={showEntryForm}
        onCancel={() => setShowEntryForm(false)}
        footer={null}
        centered
      >
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
            <Table columns={columns} dataSource={products} rowKey="_id" pagination={false} />
          ) : (
            <p>Không có sản phẩm nào thuộc nhà cung cấp này.</p>
          )}
          <Button type="primary" htmlType="submit">Nhập kho</Button>
        </form>
      </Modal>
    </div>
  );
};

export default NhapKho;
