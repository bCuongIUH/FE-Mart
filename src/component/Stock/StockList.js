import React, { useEffect, useState } from 'react';
import { getAllStocks } from '../../untills/stockApi';
import { getAllProducts } from '../../untills/api';
import { Table } from 'antd';
const { Column } = Table;

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            try {
                const stockData = await getAllStocks();
                console.log('Stock Data:', stockData);
                setStocks(stockData.stocks || []);

                const productData = await getAllProducts();
                console.log('Product Data:', productData);
                setProducts(productData.products || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, []);

    const stockData = stocks.map(stock => {
        const productIdStr = stock.productId.trim();
        const product = products.find(p => p._id.trim() === productIdStr);

        console.log('Checking productId:', productIdStr, 'Found product:', product);

        return {
            productId: stock.productId,
            code: stock.productCode,
            productName: stock.productName ,
            image:stock.image ,
            unit: stock.stocks.map(s => s.unit).join(', '),
            quantity: stock.stocks.map(s => s.quantity).join(', '),
        };
    });

    return (
        <Table dataSource={stockData} loading={loading} rowKey="productId">
            <Column title="Mã SP" dataIndex="code" key="code" />
            <Column title="Tên sản phẩm" dataIndex="productName" key="productName" />
            <Column title="Hình ảnh" dataIndex="image" key="image" render={image => <img src={image} alt="product" style={{ width: 50, height: 50 }} />} />
            <Column title="Đơn vị" dataIndex="unit" key="unit" />
            <Column title="Số lượng tồn" dataIndex="quantity" key="quantity" />
        </Table>
    );
};

export default StockList;
