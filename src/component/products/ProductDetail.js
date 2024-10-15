import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Tag, Row, Col, Card, Image, message, Switch } from 'antd';
import { getCategories, updateProductStatus } from '../../untills/api';
import Barcode from './Barcode'; 

const ProductDetail = ({ product, onBack }) => {
    const [categories, setCategories] = useState([]);
    const [isAvailable, setIsAvailable] = useState(product.isAvailable);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (Array.isArray(response.categories)) {
                    setCategories(response.categories);
                } else {
                    message.error('Dữ liệu danh mục không hợp lệ!');
                }
            } catch (error) {
                message.error('Lỗi khi lấy danh mục: ' + (error.response?.data.message || 'Vui lòng thử lại!'));
            }
        };

        fetchCategories();
    }, []);

    const handleSwitchChange = async (checked, productId) => {
        if (product.quantity === 0 && checked) {
            message.warning('Không thể cập nhật trạng thái thành Đang bán vì sản phẩm hiện tại không còn hàng!');
            return;
        }

        if (checked && (!product.currentPrice || product.currentPrice <= 0)) {
            message.warning('Không thể cập nhật trạng thái thành Đang bán vì giá sản phẩm không hợp lệ!');
            return;
        }

        setIsAvailable(checked);
        try {
            await updateProductStatus(productId, checked);
            message.success(`Trạng thái sản phẩm đã ${checked ? 'cập nhật thành Đang bán' : 'cập nhật thành Ngưng bán'}`);
        } catch (error) {
            message.error('Cập nhật trạng thái không thành công!');
            setIsAvailable(!checked);
        }
    };

    return (
        <div>
            <h2>Chi tiết sản phẩm</h2>
            <Row gutter={16}>
                {/* Cột bên trái: Thông tin chi tiết sản phẩm chiếm 2 phần */}
                <Col span={16}>
                    <Card title="Thông tin Sản phẩm">
                        <Image
                            src={product.image}
                            alt={product.nameProduct}
                            width={100}
                            height={100}
                            style={{ marginBottom: 16 }}
                        />
                        <Descriptions column={1}>
                            <Descriptions.Item label="Mã">{product.code}</Descriptions.Item>
                            <Descriptions.Item label="Mã vạch">{product.barcode}</Descriptions.Item>
                            <Descriptions.Item label="Tên sản phẩm">{product.nameProduct}</Descriptions.Item>
                            <Descriptions.Item label="Phân loại">
                                {categories.find(category => category._id === product.category)?.name || 'Không xác định'}
                            </Descriptions.Item>
                        </Descriptions>
                        
                       
                        <div style={{ textAlign: 'center', marginTop: -100 }}>
                            <Barcode code={product.barcode} />
                        </div>
                    </Card>
                </Col>

                {/* Cột bên phải: Trạng thái bán và Chương trình khuyến mãi */}
                <Col span={8}>
                    <Card title="Trạng thái bán">
                        <Descriptions column={1}>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={isAvailable ? "green" : "red"}>
                                    {isAvailable ? 'Đang bán' : 'Ngưng bán'}
                                </Tag>
                                <Switch 
                                    checked={isAvailable} 
                                    onChange={(checked) => handleSwitchChange(checked, product.key)}
                                    style={{ marginLeft: 16 }} 
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Số lượng">{product.quantity}</Descriptions.Item>
                            <Descriptions.Item label="Giá bán">{product.currentPrice.toLocaleString()} đ</Descriptions.Item>
                        </Descriptions>
                    </Card>

                    <Card title="Chương trình khuyến mãi" style={{ marginTop: 16 }}>
                        <Descriptions column={1}>
                            <Descriptions.Item label="Khuyến mãi hiện tại">
                                Không có khuyến mãi
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
            </Row>

            <Button type="primary" onClick={onBack} style={{ marginTop: 16 }}>
                Quay lại danh sách
            </Button>
        </div>
    );
};

export default ProductDetail;
