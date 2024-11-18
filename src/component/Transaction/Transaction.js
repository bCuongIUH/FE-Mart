import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../../untills/stockApi';
import { Table, Spin, Alert, Button, DatePicker, Select, Row, Col, Dropdown, Menu } from 'antd';
import TransactionDetailsModal from './TransactionDetailsModal';
import moment from 'moment';
import { DownOutlined, FilterOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';

const { Option } = Select;

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await getAllTransactions();
            setTransactions(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
                setFilteredTransactions(data);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
                setError("Unable to load transactions.");
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    // Hiển thị modal với thông tin chi tiết của giao dịch
    const showTransactionDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalVisible(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedTransaction(null);
    };

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


    // Lọc giao dịch dựa trên ngày và loại
    useEffect(() => {
        let filteredData = transactions;

        if (selectedDate) {
            const dateStr = selectedDate.format('YYYY-MM-DD');
            filteredData = filteredData.filter(transaction =>
                moment(transaction.date).format('YYYY-MM-DD') === dateStr
            );
        }

        if (selectedType) {
            filteredData = filteredData.filter(transaction =>
                transaction.transactionType === selectedType
            );
        }

        setFilteredTransactions(filteredData);
    }, [selectedDate, selectedType, transactions]);

    // Xử lý thay đổi ngày
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Xử lý thay đổi loại giao dịch
    const handleTypeChange = (type) => {
        setSelectedType(type === 'all' ? null : type);
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

    // Tạo Menu cho Dropdown với bộ lọc
    const filterMenu = (
        <Menu>
            <Menu.Item key="datePicker">
                <DatePicker 
                    onChange={handleDateChange} 
                    placeholder="Chọn ngày" 
                    style={{ width: '100%' }} 
                    onClick={(e) => e.stopPropagation()}
                />
            </Menu.Item>
            <Menu.Item key="transactionType">
                <Select
                    placeholder="Chọn loại giao dịch"
                    onChange={handleTypeChange}
                    style={{ width: '100%' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Option value="all">Tất cả</Option>
                    <Option value="kiemke">Kiểm kê</Option>
                    <Option value="huy">Hủy</Option>
                    <Option value="ban">Bán hàng</Option>
                    <Option value="nhap">Nhập kho</Option>
                    <Option value="khuyenmai">Khuyến mãi</Option>
                </Select>
            </Menu.Item>
        </Menu>
    );

    if (loading) {
        return <Spin tip="Loading..." />;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    return (
        <div>
            <Title style={{ fontWeight: 'bold', fontStyle: 'italic' }} level={2}>Danh sách giao dịch</Title>
            <Row justify="end" gutter={16} style={{ marginBottom: '16px' }}>
                <Col>
                    <Dropdown 
                        overlay={filterMenu} 
                        trigger={['click']}
                        visible={dropdownOpen}
                        onVisibleChange={(flag) => setDropdownOpen(flag)}
                    >
                        <Button onClick={() => setDropdownOpen(!dropdownOpen)} icon={<FilterOutlined />}>
                            Bộ lọc <DownOutlined />
                        </Button>
                    </Dropdown>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={filteredTransactions}
                rowKey={(record) => record._id}  
                pagination={{ pageSize: 10 }}
                onRow={(record) => ({
                    onClick: () => showTransactionDetails(record), // Mở modal khi nhấn vào hàng
                })}
            />

            {/* Sử dụng TransactionDetailsModal */}
            <TransactionDetailsModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                transaction={selectedTransaction}
            />
        </div>
    );
};

export default Transaction;
