import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Dropdown, Menu, Tag } from 'antd'; 
import { getAllProducts } from '../../untills/api';
import NhapHangInput from './NhapHangInput';
import AddProduct from './AddProduct'; 
import ProductDetail from './ProductDetail'; 

const ProductPage = () => {
  const [data, setData] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [isAddingProduct, setIsAddingProduct] = useState(false); 
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); 
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); 

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
            barcode: product.barcode,
            nameProduct: product.name,
            description: product.description,
            image: product.image,
            category: product.category,
            quantity: product.quantity || 0, 
            price: product.price,
            isAvailable: product.isAvailable,
            lines: product.lines,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
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
      setSelectedRowKeys([]); 
      setSelectedProducts([]);
    } else if (key === "2") { // Nhập hàng
      const selectedItems = data.filter(item => selectedRowKeys.includes(item.key));
      setSelectedProducts(selectedItems);
      setIsAddingProduct(true);
    }
  };
  
  const handleCancel = () => {
    setIsAddingProduct(false);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Bỏ chọn</Menu.Item>
      <Menu.Item key="2">Nhập hàng</Menu.Item>
    </Menu>
  );

  const handleAddNewProduct = () => {
    setIsAddingNewProduct(true); 
  };


  const handleRowClick = (record) => {
    setSelectedProduct(record); 
  };


  const handleBackToList = () => {
    setSelectedProduct(null); 
  };

  return (
    <>
      {isAddingNewProduct ? ( 
        <AddProduct onCancel={() => setIsAddingNewProduct(false)} /> 
      ) : isAddingProduct ? (
        <NhapHangInput selectedProducts={selectedProducts} onCancel={handleCancel} />
      ) : selectedProduct ? (
        <ProductDetail product={selectedProduct} onBack={handleBackToList} />
      ) : (
        <>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Input 
              placeholder="Tìm kiếm sản phẩm" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ width: 500 }} 
            />
            <Button type="primary" onClick={handleAddNewProduct}>
              Thêm sản phẩm
            </Button>
          </div>
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
            onRow={(record) => ({
              onClick: () => handleRowClick(record), // Khi nhấn vào hàng nào, gọi handleRowClick
            })}
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

export default ProductPage;
