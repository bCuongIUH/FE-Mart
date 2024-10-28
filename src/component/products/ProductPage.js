import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Dropdown, Menu, Tag, message } from 'antd'; 
import { getAllProducts, getCategories } from '../../untills/api';
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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (Array.isArray(response.categories)) {
          setCategories(response.categories);
        } else {
          // message.error('Dữ liệu danh mục không hợp lệ!');
        }
      } catch (error) {
        // message.error('Lỗi khi lấy danh mục: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
      }
    };

    fetchCategories();
  }, []);
  
  // Lấy danh sách sản phẩm
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
        
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        // message.error('Lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);
console.log("2",products);


  // Lấy sản phẩm và định dạng dữ liệu
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts(); 
        console.log('Fetched Products:', productsData);

        const formattedData = productsData.map((product) => {
          let status = { text: 'Hết hàng', color: 'red' };
          if (product.quantity > 20) {
            status = { text: 'Còn hàng', color: 'green' };
          } else if (product.quantity > 0) {
            status = { text: 'Sắp hết', color: 'orange' };
          }

          const today = new Date();
          let currentPrice = product.currentPrice;

          if (product.priceRanges && product.priceRanges.length > 0) {
            const validRange = product.priceRanges.find(range => {
              const startDate = new Date(range.startDate);
              const endDate = new Date(range.endDate);
              return today >= startDate && today <= endDate && range.isActive; 
            });
            console.log(`Valid Range for ${product.name}: `, validRange);

           if (validRange) {
            currentPrice = validRange.currentPrice;
          }
        }
         
          return {
            key: product._id, // thêm để chọn sp 
            ...product, 
            currentPrice: currentPrice, 
            status: status 
          };
        });
        console.log(productsData);


        // Cập nhật lại state với dữ liệu đã xử lý
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Hàm để cập nhật giá sản phẩm
  const updateProductPrice = (productId, newPrice) => {
    setData(prevData =>
      prevData.map(product => 
        product._id === productId ? { ...product, price: newPrice } : product
      )
    );
  };

  const handleMenuClick = ({ key }) => {
    if (key === "1") { 
      setSelectedRowKeys([]); 
      setSelectedProducts([]); 
    } else if (key === "2") { 
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

  // Hàm để xử lý khi nhập hàng thành công
  const handlePriceUpdate = (productId, newPrice) => {
    updateProductPrice(productId, newPrice);
    message.success('Cập nhật giá thành công!');
  };

  //quy đổi giá
  // function formatPriceInVND(price) {
  //   if (typeof price !== 'number') {
  //     return '0 đ'; 
  //   }
  //   return price.toLocaleString('vi-VN') + ' đ';
  // }
  return (
    <>
      {isAddingNewProduct ? ( 
        <AddProduct onCancel={() => setIsAddingNewProduct(false)} /> 
      ) : isAddingProduct ? (
        <NhapHangInput 
          selectedProducts={selectedProducts} 
          onCancel={handleCancel} 
          onPriceUpdate={handlePriceUpdate} 
        />
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
            
              // type: 'checkbox', 
            }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            columns={[ 
              { title: 'Mã', dataIndex: 'code', key: 'code' },
              { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
              { 
                title: 'Loại sản phẩm', 
                dataIndex: 'category', 
                key: 'category',
                render: (categoryId) => {
                  const category = categories.find(cat => cat._id === categoryId);
                  return category ? category.name : 'Không xác định';
                },
              },
              { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
              { 
                title: 'Trạng thái', 
                dataIndex: 'status', 
                key: 'status',
                render: (status) => <Tag color={status.color}>{status.text}</Tag> 
              },
              // { 
              //   title: 'Giá', 
              //   dataIndex: 'currentPrice', 
              //   key: 'currentPrice',
              //   render: (value) => formatPriceInVND(value),
              // }, 
            ]}
            dataSource={data.filter(item => item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()))}
          />
        </>
      )}
    </>
  );
};

export default ProductPage;
