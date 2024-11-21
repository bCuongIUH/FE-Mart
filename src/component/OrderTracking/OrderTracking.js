import React, { useContext, useEffect, useState } from 'react';
import { Space, Table, Tag, Modal, Select, message, List } from 'antd';
import { getBillOnline, updateCart } from '../../untills/api';
import { AuthContext } from '../../untills/context/AuthContext';
import { formatCurrency } from '../../untills/formatCurrency';

const { Option } = Select;

const OrderTracking = () => {
  const [cartData, setCartData] = useState([]);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedCart, setSelectedCart] = useState(null); 
  const [selectedCartId, setSelectedCartId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const { user } = useContext(AuthContext);

  // Fetch bills from the backend
  const fetchBills = async () => {
    try {
      const bills = await getBillOnline();
      console.log('====================================');
      console.log('Bills:', bills);
      console.log('====================================');
      const formattedData = bills.map(bill => ({
        key: bill.billCode,
        userName: bill.customer ? bill.customer.fullName : 'N/A', 
        quantity: bill.items.reduce((total, item) => total + item.quantity, 0),
        totalAmount: bill.totalAmount,
        status: bill.status,
        items: bill.items,
      }));

      setCartData(formattedData);
    } catch (error) {
      setError('Lỗi khi lấy dữ liệu hóa đơn');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleUpdate = (record) => {
    setSelectedCartId(record.key); 
    setNewStatus(record.status); 
    setIsModalVisible(true); 
  };

  const handleOk = async () => {
    try {
      await updateCart(selectedCartId, newStatus, user);
      setIsModalVisible(false); 
      setNewStatus(''); 
      fetchBills(); 
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái giỏ hàng:', error);
      setError('Cập nhật trạng thái thất bại.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewStatus('');
  };

  const handleViewDetails = (record) => {
    setSelectedCart(record); // Lưu thông tin giỏ hàng chi tiết
    setIsDetailModalVisible(true); // Hiển thị modal chi tiết
  };

  const closeDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedCart(null);
  };

  const columns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'key',
      key: '_id',
      render: (text, record) => <a onClick={() => handleViewDetails(record)}>{text}</a>, // Thêm onClick để mở modal chi tiết
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tổng giá',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => formatCurrency(text),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'HoanThanh' ? 'green' : 'volcano';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleUpdate(record)}>Thay đổi</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Table columns={columns} dataSource={cartData} />
      
      {/* Modal cập nhật trạng thái */}
      <Modal
        title="Cập nhật trạng thái giỏ hàng"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Select
          value={newStatus}
          onChange={value => setNewStatus(value)}
          style={{ width: '100%' }}
          placeholder="Chọn trạng thái mới"
        >
          <Option value="DaMua">Đã giao hàng</Option>
          <Option value="HoanTra">Hoàn Trả</Option>
        </Select>
      </Modal>

      {/* Modal chi tiết giỏ hàng */}
      <Modal
        title="Chi tiết giỏ hàng"
        visible={isDetailModalVisible}
        onOk={closeDetailModal}
        onCancel={closeDetailModal}
        footer={null}
      >
        {selectedCart ? (
          <div>
            <p><strong>Mã hóa đơn:</strong> {selectedCart.key}</p>
            <p><strong>Khách hàng:</strong> {selectedCart.userName}</p>
            <p><strong>Trạng thái:</strong> {selectedCart.status}</p>
            <p><strong>Tổng giá:</strong> {selectedCart.totalPrice}</p>
            <p><strong>Số lượng sản phẩm:</strong> {selectedCart.quantity}</p>
            <h4>Chi tiết sản phẩm:</h4>
            <List
              dataSource={selectedCart.items}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.product.name}
                    description={`Số lượng: ${item.quantity} | Giá: ${item.currentPrice} | Tổng: ${item.totalAmount}`}
                  />
                </List.Item>
              )}
            />
          </div>
        ) : (
          <p>Không có thông tin chi tiết.</p>
        )}
      </Modal>
    </>
  );
};

export default OrderTracking;
