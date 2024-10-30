import React, { useEffect, useState } from "react";
import { Modal, Button, Image, message, Divider, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Barcode from "./Barcode";
import { getCategories } from "../../untills/api";

const ProductDetail = ({ visible, product, onClose, onEdit, onDelete }) => {
  const [categories, setCategories] = useState([]);

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

  const categoryName =
    categories.find((category) => category._id === product?.category)?.name ||
    "Không xác định";

  return (
    <Modal
      visible={visible}
      // title="Chi tiết sản phẩm"
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ borderRadius: "12px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "left",
          gap: "20px",
        }}
      >
        {/* Phần thông tin sản phẩm */}
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {product?.name}
          </h2>
          <div style={{ fontSize: "16px", fontStyle: "italic", color: "gray", marginBottom: "8px" }}>
             {categoryName}
          </div>
          <Divider />

         
          <div style={{ fontSize: "16px", margin: "8px 0" }}>
            <strong>Mã sản phẩm:</strong> {product?.code}
          </div>
          <div style={{ fontSize: "16px", margin: "8px 0" }}>
            <strong>Mã vạch:</strong>
            <p>{product?.barcode || "Không có mô tả"}</p>
          </div>
          <div style={{ fontSize: "16px", margin: "8px 0" }}>
            <strong>Mô tả</strong>
            <p style={{ fontStyle: "italic", color: "gray" }}>
              {product?.description || "Không có mô tả"}
            </p>
          </div>


          <Divider />

          {/* Hiển thị đơn vị cơ bản */}
          <h4 style={{ fontSize: "18px", fontWeight: "bold" }}>
            Đơn vị cơ bản
          </h4>
          <Tag color="blue" style={{ marginBottom: "8px" }}>
            {product?.baseUnit?.name}
          </Tag>

          {/* Hiển thị đơn vị quy đổi */}
          {product?.conversionUnits?.length > 0 && (
            <>
              <h4 style={{ fontSize: "18px", fontWeight: "bold" }}>
                Đơn vị quy đổi
              </h4>
              {product?.conversionUnits.map((unit, index) => (
                <Tag color="green" key={index} style={{ marginBottom: "8px" }}>
                  {unit?.name} - {unit?.conversionValue}
                </Tag>
              ))}
            </>
          )}
        </div>

        {/* Phần hình ảnh sản phẩm */}
        <div style={{ flex: "0 0 300px", textAlign: "center" }}>
          <Image
            src={product?.image}
            alt={product?.name}
            width={300}
            height={300}
            style={{ borderRadius: "10px", objectFit: "cover" }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetail;
