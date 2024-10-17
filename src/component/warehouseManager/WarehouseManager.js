import React, { useEffect, useState, useContext } from 'react';
import { getAllSuppliers, getProductsBySupplier, createWarehouseEntry, getAllWarehouse, getAllUsers, getAllProducts } from '../../untills/api';
import { AuthContext } from '../../untills/context/AuthContext';
import { Table, Input, Select, Button, Drawer, Modal } from 'antd';
const { Option } = Select;


const initialWarehouseEntry = {
  entryCode: '',        
  supplierId: '',       
  enteredBy: '',      
  totalAmount: 0,       
  products: [],        
 
};

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
  const [warehouseEntry, setWarehouseEntry] = useState(initialWarehouseEntry);
  const [error, setError] = useState(null);
 
  

  const resetEntryForm = () => {
    setWarehouseEntry(initialWarehouseEntry); 
  };
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

  const handleProductChange = (productId, quantity, price) => {
    // Kiểm tra xem sản phẩm có tồn tại trong danh sách không
    const productExists = products.find(product => product._id === productId);
    if (!productExists) {
      console.error(`Product with ID ${productId} not found`);
      return;
    }
  
    const updatedProducts = entryProducts.map((p) =>
      p.productId === productId ? { ...p, quantity: quantity || 0, price: price || 0 } : p
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

  //l lấy sản phẩm
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
// hàm lấy thông tin chung của sp
  const getProductDetails = (productId) => {
    const product = products.find((item) => item._id === productId); 
    return product ? { name: product.name, code: product.code, image: product.image } : { name: 'Không tìm thấy', code: 'Không tìm thấy', image: null };
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
                      render: (text, product) => {
                        const { code } = getProductDetails(product.productId);
                        return code;
                      },
                    },
                     {
                      title: 'Tên sản phẩm',
                      render: (text, product) => {
                        const { name } = getProductDetails(product.productId);
                        return name;
                      },
                    },
                    {
                      title: 'Hình ảnh',
                      render: (text, product) => {
                        const { image } = getProductDetails(product.productId);
                        return image ? <img src={image} alt={product.productId} style={{ width: 50, height: 50 }} /> : null;
                      },
                    },
                     {
                       title: 'Số lượng',
                       dataIndex: 'quantity',
                     },
                     {
                       title: 'Giá nhập',
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
        style={{ position: 'fixed', top: 70, right: 20 }}
        onClick={() => {
          resetEntryForm(); // Reset form trước khi hiển thị
          setShowEntryForm(true);
        }}
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
          <Table
          columns={[
            {
              title: 'Mã sản phẩm',
              render: (text, product) => {
                const { code } = getProductDetails(product.productId);
                return <span>{code}</span>;
              },
            },
            {
              title: 'Tên sản phẩm',
              dataIndex: 'productId',
              render: (text, product) => {
                const productDetails = getProductDetails(product.productId);
                return <span>{productDetails.name || 'Không có tên'}</span>;
              },
            },
            {
              title: 'Hình ảnh',
              render: (text, product) => {
                const { image } = getProductDetails(product.productId);
                return image ? (
                  <img src={image} alt={product.productId} style={{ width: 50, height: 50 }} />
                ) : (
                  <span>Không có hình</span>
                );
              },
            },
            {
              title: 'Giá nhập',
              dataIndex: 'price',
              render: (text, product) => (
                <Input
                  type="number"
                  min={0}
                  onChange={(e) => handleProductChange(product.productId, product.quantity, e.target.value)} // Chú ý ở đây
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
                  onChange={(e) => handleProductChange(product.productId, e.target.value, product.price)} // Chú ý ở đây
                />
              ),
            },
          ]}
          dataSource={entryProducts}
          rowKey="productId"
          pagination={{
            pageSize: 6, // Số sản phẩm hiển thị trên mỗi trang
            showSizeChanger: true, // Cho phép thay đổi số lượng sản phẩm hiển thị
            pageSizeOptions: ['10', '20', '30'], // Các tùy chọn số sản phẩm trên mỗi trang
            showTotal: (total) => `Tổng ${total} sản phẩm`, // Hiển thị tổng số sản phẩm
          }}
        />
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