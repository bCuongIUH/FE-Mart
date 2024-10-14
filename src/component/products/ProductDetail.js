import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Tag, Row, Col, Card, Image, message, Switch } from 'antd';
import { getCategories, updateProductStatus } from '../../untills/api'; 

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

    // Hàm xử lý thay đổi trạng thái bán
    const handleSwitchChange = async (checked, productId) => {
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
                {/* Cột bên trái: Thông tin sản phẩm */}
                <Col span={8}>
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
                    </Card>
                </Col>

                {/* Cột giữa: Trạng thái bán */}
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
                            <Descriptions.Item label="Giá bán">{product.price}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Cột bên phải: Chương trình khuyến mãi */}
                <Col span={8}>
                    <Card title="Chương trình khuyến mãi">
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
