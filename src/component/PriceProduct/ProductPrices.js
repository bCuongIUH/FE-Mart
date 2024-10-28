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
                            <p><strong>Đơn vị cơ bản:</strong> {product.baseUnit.name} (Giá trị chuyển đổi: {product.baseUnit.conversionValue})</p>

                            <h3>Tồn kho:</h3>
                            <ul>
                                {product.stock.map(stockItem => (
                                    <li key={stockItem.unit}>
                                        {stockItem.unit}: {stockItem.quantity}
                                    </li>
                                ))}
                            </ul>

                            <h3>Giá:</h3>
                            <ul>
                                {product.prices.map(price => (
                                    <li key={price._id}>
                                        {price.unitName}: {price.price} VNĐ
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
