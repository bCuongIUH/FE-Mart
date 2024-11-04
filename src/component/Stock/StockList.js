import React, { useEffect, useState } from "react";
import { getAllStocks } from "../../untills/stockApi";
import { getProductByCode } from "../../untills/api";
import { Table, Input, Button } from "antd";
import Title from "antd/es/typography/Title";

const { Column } = Table;

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchCode, setSearchCode] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const productData = await getProductByCode(searchCode);
      console.log("Product Data:", productData);
      setProduct(productData);

      const stockData = await getAllStocks();
      console.log("Stock Data:", stockData);
      setStocks(stockData.stocks || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  // Tạo stockData với conversionValue
  const stockData = stocks
    .filter((stock) => stock.productCode === product?.code)
    .flatMap((stock) => {
      return stock.stocks.map((s) => {
        // Lấy conversionValue dựa trên unit
        let conversionValue = 1;
        if (s.unit === product?.baseUnit.name) {
          conversionValue = product.baseUnit.conversionValue;
        } else {
          const matchingUnit = product?.conversionUnits.find(
            (unit) => unit.name === s.unit
          );
          conversionValue = matchingUnit?.conversionValue || 1;
        }
        const baseUnitQuantity = s.quantity * conversionValue;
        return {
          productId: stock.productId,
          code: stock.productCode,
          productName: product?.name,
          image: product?.image,
          unit: s.unit,
          quantity: s.quantity,
          conversionValue: conversionValue, // Thêm conversionValue
          baseUnitName: product?.baseUnit.name,
          baseUnitQuantity: baseUnitQuantity,
        };
      });
    });

  return (
    <div>
        <Title style={{ fontWeight: 'bold', fontStyle: 'italic' }} level={2}>Quản lí tồn kho</Title>
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
          style={{ width: "70%", height: "40px", marginRight: "2%" }}
        />
        <Button
          type="primary"
          onClick={handleSearch}
          disabled={!searchCode}
          style={{ width: "20%", height: "40px" }}
        >
          Tìm kiếm
        </Button>
      </div>
      {error && <p style={{ color: "red" }}>Lỗi: {error}</p>}
      <Table
        dataSource={stockData}
        loading={loading}
        rowKey={(record) => `${record.productId}-${record.unit}`}
        style={{ marginTop: 16 }}
      >
        <Column title="Mã SP" dataIndex="code" key="code" />
        <Column
          title="Tên sản phẩm"
          dataIndex="productName"
          key="productName"
        />
        <Column
          title="Hình ảnh"
          dataIndex="image"
          key="image"
          render={(image) => (
            <img src={image} alt="product" style={{ width: 50, height: 50 }} />
          )}
        />
        <Column title="Đơn vị tính" dataIndex="unit" key="unit" />
        <Column title="Số lượng tồn" dataIndex="quantity" key="quantity" />
        <Column title="Đơn vị cơ bản" dataIndex="baseUnitName" key="baseUnitName" />
        <Column
          title="Giá trị quy đổi"
          dataIndex="conversionValue"
          key="conversionValue"
        />
        <Column title="Tổng số lượng" dataIndex="baseUnitQuantity" key="baseUnitQuantity" />

      </Table>
    </div>
  );
};

export default StockList;
