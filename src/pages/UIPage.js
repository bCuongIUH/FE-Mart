import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../untills/context/AuthContext";
import { getAllProducts } from "../untills/api";
import ProductsModal from "../component/products/ProductsModel";
import ProductCard from "../component/ProductCard/ProductCard";
import { message, Pagination, Spin } from "antd";
import { useParams } from "react-router-dom";
import Header from "../component/Header/Header";
import Footer from "../component/Footer/Footer";

function UIPage() {
  const [products, setProducts] = useState([]); // All products
  const [filteredProducts, setFilteredProducts] = useState([]); // Filtered products by category
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { id } = useParams(); 
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Start loading
      try {
        const data = await getAllProducts();
        setProducts(data);

        // Filter products by category id from URL
        if (id) {
          const filtered = data.filter((product) => product.category === id);
          setFilteredProducts(filtered); 
        } else {
          setFilteredProducts(data);
        }
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu sản phẩm");
        console.error(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProducts();
  }, [id]); 

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      <header>
        <Header />
      </header>
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <main style={{ padding: "20px 50px" }}>
          <section>
            {loading ? (
              <Spin tip="Đang tải sản phẩm..." />
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : (
              <>
                <div style={productGridStyle}>
                  {currentProducts.map((product) => (
                    <div key={product._id} className="item">
                      <ProductCard product={product} onClick={() => handleProductClick(product)} />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "20px", textAlign: "center" }}>
                  <Pagination
                    current={currentPage}
                    total={filteredProducts.length}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
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
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "20px",
};

export default UIPage;
