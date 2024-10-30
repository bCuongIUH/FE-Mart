import React, { useEffect, useState } from 'react';
import { getAllSuppliers } from '../../../untills/api';
import { Button, Modal, Table, Space, message } from 'antd';
import SuppliersAddModal from './SuppliersAddModal';
import { FaTrash } from 'react-icons/fa';

function SuppliersInfo() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const suppliersList = await getAllSuppliers();
      setSuppliers(suppliersList);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách nhà cung cấp:', error);
      message.error('Không thể tải danh sách nhà cung cấp.');
    }
  };

  const handleSupplierClick = (supplier) => {
    setSelectedSupplier(supplier);
  };

  const closeModal = () => {
    setSelectedSupplier(null);
  };

  const handleAddSupplierSuccess = (newSupplier) => {
    setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
    setIsAddModalVisible(false);
    message.success('Nhà cung cấp đã được thêm thành công!');
  };
  

  const handleDeleteSupplier = (supplier) => {
    setSuppliers((prev) => prev.filter((s) => s._id !== supplier._id));
    message.success('Nhà cung cấp đã được xóa thành công!');
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a
          onClick={() => handleSupplierClick(record)}
          style={{
            maxWidth: '150px',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <span
          style={{
            maxWidth: '200px',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Số ĐT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (text) => (
        <span
          style={{
            maxWidth: '100px',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Thông tin liên hệ',
      dataIndex: 'contactInfo',
      key: 'contactInfo',
      render: (text) => (
        <span
          style={{
            maxWidth: '250px',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<FaTrash />}
            onClick={() => handleDeleteSupplier(record)}
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <h1>Danh sách nhà cung cấp</h1>
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
          Thêm nhà cung cấp
        </Button>
      </div>

      <Table
          columns={columns}
          dataSource={suppliers}
          rowKey={(record) => record._id} 
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: 'Không có nhà cung cấp nào' }}
          rowClassName="custom-row"
        />


      {/* Modal chi tiết nhà cung cấp */}
      {selectedSupplier && (
        <Modal
          visible={!!selectedSupplier}
          onCancel={closeModal}
          footer={null}
          title="Thông tin nhà cung cấp"
        >
          <h2>{selectedSupplier.name}</h2>
          <p><strong>Thông tin liên hệ:</strong> {selectedSupplier.contactInfo}</p>
          <p><strong>Email:</strong> {selectedSupplier.email}</p>
          <p><strong>Số điện thoại:</strong> {selectedSupplier.phoneNumber}</p>
        </Modal>
      )}

      {/* Modal thêm nhà cung cấp */}
      <SuppliersAddModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddSuccess={handleAddSupplierSuccess}
      />
    </div>
  );
}

export default SuppliersInfo;
