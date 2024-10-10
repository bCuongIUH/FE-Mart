import React, { useContext, useEffect, useState } from 'react';
import { Space, Table, Tag, Modal, Select } from 'antd';
import { getAllCartPending, getAllUsers, updateCart } from '../../untills/api'; 
import { AuthContext } from '../../untills/context/AuthContext';

const { Option } = Select; 

const OrderTracking = () => {
  const [cartData, setCartData] = useState([]);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const { user } = useContext(AuthContext); // Lấy userId từ AuthContext
console.log(user);

  const columns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'key', 
      key: '_id',
      render: (text) => <a>{text}</a>,
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
      dataIndex: 'totalPrice', 
      key: 'totalPrice',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        let color = status === 'Shipped' ? 'green' : 'volcano';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleUpdate(record)}>Update</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const fetchAllCartPending = async () => {
    try {
      const response = await getAllCartPending();
      const formattedData = response.map(cart => {
        const user = users.find(user => user._id === cart.user);
        return {
          key: cart._id,
          userName: user ? user.fullName : 'N/A', 
          quantity: cart.items[0]?.quantity || 0,
          totalPrice: cart.items[0]?.totalPrice || 0,
          status: cart.status,
          user: cart.user,
        };
      });

      setCartData(formattedData);
    } catch (error) {
      setError('Lỗi khi lấy dữ liệu hóa đơn');
      console.error(error);
    }
  };

  const handleUpdate = (record) => {
    setSelectedCartId(record.key); 
    setNewStatus(record.status); // Lấy trạng thái hiện tại vào modal
    setIsModalVisible(true); 
  };

  const handleOk = async () => {
    try {
      // Gọi hàm updateCart với selectedCartId, newStatus và userId
      await updateCart(selectedCartId, newStatus, user);
      setIsModalVisible(false); 
      setNewStatus(''); 
      fetchAllCartPending(); 
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái giỏ hàng:', error);
      setError('Cập nhật trạng thái thất bại.'); 
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewStatus(''); // Đặt lại trạng thái khi hủy
  };

  useEffect(() => {
    fetchAllCartPending(); 
  }, [users]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getAllUsers();
        setUsers(userList);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Table columns={columns} dataSource={cartData} />
      
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
          <Option value="DaMua">Đã Mua</Option>
          <Option value="HoanTra">Hoàn Trả</Option>
        </Select>
      </Modal>
    </>
  );
};

export default OrderTracking;
