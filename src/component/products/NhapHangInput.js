import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Select, InputNumber, Table, Modal, notification } from 'antd';
import { addWarehouseEntry, getAllSuppliers, getAllUsers } from '../../untills/api'; 
import styles from './NhapHangInput.module.css'; 
import { AuthContext } from '../../untills/context/AuthContext';

const { Option } = Select;

const NhapHangInput = ({ selectedProducts, onCancel }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); 
    const { user } = useContext(AuthContext); 
    const currentDate = new Date().toLocaleString();

    useEffect(() => {
        const fetchSuppliers = async () => {
            const suppliersData = await getAllSuppliers();
            setSuppliers(suppliersData);
        };
        fetchSuppliers();
    }, []);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (user?._id) {
                try {
                    const userData = await getAllUsers(user._id);
                    setCurrentUser(userData); 
                } catch (error) {
                    console.error('Error fetching current user:', error);
                }
            }
        };
        fetchCurrentUser();
    }, [user]);

    useEffect(() => {
        const initialFormData = selectedProducts.map((product) => ({
            key: product.key,
            code: product.code,
            nameProduct: product.nameProduct,
            quantity: 0,             
            price: 0,                
            totalPrice: 0,           
            supplierId: null,        
            unit: 'Cái',             
            enteredBy: user._id,     
            productId: product.productId || product.key  
            
        }));
        setFormData(initialFormData);
    }, [selectedProducts, user]);

    const handleQuantityPriceChange = (value, key, type) => {
        const newFormData = [...formData];
        const index = newFormData.findIndex((item) => item.key === key);
        if (index !== -1) {
            newFormData[index][type] = value;
            newFormData[index].totalPrice = newFormData[index].quantity * newFormData[index].price;
            setFormData(newFormData);
        }
    };

    const handleSupplierChange = (supplierId, index) => {
      const updatedFormData = formData.map((item, idx) => {
          if (idx === index) {
              return {
                  ...item,
                  supplierId: supplierId, 
              };
          }
          return item;
      });
      setFormData(updatedFormData);
  };

    const handleRemoveProduct = (key) => {
        const newFormData = formData.filter((product) => product.key !== key);
        setFormData(newFormData);
    };

    const handlePayment = () => {
        const hasInvalidProducts = formData.some(product => 
            !product.supplierId || product.quantity <= 0 || product.price <= 0
        );

        if (hasInvalidProducts) {
            Modal.error({
                title: 'Lỗi',
                content: 'Vui lòng điền đầy đủ thông tin cho tất cả các sản phẩm trước khi xác nhận.',
            });
            return;
        }

        setIsModalVisible(true);
    };

    const handleConfirm = async () => {
        const entriesToAdd = formData.map(({ code, nameProduct, quantity, price, supplierId, unit, productId }) => ({
            code,
            nameProduct,
            quantity,
            price,
            supplierId,
            unit,
            totalPrice: quantity * price,
            enteredBy: user._id, 
            entryCode: `ENTRY-${new Date().getTime()}`,
            productId,
           
            
        }));
        console.log(entriesToAdd);
        try {
            await addWarehouseEntry({ 
                entryCode: `ENTRY-${new Date().getTime()}`, 
                enteredBy: user._id, 
                lines: entriesToAdd 
            });
            notification.success({
                message: 'Nhập hàng thành công',
                description: 'Đơn hàng đã được nhập thành công'
            });
            setIsModalVisible(false);
            onCancel();
        } catch (error) {
            console.error('Error during warehouse entry:', error);
            notification.error({
                message: 'Lỗi khi nhập hàng',
                description: error.response?.data.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
            });
        }
    };

    return (
        <div className={styles.container}>
            <h2>Nhập hàng cho các sản phẩm đã chọn</h2>
            <Table
                dataSource={formData}
                columns={[
                    { title: 'Mã sản phẩm', dataIndex: 'code', key: 'code' },
                    { title: 'Tên sản phẩm', dataIndex: 'nameProduct', key: 'nameProduct' },
                    {
                      title: 'Nhà cung cấp',
                      dataIndex: 'supplierId',
                      key: 'supplierId',
                      render: (text, record, index) => (
                          <Select
                              value={record.supplierId}
                              onChange={(value) => handleSupplierChange(value, index)} // Cập nhật với index
                              placeholder="Chọn nhà cung cấp"
                              style={{ width: '100%' }}
                          >
                              {suppliers.map((supplier) => (
                                  <Option key={supplier._id} value={supplier._id}>
                                      {supplier.name}
                                  </Option>
                              ))}
                          </Select>
                      ),
                  },
                    {
                        title: 'Đơn vị tính',
                        dataIndex: 'unit',
                        key: 'unit',
                        render: (text, record) => (
                            <Select
                                value={record.unit}
                                onChange={(value) => handleQuantityPriceChange(value, record.key, 'unit')}
                                style={{ width: '100%' }}
                            >
                                <Option value="Cái">Cái</Option>
                                <Option value="Kg">Kg</Option>
                                <Option value="Lít">Lít</Option>
                            </Select>
                        ),
                    },
                    {
                        title: 'Số lượng nhập',
                        dataIndex: 'quantity',
                        key: 'quantity',
                        render: (text, record) => (
                            <InputNumber
                                min={1}
                                value={record.quantity}
                                onChange={(value) => handleQuantityPriceChange(value, record.key, 'quantity')}
                                style={{ width: '100%' }}
                            />
                        ),
                    },
                    {
                        title: 'Giá mỗi sản phẩm',
                        dataIndex: 'price',
                        key: 'price',
                        render: (text, record) => (
                            <InputNumber
                                min={0}
                                value={record.price}
                                onChange={(value) => handleQuantityPriceChange(value, record.key, 'price')}
                                style={{ width: '100%' }}
                            />
                        ),
                    },
                    { title: 'Tổng tiền', dataIndex: 'totalPrice', key: 'totalPrice' },
                    {
                        title: 'Hành động',
                        key: 'action',
                        render: (text, record) => (
                            <Button style={{ backgroundColor: '#FFFFFF' }} onClick={() => handleRemoveProduct(record.key)} type="link" danger>
                                Xóa
                            </Button>
                        ),
                    },
                ]}
                pagination={false}
                style={{ width: '100%' }}
            />
            <div className={styles.footer}>
                <Form.Item label="Tổng giá trị đơn hàng">
                    <Input
                        value={formData.reduce((total, product) => total + product.totalPrice, 0)}
                        readOnly
                    />
                </Form.Item>
                <Button type="primary" onClick={handlePayment}>
                    Tiếp tục
                </Button>
                <Button style={{ marginLeft: 10 }} onClick={onCancel}>
                    Hủy
                </Button>
            </div>

            <Modal
                title="PHIẾU NHẬP KHO"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <h3>Thông tin đơn nhập</h3>
                <div>
                    <p>Mã phiếu nhập: ENTRY-{new Date().getTime()}</p>
                    <p>Người nhập: {user.fullName}</p>
                    <p>Thời gian: {currentDate}</p>
                </div>
                <Table
                    dataSource={formData}
                    columns={[
                        { title: 'Mã sản phẩm', dataIndex: 'code', key: 'code' },
                        { title: 'Tên sản phẩm', dataIndex: 'nameProduct', key: 'nameProduct' },
                        { title: 'Số lượng nhập', dataIndex: 'quantity', key: 'quantity' },
                        { title: 'Giá', dataIndex: 'price', key: 'price' },
                        { title: 'Tổng tiền', dataIndex: 'totalPrice', key: 'totalPrice' },
                    ]}
                    pagination={false}
                />
                <div style={{ textAlign: 'right', marginTop: 20 }}>
                    <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 10 }}>
                        Hủy
                    </Button>
                    <Button type="primary" onClick={handleConfirm}>
                        Xác nhận
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default NhapHangInput;
