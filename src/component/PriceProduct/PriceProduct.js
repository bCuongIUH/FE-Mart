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
} from "antd";
import { getAllProducts, getCategories } from "../../untills/api";
import { SaveOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import {
  addPricesToPriceList,
  getAllPriceLists,
  createPriceList,
  deletePriceList,
  deletePriceFromPriceList
} from "../../untills/priceApi";
import EditPriceListModal from "./EditPriceListModal";

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
  const [showPriceListForm, setShowPriceListForm] = useState(false);
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
      // Tìm sản phẩm theo mã
      const filtered = products.filter(
        (product) => product.code.toLowerCase() === searchCode.toLowerCase()
      );

      if (filtered.length === 0) {
        setError("Không tìm thấy sản phẩm với mã này.");
        return;
      } else {
        // Kiểm tra nếu sản phẩm chỉ nằm trong bảng giá hiện tại hoặc không thuộc bảng giá nào
        const product = filtered[0];
        const isInCurrentPriceListOnly = priceLists.every(
          (priceList) =>
            priceList._id === recordColumn.key ||
            !priceList.products.some(
              (p) => p.productId.toString() === product._id.toString()
            )
        );

        if (!isInCurrentPriceListOnly) {
          // Nếu sản phẩm thuộc bảng giá khác, hiển thị thông báo
          setFilteredProducts([]);
          message.warning(
            "Sản phẩm này đã nằm trong một bảng giá khác và không thể thêm vào bảng giá hiện tại."
          );
          return;
        }

        // Cập nhật sản phẩm đã lọc để hiển thị
        setFilteredProducts(filtered);
        console.log(filtered);
      }
    } catch (error) {
      setError("Đã xảy ra lỗi trong quá trình tìm kiếm.");
    } finally {
      setLoading(false);
    }
  };

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
        setProductPrices({});
        setShowPriceListForm(false);

        message.success("Bảng giá đã được tạo thành công!");
      } else {
        message.error("Không thể tạo bảng giá.");
      }
    } catch (error) {
      message.error("Không thể tạo bảng giá.");
    }
  };

  // thêm giá vào sp
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
        setProductPrices({}); // Reset giá trị sau khi lưu thành công
        setFlagFilter(1);
        // Cập nhật `savedPrices` với các đơn vị đã có giá
        const updatedSavedPrices = pricesToUpdate.reduce(
          (acc, { productId, prices }) => {
            acc[productId] = prices.reduce((unitAcc, { unitName, price }) => {
              if (price > 0) unitAcc[unitName] = price; // Chỉ lưu giá trị đã có giá
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
      // Tạo danh sách các sản phẩm với đơn vị và giá cho bảng chi tiết
      productData = products.flatMap((product) => {
        const priceEntry = recordColumn.products.find(
          (p) => p.productId === product._id
        );

        // Chỉ tiếp tục nếu sản phẩm có trong bảng giá
        if (!priceEntry) return []; // Loại bỏ sản phẩm nếu không có trong bảng giá

        const prices = priceEntry.prices;

        return prices.map((price) => ({
          productId: product._id,
          code: product.code,
          name: product.name,
          image: product.image,
          unitName: price.unitName,
          price: price.price,
          unitId: price._id, // thêm unitId vào return
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

        return combinedPrices; // Hiển thị tất cả sản phẩm, không lọc theo giá khác 0
      });
    }

    // Xử lý thay đổi giá cho mỗi dòng
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
      console.log("Cập nhật giá mới:", productPrices);
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
            // Cập nhật danh sách sản phẩm sau khi xóa
            setProductPrices((prevPrices) => {
              const updatedPrices = { ...prevPrices };
              delete updatedPrices[productId];
              return updatedPrices;
            });

            // Thực hiện cập nhật lại bảng
            fetchAllData();
          } catch (error) {
            message.error(
              error.message || "Lỗi khi xóa sản phẩm khỏi bảng giá."
            );
          }
        },
      });
    };
    // Cấu hình các cột cho bảng chi tiết
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
        title: "Giá Bán",
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
            style={{ width: "70%", height: "40px", marginRight: "2%" }} // Tăng chiều cao và đặt chiều rộng
          />
          <Button
            type="primary"
            onClick={handleSearch}
            style={{ width: "20%", height: "40px" }} // Tăng chiều cao và đặt chiều rộng
          >
            Tìm kiếm
          </Button>
        </div>
        {error && <p style={{ color: "red" }}>Lỗi: {error}</p>}
        <Table
          columns={columns}
          dataSource={productData}
          pagination={false}
          rowKey={(record) => `${record.productId}-${record.unitName}`}
        />
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => handleSavePrices(recordColumn.key)}
          style={{ marginTop: 16 }}
        >
          Cập nhật Giá
        </Button>
      </>
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

  // Hàm xử lý xóa bảng giá
  const handleDeletePriceList = async (priceListId) => {
    try {
      await deletePriceList(priceListId);
      message.success("Xóa bảng giá thành công!");
      // Cập nhật danh sách bảng giá sau khi xóa
      fetchAllData();
      setPriceLists((prevPriceList) =>
        prevPriceList.filter((price) => price.key !== priceListId)
      );
    } catch (error) {
      message.error("Không thể xóa bảng giá. Vui lòng thử lại.");
      console.error("Lỗi:", error.message);
    }
  };

  return (
    <>
      <h2>Quản lý Bảng Giá</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button type="primary" onClick={() => setShowPriceListForm(true)}>
          Thêm bảng giá
        </Button>
      </div>

      {showPriceListForm && (
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Mã bảng giá"
            value={newPriceList.code}
            onChange={(e) =>
              setNewPriceList({ ...newPriceList, code: e.target.value })
            }
          />
          <Input
            placeholder="Tên bảng giá"
            value={newPriceList.name}
            onChange={(e) =>
              setNewPriceList({ ...newPriceList, name: e.target.value })
            }
          />
          <Input
            placeholder="Mô tả"
            value={newPriceList.description}
            onChange={(e) =>
              setNewPriceList({ ...newPriceList, description: e.target.value })
            }
          />
          <DatePicker
            placeholder="Ngày bắt đầu"
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            onChange={(date) =>
              setNewPriceList({ ...newPriceList, startDate: date })
            }
          />

          <DatePicker
            placeholder="Ngày kết thúc"
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            onChange={(date) =>
              setNewPriceList({ ...newPriceList, endDate: date })
            }
          />

          <Button
            type="primary"
            onClick={handleAddPriceList}
            style={{ marginTop: 16 }}
          >
            Lưu bảng giá
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => setShowPriceListForm(false)}
          >
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
                  {record.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Tag>
              ),
            },
            {
              title: "Hành động",
              key: "action",
              render: (text, record) => (
                <>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEditPriceList(record.key)}
                    style={{ marginRight: 8 }}
                  ></Button>
                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => confirmDeletePriceList(record.key)}
                  ></Button>
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
