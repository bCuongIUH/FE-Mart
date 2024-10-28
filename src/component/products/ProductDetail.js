import React, { useEffect, useState } from 'react';
import { Button, Image, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Barcode from './Barcode';
import { getCategories } from '../../untills/api';
import './ProductDetail.css';

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

    return (
        <div className="pdt-product-detail-container">
            <h2 className="pdt-title">Chi tiết sản phẩm</h2>
            <Button type="primary" className="pdt-button-back" onClick={onBack}>
                Quay lại
            </Button>

            <div className="pdt-product-card">
            <Image
                    src={product.image}
                    alt={product.name}
                    width={500}
                    height={500}
                />
                <div className="pdt-product-info">
                    <div className="pdt-product-name">{product.name}</div>
                    <hr className="pdt-divider" />
                    <div className="pdt-product-item">
                        {categories.find(category => category._id === product.category)?.name || 'Không xác định'}
                    </div>
                    <div className="pdt-product-item">
                        <strong>Mã:</strong> {product.code}
                    </div>
                    <div className="pdt-product-item">
                        <strong>Mã vạch:</strong> {product.barcode}
                    </div>
                    
                    <div className="pdt-product-item-mota">
                        <strong>Chi tiết sản phẩm</strong> <br></br>
                        {product.description || 'Không có mô tả'}
                    </div>
                
                </div>
              
            
                <div className="pdt-action-buttons">
                    <Button type="default" icon={<EditOutlined />} className="pdt-edit-button">
                        Chỉnh sửa
                    </Button>
                    <Button type="default" icon={<DeleteOutlined />} className="pdt-delete-button">
                        Xóa
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
