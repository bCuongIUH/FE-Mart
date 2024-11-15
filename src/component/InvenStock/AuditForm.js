import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Select, Button, Table, message, AutoComplete } from 'antd';
import { getAllProducts } from '../../untills/api';
import { AuthContext } from '../../untills/context/AuthContext';
import { getAllStocks, updateInventoryQuantities } from '../../untills/stockApi';
import { MinusCircleOutlined } from '@ant-design/icons';
import styles from './AuditForm.module.css';
import { getAllEmployee } from '../../untills/employeesApi';

const { Option } = Select;

const AuditForm = ({ onClose }) => {
  const { user } = useContext(AuthContext); 
  const [form] = Form.useForm();
  const [stocks, setStocks] = useState({}); 
  const [employeeId, setEmployeeId] = useState(null);
  const [products, setProducts] = useState([]);
  const [entryProducts, setEntryProducts] = useState([
    { productCode: '', unit: '', actualQuantity: 0, name: '', stockQuantity: 0, productId: '', reason: '' }
  ]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (user && user._id) {
          const employees = await getAllEmployee();
          const employee = employees.find(emp => String(emp.employeeId) === String(user._id));
          if (employee) {
            setEmployeeId(employee._id);
          } else {
            message.error("Không tìm thấy nhân viên phù hợp.");
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhân viên:", error);
        message.error("Không thể tải dữ liệu nhân viên.");
      }
    };
    fetchEmployeeData();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(Array.isArray(productsData) ? productsData : []);
        
        const response = await getAllStocks();
        const stocksData = response.stocks;
        
        if (Array.isArray(stocksData)) {
          const formattedStocks = {};
          stocksData.forEach(product => {
            formattedStocks[product.productId] = product.stocks;
          });
          setStocks(formattedStocks);
        } else {
          console.error("Stocks data không phải là một mảng:", stocksData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm hoặc kho:", error);
        message.error('Không thể tải dữ liệu sản phẩm hoặc kho.');
      }
    };
    fetchData();
  }, []);

  const handleProductCodeChange = async (index, code) => {
    const updatedProducts = [...entryProducts];
    const product = products.find(p => p.code === code);
  
    if (product) {
      const selectedUnit = updatedProducts[index].unit;
  
      // Kiểm tra nếu sản phẩm cùng `productId` và `unit` đã tồn tại trong danh sách
      const isDuplicate = entryProducts.some((p, idx) =>
        idx !== index && p.productId === product._id && p.unit === selectedUnit
      );
  
      if (isDuplicate) {
        message.warning('Sản phẩm với đơn vị này đã tồn tại trong phiếu kiểm kê!');
        return; // Ngăn không cho cập nhật nếu sản phẩm và đơn vị đã có
      }
  
      updatedProducts[index] = {
        ...updatedProducts[index],
        productCode: code,
        productId: product._id,
        name: product.name,
        conversionUnits: product.conversionUnits || [],
        baseUnit: product.baseUnit?.name || ''
      };
  
      const stockQuantity = await fetchStockQuantity(product._id, product.baseUnit?.name || '');
      updatedProducts[index].stockQuantity = stockQuantity || 0;
    } else {
      updatedProducts[index] = { productCode: code, unit: '', actualQuantity: 0, stockQuantity: 0, reason: '' };
    }
  
    setEntryProducts(updatedProducts);
  };
  
  

  const fetchStockQuantity = async (productId, unit) => {
    const productStocks = stocks[productId] || [];
    const stock = productStocks.find(s => s.unit.trim().toLowerCase() === unit.trim().toLowerCase());
    return stock ? stock.quantity : 0;
  };

  const handleUnitChange = (index, unit) => {
    const updatedProducts = [...entryProducts];
    const product = updatedProducts[index];
  
    // Kiểm tra nếu sản phẩm với `productId` và `unit` đã tồn tại
    const isDuplicate = entryProducts.some((p, idx) =>
      idx !== index && p.productId === product.productId && p.unit === unit
    );
  
    if (isDuplicate) {
      message.warning('Sản phẩm với đơn vị này đã tồn tại trong phiếu kiểm kê!');
      return; // Ngăn không cho chọn đơn vị đã có
    }
  
    const productStocks = stocks[product.productId] || [];
    const sanitizedUnit = unit.trim().toLowerCase();
    const stock = productStocks.find(s => s.unit.trim().toLowerCase() === sanitizedUnit);
  
    if (stock) {
      updatedProducts[index] = {
        ...product,
        unit: unit,
        stockQuantity: stock.quantity
      };
    } else {
      message.warning('Không tìm thấy đơn vị tính hoặc kho phù hợp cho sản phẩm này.');
      updatedProducts[index] = {
        ...product,
        unit: '',
        stockQuantity: 0
      };
    }
  
    setEntryProducts(updatedProducts);
  };
  

  const handleQuantityChange = (index, quantity) => {
    const updatedProducts = [...entryProducts];
    updatedProducts[index].actualQuantity = Number(quantity) || 0;
    setEntryProducts(updatedProducts);
  };

  //hàm chọn thêm 1 sản phẩm vào 
  const handleAddProduct = () => {
    const newProduct = { productCode: '', unit: '', actualQuantity: 0, name: '', stockQuantity: 0, productId: '', reason: '' };
  
    // Kiểm tra nếu sản phẩm có cùng `productId` và `unit` đã tồn tại trong danh sách
    const isDuplicate = entryProducts.some(product =>
      product.productId === newProduct.productId && product.unit === newProduct.unit
    );
  
    if (isDuplicate) {
      message.warning('Sản phẩm với đơn vị này đã tồn tại trong phiếu kiểm kê!');
      return; // Ngăn không cho thêm sản phẩm trùng lặp
    }

    setEntryProducts([...entryProducts, newProduct]);
  };
  
  

  const handleRemoveProduct = (index) => {
    const updatedProducts = entryProducts.filter((_, i) => i !== index);
    setEntryProducts(updatedProducts);
  };

  //nhấn lưu
  const handleSubmit = async (values) => {
    const adjustments = entryProducts.map(p => ({
        productId: p.productId, // Chỉ truyền productId
        unit: p.unit,           // Truyền đơn vị
        adjustmentQuantity: p.actualQuantity,
        reason: p.reason
    }));

    const auditData = {
        code: values.code, 
        description: values.description, 
        auditDate: new Date().toISOString(),
        auditedBy: employeeId, 
        adjustments: adjustments.length > 0 ? adjustments : [] 
    };

    try {
        const newAdjustment = await updateInventoryQuantities(auditData);
        message.success('Phiếu kiểm kê đã được lưu thành công.');
        form.resetFields();
        setEntryProducts([{ productCode: '', unit: '', actualQuantity: 0, name: '', stockQuantity: 0, productId: '', reason: '' }]);
        onClose(newAdjustment);
        
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message) {
        message.error(error.response.data.message);
      } else {
        console.error("Lỗi khi lưu phiếu kiểm kê:", error.response?.data?.message || error.message);
        message.error('Lỗi khi lưu phiếu kiểm kê.');
      }
    }
    
};


  return (
    <div className={styles.formContainer}>
      <h2>Tạo Phiếu Kiểm Kê</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item style={{ width: '20%' }} name="code" label="Mã Phiếu" rules={[{ required: true, message: 'Vui lòng nhập mã phiếu' }]}>
          <Input placeholder="Nhập mã phiếu kiểm kê" />
        </Form.Item>
        <Form.Item style={{ width: '20%' }} name="description" label="Mô Tả">
          <Input placeholder="Nhập mô tả phiếu kiểm kê" />
        </Form.Item>
        
        <Table
          columns={[
            {
              title: 'Mã SP',
              dataIndex: 'productCode',
              width: 80, 
              render: (text, record, index) => (
                <AutoComplete
                  value={entryProducts[index]?.productCode}
                  onChange={(value) => handleProductCodeChange(index, value)}
                  options={products.map(product => ({ value: product.code }))}
                  placeholder="Nhập mã sản phẩm"
                  style={{ width: '90%' }}
                />
              ),
            },
            {
              title: 'Tên SP',
              dataIndex: 'name',
              width: 150, 
              render: (text, record, index) => <span>{entryProducts[index]?.name || '-'}</span>,
            },
            {
              title: 'Đơn vị',
              dataIndex: 'unit',
              width: 100, 
              render: (text, record, index) => (
                <Select
                  value={entryProducts[index]?.unit || undefined}
                  onChange={(value) => handleUnitChange(index, value)}
                  placeholder="Chọn đơn vị"
                  style={{ width: '80%' }}
                >
                  {(entryProducts[index].conversionUnits || []).map((unit) => (
                    <Option key={unit._id} value={unit.name}>
                      {unit.name} (1 {unit.name} = {unit.conversionValue} {entryProducts[index].baseUnit || 'Đơn vị cơ bản'})
                    </Option>
                  ))}
                  {entryProducts[index].baseUnit && (
                    <Option key={entryProducts[index].baseUnit} value={entryProducts[index].baseUnit}>
                      {entryProducts[index].baseUnit} (1 {entryProducts[index].baseUnit} = 1)
                    </Option>
                  )}
                </Select>
              ),
            },
            {
              title: 'Số lượng kho',
              dataIndex: 'stockQuantity',
              width: 100, 
              render: (text, record, index) => (
                <span>{entryProducts[index]?.stockQuantity || 0}</span>
              ),
            },
            {
              title: 'Số lượng thực tế',
              dataIndex: 'actualQuantity',
              width: 150, 
              render: (text, record, index) => (
                <Input
                  type="number"
                  min={0}
                  value={entryProducts[index]?.actualQuantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                  placeholder="Nhập số lượng thực tế"
                />
              ),
            },
            {
              title: 'Lý do',
              dataIndex: 'reason',
              width: 200, 
              render: (text, record, index) => (
                <Input
                  value={entryProducts[index]?.reason || ''}
                  onChange={(e) => {
                    const updatedProducts = [...entryProducts];
                    updatedProducts[index].reason = e.target.value;
                    setEntryProducts(updatedProducts);
                  }}
                  placeholder="Nhập lý do kiểm hàng"
                />
              ),
            },
            {
              title: 'Hành động',
              dataIndex: 'action',
              width: 50,
              render: (text, record, index) => (
                <MinusCircleOutlined
                  onClick={() => handleRemoveProduct(index)}
                  style={{ cursor: 'pointer', color: 'red' }}
                />
              ),
            },
          ]}
          dataSource={entryProducts}
          rowKey={(record, index) => index}
          scroll={{ x: 900 }}
          style={{ tableLayout: 'fixed' }}
        />

        <Button type="dashed" onClick={handleAddProduct} style={{ marginTop: 16 }}>
          Thêm sản phẩm
        </Button>

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>Hủy</Button>
          <Button type="primary" htmlType="submit">Lưu Phiếu Kiểm Kê</Button>
        </div>
      </Form>
    </div>
  );
};

export default AuditForm;
