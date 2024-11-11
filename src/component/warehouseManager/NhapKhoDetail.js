import React, { useState, useEffect, useContext } from 'react';
import { createWarehouseEntry, getAllProducts, getAllSuppliers } from '../../untills/api';
import { AuthContext } from '../../untills/context/AuthContext';
import { Table, Input, Select, Button, message, AutoComplete } from 'antd';
import { MinusCircleOutlined,SaveOutlined, CloseOutlined } from '@ant-design/icons'; 
import styles from './WarehouseEntryForm.module.css';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const WarehouseEntryForm = ({ onCancel, onEntryCreated  }) => {
  const { user } = useContext(AuthContext); 
  const [suppliers, setSuppliers] = useState([]);
  const [entryCode, setEntryCode] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null); 
  const [entryProducts, setEntryProducts] = useState([{ productCode: '', unit: '', quantity: 0, name: '', image: '', conversionUnits: [], baseUnit: '' }]);
  const [allProducts, setAllProducts] = useState([]);
    const navigate = useNavigate();
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getAllSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error('Lỗi khi lấy nhà cung cấp:', error);
        message.error('Không thể lấy nhà cung cấp.');
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setAllProducts(data);
      } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        message.error('Không thể lấy sản phẩm.');
      }
    };

    fetchSuppliers();
    fetchProducts();
  }, []);


  const handleProductCodeChange = (index, code) => {
    const updatedProducts = [...entryProducts];
    const product = allProducts.find(p => p.code === code);

    if (product) {
        // Lấy thông tin sản phẩm từ cơ sở dữ liệu
        updatedProducts[index] = {
            productCode: code,
            unit: '',
            quantity: 0,
            name: product.name,
            image: product.image,
            conversionUnits: product.conversionUnits,
            baseUnit: product.baseUnit?.name || '',
            productId: product._id
        };
    } else {
        updatedProducts[index] = {
            productCode: code,
            unit: '',
            quantity: 0,
            name: '',
            image: '',
            conversionUnits: [],
            baseUnit: '',
            productId: ''
        };
    }
    setEntryProducts(updatedProducts);
};

const handleUnitChange = (index, unit) => {
  const updatedProducts = [...entryProducts];
  const product = updatedProducts[index];

  // Kiểm tra nếu `productId` và `unit` đã có trong danh sách
  const isDuplicate = updatedProducts.some(
      (p, i) => i !== index && p.productId === product.productId && p.unit === unit
  );

  if (isDuplicate) {
      message.warning("Sản phẩm này với đơn vị này đã tồn tại trong danh sách nhập kho.");
      // Xóa sản phẩm trùng lặp khỏi danh sách
      updatedProducts.splice(index, 1);
      setEntryProducts(updatedProducts);
      return; // Dừng lại nếu trùng lặp
  }

  // Cập nhật đơn vị nếu không trùng lặp
  updatedProducts[index].unit = unit;
  setEntryProducts(updatedProducts);
};


const handleAddProduct = () => {
    setEntryProducts(prevProducts => [
        ...prevProducts,
        { productCode: '', unit: '', quantity: 0, name: '', image: '', conversionUnits: [], baseUnit: '' }
    ]);
};


  const handleQuantityChange = (index, quantity) => {
    const updatedProducts = [...entryProducts];
    updatedProducts[index].quantity = Number.isNaN(parseInt(quantity)) ? 0 : parseInt(quantity);
    setEntryProducts(updatedProducts);
  };
  const handleRemoveProduct = (index) => {
    const updatedProducts = entryProducts.filter((_, i) => i !== index);
    setEntryProducts(updatedProducts);
  };

  // Hàm xử lý khi nhấn nút Lưu
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo đối tượng phiếu nhập kho
    const entryData = {
        entryCode: entryCode,
        supplierId: selectedSupplier, 
        enteredBy: user._id,
        products: entryProducts.map(product => ({
            productId: product.productId, 
            quantity: product.quantity,     
            unit: product.unit             
        }))
    };

    try {
        const result = await createWarehouseEntry(entryData);
        message.success('Phiếu nhập kho đã được lưu thành công!');

        onEntryCreated();
        onCancel(); // Đóng form
        // Reset các trường nhập liệu sau khi lưu thành công
        setEntryCode('');
        setSelectedSupplier('');
        setEntryProducts([]);
    } catch (error) {
        console.error("Có lỗi xảy ra khi tạo phiếu nhập kho:", error);

        // Kiểm tra mã lỗi để hiển thị thông báo cụ thể cho người dùng
        if (error.response && error.response.status === 400 && error.response.data.message) {
            // Hiển thị thông báo lỗi từ phản hồi của API
            message.error(error.response.data.message);
        } else {
            // Hiển thị thông báo lỗi chung nếu không có thông báo chi tiết từ API
            message.error('Có lỗi xảy ra khi lưu phiếu nhập kho. Vui lòng thử lại!');
        }
    }
};





  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
      <div className={styles.headerWH}>
        Phiếu Nhập Kho
    </div>
        <div>
          <label  className={styles.textInfoWH}>Mã phiếu nhập:</label>
          <Input className={styles.shortInput} type="text" value={entryCode} onChange={(e) => setEntryCode(e.target.value)} required />
        </div>

        <div>
          <label className={styles.textInfoWH}>Nhà cung cấp:</label>
          <Select
            style={{ width: '20%', margin : '15px' }} 
            placeholder="Chọn nhà cung cấp"
            onChange={(value) => setSelectedSupplier(value)} // value sẽ là ID nhà cung cấp
            value={selectedSupplier}
          >
            {suppliers.map(supplier => (
              <Option key={supplier._id} value={supplier._id}> {/* Sử dụng ID của nhà cung cấp */}
                {supplier.name}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label className={styles.textInfoWH}>Người tạo phiếu:</label>
          <span>{user?.fullName || 'Chưa có thông tin'}</span>
        </div>

        <div className={styles.buttonContainerWH}>
          
        <Button type="button" onClick={onCancel} icon={<CloseOutlined />}>
          Hủy
        </Button>
        <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
          Lưu
        </Button>
      </div>
        
        <Table
          columns={[
            {
              title: 'Mã SP',
              dataIndex: 'productCode',
              width: 150,
              render: (text, record, index) => (
                <AutoComplete
                  className={styles.autoCompleteInput}
                  value={entryProducts[index]?.productCode}
                  onChange={(value) => handleProductCodeChange(index, value)}
                  placeholder="Nhập mã sản phẩm"
                  options={allProducts
                    .filter(product => product.code.toLowerCase().includes(entryProducts[index]?.productCode?.toLowerCase() || ''))
                    .slice(0, 3) 
                    .map(product => ({ value: product.code }))} 
                  dropdownRender={(menu) => (
                    <div>
                      {menu}
                      {allProducts.filter(product => product.code.toLowerCase().includes(entryProducts[index]?.productCode?.toLowerCase() || '')).length > 5 && (
                        <div style={{ padding: '8px', textAlign: 'center' }}>
                          <span>Cuộn để xem thêm...</span>
                        </div>
                      )}
                    </div>
                  )}
                />
              ),
            },
            {
              title: 'Tên SP',
              dataIndex: 'name', 
              width: 200,
              render: (text, record, index) => (
                <span>{entryProducts[index]?.name || '-'}</span>
              ),
            },
            {
              title: 'Hình ảnh',
              dataIndex: 'image',
              width: 100,
              render: (text, record, index) => (
                entryProducts[index]?.image ? (
                  <img src={entryProducts[index].image} alt={entryProducts[index].name} style={{ width: 70, height: 70 }} />
                ) : (
                  <span>-</span>
                )
              ),
            },
            {
              title: 'Đơn vị',
              dataIndex: 'unit',
              width: 250,
              render: (text, record, index) => {
                const currentProduct = entryProducts[index] || {};

                return (
                  <Select
                    style={{ width: '60%' }} 
                    value={currentProduct.unit || undefined}
                    onChange={(value) => handleUnitChange(index, value)}
                  >
                    {currentProduct.conversionUnits?.map((unit) => (
                      <Option key={unit._id} value={unit.name}>
                        {unit.name} (1 {unit.name} = {unit.conversionValue} {currentProduct.baseUnit || 'Đơn vị cơ bản'})
                      </Option>
                    ))}

                    {currentProduct.baseUnit && (
                      <Option key={currentProduct.baseUnit} value={currentProduct.baseUnit}>
                        {currentProduct.baseUnit} (1 {currentProduct.baseUnit} = 1)
                      </Option>
                    )}
                  </Select>
                );
              },
            },
            {
              title: 'Số lượng',
              dataIndex: 'quantity',
              width: 100,
              render: (text, record, index) => (
                <Input
                  type="number"
                  min={0}
                  value={entryProducts[index]?.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              ),
            },
            {
              title: 'Hành động',
              dataIndex: 'action',
              width: 100,
              render: (text, record, index) => (
                <Button 
                  type="text" 
                  icon={<MinusCircleOutlined />} 
                  onClick={() => handleRemoveProduct(index)}
                />
              ),
            },
          ]}
          dataSource={entryProducts}
          rowKey={(record, index) => index}
          className={styles.table}
        />

        <Button type="dashed" onClick={handleAddProduct} style={{ width: '10%'}}>
          Thêm sản phẩm
        </Button>
      </form>
    </div>
  );
};

export default WarehouseEntryForm;
