import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Tag, Row, Col, Card, Image, message, Switch, Select } from 'antd';
import Barcode from './Barcode';
import { getCategories, updateProductStatus } from '../../untills/api';
import { getDetailsByLineId } from '../../untills/unitApi';

const { Option } = Select;

const ProductDetail = ({ product, onBack }) => {
    const [categories, setCategories] = useState([]);
    const [isAvailable, setIsAvailable] = useState(product.isAvailable);
    const [details, setDetails] = useState([]);
    const [selectedDetailId, setSelectedDetailId] = useState(null);
    const [quantity, setQuantity] = useState(product.quantity);
    const [displayQuantity, setDisplayQuantity] = useState(0);

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

    useEffect(() => {
        const fetchDetails = async () => {
            if (product.units.length > 0) {
                const lineId = product.units[0].unitLine; 
                try {
                    const detailsData = await getDetailsByLineId(lineId);
                    setDetails(detailsData);

                    // Chọn chi tiết đầu tiên
                    if (detailsData.length > 0) {
                        const firstDetailId = detailsData[0]._id;
                        setSelectedDetailId(firstDetailId);
                        const value = detailsData[0].value || 1; 
                        setDisplayQuantity(quantity / value);
                    }
                } catch (error) {
                    message.error('Lỗi khi lấy thông tin chi tiết.');
                }
            }
        };

        fetchDetails();
    }, [product]);

    const handleSwitchChange = async (checked) => {
        setIsAvailable(checked);
        const updatedStatus = await updateProductStatus(product._id, { isAvailable: checked });
        if (updatedStatus) {
            message.success('Cập nhật trạng thái thành công!');
        } else {
            message.error('Cập nhật trạng thái thất bại!');
        }
    };

    const handleDetailChange = (detailId) => {
        setSelectedDetailId(detailId);
        
        const selectedDetail = details.find(detail => detail._id === detailId);
        if (selectedDetail) {
            const value = selectedDetail.value || 1; // Tránh chia cho 0
            setDisplayQuantity(quantity / value);
        } else {
            setDisplayQuantity(0); // Reset nếu không tìm thấy chi tiết
        }
    };

    return (
        <div>
            <h2>Chi tiết sản phẩm</h2>
            <Row gutter={16}>
                <Col span={16}>
                    <Card title="Thông tin Sản phẩm">
                        <Image
                            src={product.image}
                            alt={product.name}
                            width={100}
                            height={100}
                            style={{ marginBottom: 16 }}
                        />
                        <Descriptions column={1}>
                            <Descriptions.Item label="Mã">{product.code}</Descriptions.Item>
                            <Descriptions.Item label="Mã vạch">{product.barcode}</Descriptions.Item>
                            <Descriptions.Item label="Tên sản phẩm">{product.name}</Descriptions.Item>
                            <Descriptions.Item label="Phân loại">
                                {categories.find(category => category._id === product.category)?.name || 'Không xác định'}
                            </Descriptions.Item>
                        </Descriptions>
                        <div style={{ textAlign: 'center', marginTop: -100 }}>
                            <Barcode code={product.barcode} />
                        </div>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card title="Trạng thái bán">
                        <Descriptions column={1}>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={isAvailable ? "green" : "red"}>
                                    {isAvailable ? 'Đang bán' : 'Ngưng bán'}
                                </Tag>
                                <Switch 
                                    checked={isAvailable} 
                                    onChange={handleSwitchChange}
                                    style={{ marginLeft: 16 }} 
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Số Lượng">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span>
                                    {displayQuantity.toFixed(2)} 
                                </span>
                                <Select
                                    defaultValue={details.length > 0 ? details[0]._id : null}
                                    style={{ width: '200px', marginLeft: 10 }}
                                    onChange={handleDetailChange}
                                    value={selectedDetailId} 
                                >
                                    {details.map(detail => (
                                        <Option key={detail._id} value={detail._id}>
                                            {`${detail.name}`} 
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </Descriptions.Item>


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
