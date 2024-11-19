import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  DatePicker,
  message,
  Spin,
  Switch,
  Tag,
  Select,
  Modal,
  Form
} from "antd";
import { SaveOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaEdit, FaTrash } from "react-icons/fa";
import Title from "antd/es/typography/Title";
import moment from 'moment';
import {
  addPricesToPriceList,
  getAllPriceLists,
  createPriceList,
  deletePriceList,
  deletePriceFromPriceList
} from "../../untills/priceApi";
import { getAllProducts, getCategories } from "../../untills/api";
import EditPriceListModal from "./EditPriceListModal";

const { Option } = Select;

const PriceProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceLists, setPriceLists] = useState([]);
  const [newPriceList, setNewPriceList] = useState({
    code: "",
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [flagFilter, setFlagFilter] = useState(1);
  const [productPrices, setProductPrices] = useState({});
  const [recordColumn, setRecordColumn] = useState();
  const [newPrices, setNewPrices] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchCode, setSearchCode] = useState("");
  const [selectedUnits, setSelectedUnits] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [savedPrices, setSavedPrices] = useState({});
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPriceList, setEditingPriceList] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);

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
      console.error("Lỗi khi tải dữ liệu:", error);
      message.error("Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleSearch = () => {
    setLoading(true);
    setError(null);
  
    try {
      setFlagFilter(0);
  
      if (!searchCode) {
        setFilteredProducts([]);
        setFlagFilter(1);
        return;
      }
  
      let filtered = products.filter(
        (product) => product.code.toLowerCase() === searchCode.toLowerCase()
      );
  
      if (filtered.length === 0) {
        setError("Không tìm thấy sản phẩm với mã này.");
        return;
      }
  
      filtered = filtered.filter((product) => {
        const isOverlappingInOtherPriceList = priceLists.some((priceList) => {
          const isInOtherPriceList = priceList._id !== recordColumn.key;
          const isProductInPriceList = priceList.products.some(
            (p) => p.productId.toString() === product._id.toString()
          );
          const isOverlappingTime =
            priceList.startDate <= recordColumn.endDate &&
            priceList.endDate >= recordColumn.startDate;
  
          const isActivePriceList = new Date() >= new Date(priceList.startDate) && new Date() <= new Date(priceList.endDate);
  
          return isInOtherPriceList && isProductInPriceList && isOverlappingTime && isActivePriceList;
        });
  
        return !isOverlappingInOtherPriceList;
      });
  
      if (filtered.length === 0) {
        message.warning("Sản phẩm này đã nằm trong một bảng giá khác có thời gian hiệu lực và không thể thêm vào bảng giá hiện tại.");
        setError(
          "Sản phẩm này đã nằm trong một bảng giá khác có thời gian hiệu lực và không thể thêm vào bảng giá hiện tại."
        );
        return;
      }
  
      setFilteredProducts(filtered);
    } catch (error) {
      setError("Đã xảy ra lỗi trong quá trình tìm kiếm.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartDateChange = (date) => {
    setNewPriceList(prev => ({
      ...prev,
      startDate: date,
      endDate: date && prev.endDate && date >= prev.endDate ? null : prev.endDate
    }));
  };

  const handleEndDateChange = (date) => {
    setNewPriceList(prev => ({
      ...prev,
      endDate: date
    }));
  };

  const disabledEndDate = (endDate) => {
    if (!endDate || !newPriceList.startDate) {
      return false;
    }
    return endDate.isBefore(newPriceList.startDate, 'day');
  };

  const handleSelectPrice = (productId, unitName) => {
    const product = products.find((p) => p.productId === productId);

    if (product) {
      const selectedPrice = product.prices.find((p) => p.unitName === unitName);

      if (selectedPrice) {
        setSelectedPrices((prev) => [
          ...prev,
          { productId, unitName, price: selectedPrice.price },
        ]);
      }
    }
  };
console.log(priceLists);

  const handleAddPriceList = async () => {
    try {
      const formattedPriceList = {
        ...newPriceList,
        startDate: newPriceList.startDate
          ? newPriceList.startDate.toISOString()
          : null,
        endDate: newPriceList.endDate
          ? newPriceList.endDate.toISOString()
          : null,
      };
      const response = await createPriceList(formattedPriceList);
      if (response.success) {
        setPriceLists((prevLists) => [...prevLists, response.priceList]);
        setNewPriceList({
          code: "",
          name: "",
          description: "",
          startDate: null,
          endDate: null,
          isActive: true,
        });
        setIsModalVisible(false);
        message.success("Bảng giá đã được tạo thành công!");
      } else {
        message.error("Không thể tạo bảng giá.");
      }
    } catch (error) {
      message.error("Không thể tạo bảng giá.");
    }
  };

  const handleSavePrices = async (priceListId) => {
    const pricesToUpdate = Object.entries(productPrices).flatMap(
      ([productId, units]) =>
        Object.entries(units).map(([unitName, price]) => ({
          productId,
          prices: [
            {
              unitName,
              price: price !== null && price !== undefined ? Number(price) : 0,
            },
          ],
        }))
    );

    try {
      const response = await addPricesToPriceList(priceListId, pricesToUpdate);
      if (response.success) {
        message.success("Giá đã được cập nhật thành công!");
        setProductPrices({});
        setFlagFilter(1);
        const updatedSavedPrices = pricesToUpdate.reduce(
          (acc, { productId, prices }) => {
            acc[productId] = prices.reduce((unitAcc, { unitName, price }) => {
              if (price > 0) unitAcc[unitName] = price;
              return unitAcc;
            }, {});
            return acc;
          },
          {}
        );
        setSavedPrices(updatedSavedPrices);

        await fetchAllData();
      } else {
        message.error("Không thể cập nhật giá.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật giá:", error);
      message.error("Không thể cập nhật bảng giá đang hoạt động hoặc đơn vị sản phẩm không còn khả dụng.");
    }
  };

  const expandedRowRender = (recordColumn) => {
    let productData;

    if (flagFilter === 1) {
      productData = products.flatMap((product) => {
        const priceEntry = recordColumn.products.find(
          (p) => p.productId === product._id
        );

        if (!priceEntry) return [];

        const prices = priceEntry.prices;

        return prices.map((price) => ({
          productId: product._id,
          code: product.code,
          name: product.name,
          image: product.image,
          unitName: price.unitName,
          price: price.price,
          unitId: price._id,
        }));
      });
    } else {
      productData = filteredProducts.flatMap((product) => {
        const priceEntry = recordColumn.products.find(
          (p) => p.productId === product._id
        );

        const pricesFromPriceList = priceEntry ? priceEntry.prices : [];

        const allUnits = [
          {
            unitName: product.baseUnit.name,
            price: 0,
            unitId: product.baseUnit._id,
          },
          ...product.conversionUnits.map((unit) => ({
            unitName: unit.name,
            price: 0,
            unitId: unit._id,
          })),
        ];

        const combinedPrices = allUnits.map((unit) => {
          const priceItem = pricesFromPriceList.find(
            (p) => p.unitName === unit.unitName
          );
          return {
            productId: product._id,
            code: product.code,
            name: product.name,
            image: product.image,
            unitName: unit.unitName,
            price: priceItem ? priceItem.price : unit.price,
            unitId: priceItem ? priceItem._id : unit.unitId,
          };
        });

        return combinedPrices;
      });
    }

    const handlePriceChange = (productId, unitName, newPrice) => {
      if (newPrice < 0) {
        message.error("Giá không được là số âm!");
        return;
      }
      setProductPrices((prevPrices) => ({
        ...prevPrices,
        [productId]: {
          ...prevPrices[productId],
          [unitName]: newPrice,
        },
      }));
    };

    const handleDelete = async (priceListId, productId, priceId) => {
      Modal.confirm({
        title: "Xác nhận xóa sản phẩm",
        content: "Bạn có chắc chắn muốn xóa sản phẩm này khỏi bảng giá?",
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
        onOk: async () => {
          try {
            await deletePriceFromPriceList(priceListId, productId, priceId);
            message.success("Sản phẩm đã được xóa khỏi bảng giá!");
            setFlagFilter(1);
            setProductPrices((prevPrices) => {
              const updatedPrices = { ...prevPrices };
              delete updatedPrices[productId];
              return updatedPrices;
            });

            fetchAllData();
          } catch (error) {
            message.error(
              error.message || "Lỗi khi xóa sản phẩm khỏi bảng giá."
            );
          }
        },
      });
    };

    const columns = [
      {
        title: "Mã sản phẩm",
        dataIndex: "code",
        key: "code",
        onHeaderCell: () => ({
          style: {
            backgroundColor: "#F5F5DC",
            color: "#333",
            fontWeight: "bold",
          },
        }),
      },
      {
        title: "Tên sản phẩm",
        dataIndex: "name",
        key: "name",
        onHeaderCell: () => ({
          style: {
            backgroundColor: "#F5F5DC",
            color: "#333",
            fontWeight: "bold",
          },
        }),
      },
      {
        title: "Hình ảnh",
        dataIndex: "image",
        key: "image",
        render: (image) => (
          <img src={image} alt="product" style={{ width: 50 }} />
        ),
        onHeaderCell: () => ({
          style: {
            backgroundColor: "#F5F5DC",
            color: "#333",
            fontWeight: "bold",
          },
        }),
      },
      {
        title: "Đơn Vị",
        dataIndex: "unitName",
        key: "unitName",
        onHeaderCell: () => ({
          style: {
            backgroundColor: "#F5F5DC",
            color: "#333",
            fontWeight: "bold",
          },
        }),
      },
      {
        title: "Giá hiện tại",
        dataIndex: "price",
        key: "price",
        render: (price) => `${price.toLocaleString()} VNĐ`,
        onHeaderCell: () => ({
          style: {
            backgroundColor: "#F5F5DC",
            color: "#333",
            fontWeight: "bold",
          },
        }),
      },
      {
        title: "Nhập giá mới",
        key: "newPrice",
        render: (text, record) => (
          <Input
            type="number"
            min={0}
            placeholder="Nhập giá mới"
            value={productPrices[record.productId]?.[record.unitName] || ""}
            onChange={(e) =>
              handlePriceChange(
                record.productId,
                record.unitName,
                Number(e.target.value)
              )
            }
          />
        ),
        onHeaderCell: () => ({
          style: {
            backgroundColor: "#F5F5DC",
            color: "#333",
            fontWeight: "bold",
          },
        }),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <DeleteOutlined
            onClick={() =>
              handleDelete(recordColumn.key, record.productId, record.unitId)
            }
            style={{ color: "red", cursor: "pointer" }}
          />
        ),
        onHeaderCell: () => ({
          style: {
            backgroundColor: "#F5F5DC",
            color: "#333",
            fontWeight: "bold",
          },
        }),
      },
    ];

    return (
      <>
        <div
          style={{
            display: "flex",
            width: "100%",
            marginBottom: 16,
            marginTop: 20,
          }}
        >
          <Input
            placeholder="Nhập mã sản phẩm"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            style={{ width: "15%", height: "30px", marginRight: "2%" }}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            style={{ width: "10%", height: "20%" }}
            danger
          >
            Tìm kiếm
          </Button>
        </div>
        
        {error && <p style={{ color: "red" }}>Lỗi: {error}</p>}
        
        <Table
          columns={columns}
          dataSource={productData}
          rowKey={(record) => `${record.productId}-${record.unitName}`}
          pagination={{ pageSize: 6 }}
        />
    
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => handleSavePrices(recordColumn.key)}
          style={{ marginTop: 16 }}
          danger
        >
          Cập nhật Giá
        </Button>
      </>
    );
  };
  
  const handleEditPriceList = (priceListId) => {
    const priceList = priceLists.find((list) => list._id === priceListId);
    setEditingPriceList(priceList);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setEditingPriceList(null);
  };

  const confirmDeletePriceList = (priceListId, isActive) => {
    if (isActive) {
      message.error("Không thể xóa bảng giá đang hoạt động!");
      return;
    }

    Modal.confirm({
      title: "Xác nhận xóa bảng giá",
      content: "Bạn có chắc chắn muốn xóa bảng giá này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => handleDeletePriceList(priceListId),
    });
  };

  const handleDeletePriceList = async (priceListId) => {
    try {
      await deletePriceList(priceListId);
      message.success("Xóa bảng giá thành công!");
      fetchAllData();
      setPriceLists((prevPriceList) =>
        prevPriceList.filter((price) => price.key !== priceListId)
      );
    } catch (error) {
      message.error("Không thể xóa bảng giá. Vui lòng thử lại.");
      console.error("Lỗi:", error.message);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setNewPriceList({
      code: "",
      name: "",
      description: "",
      startDate: null,
      endDate: null,
      isActive: true,
    });
  };

  return (
    <>
      <Title style={{ fontWeight: 'bold', fontStyle: 'italic' }} level={2}>Quản lí bảng giá</Title>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Button type="primary" danger onClick={showModal}>
          Thêm bảng giá
        </Button>
      </div>

      <Modal
        title="Thêm bảng giá mới"
        visible={isModalVisible}
        onOk={handleAddPriceList}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Mã bảng giá">
            <Input
              value={newPriceList.code}
              onChange={(e) => setNewPriceList({ ...newPriceList, code: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Tên bảng giá">
            <Input
              value={newPriceList.name}
              onChange={(e) => setNewPriceList({ ...newPriceList, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input
              value={newPriceList.description}
              onChange={(e) => setNewPriceList({ ...newPriceList, description: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="Ngày bắt đầu">
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              value={newPriceList.startDate}
              onChange={handleStartDateChange}
            />
          </Form.Item>
          <Form.Item label="Ngày kết thúc">
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              value={newPriceList.endDate}
              onChange={handleEndDateChange}
              disabledDate={disabledEndDate}
            />
          </Form.Item>
        </Form>
      </Modal>

      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Table
          dataSource={priceLists.map((list) => ({
            key: list._id,
            code: list.code,
            name: list.name,
            description: list.description,
            startDate: new Date(list.startDate).toLocaleString(),
            endDate: new Date(list.endDate).toLocaleString(),
            isActive: list.isActive,
            products: list.products || [],
          }))}
          columns={[
            {
              title: "Mã bảng giá",
              dataIndex: "code",
              key: "code",
            },
            {
              title: "Tên bảng giá",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "Mô tả",
              dataIndex: "description",
              key: "description",
            },
            {
              title: "Ngày bắt đầu",
              dataIndex: "startDate",
              key: "startDate",
            },
            {
              title: "Ngày kết thúc",
              dataIndex: "endDate",
              key: "endDate",
            },
            {
              title: "Trạng thái",
              key: "isActive",
              render: (text, record) => (
                <Tag color={record.isActive ? "green" : "red"}>
                  {record.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                </Tag>
              ),
            },
            {
              title: "Hành động",
              key: "action",
              render: (text, record) => (
                <>
                  <Button
                    type="text"
                    icon={<FaEdit />}
                    onClick={() => handleEditPriceList(record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Sửa
                  </Button>
                  <Button
                    type="text"
                    danger
                    icon={<FaTrash />}
                    onClick={() => confirmDeletePriceList(record.key, record.isActive)}
                  >
                    Xóa
                  </Button>
                </>
              ),
            },
          ]}
          expandable={{
            expandedRowRender,
            onExpand: (expanded, record) => {
              if (expanded) {
                setRecordColumn(record);
              } else {
                setRecordColumn(null);
              }
            },
          }}
          expandedRowKeys={recordColumn ? [recordColumn.key] : []}
        />
      )}

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