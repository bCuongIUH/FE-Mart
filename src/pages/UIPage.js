import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../untills/context/AuthContext";
import { getAllProducts, getAllProductsPOP } from "../untills/api";
import ProductsModal from "../component/products/ProductsModel";
import ProductCard from "../component/ProductCard/ProductCard"; // Import ProductCard để sử dụng
import { message, Pagination } from "antd";
import { useParams } from "react-router-dom";
import Header from "../component/Header/Header";
import Footer from "../component/Footer/Footer";

function UIPage() {
  const [products, setProducts] = useState([]); // Tất cả sản phẩm
  const [filteredProducts, setFilteredProducts] = useState([]); // Sản phẩm đã lọc theo danh mục
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { id } = useParams(); // Lấy id danh mục từ URL
  console.log(id);
  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 10; // Số sản phẩm mỗi trang

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts(); // Lấy tất cả sản phẩm
        setProducts(data); // Lưu tất cả sản phẩm vào state

        // Lọc sản phẩm theo category id từ URL
        if (id) {
          const filtered = data.filter((product) => product.category._id === id); 
          setFilteredProducts(filtered); // Lưu danh sách sản phẩm đã lọc vào state
        } else {
          setFilteredProducts(data); // Nếu không có id, hiển thị tất cả sản phẩm
        }
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu sản phẩm");
        console.error(error);
      }
    };

    fetchProducts();
  }, [id]); // Thực hiện lại khi id thay đổi

  const handleProductClick = (product) => {
    const userInStorage = localStorage.getItem("user");
    if (!userInStorage) {
      message.warning("Bạn phải đăng nhập để xem chi tiết sản phẩm");
    } else {
      setSelectedProduct(product);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    console.log("Thêm vào giỏ hàng:", product);
    handleCloseModal();
  };

  const handleBuyNow = (product) => {
    console.log("Mua sản phẩm:", product);
    handleCloseModal();
  };

  // Xử lý phân trang ở frontend
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  // Lấy sản phẩm của trang hiện tại
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  ); // Lấy sản phẩm theo trang

  return (<>
    <header>
      <Header />
    </header>
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <main style={{ padding: "20px 50px" }}>
        <section>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div style={productGridStyle}>
            {currentProducts.map((product) => (
              <div key={product._id} className="item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Phân trang */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Pagination
              current={currentPage} // Trang hiện tại
              total={filteredProducts.length} // Tổng số sản phẩm đã lọc
              pageSize={itemsPerPage} // Số sản phẩm mỗi trang
              onChange={handlePageChange} // Hàm xử lý khi chuyển trang
              showSizeChanger={false} // Ẩn tuỳ chọn thay đổi số sản phẩm mỗi trang
            />
          </div>
        </section>
      </main>

      {selectedProduct && (
        <ProductsModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </div>
    <footer>
      <Footer />
    </footer>
  </>

);
}

const productGridStyle = {
display: "grid",
gridTemplateColumns: "repeat(5, 1fr)", // 5 sản phẩm mỗi hàng
gap: "20px",
};

export default UIPage;