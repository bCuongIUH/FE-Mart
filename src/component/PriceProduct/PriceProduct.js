import React, { useEffect, useState } from 'react';
import { Table, Input, Button, DatePicker, message, Spin, Switch, Tag } from 'antd';
import { getAllProducts, createPriceList, getAllPriceLists, addPricesToPriceList, activatePriceList, deactivatePriceList, getPriceListById } from '../../untills/api';
import { SaveOutlined } from '@ant-design/icons';

const PriceProduct = () => {
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
  const [productPrices, setProductPrices] = useState({});
  const [showPriceListForm, setShowPriceListForm] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);

        const priceListsData = await getAllPriceLists();
        setPriceLists(priceListsData.priceLists || []);
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Error loading data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
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
        setProductPrices({});
        setShowPriceListForm(false);
        message.success('Price list created successfully!');
      } else {
        message.error('Failed to create price list.');
      }
    } catch (error) {
      message.error('Failed to create price list.');
    }
  };

  const handlePriceChange = (productId, value) => {
    setProductPrices((prevPrices) => ({
      ...prevPrices,
      [productId]: value,
    }));
  };

  const handleSavePrices = async (priceListId) => {
    const pricesToUpdate = Object.entries(productPrices).map(([productId, price]) => ({
      productId,
      price: Number(price),
    }));

    const payload = {
      priceListId,
      products: pricesToUpdate,
    };

    try {
      const response = await addPricesToPriceList(priceListId, pricesToUpdate);
      if (response.success) {
        message.success('Prices updated successfully!');
        setProductPrices({});
      } else {
        message.error('Failed to update prices.');
      }
    } catch (error) {
      console.error('Error updating prices:', error);
      message.error('Failed to update prices.');
    }
  };

  const handleToggleActive = async (priceListId) => {
    try {
      const priceList = await getPriceListById(priceListId); // Lấy thông tin bảng giá từ API
  
      if (priceList.isActive) {
        // Nếu bảng giá đang hoạt động, yêu cầu hủy kích hoạt
        await deactivatePriceList(priceListId);
        message.success('Bảng giá đã được hủy kích hoạt thành công!');
      } else {
       
        const activePriceList = priceLists.find((list) => list.isActive);
        if (activePriceList) {
          message.error('Không thể kích hoạt bảng giá vì đã có bảng giá khác đang hoạt động!');
          return; 
        }
        // Kích hoạt bảng giá
        await activatePriceList(priceListId);
        message.success('Bảng giá đã được kích hoạt thành công!');
      }
  
     
      setPriceLists((prevLists) =>
        prevLists.map((list) => (list._id === priceListId ? { ...list, isActive: !list.isActive } : list))
      );
    } catch (error) {
      // Hiển thị thông báo lỗi
      console.error('Error toggling price list status:', error);
      message.error(error.response?.data?.message || 'Đã xảy ra lỗi khi thay đổi trạng thái bảng giá.');
    }
  };
  

  const expandedRowRender = (record) => {
    const productPricesForList = record.products.reduce((acc, product) => {
      acc[product.productId] = product.price;
      return acc;
    }, {});

    return (
      <div>
        <h4>Product List</h4>
        <Table
          dataSource={products.map((product) => ({
            key: product._id,
            code: product.code,
            name: product.name,
            image: product.image,
            currentPrice: productPricesForList[product._id] || product.currentPrice,
            newPrice: productPricesForList[product._id] || '',
          }))}
          columns={[
            {
              title: 'Product Code',
              dataIndex: 'code',
              key: 'code',
            },
            {
              title: 'Product Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: 'Image',
              dataIndex: 'image',
              key: 'image',
              render: (image) => <img src={image} alt="product" style={{ width: 50 }} />,
            },
            {
              title: 'Current Price',
              dataIndex: 'currentPrice',
              key: 'currentPrice',
              render: (text) => (
                <span>{text ? text.toLocaleString() : 'Not updated'} VNĐ</span>
              ),
            },
            {
              title: 'New Price',
              key: 'newPrice',
              render: (text, product) => (
                <Input
                  type="number"
                  placeholder="Enter new price"
                  defaultValue={productPricesForList[product.key] || ''}
                  onChange={(e) => handlePriceChange(product.key, e.target.value)}
                />
              ),
            },
          ]}
          pagination={false}
        />
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => handleSavePrices(record.key)}
          style={{ marginTop: 16 }}
        >
          Update Price
        </Button>
      </div>
    );
  };

  return (
    <>
      <h2>Manage Price Lists</h2>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button type="primary" onClick={() => setShowPriceListForm(true)}>
          Add Price List
        </Button>
      </div>

      {showPriceListForm && (
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Price List Code"
            value={newPriceList.code}
            onChange={(e) => setNewPriceList({ ...newPriceList, code: e.target.value })}
          />
          <Input
            placeholder="Price List Name"
            value={newPriceList.name}
            onChange={(e) => setNewPriceList({ ...newPriceList, name: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={newPriceList.description}
            onChange={(e) => setNewPriceList({ ...newPriceList, description: e.target.value })}
          />
          <DatePicker
            placeholder="Start Date"
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={(date) => setNewPriceList({ ...newPriceList, startDate: date })}
          />
          <DatePicker
            placeholder="End Date"
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onChange={(date) => setNewPriceList({ ...newPriceList, endDate: date })}
          />
          <Button type="primary" onClick={handleAddPriceList} style={{ marginTop: 16 }}>
            Save Price List
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => setShowPriceListForm(false)}>
            Close
          </Button>
        </div>
      )}

      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Table
          dataSource={priceLists.map((list) => ({
            key: list._id,
            code: list.code,
            name: list.name,
            description: list.description,
            startDate: new Date(list.startDate).toLocaleString(),
            endDate: new Date(list.endDate).toLocaleString(),
            isActive: list.isActive,
            products: list.products,
          }))}
          columns={[
            { title: 'Price List Code', dataIndex: 'code', key: 'code' },
            { title: 'Price List Name', dataIndex: 'name', key: 'name' },
            { title: 'Description', dataIndex: 'description', key: 'description' },
            { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
            { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
            {
              title: 'Active',
              dataIndex: 'isActive',
              key: 'isActive',
              render: (isActive, record) => (
                <div>
                  <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Active' : 'Inactive'}</Tag>
                  <Switch
                    checked={isActive}
                    onChange={() => handleToggleActive(record.key)}
                  />
                </div>
              ),
            },
          ]}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => record.products.length > 0,
          }}
          pagination={false}
        />
      )}
    </>
  );
};

export default PriceProduct;
