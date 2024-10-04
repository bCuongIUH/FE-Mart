import React, { useEffect, useState } from 'react';
import { getAllWarehouse, updateWarehouseEntry } from '../../../untills/api';
import styles from './UpdateWarehouseOutputProduct.module.css'; 

const ExportProduct = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [sellingPrice, setSellingPrice] = useState('');
    const [quantityToTake, setQuantityToTake] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const data = await getAllWarehouse();
                setWarehouses(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách kho:', error);
            }
        };
        fetchWarehouses();
    }, []);

    const handleOpenModal = (entry) => {
        setSelectedEntry(entry);
        setIsModalOpen(true);
    };

    const handleExport = async (e) => {
        e.preventDefault();
        if (!selectedEntry || !sellingPrice || !quantityToTake) {
            alert('Vui lòng điền đủ thông tin.');
            return;
        }

        try {
            const warehouseData = {
                sellingPrice: parseFloat(sellingPrice),
                quantityToTake: parseInt(quantityToTake),
                description,
                image: image ? URL.createObjectURL(image) : null,
            };

            const response = await updateWarehouseEntry(selectedEntry._id, warehouseData); 
            alert(response.message);
            // Reset 
            setIsModalOpen(false);
            setSelectedEntry(null);
            setSellingPrice('');
            setQuantityToTake('');
            setDescription('');
            setImage('');
        } catch (error) {
            alert('Lỗi khi xuất sản phẩm: ' + error.message);
        }
    };
    // chọn ảnh
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file); 
        }
    };

    return (
        <div className={styles.container}>
            <h2>Xuất Sản Phẩm Từ Kho</h2>
            <div className={styles.warehouseList}>
                {warehouses.map((warehouse) => (
                    <div className={styles.warehouseItem} key={warehouse._id}>
                        <span className={styles.productName}>{warehouse.productName}</span>
                        <span className={styles.productQuantity}>Số lượng: {warehouse.quantity}</span>
                        <span className={styles.productPrice}>Giá nhập: {warehouse.purchasePrice}</span>
                        <button className={styles.exportButton} onClick={() => handleOpenModal(warehouse)}>Xuất</button>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Nhập thông tin xuất kho</h3>
                        <form onSubmit={handleExport}>
                            <div>
                                <label>Giá bán:</label>
                                <input
                                    type="number"
                                    value={sellingPrice}
                                    onChange={(e) => setSellingPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Số lượng xuất:</label>
                                <input
                                    type="number"
                                    value={quantityToTake}
                                    onChange={(e) => setQuantityToTake(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Mô tả:</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Hình ảnh:</label>
                                <input
                                    type="file"
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    required 
                                />
                            </div>
                            <div className={styles.modalButtons}>
                                <button type="submit">Xác Nhận Xuất Kho</button>
                                <button type="button" onClick={() => setIsModalOpen(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExportProduct;