import React, { useEffect, useState } from 'react';
import { getAllPriceProduct } from '../../untills/priceApi';

const ProductPrices = () => {
    const [prices, setPrices] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const data = await getAllPriceProduct();
                if (data.success) {
                    setPrices(data.prices);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPrices();
    }, []); // Chạy một lần khi component mount

    return (
        <div>
            <h1>Giá Sản Phẩm</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {prices.length > 0 ? (
                <ul>
                    {prices.map(product => (
                        <li key={product.productId}>
                            <h2>{product.productName}</h2>
                            <img src={product.image} alt={product.productName} style={{ width: '100px', height: '100px' }} />
                            <p><strong>Mô tả:</strong> {product.description}</p>
                            
                            <h3>Đơn vị và Giá:</h3>
                            <ul>
                                {product.units.map((unit) => (
                                    <li key={unit.unitName}>
                                        <p><strong>Đơn vị:</strong> {unit.unitName}</p>
                                        <p><strong>Số lượng tồn kho:</strong> {unit.quantity}</p>
                                        <p><strong>Giá:</strong> {unit.price} VNĐ</p>
                                        <p><strong>Giá trị chuyển đổi:</strong> {unit.conversionValue}</p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không có dữ liệu sản phẩm.</p>
            )}
        </div>
    );
};

export default ProductPrices;
