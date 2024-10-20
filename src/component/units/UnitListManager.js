import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Form, Input, Modal, message } from 'antd';
import { createUnitList, getAllUnitList } from '../../untills/unitApi';
import { AuthContext } from '../../untills/context/AuthContext';
import './UnitListManager.css'; // Import file CSS
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
const UnitListManager = () => {
    const { user } = useContext(AuthContext);
    const [unitListName, setUnitListName] = useState('');
    const [unitListDescription, setUnitListDescription] = useState('');
    const [unitLists, setUnitLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]); // Trạng thái cho các hàng mở rộng

    useEffect(() => {
        const fetchUnitLists = async () => {
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

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setUnitListName('');
        setUnitListDescription('');
    };

    //chính sửa
    const handleEdit = (record) => {
        // Thực hiện hành động chỉnh sửa
        message.info(`Chỉnh sửa bảng đơn vị tính: ${record.name}`);
    };

    //xóa
    const handleDelete = (record) => {
        // Thực hiện hành động xóa
        message.info(`Xóa bảng đơn vị tính: ${record.name}`);
    };


    const expandedRowRender = (record) => {
        

        return (
            <Table
                
                pagination={false}
                columns={[
                    {
                        title: 'Đơn vị cơ bản',
                        dataIndex: 'label',
                        key: 'label',
                        onHeaderCell: () => ({
                            style: {
                              backgroundColor: '#F5F5DC',
                              color: '#333',
                              fontWeight: 'bold',
                            },
                          }),
                    },
                    {
                        title: 'Đơn vị quy đổi',
                        dataIndex: 'label',
                        key: 'label',
                        onHeaderCell: () => ({
                            style: {
                              backgroundColor: '#F5F5DC',
                              color: '#333',
                              fontWeight: 'bold',
                            },
                          }),
                    },
                    {
                        title: 'Gía trị quy đổi',
                        dataIndex: 'label',
                        key: 'label',
                        onHeaderCell: () => ({
                            style: {
                              backgroundColor: '#F5F5DC',
                              color: '#333',
                              fontWeight: 'bold',
                            },
                          }),
                    },
                    {
                        title: 'Sản phẩm áp dụng',
                        dataIndex: 'value',
                        key: 'value',
                        onHeaderCell: () => ({
                            style: {
                              backgroundColor: '#F5F5DC',
                              color: '#333',
                              fontWeight: 'bold',
                            },
                          }),
                    },
                ]}
                rowKey="label"
                size="small"
            />
        );
    };

    const onExpand = (expanded, record) => {
        if (expanded) {
            // Nếu mở hàng mới, đặt hàng hiện tại là hàng duy nhất mở
            setExpandedRowKeys([record._id]);
        } else {
            // Nếu đóng hàng, xóa hàng khỏi danh sách mở
            setExpandedRowKeys([]);
        }
    };

    return (
        <div>
            <div className="button-container-unit">
                <Button type="primary" onClick={showModal}>
                    Tạo Bảng Đơn Vị Tính
                </Button>
            </div>

            <Modal
                title="Tạo Bảng Đơn Vị Tính"
                visible={isModalVisible}
                onOk={handleCreateUnitList}
                onCancel={handleCancel}
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
                    // {
                    //     title: 'Người Tạo',
                    //     dataIndex: 'createdBy',
                    //     key: 'createdBy',
                    //     render: (text) => text ? text : 'Chưa có',
                    // },
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
                expandedRowRender={expandedRowRender}
                onExpand={onExpand}
                expandedRowKeys={expandedRowKeys}
                rowKey="_id"
                loading={loading}
            />
        </div>
    );
};

export default UnitListManager;