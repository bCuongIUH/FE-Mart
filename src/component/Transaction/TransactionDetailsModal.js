import React from 'react';
import { Modal, Button, Table } from 'antd';

// Hàm chuyển đổi loại giao dịch thành tên hiển thị
const formatTransactionType = (type) => {
    switch (type) {
        case 'kiemke':
            return 'Kiểm kê';
        case 'huy':
            return 'Hủy';
        case 'ban':
            return 'Bán hàng';
        case 'khuyenmai':
            return 'Khuyến mãi';
        case 'nhap':
            return 'Nhập kho';
        case 'hoantra':
            return 'Trả hàng';
        default:
            return type;
    }
};

const TransactionDetailsModal = ({ visible, onClose, transaction }) => {
    // Chuyển đổi dữ liệu giao dịch thành mảng để hiển thị trong bảng
    const dataSource = transaction
        ? [
            { key: '1', label: 'Mã SP', value: transaction.productId?.code || 'N/A' },
            { key: '2', label: 'Tên sản phẩm', value: transaction.productId?.name || 'N/A' },
            { key: '3', label: 'Đơn vị tính', value: transaction.unit },
            {
                key: '4',
                label: 'Số lượng',
                value: transaction.transactionType === 'kiemke'
                    ? `${transaction.quantity} (${transaction.adjustmentType === 'increase' ? 'Tăng' : 'Giảm'})`
                    : transaction.quantity
            },
            { key: '5', label: 'Loại giao dịch', value: formatTransactionType(transaction.transactionType) },
            { key: '6', label: 'Ngày giao dịch', value: new Date(transaction.date).toLocaleString() },
        ]
        : [];

    // Định nghĩa các cột của bảng
    const columns = [
        {
            title: 'Trường',
            dataIndex: 'label',
            key: 'label',
            width: '30%',
        },
        {
            title: 'Chi tiết',
            dataIndex: 'value',
            key: 'value',
            width: '70%',
        },
    ];

    return (
        <Modal
            title="Chi tiết giao dịch"
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>,
            ]}
        >
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false} // Tắt phân trang trong bảng
                showHeader={false} // Ẩn tiêu đề của bảng
                bordered // Hiển thị đường viền cho bảng
            />
        </Modal>
    );
};

export default TransactionDetailsModal;
