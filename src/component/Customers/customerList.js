import React, { useEffect, useState } from 'react';
import { Table, Modal, message } from 'antd';
import { getAllCustomers } from '../../untills/customersApi';
import Title from 'antd/es/typography/Title';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Lưu thông tin khách hàng được chọn
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const customerData = await getAllCustomers();
        setCustomers(customerData);
      } catch (error) {
        message.error('Có lỗi xảy ra khi lấy danh sách khách hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Định nghĩa cột cho bảng Ant Design
  const columns = [
    {
      title: 'Tên Khách Hàng',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text ? text : 'Chưa cập nhật',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Ngày Tham Gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (text) => new Date(text).toLocaleDateString('vi-VN'),
    },
  ];

  // Hàm xử lý khi nhấn vào một hàng
  const onRowClick = (record) => {
    setSelectedCustomer(record);
    setIsModalVisible(true); 
  };

  // Hàm đóng modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCustomer(null);
  };

  return (
    <div>
      <Title style={{ fontWeight: 'bold', fontStyle: 'italic' }} level={2}>Quản lí khách hàng</Title>
      <Table
        columns={columns}
        dataSource={customers}
        loading={loading}
        rowKey={(record) => record._id} 
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
      />

      {/* Modal hiển thị chi tiết khách hàng */}
      <Modal
        title="Chi tiết khách hàng"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedCustomer && (
          <div>
            <p><strong>Tên Khách Hàng:</strong> {selectedCustomer.fullName}</p>
            <p><strong>Email:</strong> {selectedCustomer.email}</p>
            <p><strong>Số Điện Thoại:</strong> {selectedCustomer.phoneNumber}</p>
            <p>
              <strong>Ngày Sinh:</strong> {selectedCustomer.dateOfBirth ? new Date(selectedCustomer.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
            </p>
          
            <p>
              <strong>Địa Chỉ:</strong> 
              {selectedCustomer.addressLines?.houseNumber || selectedCustomer.addressLines?.ward || selectedCustomer.addressLines?.district || selectedCustomer.addressLines?.province 
                ? `${selectedCustomer.addressLines.houseNumber}, ${selectedCustomer.addressLines.ward}, ${selectedCustomer.addressLines.district}, ${selectedCustomer.addressLines.province}` 
                : 'Chưa cập nhật'}
            </p>
            <p><strong>Ngày Tham Gia:</strong> {new Date(selectedCustomer.joinDate).toLocaleDateString('vi-VN')}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerList;
