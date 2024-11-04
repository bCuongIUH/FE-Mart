import React, { useEffect, useState } from "react";
import { Input, Select, List, message } from "antd";
import { getAllPriceProduct } from "../../untills/priceApi";

const { Option } = Select;

function ProductFilter() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllPriceProduct();
        if (response.success) {
          setProducts(response.prices);
          setFilteredProducts(response.prices);

          // Extract unique categories from products
          const uniqueCategories = [
            ...new Set(response.prices.map((product) => product.category)),
          ];
          setCategories(uniqueCategories);
        } else {
          message.error("Lỗi khi tải danh sách sản phẩm.");
        }
      } catch (error) {
        message.error("Không thể tải dữ liệu sản phẩm.");
      }
    };
    fetchProducts();
  }, []);

  // Filter products based on search text and selected category
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchText, selectedCategory]);

  return (
    <div>
      <h3>Danh sách sản phẩm</h3>
      <Input
        placeholder="Tìm kiếm sản phẩm"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <Select
        placeholder="Chọn danh mục"
        onChange={(value) => setSelectedCategory(value)}
        value={selectedCategory}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <Option value={null}>Tất cả</Option>
        {categories.map((category) => (
          <Option key={category} value={category}>
            {category}
          </Option>
        ))}
      </Select>
      <List
        itemLayout="horizontal"
        dataSource={filteredProducts}
        renderItem={(product) => (
          <List.Item>
            <List.Item.Meta
              title={product.name}
              description={`Giá: ${product.price}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default ProductFilter;
