import { useContext, useState } from "react";
import { addToCartForUser, getAddToCart } from "../../untills/api";
import { AuthContext } from "../../untills/context/AuthContext";
import { message } from "antd"; // Import message từ Ant Design
import { Modal, Button } from "react-bootstrap"; // Import Modal từ React-Bootstrap

function ProductsModal({ product, onClose }) {
  const { user } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = product.quantity || 0;
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [cart, setCart] = useState([]);

  // Hàm để định dạng giá thành VND
  // const formatPrice = (price) => {
  //   return price.toLocaleString("vi-VN", {
  //     style: "currency",
  //     currency: "VND",
  //   });
  // };

  // Hàm để tính toán giá dựa trên đơn vị được chọn
  const getTotalPrice = () => {
    if (!selectedUnit || !product.currentPrice) return product.currentPrice;
    return product.currentPrice * selectedUnit.value;
  };

  const onAddToCart = async () => {
    try {
      if (!user || !user._id) {
        return message.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      }

      if (!product || !product._id) {
        return message.error("Sản phẩm không hợp lệ");
      }

      // Xác định giá trị currentPrice
      const currentPrice = selectedUnit
        ? product.currentPrice * selectedUnit.value
        : product.currentPrice;

      // Xác định đơn vị nếu có
      const unit = selectedUnit ? selectedUnit.name : null;
      const unitValue = selectedUnit ? selectedUnit.value : null;

      // Gọi hàm addToCartForUser với currentPrice và unit đã xác định
      const cartData = await addToCartForUser(
        user._id,
        product._id,
        quantity,
        currentPrice,
        unit, // Truyền đơn vị (unit) nếu có
        unitValue
      );
      setCart(cartData.items);

      message.success("Sản phẩm đã được thêm vào giỏ hàng");
    } catch (error) {
      message.error("Lỗi khi thêm sản phẩm vào giỏ hàng");
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= maxQuantity) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
  };

  // Đảm bảo sự kiện đóng modal chỉ được kích hoạt khi người dùng nhấp vào nút Đóng
  const handleModalClick = (e) => {
    e.stopPropagation(); // Dừng sự kiện đóng modal khi click vào bên trong
  };

  return (
    <Modal show={true} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body onClick={handleModalClick}>
        {" "}
        {/* Thêm sự kiện onClick cho Modal Body */}
        <div className="modalContent" style={{ display: "flex" }}>
          <div
            className="imageContainer"
            style={{ flex: 1, marginRight: "20px" }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "auto",
                border: "1px solid #ccc",
              }}
            />
            <p style={{ fontSize: "12px", textAlign: "center", color: "gray" }}>
              * Hình ảnh chỉ mang tính chất minh họa *
            </p>
          </div>
          <div
            className="modalDetails"
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>
              {product.name}
            </h2>
            <p style={{ fontSize: "18px", marginBottom: "10px" }}>
              {product.description}
            </p>
            <p style={{ fontSize: "22px", marginBottom: "15px" }}>
              <span style={{ fontWeight: "bold" }}>
                {/* {formatPrice(getTotalPrice())} */}
              </span>
            </p>
            <div style={{ marginBottom: "20px" }}>
              <p>
                <strong>Số lượng có sẵn:</strong> {maxQuantity}
              </p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  style={{
                    backgroundColor: "#0046ad",
                    borderColor: "#0046ad",
                  }}
                >
                  -
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={maxQuantity}
                  style={{
                    width: "50px",
                    textAlign: "center",
                    margin: "0 10px",
                  }}
                />
                <Button
                  onClick={incrementQuantity}
                  disabled={quantity >= maxQuantity}
                  style={{
                    backgroundColor: "#0046ad",
                    borderColor: "#0046ad",
                  }}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Kiểm tra nếu sản phẩm có đơn vị */}
            {product.units && product.units.length > 0 && (
              <div>
                <p>
                  <strong>Chọn đơn vị:</strong>
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  {product.units[0].details.map((unit) => (
                    <div
                      key={unit._id}
                      style={{
                        padding: "10px 20px",
                        border: `2px solid ${
                          selectedUnit && selectedUnit._id === unit._id
                            ? "#0046ad"
                            : "#cccccc"
                        }`,
                        borderRadius: "5px",
                        cursor: "pointer",
                        textAlign: "center",
                        minWidth: "80px",
                        color: "black",
                      }}
                      onClick={() => handleUnitClick(unit)}
                    >
                      {unit.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p style={{ marginTop: "10px" }}>
              <strong>Danh mục:</strong> {product.category.name}
            </p>
            <p>
              <strong>Nhà cung cấp:</strong> {product.supplier.name}
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{
            backgroundColor: "#0046ad",
            borderColor: "#0046ad",
          }}
          onClick={onAddToCart}
        >
          Thêm vào giỏ hàng
        </Button>
        <Button
          style={{
            backgroundColor: "#0046ad",
            borderColor: "#0046ad",
          }}
          onClick={onClose}
        >
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProductsModal;
