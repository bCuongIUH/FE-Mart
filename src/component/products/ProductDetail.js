import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Tag, Row, Col, Card, Image,message } from 'antd';
import { getCategories } from '../../untills/api';

const ProductDetail = ({ product, onBack }) => {
    const [categories, setCategories] = useState([]);
  
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
    console.log("123",categories);
  
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
                {product.isAvailable ? (
                  <Tag color="green">Đang bán</Tag>
                ) : (
                  <Tag color="red">Ngưng bán</Tag>
                )}
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
                {/* Bạn có thể thêm thông tin về chương trình khuyến mãi ở đây */}
                Không có khuyến mãi
              </Descriptions.Item>
              {/* Thêm thông tin chương trình khác nếu có */}
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
