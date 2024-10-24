import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../../untills/api"; // Gọi API để lấy sản phẩm

// Hàm formatCurrency để định dạng tiền tệ theo VND
const formatCurrency = (amount) => {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const Search = () => {
  const [searchValue, setSearchValue] = useState(""); // Giá trị tìm kiếm
  const [products, setProducts] = useState([]); // Lưu danh sách sản phẩm tìm được
  const [showSearchResult, setShowSearchResult] = useState(false); // Hiển thị kết quả tìm kiếm
  const [showCloseBtn, setShowCloseBtn] = useState(false); // Hiển thị nút đóng
  const [showSpinner, setShowSpinner] = useState(false); // Hiển thị spinner (đang tải)

  // Debounce API call: Chỉ gọi API sau khi người dùng dừng nhập liệu trong 300ms
  useEffect(() => {
    if (!searchValue.trim()) {
      setShowSearchResult(false);
      setShowCloseBtn(false);
      setShowSpinner(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchValue); // Gọi API khi người dùng dừng nhập liệu
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn); // Dọn dẹp nếu người dùng nhập tiếp
  }, [searchValue]);

  // Gọi API để tìm kiếm sản phẩm dựa trên tên
  const fetchProducts = async (query) => {
    try {
      setShowSpinner(true);
      const data = await getAllProducts(); // Gọi API để lấy tất cả sản phẩm
      // Lọc sản phẩm dựa trên từ khóa tìm kiếm
      const filteredProducts = data.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filteredProducts);
      setShowSearchResult(true);
      setShowCloseBtn(true);
      setShowSpinner(false);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setShowSpinner(false);
    }
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleCloseBtnClick = () => {
    setShowSearchResult(false);
    setSearchValue("");
    setShowCloseBtn(false);
  };

  const closeSearchUnder992 = () => {
    if (window.innerWidth < 992) {
      setShowSearchResult(false);
    }
  };

  return (
    <div className="search">
      {/* ======= search-form ======= */}
      <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={searchValue}
          placeholder="Nhập từ khóa..."
          onChange={handleChange}
        />

        <div className={showSpinner ? "lds-dual-ring" : "d-none"}></div>
      </form>

      {/* ======= search-result ======= */}
      <div className={showSearchResult ? "search-result-wrapper" : "d-none"}>
        {products.length > 0 ? (
          <div className="search-result">
            {products.map((product) => {
              const defaultImage = product.image;

              return (
                <div key={product._id} className="product-item d-flex">
                  <div className="img">
                    <img src={defaultImage} alt={product.name} />
                  </div>
                  <div className="info">
                    <Link
                      to={`/UIPage/${product._id}`}
                      onClick={() => {
                        setShowSearchResult(false);
                        setShowCloseBtn(false);
                        setSearchValue("");
                        closeSearchUnder992();
                      }}
                    >
                      <h6>{product.name}</h6>
                    </Link>

                    <div className="product-price">
                      <p style={{ margin: "0", fontWeight: "bold" }}>
                        {formatCurrency(product.currentPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="my-2">Không tìm thấy sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
