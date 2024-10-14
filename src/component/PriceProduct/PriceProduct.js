import React, { useEffect, useState } from 'react';
import { Table, InputNumber, Button, message, DatePicker, Collapse } from 'antd';
import { getAllProducts, updatePriceRange, togglePriceRangeActive } from '../../untills/api';

const { Panel } = Collapse;

const PriceSetupPage = () => {
  const [data, setData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [newPrice, setNewPrice] = useState(null);
  const [newStartDate, setNewStartDate] = useState(null);
  const [newEndDate, setNewEndDate] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAllProducts();
        const formattedData = products.map((product) => {
          const currentDate = new Date();

          // Kiểm tra khoảng giá đang hoạt động
          const currentPriceRange = product.priceRanges.find(range =>
            new Date(range.startDate) <= currentDate && new Date(range.endDate) >= currentDate
          );
          const currentSellingPrice = currentPriceRange ? currentPriceRange.price : 0;

          return {
            key: product._id,
            code: product.code,
            nameProduct: product.name,
            lastImportPrice: product.lastImportPrice || 0,
            currentSellingPrice: currentSellingPrice || 0,
            priceRanges: product.priceRanges || [],
          };
        });

        setData(formattedData);
        console.log('Fetched Products:', formattedData);
      } catch (error) {
        message.error('Lỗi khi tải danh sách sản phẩm: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
      }
    };

    fetchProducts();
  }, []);

  const handleAddPriceRange = async (key) => {
    if (!newPrice || !newStartDate || !newEndDate) {
      message.error('Vui lòng nhập đầy đủ thông tin giá và ngày bắt đầu/kết thúc');
      return;
    }

    // Kiểm tra tính hợp lệ của ngày
    const startDate = new Date(newStartDate);
    const endDate = new Date(newEndDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      message.error('Ngày không hợp lệ');
      return;
    }

    if (startDate > endDate) {
      message.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return;
    }

    const priceRange = {
      price: newPrice,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    try {
      const response = await updatePriceRange(key, priceRange);
      const updatedProduct = response.data;

      // Cập nhật dữ liệu sản phẩm
      setData(prevData =>
        prevData.map(product =>
          product.key === key ? updatedProduct : product
        )
      );

      // Mở phần chi tiết khoảng giá sau khi thêm
      if (!expandedRowKeys.includes(key)) {
        setExpandedRowKeys(prev => [...prev, key]);
      }

      setNewPrice(null);
      setNewStartDate(null);
      setNewEndDate(null);
      message.success('Thêm khoảng giá thành công!');
    } catch (error) {
      message.error('Lỗi khi thêm khoảng giá: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
    }
  };

  const handleToggleActive = async (productId, priceRangeId, isActive) => {
    try {
      await togglePriceRangeActive(productId, priceRangeId, isActive);
      message.success(`Cập nhật trạng thái khoảng giá thành công!`);
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái khoảng giá: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
    }
  };

  const onExpand = (expanded, record) => {
    if (!record) return;
    const newExpandedRowKeys = expanded
      ? [...expandedRowKeys, record.key]
      : expandedRowKeys.filter(key => key !== record.key);

    setExpandedRowKeys(newExpandedRowKeys);
  };

return (
    <>
      <h2>Thiết lập giá sản phẩm</h2>
      <Table
        expandedRowKeys={expandedRowKeys}
        onExpand={onExpand}
        columns={[
          { title: 'Mã sản phẩm', dataIndex: 'code', key: 'code' },
          { title: 'Tên sản phẩm', dataIndex: 'nameProduct', key: 'nameProduct' },
          {
            title: 'Giá nhập cuối',
            dataIndex: 'lastImportPrice',
            key: 'lastImportPrice',
            render: (price) => `${(price || 0).toLocaleString()} đ`,
          },
          {
            title: 'Giá bán hiện tại',
            dataIndex: 'currentSellingPrice',
            key: 'currentSellingPrice',
            render: (price) => `${(price || 0).toLocaleString()} đ`,
          },
        ]}
        dataSource={data.map(product => ({ ...product, key: product.key }))} 
        pagination={{ pageSize: 10 }}
        expandable={{
          expandedRowRender: (record) => (
            <Collapse>
              <Panel header="Chi tiết khoảng giá" key="1">
                {record.priceRanges.length > 0 ? (
                  record.priceRanges.map((range) => (
                    <div key={range._id}> 
                      <p>Giá: {range.price ? range.price.toLocaleString() : 'Chưa có'} đ</p>
                      <p>Từ {new Date(range.startDate).toLocaleDateString()} đến {new Date(range.endDate).toLocaleDateString()}</p>
                      <Button
                        type={range.isActive ? "danger" : "primary"}
                        onClick={() => handleToggleActive(record.key, range._id, !range.isActive)}
                      >
                        {range.isActive ? "Hủy kích hoạt" : "Kích hoạt"}
                      </Button>
                    </div>
                  ))
                ) : (
                  <p>Không có khoảng giá nào.</p>
                )}
                <InputNumber
                  placeholder="Nhập giá mới"
                  value={newPrice}
                  onChange={setNewPrice}
                />
                <DatePicker.RangePicker
                  onChange={(dates) => {
                    setNewStartDate(dates[0]);
                    setNewEndDate(dates[1]);
                  }}
                />
                <Button onClick={() => handleAddPriceRange(record.key)}>Thêm khoảng giá</Button>
              </Panel>
            </Collapse>
          ),
        }}
      />
    </>
  );
};

export default PriceSetupPage;
