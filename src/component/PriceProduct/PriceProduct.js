import React, { useCallback, useEffect, useState } from 'react';
import { Table, Input, Button, DatePicker, message, Spin, Switch, Tag, Select ,Modal} from 'antd';
import { getAllProducts, getCategories } from '../../untills/api'; 
import { SaveOutlined, EditOutlined, DeleteOutlined  } from '@ant-design/icons';
import { Option } from 'antd/es/mentions';
import { addPricesToPriceList, getAllPriceLists, createPriceList, deletePriceList } from '../../untills/priceApi';
import EditPriceListModal from './EditPriceListModal';

const PriceProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceLists, setPriceLists] = useState([]);
  const [newPriceList, setNewPriceList] = useState({
    code: '',
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [productPrices, setProductPrices] = useState({});
 
  const [newPrices, setNewPrices] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchCode, setSearchCode] = useState('');
  const [selectedUnits, setSelectedUnits] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]); 
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
  const [editingPriceList, setEditingPriceList] = useState(null); 
  const [showPriceListForm, setShowPriceListForm] = useState(false);
    const fetchAllData = useCallback(async () => {
      setLoading(true);
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
  
        const categoriesData = await getCategories();
        setCategories(categoriesData.categories || []);
  
        const priceListsData = await getAllPriceLists();
        setPriceLists(priceListsData.priceLists || []);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        message.error('Lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    }, []);
  

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleSelectPrice = (productId, unitName) => {
    const product = products.find((p) => p.productId === productId);
    
    if (product) {
      const selectedPrice = product.prices.find((p) => p.unitName === unitName);
      
      if (selectedPrice) {
        // Nếu tìm thấy giá, thêm vào mảng
        setSelectedPrices((prev) => [
          ...prev,
          { productId, unitName, price: selectedPrice.price },
        ]);
      }
    }
  };

  const handleAddPriceList = async () => {
    try {
      const formattedPriceList = {
        ...newPriceList,
        startDate: newPriceList.startDate ? newPriceList.startDate.toISOString() : null,
        endDate: newPriceList.endDate ? newPriceList.endDate.toISOString() : null,
      };
      const response = await createPriceList(formattedPriceList);
      if (response.success) {
        setPriceLists((prevLists) => [...prevLists, response.priceList]);
        setNewPriceList({
          code: '',
          name: '',
          description: '',
          startDate: null,
          endDate: null,
          isActive: true,
        });
        setProductPrices({}); 
        setShowPriceListForm(false); 
        message.success('Bảng giá đã được tạo thành công!');
      } else {
        message.error('Không thể tạo bảng giá.');
      }
    } catch (error) {
      message.error('Không thể tạo bảng giá.');
    }
  };

 
// thêm giá vào sp
const handleSavePrices = async (priceListId) => {
  const pricesToUpdate = Object.entries(productPrices).map(([productId, { price, unitName }]) => {
    return {
      productId,
      prices: [
        {
          unitName,
          price: Number(price),
        },
      ],
    };
  });

  const payload = {
    priceListId,
    products: pricesToUpdate,
  };

  console.log("Payload:", payload);

  try {
    const response = await addPricesToPriceList(priceListId, pricesToUpdate);
    if (response.success) {
      message.success('Giá đã được cập nhật thành công!');
      setProductPrices({});
    } else {
      message.error('Không thể cập nhật giá.');
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật giá:', error);
    message.error('Không thể cập nhật bảng giá đang hoạt động.');
  }
};


  const expandedRowRender = (record) => {  
    const productPricesForList = record.products.reduce((acc, product) => {  
      acc[product.productId] = product.price;  
      return acc;  
    }, {});  


    const handlePriceChange = (productId, newPrice) => {
      if (newPrice < 0) {
        message.error('Giá không được là số âm!');
        return; 
      }
      setProductPrices(prevPrices => ({
    ...prevPrices,
    [productId]: {
      ...prevPrices[productId],
      price: newPrice, // Lưu lại giá mới
      unitName: prevPrices[productId]?.unitName || '', // Đảm bảo đơn vị cũng được lưu
    },
  }));
};
    // Lọc sản phẩm theo danh mục và mã sản phẩm
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    const matchesCode = product.code.toLowerCase().includes(searchCode.toLowerCase());
    return matchesCategory && matchesCode;
  });

  // chọn đv
  const handleUnitChange = (productId, name) => {
    setProductPrices(prevPrices => ({
      ...prevPrices,
      [productId]: {
        ...prevPrices[productId],
        name, // Lưu lại đơn vị đã chọn
        // price: prevPrices[productId]?.price || '', 
      },
    }));
  };
  
  


    return (  
      <div>  
        <h4>Danh sách sản phẩm</h4>  
        {/* Select cho danh mục và ô tìm kiếm mã sản phẩm */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <Select
          placeholder="Chọn danh mục"
          style={{ width: 200, marginRight: 8 }}
          onChange={(value) => setSelectedCategory(value)}
        >
          {categories.map((category) => (
            <Option key={category._id} value={category._id}>{category.name}</Option>
          ))}
        </Select>

        <Input
          placeholder="Tìm kiếm mã sản phẩm"
          style={{ width: 200 }}
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
        />
      </div>
        <Table  
         dataSource={filteredProducts.map((product) => ({
            key: product._id,  
            code: product.code,  
            name: product.name,  
            image: product.image,  
            baseUnit: product.baseUnit,
            conversionUnits: product.conversionUnits,
            newPrice: productPricesForList[product._id] || '', 
          }))}  
          columns={[  
            {  
              title: 'Mã sản phẩm',  
              dataIndex: 'code',  
              key: 'code',  
              onHeaderCell: () => ({
                style: {
                  backgroundColor: '#F5F5DC',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
            },  
            {  
              title: 'Tên sản phẩm',  
              dataIndex: 'name',  
              key: 'name',  
              onHeaderCell: () => ({
                style: {
                  backgroundColor: '#F5F5DC',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
            },  
            {  
              title: 'Hình ảnh',  
              dataIndex: 'image',  
              key: 'image',  
              onHeaderCell: () => ({
                style: {
                  backgroundColor: '#F5F5DC',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
              render: (image) => <img src={image} alt="product" style={{ width: 50 }} />,  
            },  
            {
              title: 'Đơn Vị',
              key: 'unit',
              onHeaderCell: () => ({
                style: {
                  backgroundColor: '#F5F5DC',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
              render: (text, product) => {
                // Kiểm tra sản phẩm và đơn vị cơ bản
                if (!product || !product.baseUnit) return null; 
            
                const baseUnit = product.baseUnit;
            
                return (
                  <Select
                    defaultValue={baseUnit.name} // Hiển thị tên đơn vị cơ bản
                    onChange={(name) => handleUnitChange(product._id, name)} // Hàm xử lý thay đổi đơn vị
                  >
                    <Select.Option key={baseUnit._id} value={baseUnit.name}>
                      {baseUnit.name}
                    </Select.Option>
                    {product.conversionUnits && product.conversionUnits.length > 0 && product.conversionUnits.map((unit) => (
                      <Select.Option key={unit._id} value={unit.name}>
                        {unit.name}
                      </Select.Option>
                    ))}
                  </Select>
                );
              },
            },
            
            {  
              title: 'Giá hiện tại',  
              dataIndex: 'currentPrice',  
              key: 'currentPrice',  
              onHeaderCell: () => ({
                style: {
                  backgroundColor: '#F5F5DC',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
              render: (text) => (  
                <span>{text ? text.toLocaleString() : 'Chưa cập nhật'} VNĐ</span>  
              ),  
            },  
            {
              title: 'Giá Bán',
              key: 'newPrice',
              render: (text, product) => (
                <Input  
                  type="number"  
                  min={1} 
                  placeholder="Nhập giá mới"  
                  value={productPrices[product.key]?.price || ''}  
                  onChange={(e) => handlePriceChange(product.key, e.target.value)}   
                />  
              ),
            },
            
          ]}  
          pagination={false}  
        />  
        <Button  
          type="primary"  
          icon={<SaveOutlined />}  
          onClick={() => handleSavePrices(record.key)}   
          style={{ marginTop: 16 }}  
        >  
          Cập nhật Giá  
        </Button>  
      </div>  
    );  
  };


// Hiển thị modal chỉnh sửa bảng giá
const handleEditPriceList = (priceListId) => {
  const priceList = priceLists.find((list) => list._id === priceListId);
  setEditingPriceList(priceList);
  setIsEditModalVisible(true);
};

// Hàm đóng modal chỉnh sửa
const closeEditModal = () => {
  setIsEditModalVisible(false);
  setEditingPriceList(null);
};
// Hàm hiển thị modal xác nhận xóa
const confirmDeletePriceList = (priceListId, isActive) => {
  if (isActive) {
    message.error('Không thể xóa bảng giá đang hoạt động!');
    return;
  }

  Modal.confirm({
    title: 'Xác nhận xóa bảng giá',
    content: 'Bạn có chắc chắn muốn xóa bảng giá này không?',
    okText: 'Xóa',
    okType: 'danger',
    cancelText: 'Hủy',
    onOk: () => handleDeletePriceList(priceListId),
  });
};

// Hàm xử lý xóa bảng giá
const handleDeletePriceList = async (priceListId) => {
  try {
    await deletePriceList(priceListId);
    message.success('Xóa bảng giá thành công!');
    // Cập nhật danh sách bảng giá sau khi xóa
    fetchAllData();
    setPriceLists(prevPriceList => prevPriceList.filter(price => price.key !== priceListId));
  } catch (error) {
    message.error('Không thể xóa bảng giá. Vui lòng thử lại.');
    console.error('Lỗi:', error.message);
  }
};

;
  return (  
    <>  
      <h2>Quản lý Bảng Giá</h2>  
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button type="primary" onClick={() => setShowPriceListForm(true)}>  
          Thêm bảng giá  
        </Button>  
      </div>

      {showPriceListForm && (  
        <div style={{ marginBottom: 16 }}> 
          <Input  
            placeholder="Mã bảng giá"  
            value={newPriceList.code}  
            onChange={(e) => setNewPriceList({ ...newPriceList, code: e.target.value })}  
          />  
          <Input  
            placeholder="Tên bảng giá"  
            value={newPriceList.name}  
            onChange={(e) => setNewPriceList({ ...newPriceList, name: e.target.value })}  
          />  
          <Input  
            placeholder="Mô tả"  
            value={newPriceList.description}  
            onChange={(e) => setNewPriceList({ ...newPriceList, description: e.target.value })}  
          />  
          <DatePicker  
            placeholder="Ngày bắt đầu"  
            showTime={{ format: 'HH:mm' }}  
            format="YYYY-MM-DD HH:mm" 
            onChange={(date) => setNewPriceList({ ...newPriceList, startDate: date })}  
          />  

          <DatePicker  
            placeholder="Ngày kết thúc"  
            showTime={{ format: 'HH:mm' }}  
            format="YYYY-MM-DD HH:mm"  
            onChange={(date) => setNewPriceList({ ...newPriceList, endDate: date })}  
          />  

          <Button type="primary" onClick={handleAddPriceList} style={{ marginTop: 16 }}>  
            Lưu bảng giá  
          </Button>  
          <Button style={{ marginLeft: 8 }} onClick={() => setShowPriceListForm(false)}>
            Đóng
          </Button>
        </div>
      )}

      {loading ? (  
        <Spin tip="Loading..." />  
      ) : (  
        <Table  
          dataSource={priceLists.map((list) => ({  
            key: list._id,  
            code: list.code,  
            name: list.name,  
            startDate: new Date(list.startDate).toLocaleString(),  
            endDate: new Date(list.endDate).toLocaleString(),  
            isActive: list.isActive,  
            products: list.products || [],  
          }))}  
          columns={[  
            {  
              title: 'Mã bảng giá',  
              dataIndex: 'code',  
              key: 'code',  
            },  
            {  
              title: 'Tên bảng giá',  
              dataIndex: 'name',  
              key: 'name',  
            },  
            {  
              title: 'Ngày bắt đầu',  
              dataIndex: 'startDate',  
              key: 'startDate',  
            },  
            {  
              title: 'Ngày kết thúc',  
              dataIndex: 'endDate',  
              key: 'endDate',  
            },  
            {  
              title: 'Trạng thái',  
              key: 'isActive',  
              render: (text, record) => (  
                <>  
                  <Tag color={record.isActive ? 'green' : 'red'}>  
                    {record.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}  
                  </Tag>  
                </>  
              ),  
            }, 
            {
              title: 'Hành động',
              key: 'action',
              render: (text, record) => (
                <>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEditPriceList(record.key)} 
                    style={{ marginRight: 8 }}
                  >
                    
                  </Button>
                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => confirmDeletePriceList(record.key)}
                  >
                   
                  </Button>
                </>
              ),
            },
          ]}
          expandable={{
            expandedRowRender,
          }}
        />
      )}

      {/* Modal chỉnh sửa bảng giá */}
      {editingPriceList && (
        <EditPriceListModal
          visible={isEditModalVisible}
          onClose={closeEditModal}
          priceList={editingPriceList}
          onPriceListUpdated={fetchAllData}
        />
      )}
    </>
  );
};
export default PriceProduct;
