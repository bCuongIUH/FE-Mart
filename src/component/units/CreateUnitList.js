import React, { useContext, useState } from 'react';
import { createUnitList } from '../../untills/unitApi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../untills/context/AuthContext';

const CreateUnitList = () => {
    const [name, setName] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { name, createdBy: user?._id, description, isActive }; // Sử dụng user.name
            const result = await createUnitList(data);
            setMessage(result.message);
            navigate('/update-conversion-rate');
        } catch (error) {
            setMessage('Lỗi khi tạo bảng đơn vị tính');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Tạo Bảng Đơn Vị Tính</h2>
            <input type="text" placeholder="Tên" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder="Người tạo" value={user?._id || ''} readOnly /> 
            <textarea placeholder="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <label>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Kích hoạt
            </label>
            <button type="submit">Tạo</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default CreateUnitList;
