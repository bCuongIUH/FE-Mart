import React, { useEffect, useState } from 'react';
// import { getAllProducts, createPriceListHeader, addProductsToPriceList, getDetailsByLineId } from './api'; 
import { message } from 'antd'; 
import { addProductsToPriceList,createPriceListHeader } from '../../untills/priceApi';
import { getAllProducts } from '../../untills/api';

const CreatePriceList = () => {
    const [products, setProducts] = useState([]);
    const [priceList, setPriceList] = useState({ code: '', name: '', description: '', startDate: '', endDate: '' });
    const [productPrices, setProductPrices] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data); // Lưu danh sách sản phẩm
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm:", error);
            }
        };
        fetchProducts();
    }, []);

    const handlePriceChange = (productId, unitDetail, price) => {
        setProductPrices(prevPrices => {
            const updatedPrices = [...prevPrices];
            const existingPrice = updatedPrices.find(p => p.productId === productId);

            if (existingPrice) {
                const existingUnitPrice = existingPrice.unitPrices.find(up => up.unitDetail === unitDetail);
                if (existingUnitPrice) {
                    existingUnitPrice.price = price; // Cập nhật giá cho đơn vị tính đã tồn tại
                } else {
                    existingPrice.unitPrices.push({ unitDetail, price }); // Thêm mới nếu chưa tồn tại
                }
            } else {
                updatedPrices.push({
                    productId,
                    unitPrices: [{ unitDetail, price }],
                });
            }
            return updatedPrices;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: priceListHeader } = await createPriceListHeader(priceList); // Tạo header bảng giá
            await addProductsToPriceList({ priceListId: priceListHeader._id, products: productPrices }); // Thêm giá vào sản phẩm
            message.success('Tạo bảng giá thành công!');
            setProductPrices([]); // Reset lại giá sản phẩm
            setPriceList({ code: '', name: '', description: '', startDate: '', endDate: '' }); // Reset bảng giá
        } catch (error) {
            console.error("Lỗi khi tạo bảng giá:", error);
            message.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div>
            <h1>Tạo Bảng Giá</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Mã bảng giá"
                        value={priceList.code}
                        onChange={e => setPriceList({ ...priceList, code: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Tên bảng giá"
                        value={priceList.name}
                        onChange={e => setPriceList({ ...priceList, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Mô tả"
                        value={priceList.description}
                        onChange={e => setPriceList({ ...priceList, description: e.target.value })}
                    />
                </div>
                <div>
                    <input
                        type="date"
                        value={priceList.startDate}
                        onChange={e => setPriceList({ ...priceList, startDate: e.target.value })}
                        required
                    />
                    <input
                        type="date"
                        value={priceList.endDate}
                        onChange={e => setPriceList({ ...priceList, endDate: e.target.value })}
                        required
                    />
                </div>
                <h2>Chọn Sản Phẩm và Giá</h2>
                {products.map(product => (
                    <div key={product._id}>
                        <h3>{product.name}</h3>
                        {/* Gọi API để lấy đơn vị tính cho sản phẩm */}
                        {product.units && product.units.map(unit => (
                            <div key={unit.unitDetail}>
                                <label>{unit.unitDetail}: </label>
                                <input
                                    type="number"
                                    placeholder="Giá"
                                    onChange={e => handlePriceChange(product._id, unit.unitDetail, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                ))}
                <button type="submit">Tạo Bảng Giá</button>
            </form>
        </div>
    );
};

export default CreatePriceList;
