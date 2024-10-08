import React, { useEffect, useState } from 'react';
import { getAllWarehouse, updateWarehouseEntry, getCategories, addCategory } from '../../../untills/api';
import styles from './UpdateWarehouseOutputProduct.module.css';

const ExportProduct = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [quantityToTake, setQuantityToTake] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const data = await getAllWarehouse();
                setWarehouses(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách kho:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const categoryData = await getCategories();
                setCategories(categoryData.categories);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách nhóm hàng:', error);
            }
        };

        fetchWarehouses();
        fetchCategories();
    }, []);

    const handleOpenModal = (entry) => {
        setSelectedEntry(entry);
        setIsModalOpen(true);
    };
    //nút thực hiện chức năng xuất hóa đơn
    const handleExport = async (e) => {
        e.preventDefault();
        if (!selectedEntry || !sellingPrice || !quantityToTake || !selectedCategory) {
            alert('Vui lòng điền đủ thông tin.');
            return;
        }
        // console.log("rứa thâu 1 :", selectedCategory); 
      
        try {
            const warehouseData = {
                sellingPrice: parseFloat(sellingPrice),
                quantityToTake: parseInt(quantityToTake),
                description,
                image: image ? URL.createObjectURL(image) : null,
                categoryId: selectedCategory,
            };
            // console.log("rứa thâu 2:", warehouseData); 
            const response = await updateWarehouseEntry(selectedEntry._id, warehouseData);
            alert(response.message);
            // Reset 
            setIsModalOpen(false);
            setSelectedEntry(null);
            setSellingPrice('');
            setQuantityToTake('');
            setDescription('');
            setImage(null);
            setSelectedCategory('');
        } catch (error) {
            alert('Lỗi khi xuất sản phẩm: ' + error.message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };
    //thêm loại sp
    const handleAddCategory = async () => {
        if (!newCategoryName) {
            alert('Vui lòng nhập tên nhóm hàng mới.');
            return;
        }

        try {
            const response = await addCategory({ name: newCategoryName });
            alert(response.message);
            setCategories([...categories, response.category]);
            setNewCategoryName('');
        } catch (error) {
            alert('Lỗi khi thêm nhóm hàng: ' + error.message);
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
                                <label>Giá bán</label>
                                <input
                                    type="number"
                                    value={sellingPrice}
                                    onChange={(e) => setSellingPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Số lượng xuất</label>
                                <input
                                    type="number"
                                    value={quantityToTake}
                                    onChange={(e) => setQuantityToTake(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Thuộc nhóm hàng</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    required
                                >
                                    <option value="">Chọn nhóm hàng</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
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
                        {/* <div>
                            <h4>Hoặc thêm nhóm hàng mới:</h4>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Tên nhóm hàng mới"
                            />
                            <button onClick={handleAddCategory}>Thêm nhóm hàng</button>
                        </div> */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExportProduct;
