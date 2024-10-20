import React, { useEffect, useState } from 'react';
import { getAllUnitList, updateConversionRate } from '../../untills/unitApi';

const UpdateConversionRate = () => {
    const [unitLists, setUnitLists] = useState([]); // State để lưu danh sách bảng đơn vị
    const [unitListId, setUnitListId] = useState('');
    const [fromUnitName, setFromUnitName] = useState('');
    const [toUnitName, setToUnitName] = useState('');
    const [factor, setFactor] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUnitLists = async () => {
            try {
                const data = await getAllUnitList();
                // Kiểm tra và lấy unitLists từ dữ liệu trả về
                if (Array.isArray(data.unitLists)) {
                    setUnitLists(data.unitLists);
                } else {
                    console.error('Dữ liệu không phải là mảng:', data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bảng đơn vị:', error);
            }
        };

        fetchUnitLists();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { unitListId, fromUnitName, toUnitName, factor };
            const result = await updateConversionRate(data);
            setMessage(result.message);
        } catch (error) {
            setMessage('Lỗi khi cập nhật quy đổi');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Cập Nhật Quy Đổi</h2>

            <select value={unitListId} onChange={(e) => setUnitListId(e.target.value)} required>
                <option value="" disabled>Chọn ID Bảng Đơn Vị</option>
                {Array.isArray(unitLists) && unitLists.map((unitList) => (
                    <option key={unitList._id} value={unitList._id}>
                        {unitList.name}
                    </option>
                ))}
            </select>

            <input type="text" placeholder="Tên Đơn Vị Nguồn" value={fromUnitName} onChange={(e) => setFromUnitName(e.target.value)} required />
            <input type="text" placeholder="Tên Đơn Vị Đích" value={toUnitName} onChange={(e) => setToUnitName(e.target.value)} required />
            <input type="number" placeholder="Tỉ Lệ Quy Đổi" value={factor} onChange={(e) => setFactor(e.target.value)} required />

            <button type="submit">Cập Nhật</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default UpdateConversionRate;