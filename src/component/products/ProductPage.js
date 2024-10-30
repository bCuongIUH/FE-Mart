import React, { useEffect, useState,useContext } from "react";
import { Table, Button, Input, Dropdown, Menu, message, Modal } from "antd";
import {
  getAllProducts,
  getCategories,
  deleteProduct,
} from "../../untills/api"; // Đảm bảo import deleteProduct
import NhapHangInput from "./NhapHangInput";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import ProductDetail from "./ProductDetail"; // Import ProductDetail
import { AuthContext } from "../../untills/context/AuthContext";

const ProductPage = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewingProduct, setIsViewingProduct] = useState(false); // State for viewing product detail
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

const {user} = useContext(AuthContext); 

  console.log("User:", user);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        if (Array.isArray(response.categories)) {
          setCategories(response.categories);
        } else {
          message.error("Dữ liệu danh mục không hợp lệ!");
        }
      } catch (error) {
        message.error(
          "Lỗi khi lấy danh mục: " +
            (error.response?.data.message || "Vui lòng thử lại!")
        );
      }
    };

    fetchCategories();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const productsData = await getAllProducts();
      setData(
        productsData.map((product) => ({ ...product, key: product._id }))
      );
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      message.error("Lỗi khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleUpdateProduct = (updatedProduct) => {
    setData((prevData) =>
      prevData.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      )
    );
    setIsEditingProduct(false);
    setSelectedProduct(null);
  };

  const handleMenuClick = ({ key }) => {
    if (key === "1") {
      setSelectedRowKeys([]);
      setSelectedProducts([]);
    } else if (key === "2") {
      const selectedItems = data.filter((item) =>
        selectedRowKeys.includes(item.key)
      );
      setSelectedProducts(selectedItems);
      setIsAddingProduct(true);
    }
  };

  const handleCancel = () => {
    setIsAddingProduct(false);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleEditProduct = (record) => {
    setSelectedProduct(record);
    setIsEditingProduct(true);
  };

  const handleViewProductDetail = (record) => {
    setSelectedProduct(record);
    setIsViewingProduct(true);
  };

  const handleDeleteProduct = (productId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteProduct(productId);
          setData((prevData) =>
            prevData.filter((item) => item._id !== productId)
          );
          message.success("Đã xóa sản phẩm thành công!");
        } catch (error) {
          console.error("Lỗi khi xóa sản phẩm:", error);
          message.error("Lỗi khi xóa sản phẩm.");
        }
      },
    });
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Bỏ chọn</Menu.Item>
      <Menu.Item key="2">Nhập hàng</Menu.Item>
    </Menu>
  );

  const handleAddNewProduct = () => {
    setIsAddingNewProduct(true);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <AddProduct
        visible={isAddingNewProduct}
        onCancel={() => setIsAddingNewProduct(false)}
        fetchAllData={fetchAllData}
      />
      <EditProduct
        visible={isEditingProduct}
        onCancel={() => setIsEditingProduct(false)}
        product={selectedProduct}
        onUpdate={handleUpdateProduct}
        fetchAllData={fetchAllData}
      />
      <ProductDetail
        visible={isViewingProduct}
        onClose={() => setIsViewingProduct(false)}
        product={selectedProduct}
      />

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input
          placeholder="Tìm kiếm sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 500 }}
        />
        <Button type="primary" onClick={handleAddNewProduct}>
          Thêm sản phẩm
        </Button>
      </div>
      {selectedRowKeys.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="primary">
              Thao tác <span style={{ marginLeft: 8 }}>▼</span>
            </Button>
          </Dropdown>
        </div>
      )}
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        columns={[
          { title: "Mã", dataIndex: "code", key: "code" },
          { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
          {
            title: "Hình ảnh",
            dataIndex: "image",
            key: "image",
            render: (image) => (
              <img
                src={image}
                alt="product"
                style={{ width: 50, height: 50, objectFit: "cover" }}
              />
            ),
          },
          {
            title: "Loại sản phẩm",
            dataIndex: "category",
            key: "category",
            render: (categoryId) => {
              const category = categories.find((cat) => cat._id === categoryId);
              return category ? category.name : "Không xác định";
            },
          },
          {
            title: "Thao tác",
            key: "action",
            render: (_, record) => (
              <>
                <Button
                  type="link"
                  onClick={() => handleViewProductDetail(record)}
                >
                  Chi tiết
                </Button>
                <Button type="link" onClick={() => handleEditProduct(record)}>
                  Sửa
                </Button>
              
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteProduct(record.key)}
                >
                  Xóa
                </Button>
              </>
            ),
          },
        ]}
        dataSource={data.filter(
          (item) =>
            item.name &&
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        loading={loading}
      />
    </div>
  );
};

export default ProductPage;
