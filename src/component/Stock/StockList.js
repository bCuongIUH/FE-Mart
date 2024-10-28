import React, { useEffect, useState } from 'react';
import { getAllStocks } from '../../untills/stockApi';
import { Table, message } from 'antd';

const { Column } = Table;

const StockList = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStocks = async () => {
            setLoading(true);
            try {
                const stockData = await getAllStocks();
                console.log('Stock Data:', stockData);
                setStocks(stockData.stocks || []);
            } catch (error) {
                setError(error.message);
                message.error(error.message); // Display error message
            } finally {
                setLoading(false);
            }
        };

        fetchStocks();
    }, []);

    
    const processedStocks = stocks.map(stock => {
      
        const convertedValue = Math.floor(stock.conversionValue * stock.quantity); 

        return {
            ...stock,
            convertedValue,
        };
    });

    return (
        <Table dataSource={processedStocks} loading={loading} rowKey="productId">
            <Column title="Mã SP" dataIndex="productCode" key="productCode" />
            <Column title="Tên sản phẩm" dataIndex="productName" key="productName" />
            {/* <Column 
                title="Hình ảnh" 
                dataIndex="image" 
                key="image" 
                render={image => <img src={image} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} />} 
            /> */}
            <Column title="Đơn vị tính" dataIndex="unit" key="unit" />
            <Column title="Số lượng tồn" dataIndex="quantity" key="quantity" />
            <Column title="Số lượng cơ bản" dataIndex="convertedValue" key="convertedValue" render={value => value} /> {/* No decimal places */}
        </Table>
    );
};

export default StockList;
