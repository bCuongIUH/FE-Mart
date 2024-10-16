import React, { useEffect, useState } from 'react';
import { Table, Input, Button, DatePicker, message, Spin, Switch, Tag } from 'antd';
import { getAllProducts, createPriceList, getAllPriceLists, addPricesToPriceList, deactivatePriceList, activatePriceList } from '../../untills/api'; 
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
  const [newPrices, setNewPrices] = useState({});
  
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);

        const priceListsData = await getAllPriceLists();
        setPriceLists(priceListsData.priceLists || []); 
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        message.error('Lỗi khi tải dữ liệu.');
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
        message.success('Bảng giá đã được tạo thành công!');
      } else {
        message.error('Không thể tạo bảng giá.');
      }
    } catch (error) {
      message.error('Không thể tạo bảng giá.');
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
        message.success('Giá đã được cập nhật thành công!');
        setProductPrices({});
      } else {
        message.error('Không thể cập nhật giá .');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật giá:', error);
      message.error('Không thể cập nhật bảng giá  đang hoạt động.');
    }
  };

  const handleToggleActive = async (priceListId, currentStatus) => {
    try {
      let response;
  
      if (currentStatus) {
        response = await deactivatePriceList(priceListId); // Ngừng hoạt động
      } else {
        response = await activatePriceList(priceListId); // Kích hoạt
      }
  
      if (response.success) {
        message.success(`Trạng thái đã được cập nhật thành công: ${currentStatus ? 'Ngừng hoạt động' : 'Đang hoạt động'}`);
        // Cập nhật lại danh sách bảng giá
        setPriceLists((prevLists) => 
          prevLists.map((list) => 
            list._id === priceListId ? { ...list, isActive: !currentStatus } : list
          )
        );
      } else {
        message.error('Không thể cập nhật trạng thái.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      message.error(error.message || 'Không thể cập nhật trạng thái.');
    }
  };
  

  const expandedRowRender = (record) => {  
    const productPricesForList = record.products.reduce((acc, product) => {  
      acc[product.productId] = product.price;  
      return acc;  
    }, {});  

    return (  
      <div>  
        <h4>Danh sách sản phẩm</h4>  
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
              title: 'Giá hiện tại',  
              dataIndex: 'currentPrice',  
              key: 'currentPrice',  
              render: (text) => (  
                <span>{text ? text.toLocaleString() : 'Chưa cập nhật'} VNĐ</span>  
              ),  
            },  
            {  
              title: 'Giá mới',  
              key: 'newPrice',  
              render: (text, product) => (  
                <Input  
                  type="number"  
                  placeholder="Nhập giá mới"  
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
          Cập nhật Giá  
        </Button>  
      </div>  
    );  
  };

  return (  
    <>  
      <h2>Quản lý Bảng Giá</h2>  
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button type="primary" onClick={() => setShowPriceListForm(true)}>  
          Thêm bảng giá  
        </Button>  
      </div>

      {showPriceListForm && (  
        <div style={{ marginBottom: 16 }}> 
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
            showTime={{ format: 'HH:mm' }}  
            format="YYYY-MM-DD HH:mm" 
            onChange={(date) => setNewPriceList({ ...newPriceList, startDate: date })}  
          />  

          <DatePicker  
            placeholder="Ngày kết thúc"  
            showTime={{ format: 'HH:mm' }}  
            format="YYYY-MM-DD HH:mm"  
            onChange={(date) => setNewPriceList({ ...newPriceList, endDate: date })}  
          />  

          <Button type="primary" onClick={handleAddPriceList} style={{ marginTop: 16 }}>  
            Lưu bảng giá  
          </Button>  
          <Button style={{ marginLeft: 8 }} onClick={() => setShowPriceListForm(false)}>
            Đóng
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
            startDate: new Date(list.startDate).toLocaleString(),  
            endDate: new Date(list.endDate).toLocaleString(),  
            isActive: list.isActive,  
            products: list.products || [],  
          }))}  
          columns={[  
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
              title: 'Ngày bắt đầu',  
              dataIndex: 'startDate',  
              key: 'startDate',  
            },  
            {  
              title: 'Ngày kết thúc',  
              dataIndex: 'endDate',  
              key: 'endDate',  
            },  
            {  
              title: 'Trạng thái',  
              key: 'isActive',  
              render: (text, record) => (  
                <>  
                  <Tag color={record.isActive ? 'green' : 'red'}>  
                    {record.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}  
                  </Tag>  
                  <Switch  
                    checked={record.isActive}  
                    onChange={() => handleToggleActive(record.key, record.isActive)}  
                  />  
                </>  
              ),  
            },  
          ]}  
          expandable={{  
            expandedRowRender,  
          }}  
        />  
      )}  
    </>  
  );  
};

export default PriceProduct;
