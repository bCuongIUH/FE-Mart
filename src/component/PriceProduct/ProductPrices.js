import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../../untills/stockApi';
import { Table, Spin, Alert } from 'antd';

const ProductPrices = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await getAllTransactions();
                setTransactions(data);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
                setError("Unable to load transactions.");
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    // Hàm chuyển đổi loại giao dịch thành tên hiển thị
    const formatTransactionType = (type) => {
        switch (type) {
            case 'kiemke':
                return 'Kiểm kê';
            case 'huy':
                return 'Hủy';
            case 'ban':
                return 'Bán hàng';
            case 'nhap':
                return 'Nhập kho';
            default:
                return type;
        }
    };

    // Định nghĩa các cột cho bảng
    const columns = [
        {
            title: 'Mã SP',
            dataIndex: ['productId', 'code'],
            key: 'productId',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: ['productId', 'name'],
            key: 'productId',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Đơn vị tính',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Loại giao dịch',
            dataIndex: 'transactionType',
            key: 'transactionType',
            render: (type) => formatTransactionType(type),
        },
        {
            title: 'Ngày giao dịch',
            dataIndex: 'date',
            key: 'date',
            render: (date) => new Date(date).toLocaleString(),
        },
    ];

    if (loading) {
        return <Spin tip="Loading..." />;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <h2>Giao dịch</h2>
            <Table
                columns={columns}
                dataSource={transactions}
                rowKey={(record) => record._id}  
                pagination={{ pageSize: 10 }}  
            />
        </div>
    );
};

export default ProductPrices;
