import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdatePromotion = () => {
    const [form] = Form.useForm();
    const { promotionId } = useParams(); // Lấy ID khuyến mãi từ URL
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch thông tin khuyến mãi từ API
        const fetchPromotion = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/promotions/${promotionId}`);
                form.setFieldsValue(response.data); // Đặt giá trị cho form
            } catch (error) {
                message.error('Lỗi khi lấy thông tin khuyến mãi: ' + error.message);
            }
        };

        fetchPromotion();
    }, [promotionId, form]);

    const handleUpdatePromotion = async (values) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/promotions/${promotionId}`, values);
            message.success(response.data.message);
            navigate('/promotions'); // Quay lại trang quản lý khuyến mãi
        } catch (error) {
            message.error('Lỗi khi cập nhật khuyến mãi: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Cập Nhật Khuyến Mãi</h2>
            <Form form={form} layout="vertical" onFinish={handleUpdatePromotion}>
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
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Cập Nhật Khuyến Mãi
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdatePromotion;
