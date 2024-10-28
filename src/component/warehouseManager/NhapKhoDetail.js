import React, { useState, useEffect, useContext } from 'react';
import { createWarehouseEntry, getAllProducts, getAllSuppliers } from '../../untills/api';
import { AuthContext } from '../../untills/context/AuthContext';
import { Table, Input, Select, Button, message, AutoComplete } from 'antd';
import { MinusCircleOutlined,SaveOutlined, CloseOutlined } from '@ant-design/icons'; 
import styles from './WarehouseEntryForm.module.css';

const { Option } = Select;

const WarehouseEntryForm = ({ onCancel }) => {
  const { user } = useContext(AuthContext); 
  const [suppliers, setSuppliers] = useState([]);
  const [entryCode, setEntryCode] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null); 
  const [entryProducts, setEntryProducts] = useState([{ productCode: '', unit: '', quantity: 0, name: '', image: '', conversionUnits: [], baseUnit: '' }]);
  const [allProducts, setAllProducts] = useState([]);

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
    updatedProducts[index].productCode = code;

    const product = allProducts.find(p => p.code === code);
    if (product) {
      updatedProducts[index].unit = ''; 
      updatedProducts[index].baseUnit = product.baseUnit?.name || ''; 
      updatedProducts[index].name = product.name; 
      updatedProducts[index].image = product.image; 
      updatedProducts[index].conversionUnits = product.conversionUnits;
      updatedProducts[index].productId = product._id;
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
    updatedProducts[index].unit = unit;

    const hasDuplicateUnit = updatedProducts.some((product, i) => i !== index && product.unit === unit);
    if (hasDuplicateUnit) {
      message.warning('Đơn vị này đã được chọn cho sản phẩm khác. Vui lòng chọn đơn vị khác.');
      return; 
    }

    const selectedUnit = updatedProducts[index].conversionUnits.find(u => u.name === unit);
    updatedProducts[index].quantity = selectedUnit ? 1 : 1;

    setEntryProducts(updatedProducts);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedProducts = [...entryProducts];
    updatedProducts[index].quantity = Number.isNaN(parseInt(quantity)) ? 0 : parseInt(quantity);
    setEntryProducts(updatedProducts);
  };

  const handleAddProduct = () => {
    setEntryProducts(prevProducts => [
      ...prevProducts,
      { productCode: '', unit: '', quantity: 0, name: '', image: '', conversionUnits: [], baseUnit: '' }
    ]);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = entryProducts.filter((_, i) => i !== index);
    setEntryProducts(updatedProducts);
  };

  // Hàm xử lý khi nhấn nút Lưu
  const handleSubmit = async (e) => {
    e.preventDefault();

    const units = entryProducts.map(product => product.unit); 
    const hasDuplicateUnits = units.some((unit, index) => units.indexOf(unit) !== index);

    if (hasDuplicateUnits) {
        message.error('Có sản phẩm có cùng đơn vị, không thể lưu phiếu nhập!');
        return; 
    }

    // Tạo đối tượng phiếu nhập kho
    const entryData = {
        entryCode: entryCode,
        supplierId: selectedSupplier, 
        enteredBy: user._id, // ID của người tạo phiếu
        products: entryProducts.map(product => ({
            productId: product.productId, 
            quantity: product.quantity,     
            unit: product.unit             
        }))
    };

    // Log dữ liệu vào console
    console.log('Dữ liệu phiếu nhập kho:', entryData);

    try {
        // Gọi hàm createWarehouseEntry để lưu phiếu nhập kho
        const result = await createWarehouseEntry(entryData);
        
        // Xử lý kết quả sau khi tạo thành công
        console.log("Phiếu nhập kho đã được tạo:", result);
        message.success('Phiếu nhập kho đã được lưu thành công!');

        // Reset các trường nhập liệu sau khi lưu thành công
        setEntryCode('');
        setSelectedSupplier('');
        setEntryProducts([]); // Reset danh sách sản phẩm nếu cần
    } catch (error) {
        console.error("Có lỗi xảy ra khi tạo phiếu nhập kho:", error);
        message.error('Có lỗi xảy ra khi lưu phiếu nhập kho. Vui lòng thử lại!');
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
