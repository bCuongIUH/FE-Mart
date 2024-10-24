import React, { useState } from "react";
import { ShoppingCartOutlined } from "@ant-design/icons"; // Import icon cho nút
import ProductsModal from "../products/ProductsModel";

const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const ProductCard = ({ product }) => {
  const [selectedProduct, setSelectedProduct] = useState(null); // State để lưu sản phẩm được chọn

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

  // Hàm xử lý khi nhấn nút "Chọn Mua"
  const handleSelectProduct = () => {
    setSelectedProduct(product); // Lưu sản phẩm vào state
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setSelectedProduct(null); // Đặt lại selectedProduct để đóng modal
  };

  // Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    // Logic thêm sản phẩm vào giỏ hàng
    console.log("Thêm vào giỏ hàng:", product);
  };

  // Hàm "Mua ngay"
  const handleBuyNow = () => {
    // Logic xử lý "Mua ngay"
    console.log("Mua ngay:", product);
  };

  return (
    <>
      <div className="product-card">
        <div className="card-top">
          {/* ======= Ảnh ======= */}
          <div
            className="product-img"
            onClick={handleSelectProduct}
            style={{ cursor: "pointer" }}
          >
            <img src={defaultImage} alt={product.name} />
          </div>
        </div>

        {/* ======= Giá ======= */}
        <div className="product-price">
          <p>
            <span>{formatCurrency(product.currentPrice)}</span>
          </p>
        </div>

        {/* ======= Tiêu đề ======= */}
        <div
          className="product-title"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            cursor: "pointer", // Thêm cursor pointer
          }}
          onClick={handleSelectProduct}
        >
          <h6>{product.name}</h6>
        </div>

        {/* ======= Nút Chọn Mua ======= */}
        <div style={buttonContainerStyle}>
          <button style={addToCartButtonStyle} onClick={handleSelectProduct}>
            <ShoppingCartOutlined /> Chọn Mua
          </button>
        </div>
      </div>

      {/* ======= Modal hiển thị khi chọn sản phẩm ======= */}
      {selectedProduct && (
        <ProductsModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </>
  );
};

export default ProductCard;
