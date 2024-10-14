import React, { useEffect, useState } from 'react';
import { Table, Button, message, Modal, Form, Input, Select } from 'antd';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import UpdatePromotion from './UpdatePromotionModal';

const { Option } = Select;

const PromotionManagement = () => {
    const [promotions, setPromotions] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate ();

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/promotions'); // Địa chỉ API của bạn
                setPromotions(response.data);
            } catch (error) {
                message.error('Lỗi khi lấy danh sách khuyến mãi: ' + error.message);
            }
        };

        fetchPromotions();
    }, []);

    const showUpdatePromotion = (promotion) => {
        // Chuyển hướng đến trang cập nhật với ID của khuyến mãi
        // navigate(`/promotions/update/${promotion._id}`);
        navigate(<UpdatePromotion/>)
    };

    const showAddPromotionModal = () => {
        setIsModalVisible(true);
    };

    const handleAddPromotion = async (values) => {
        try {
            const response = await axios.post('http://localhost:5000/api/promotions', values);
            message.success(response.data.message);
            setIsModalVisible(false);
            form.resetFields();
            // Cập nhật lại danh sách khuyến mãi sau khi thêm
            const updatedPromotions = [...promotions, response.data.promotion];
            setPromotions(updatedPromotions);
        } catch (error) {
            message.error('Lỗi khi thêm khuyến mãi: ' + error.message);
        }
    };

    const columns = [
        {
            title: 'Mã Khuyến Mãi',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Mô Tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Loại',
            dataIndex: 'discountType',
            key: 'discountType',
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (text, promotion) => (
                <Button type="primary" onClick={() => showUpdatePromotion(promotion)}>
                    Cập Nhật
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h2>Quản Lý Khuyến Mãi</h2>
            <Button type="primary" onClick={showAddPromotionModal} style={{ marginBottom: 16 }}>
                Thêm Khuyến Mãi
            </Button>
            <Table dataSource={promotions} columns={columns} rowKey="_id" />

            <Modal
                title="Thêm Khuyến Mãi"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleAddPromotion}>
                    <Form.Item
                        name="code"
                        label="Mã Khuyến Mãi"
                        rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô Tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="discountType"
                        label="Loại Khuyến Mãi"
                        rules={[{ required: true, message: 'Vui lòng chọn loại khuyến mãi' }]}>
                        <Select placeholder="Chọn loại khuyến mãi">
                            <Option value="percentage">Phần trăm</Option>
                            <Option value="fixed">Số tiền cố định</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Thêm Khuyến Mãi
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PromotionManagement;
