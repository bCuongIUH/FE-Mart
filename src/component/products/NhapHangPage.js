import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Dropdown, Menu, Tag } from 'antd'; 
import { getAllProducts } from '../../untills/api';

import NhapHangInput from './NhapHangInput';
import AddProduct from './AddProduct';

const NhapHangPage = () => {
  const [data, setData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isAddingProduct, setIsAddingProduct] = useState(false); 
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        const formattedData = products.map((product) => {
          let status = { text: 'Hết hàng', color: 'red' }; 
          if (product.quantity > 20) {
            status = { text: 'Còn hàng', color: 'green' };
          } else if (product.quantity > 0) {
            status = { text: 'Sắp hết', color: 'orange' };
          }
          return {
            key: product._id,
            code: product.code,
            nameProduct: product.name,
            quantity: product.quantity || 0, 
            status: status,
          };
        });
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

 
  const handleMenuClick = ({ key }) => {
    if (key === "1") { 
      const selectedItems = data.filter(item => selectedRowKeys.includes(item.key));
      setSelectedProducts(selectedItems);
      setIsAddingProduct(true); 
      
      
    }
  };

  const handleCancel = () => {
    setIsAddingProduct(false); 
  };

  // Hàm xử lý chọn checkbox
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // Menu tùy chọn
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Nhập hàng</Menu.Item>
      <Menu.Item key="2">Chức năng 2</Menu.Item>
      <Menu.Item key="3">Chức năng 3</Menu.Item>
      <Menu.Item key="4">Chức năng 4</Menu.Item>
      <Menu.Item key="5">Chức năng 5</Menu.Item>
    </Menu>
  );

  // Render nội dung chính
  return (
    <>
      {!isAddingProduct && ( 
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Input 
            placeholder="Tìm kiếm sản phẩm" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ width: 500 }} 
          />
        </div>
      )}

      {isAddingProduct ? (
        <NhapHangInput selectedProducts={selectedProducts} onCancel={handleCancel} /> 
      ) : (
        <>
          {selectedRowKeys.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Dropdown overlay={menu} trigger={['click']}>
                <Button type="primary">
                  Thao tác <span style={{ marginLeft: 8 }}>▼</span>
                </Button>
              </Dropdown>
            </div>
          )}
          
          <Table 
            rowSelection={{
              selectedRowKeys,
              onChange: onSelectChange,
            }}
            columns={[
              { title: 'Mã', dataIndex: 'code', key: 'code' },
              { title: 'Tên sản phẩm', dataIndex: 'nameProduct', key: 'nameProduct' },
              { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
              { 
                title: 'Trạng thái', 
                dataIndex: 'status', 
                key: 'status',
                render: (status) => <Tag color={status.color}>{status.text}</Tag> 
              },
            ]}
            dataSource={data.filter(item => item.nameProduct.toLowerCase().includes(searchTerm.toLowerCase()))}
          />
        </>
      )}
    </>
  );
};

export default NhapHangPage;
