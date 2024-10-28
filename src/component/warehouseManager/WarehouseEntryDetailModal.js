import React from 'react';
import { Modal, Table } from 'antd';

const WarehouseEntryDetailModal = ({ visible, onCancel, entry, getSupplierNameById, getUserNameById, products }) => {
  if (!entry) return null; // Trả về null nếu entry là null

  // Hàm để lấy tên sản phẩm từ ID sản phẩm
  const getProductNameById = (id) => {
    const product = products.find(product => product._id === id);
    return product ? product.name : 'Không có tên sản phẩm';
  };
  
  // Hàm để lấy mã sản phẩm từ ID sản phẩm
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
      width={800} // Có thể điều chỉnh kích thước modal nếu cần
    >
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
        dataSource={entry.products} 
        rowKey="productId" // Hoặc một ID duy nhất khác
        pagination={{
          pageSize: 5, 
          showSizeChanger: true, // Hiện tùy chọn thay đổi số lượng sản phẩm trên trang
          pageSizeOptions: [5, 10, 20], // Tùy chọn cho số lượng sản phẩm trên trang
          showTotal: (total) => `Tổng số sản phẩm: ${total}`, 
        }}
      />
    </Modal>
  );
};

export default WarehouseEntryDetailModal;
