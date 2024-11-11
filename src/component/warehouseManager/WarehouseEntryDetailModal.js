import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';

const WarehouseEntryDetailModal = ({ visible, onCancel, entry, getSupplierNameById, getUserNameById, products }) => {
  const [modalData, setModalData] = useState([]);

  useEffect(() => {
    // Chỉ cập nhật modalData khi modal mở lần đầu hoặc khi `entry` thay đổi
    if (entry && entry.products) {
      setModalData([...entry.products]);
    }
  }, [entry]);

  const getProductNameById = (id) => {
    const product = products.find(product => product._id === id);
    return product ? product.name : 'Không có tên sản phẩm';
  };

  const getProductCode = (id) => {
    const product = products.find(product => product._id === id);
    return product ? product.code : 'Không có mã sản phẩm';
  };

  return (
    <Modal
      title={<div style={{ textAlign: 'center', fontSize: 30 }}>Thông tin phiếu nhập kho</div>}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      {entry && (
        <>
          <p><strong>Mã phiếu:</strong> {entry.entryCode}</p>
          <p><strong>Nhà cung cấp:</strong> {getSupplierNameById(entry.supplier)}</p>
          <p><strong>Người nhập:</strong> {getUserNameById(entry.enteredBy)}</p>
          <p><strong>Ngày nhập:</strong> {new Date(entry.createdAt).toLocaleString()}</p>

          <Table
            columns={[
              {
                title: 'Mã SP',
                dataIndex: 'productId',
                key: 'productId',
                render: (text, record) => getProductCode(record.productId),
              },
              {
                title: 'Sản phẩm',
                dataIndex: 'productId',
                key: 'productName',
                render: (text, record) => getProductNameById(record.productId),
              },
              {
                title: 'Đơn Vị',
                dataIndex: 'unit',
                key: 'unit',
              },
              {
                title: 'Số lượng',
                dataIndex: 'quantity',
                key: 'quantity',
              },
            ]}
            dataSource={modalData} 
            rowKey={(record) => `${record.productId}-${record.unit}`} 
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20],
              showTotal: (total) => `Tổng số sản phẩm: ${total}`,
            }}
          />
        </>
      )}
    </Modal>
  );
};

export default WarehouseEntryDetailModal;
