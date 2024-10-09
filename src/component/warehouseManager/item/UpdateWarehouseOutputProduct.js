import React, { useEffect, useState, useContext } from 'react';
import { getAllWarehouse, updateWarehouseEntry, getCategories, addCategory } from '../../../untills/api';
import styles from './UpdateWarehouseOutputProduct.module.css';
import { AuthContext } from '../../../untills/context/AuthContext';

const ExportProduct = () => {
    const { user } = useContext(AuthContext);
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
    const [currentPage, setCurrentPage] = useState(1);
    const [exportedProducts, setExportedProducts] = useState([]);

    const itemsPerPage = 9;

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

    // Nut thực hiện update dữ liệu mang ra quầy bán
    const handleExport = async (e) => {
        e.preventDefault();
        if (!selectedEntry || !sellingPrice || !quantityToTake || !selectedCategory) {
            alert('Vui lòng điền đủ thông tin.');
            return;
        }
        
        try {
            const warehouseData = new FormData();
            warehouseData.append('sellingPrice', parseFloat(sellingPrice));
            warehouseData.append('quantityToTake', parseInt(quantityToTake));
            warehouseData.append('description', description);
            if (image) {
                warehouseData.append('image', image);
            }
            warehouseData.append('categoryId', selectedCategory);
            warehouseData.append('createdByOut', user?._id);

            const response = await updateWarehouseEntry(selectedEntry._id, warehouseData);
            alert(response.message);

            // Thêm sản phẩm đã xuất vào danh sách exportedProducts
            setExportedProducts(prev => [
                ...prev,
                {
                    productName: selectedEntry.productName,
                    quantityToTake,
                    sellingPrice,
                    categoryName: categories.find(cat => cat._id === selectedCategory)?.name || 'Khác',
                    createdByOut: user.fullName,
                    exportDate: new Date().toLocaleDateString(),
                }
            ]);

            setIsModalOpen(false);
            setSelectedEntry(null);
            setSellingPrice('');
            setQuantityToTake('');
            setDescription('');
            setImage(null);
            setSelectedCategory('');
            setNewCategoryName('');
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

    const totalPages = Math.ceil(warehouses.length / itemsPerPage);
    const sortedWarehouses = warehouses.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate));
    const paginatedWarehouses = sortedWarehouses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };
    
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };
    
    return (
        <div className={styles.container}>
            <h2>Xuất Sản Phẩm Từ Kho</h2>
            <div className={styles.warehouseList}>
                {paginatedWarehouses.map((warehouse) => (
                    <div className={styles.warehouseItem} key={warehouse._id}>
                        <span className={styles.productName}>{warehouse.productName}</span>
                        <span className={styles.productQuantity}>Số lượng: {warehouse.quantity}</span>
                        <span className={styles.productPrice}>Giá nhập: {warehouse.purchasePrice}</span>
                        <button className={styles.exportButton} onClick={() => handleOpenModal(warehouse)}>Xuất</button>
                    </div>
                ))}
            </div>
    
            <div className={styles.pagination}>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Trước
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Tiếp
                </button>
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
                            <div className={styles.categoryWrapper}>
                                <label>Thuộc nhóm hàng</label>
                                <div className={styles.categorySelectContainer}>
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
                                        <option value="other">Khác</option>
                                    </select>
                                    {selectedCategory === 'other' && (
                                        <>
                                            <input
                                                type="text"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                placeholder="Tên nhóm hàng mới"
                                                required
                                            />
                                            <button type="button" onClick={handleAddCategory}>
                                                Thêm nhóm hàng
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label>Mô tả</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Hình ảnh</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <button type="submit">Xuất sản phẩm</button>
                            <button type="button" onClick={() => setIsModalOpen(false)}>Đóng</button>
                        </form>
                    </div>
                </div>
            )}
    
            {/* Hiển thị danh sách sản phẩm đã xuất */}
            {exportedProducts.length > 0 && (
                <div className={styles.exportedListContainer}>
                    <h2 className={styles.exportedListTitle}>Danh Sách Sản Phẩm Đã Xuất</h2>
                    <table className={styles.exportedListTable}>
                        <thead className={styles.exportedListHeader}>
                            <tr>
                                <th>Tên Sản Phẩm</th>
                                <th>Số Lượng Xuất</th>
                                <th>Giá</th>
                                <th>Nhóm Hàng</th>
                                <th>Người Xuất</th>
                                <th>Ngày Xuất</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exportedProducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.productName}</td>
                                    <td>{product.quantityToTake}</td>
                                    <td>{product.sellingPrice}</td>
                                    <td>{product.categoryName}</td>
                                    <td>{product.createdByOut}</td>
                                    <td>{product.exportDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ExportProduct;
