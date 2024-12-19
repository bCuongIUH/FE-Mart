import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Input, message, Modal } from "antd";
import { getAllProducts, getCategories, deleteProduct } from "../../untills/api";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import ProductDetail from "./ProductDetail";
import { AuthContext } from "../../untills/context/AuthContext";
import { FaEdit, FaTrash } from "react-icons/fa";

const ProductPage = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewingProduct, setIsViewingProduct] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

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
        message.error("Lỗi khi lấy danh mục: " + (error.response?.data.message || "Vui lòng thử lại!"));
      }
    };
    fetchCategories();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const productsData = await getAllProducts();
      setData(productsData.map((product) => ({ ...product, key: product._id })));
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
      prevData.map((product) => (product._id === updatedProduct._id ? updatedProduct : product))
    );
    setIsEditingProduct(false);
    setSelectedProduct(null);
  };

  const handleEditProduct = (record, event) => {
    event.stopPropagation(); 
    setSelectedProduct(record);
    setIsEditingProduct(true);
  };

  const handleViewProductDetail = (record) => {
    setSelectedProduct(record);
    setIsViewingProduct(true);
  };

  const handleDeleteProduct = (productId, event) => {
    event.stopPropagation();
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteProduct(productId);
          setData((prevData) => prevData.filter((item) => item._id !== productId));
          message.success("Đã xóa sản phẩm thành công!");
        } catch (error) {
          console.error("Lỗi khi xóa sản phẩm:", error);
          message.error("Lỗi khi xóa sản phẩm.");
        }
      },
    });
  };

  const handleAddNewProduct = () => {
    setIsAddingProduct(true);
  };

  const columns = [
    { 
      title: "Mã", 
      dataIndex: "code", 
      key: "code",
      width: 10,
      sorter: (a, b) => a.code.localeCompare(b.code)
    },
    { 
      title: "Tên sản phẩm", 
      dataIndex: "name", 
      key: "name",
      width: 120,
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (image) => (
        <img src={image} alt="product" style={{ width: 50, height: 50, objectFit: "cover" }} />
      ),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "category",
      key: "category",
      width: 100,
      render: (categoryId) => {
        const category = categories.find((cat) => cat._id === categoryId);
        return category ? category.name : "Không xác định";
      },
      sorter: (a, b) => {
        const categoryA = categories.find((cat) => cat._id === a.category);
        const categoryB = categories.find((cat) => cat._id === b.category);
        return (categoryA?.name || "").localeCompare(categoryB?.name || "");
      }
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_, record) => (
        <>
          <Button icon={<FaEdit />} type="text" onClick={(e) => handleEditProduct(record, e)}>
            Sửa
          </Button>
          <Button icon={<FaTrash />} type="text" danger onClick={(e) => handleDeleteProduct(record.key, e)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ marginTop: "20px" }}>
      <AddProduct
        visible={isAddingProduct}
        onCancel={() => setIsAddingProduct(false)}
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

      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Input
          placeholder="Tìm kiếm sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 500 }}
        />
        <Button type="primary" danger onClick={handleAddNewProduct}>
          Thêm sản phẩm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data.filter(
          (item) =>
            item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        loading={loading}
        rowKey={(record) => record._id}
        onRow={(record) => ({
          onClick: () => handleViewProductDetail(record), 
        })}
        onChange={(pagination, filters, sorter) => {
          console.log('Various parameters', pagination, filters, sorter);
          // You can add additional logic here if needed when sorting occurs
        }}
      />
    </div>
  );
};

export default ProductPage;

