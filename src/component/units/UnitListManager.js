import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, Form, Input, Modal, message } from 'antd';
import { createUnitList, getAllUnitList, getConversionRatesByUnitListId, updateConversionRate } from '../../untills/unitApi';
import { AuthContext } from '../../untills/context/AuthContext';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './UnitListManager.css';

const UnitListManager = () => {
    const { user } = useContext(AuthContext);
    const [unitListName, setUnitListName] = useState('');
    const [unitListDescription, setUnitListDescription] = useState('');
    const [unitLists, setUnitLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    const [visible, setVisible] = useState(false);
    const [unitListId, setUnitListId] = useState('');
    const [fromUnitName, setFromUnitName] = useState('');
    const [toUnitName, setToUnitName] = useState('');
    const [factor, setFactor] = useState('');

    // State quản lý danh sách tỷ lệ quy đổi cho từng bảng đơn vị
    const [conversionRatesMap, setConversionRatesMap] = useState({});
    const [expandedRowKey, setExpandedRowKey] = useState(null);

    useEffect(() => {
        const fetchUnitLists = async () => {
            setLoading(true);
            try {
                const data = await getAllUnitList();
                setUnitLists(data.unitLists || []);
            } catch (error) {
                message.error('Không thể lấy danh sách bảng đơn vị tính');
            } finally {
                setLoading(false);
            }
        };

        fetchUnitLists();
    }, []);

    const fetchConversionRates = async (unitListId) => {
        setLoading(true);
        try {
            const data = await getConversionRatesByUnitListId(unitListId);
            setConversionRatesMap(prev => ({ ...prev, [unitListId]: data.conversionRates || [] }));
        } catch (error) {
            message.error('Lỗi khi lấy danh sách quy đổi');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUnitList = async () => {
        try {
            const response = await createUnitList({
                name: unitListName,
                description: unitListDescription,
                createdBy: user._id,
                isActive: true,
            });
            setUnitLists([...unitLists, response.unitList]);
            message.success('Bảng đơn vị tính đã được tạo thành công');
            setUnitListName('');
            setUnitListDescription('');
            setIsModalVisible(false);
        } catch (error) {
            message.error('Lỗi khi tạo bảng đơn vị tính: ' + (error.response?.data.message || 'Có lỗi xảy ra'));
        }
    };

    const handleUpdateConversionRate = async (e) => {
        e.preventDefault();
        try {
            const data = { unitListId, fromUnitName, toUnitName, factor };
            await updateConversionRate(data);
            message.success('Cập nhật tỷ lệ quy đổi thành công');
            setVisible(false);
            setFromUnitName('');
            setToUnitName('');
            setFactor('');
            setUnitListId('');
        } catch (error) {
            message.error('Lỗi khi cập nhật quy đổi');
        }
    };

    const handleEdit = (record) => {
        setUnitListName(record.name);
        setUnitListDescription(record.description);
        setIsModalVisible(true);
    };

    const handleDelete = async (record) => {
        // Thêm logic xóa bảng đơn vị ở đây
    };

    const showConversionRateModal = (record) => {
        setUnitListId(record._id);
        setVisible(true);
    };

    const toggleExpandedRow = (key) => {
        if (expandedRowKey === key) {
            setExpandedRowKey(null);
        } else {
            fetchConversionRates(key); // Gọi API để lấy tỷ lệ quy đổi khi mở rộng
            setExpandedRowKey(key);
        }
    };

    return (
        <div>
            <div className="button-container-unit">
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    Tạo Bảng Đơn Vị Tính
                </Button>
            </div>

            <Modal
                title="Tạo Bảng Đơn Vị Tính"
                visible={isModalVisible}
                onOk={handleCreateUnitList}
                onCancel={() => {
                    setIsModalVisible(false);
                    setUnitListName('');
                    setUnitListDescription('');
                }}
                okText="Tạo"
                cancelText="Hủy"
            >
                <Form layout="vertical">
                    <Form.Item label="Tên bảng đơn vị tính" required>
                        <Input
                            value={unitListName}
                            onChange={(e) => setUnitListName(e.target.value)}
                            placeholder="Nhập tên bảng"
                        />
                    </Form.Item>
                    <Form.Item label="Mô tả">
                        <Input.TextArea
                            value={unitListDescription}
                            onChange={(e) => setUnitListDescription(e.target.value)}
                            placeholder="Nhập mô tả"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <h2>Danh Sách Bảng Đơn Vị Tính</h2>
            <Table
                dataSource={unitLists}
                columns={[
                    {
                        title: 'Tên Bảng Đơn Vị Tính',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        title: 'Mô Tả',
                        dataIndex: 'description',
                        key: 'description',
                    },
                    {
                        title: 'Trạng Thái',
                        dataIndex: 'isActive',
                        key: 'isActive',
                        render: (text) => text ? 'Hoạt Động' : 'Ngừng Hoạt Động',
                    },
                    {
                        title: 'Hành Động',
                        key: 'action',
                        render: (text, record) => (
                            <span>
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => handleEdit(record)}
                                    style={{ marginRight: 8 }}
                                />
                                <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDelete(record)}
                                />
                            </span>
                        ),
                    },
                ]}
                expandable={{
                    expandedRowRender: (record) => {
                        const conversionRates = conversionRatesMap[record._id] || [];
                        return (
                            <div>
                                <h3>Chi Tiết Quy Đổi</h3>
                                <Button onClick={() => showConversionRateModal(record)} style={{ marginBottom: 16 }}>
                                    Thêm Đơn Vị
                                </Button>
                                <Table
                                    dataSource={conversionRates}
                                    columns={[
                                        {
                                            title: 'Đơn Vị Nguồn',
                                            dataIndex: 'fromUnitName',
                                            key: 'fromUnitName',
                                        },
                                        {
                                            title: 'Đơn Vị Quy Đổi',
                                            dataIndex: 'toUnitName',
                                            key: 'toUnitName',
                                        },
                                        {
                                            title: 'Giá Trị Quy Đổi',
                                            dataIndex: 'factor',
                                            key: 'factor',
                                        },
                                        {
                                            title: 'Sản Phẩm Được Áp Dụng',
                                            dataIndex: 'products',
                                            key: 'products',
                                            render: (products) => (products && products.length > 0 ? products.join(', ') : 'Không có sản phẩm'),
                                        },
                                    ]}
                                    rowKey="_id"
                                />
                            </div>
                        );
                    },
                    rowExpandable: record => true,
                    expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
                    onExpand: (expanded, record) => {
                        toggleExpandedRow(record._id);
                    },
                }}
                rowKey="_id"
                loading={loading}
            />

            <Modal
                title="Thêm đơn vị quy đổi"
                visible={visible}
                onOk={handleUpdateConversionRate}
                onCancel={() => setVisible(false)}
            >
                <Form layout="vertical">
                    <Form.Item label="Đơn Vị Nguồn">
                        <Input
                            value={fromUnitName}
                            onChange={(e) => setFromUnitName(e.target.value)}
                            placeholder="Nhập tên đơn vị nguồn"
                        />
                    </Form.Item>
                    <Form.Item label="Đơn Vị Đích">
                        <Input
                            value={toUnitName}
                            onChange={(e) => setToUnitName(e.target.value)}
                            placeholder="Nhập tên đơn vị đích"
                        />
                    </Form.Item>
                    <Form.Item label="Giá Trị Quy Đổi">
                        <Input
                            value={factor}
                            onChange={(e) => setFactor(e.target.value)}
                            placeholder="Nhập giá trị quy đổi"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UnitListManager;
