import React, { useState, useEffect } from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import ProductsModal from "../products/ProductsModel";
import { getAllPriceProduct } from "../../untills/priceApi";

const ProductCard = ({ product }) => {
  const [selectedProduct, setSelectedProduct] = useState(null); // State để lưu chi tiết sản phẩm
  const [isLoading, setIsLoading] = useState(false);

  const defaultImage = product.image || "/path-to-placeholder-image.jpg";

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
  };

  const addToCartButtonStyle = {
    backgroundColor: "#0046ad",
    color: "#fff",
    border: "1px solid #0046ad",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
    transition: "background-color 0.3s, color 0.3s",
  };

  // Hàm xử lý khi nhấn nút "Chọn Mua" để lấy chi tiết sản phẩm từ API
  const handleSelectProduct = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPriceProduct();
      const productDetails = data.find((p) => p.productId === product.productId);
      setSelectedProduct(productDetails); // Lưu chi tiết sản phẩm vào state
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setSelectedProduct(null); // Đặt lại selectedProduct để đóng modal
  };

  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    console.log("Thêm vào giỏ hàng:", selectedProduct);
  };

  // Hàm "Mua ngay"
  const handleBuyNow = () => {
    console.log("Mua ngay:", selectedProduct);
  };

  return (
    <>
      <div className="product-card">
        <div className="card-top">
          <div
            className="product-img"
            onClick={handleSelectProduct}
            style={{ cursor: "pointer" }}
          >
            <img src={defaultImage} alt={product.name} />
          </div>
        </div>

        {/* Giá */}
        <div className="product-price">
          <p>
            {/* <span>{formatCurrency(product.currentPrice)}</span> */}
          </p>
        </div>

        {/* Tiêu đề */}
        <div
          className="product-title"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            cursor: "pointer",
          }}
          onClick={handleSelectProduct}
        >
          <h6>{product.name}</h6>
        </div>

        {/* Nút Chọn Mua */}
        <div style={buttonContainerStyle}>
          <button style={addToCartButtonStyle} onClick={handleSelectProduct}>
            <ShoppingCartOutlined /> Chọn Mua
          </button>
        </div>
      </div>

      {/* Modal hiển thị khi chọn sản phẩm */}
      {selectedProduct && (
        <ProductsModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isLoading={isLoading} // Truyền trạng thái loading vào modal
        />
      )}
    </>
  );
};

export default ProductCard;
