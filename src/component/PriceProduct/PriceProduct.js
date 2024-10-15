import React, { useEffect, useState } from 'react';
import { Table, Input, Button, DatePicker, message, Spin } from 'antd';
import { getAllProducts, createPriceList, getAllPriceLists } from '../../untills/api';
const PriceListManager = () => {
  const [products, setProducts] = useState([]);
  const [priceLists, setPriceLists] = useState([]);
  const [newPriceList, setNewPriceList] = useState({
    code: '',
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    async function fetchAllProducts() {
      try {
        const products = await getAllProducts();
        setProducts(products);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    }

    async function fetchAllPriceLists() {
      try {
        const priceListsData = await getAllPriceLists();
        setPriceLists(priceListsData.priceLists || []); 
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bảng giá:', error);
      }
    }

    fetchAllProducts();
    fetchAllPriceLists(); 
  }, []);

   const handleAddPriceList = async () => {
    try {
      const formattedPriceList = {
        ...newPriceList,
        startDate: newPriceList.startDate ? newPriceList.startDate.toISOString() : null,
        endDate: newPriceList.endDate ? newPriceList.endDate.toISOString() : null,
      };
      const response = await createPriceList(formattedPriceList);
      if (response.success) {
        setPriceLists((prevLists) => [...prevLists, response.priceList]);
        setNewPriceList({
          code: '',
          name: '',
          description: '',
          startDate: null,
          endDate: null,
          isActive: true,
        });
        message.success('Price list created successfully!');
      } else {
        message.error('Failed to create price list.');
      }
    } catch (error) {
      message.error('Failed to create price list.');
    }
  };


  const handlePriceChange = (productId, value) => {
    // Hàm xử lý thay đổi giá...
  };

  const expandedRowRender = (record) => {
    return (
      <div>
        <h4>Danh sách sản phẩm</h4>
        <Table
          dataSource={products.map(product => ({
            key: product._id,
            code: product.code,
            name: product.name,
            image: product.image,
          }))}
          columns={[
            {
              title: 'Mã sản phẩm',
              dataIndex: 'code',
              key: 'code',
            },
            {
              title: 'Tên sản phẩm',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Hình ảnh',
              dataIndex: 'image',
              key: 'image',
              render: (image) => <img src={image} alt="product" style={{ width: 50 }} />,
            },
            {
              title: 'Gía',
              key: 'newPrice',
              render: (text, product) => (
                <Input
                  type="number"
                  placeholder="Nhập giá"
                  onChange={(e) => handlePriceChange(product.key, e.target.value)}
                />
              ),
            },
          ]}
          pagination={false}
        />
      </div>
    );
  };

  return (
    <>
      <h2>Quản lý Bảng Giá</h2>
      {/* Phần nhập liệu thêm bảng giá */}
      <Input
        placeholder="Mã bảng giá"
        value={newPriceList.code}
        onChange={(e) => setNewPriceList({ ...newPriceList, code: e.target.value })}
      />
      <Input
        placeholder="Tên bảng giá"
        value={newPriceList.name}
        onChange={(e) => setNewPriceList({ ...newPriceList, name: e.target.value })}
      />
      <Input
        placeholder="Mô tả"
        value={newPriceList.description}
        onChange={(e) => setNewPriceList({ ...newPriceList, description: e.target.value })}
      />
      <DatePicker
        placeholder="Ngày bắt đầu"
        onChange={(date) => setNewPriceList({ ...newPriceList, startDate: date })}
      />
      <DatePicker
        placeholder="Ngày kết thúc"
        onChange={(date) => setNewPriceList({ ...newPriceList, endDate: date })}
      />
      <Button onClick={handleAddPriceList}>Thêm bảng giá</Button>

      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Table
          dataSource={priceLists.map((list) => ({
            key: list._id,
            code: list.code,
            name: list.name,
            description: list.description,
            startDate: list.startDate,
            endDate: list.endDate,
            isActive: list.isActive,
          }))}
          columns={[
            {
              title: 'STT',
              render: (text, record, index) => index + 1,
            },
            {
              title: 'Mã bảng giá',
              dataIndex: 'code',
              key: 'code',
            },
            {
              title: 'Tên bảng giá',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Mô tả',
              dataIndex: 'description',
              key: 'description',
            },
            {
              title: 'Ngày bắt đầu',
              dataIndex: 'startDate',
              key: 'startDate',
              render: (date) => new Date(date).toLocaleDateString(),
            },
            {
              title: 'Ngày kết thúc',
              dataIndex: 'endDate',
              key: 'endDate',
              render: (date) => new Date(date).toLocaleDateString(),
            },
            {
              title: 'Trạng thái',
              dataIndex: 'isActive',
              key: 'isActive',
              render: (isActive) => (isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'),
            },
          ]}
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => true,
          }}
        />
      )}
    </>
  );
};

export default PriceListManager;
