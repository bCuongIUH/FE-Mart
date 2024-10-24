// import { useContext, useState } from "react";
// import { message } from "antd"; // Import message từ Ant Design
// import { Modal, Button } from "react-bootstrap"; // Import Modal từ React-Bootstrap

// function ProductsModalAdmin({
//   product,
//   onClose,
//   onAddToCart,
//   setSelectedUnit,
//   selectedUnit,
//   handleQuantityChange,
//   setQuantity,
//   quantity,
// }) {
//   const maxQuantity = product.quantity || 0;
//   const [cart, setCart] = useState([]);

//   // Hàm để định dạng giá thành VND
//   const formatPrice = (price) => {
//     return price.toLocaleString("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     });
//   };

//   // Hàm để tính toán giá dựa trên đơn vị được chọn
//   const getTotalPrice = () => {
//     if (!selectedUnit || !product.currentPrice) return product.currentPrice;
//     return product.currentPrice * selectedUnit.value;
//   };

//   const incrementQuantity = () => {
//     if (quantity < maxQuantity) {
//       setQuantity((prev) => prev + 1);
//     }
//   };

//   const decrementQuantity = () => {
//     if (quantity > 1) {
//       setQuantity((prev) => prev - 1);
//     }
//   };

//   const handleUnitClick = (unit) => {
//     setSelectedUnit(unit);
//   };

//   // Hàm thêm sản phẩm vào giỏ hàng
//   const handleAddToCart = () => {
//     if (!selectedUnit) {
//         message.error("Vui lòng chọn đơn vị trước khi thêm vào giỏ hàng.");
//         return;
//     }
    
//     const cartItem = {
//         productId: product._id,
//         unitDetailId: selectedUnit._id, 
//         quantity,
//         totalPrice: getTotalPrice(), 
//     };

//     // Gọi hàm onAddToCart với cartItem
//     onAddToCart(cartItem);
//     message.success("Sản phẩm đã được thêm vào giỏ hàng!");
    
//     // Vô hiệu hóa nút thêm vào giỏ hàng sau khi nhấn
//     setButtonDisabled(true);
//     onClose(); 
// };

// // Khởi tạo cờ để theo dõi trạng thái nút
// const [buttonDisabled, setButtonDisabled] = useState(false);


//   // Đảm bảo sự kiện đóng modal chỉ được kích hoạt khi người dùng nhấp vào nút Đóng
//   const handleModalClick = (e) => {
//     e.stopPropagation(); // Dừng sự kiện đóng modal khi click vào bên trong
//   };

//   return (
//     <Modal show={true} onHide={onClose} centered size="lg">
//       <Modal.Header closeButton>
//         <Modal.Title>{product.name}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body onClick={handleModalClick}>
//         <div className="modalContent" style={{ display: "flex" }}>
//           <div className="imageContainer" style={{ flex: 1, marginRight: "20px" }}>
//             <img
//               src={product.image}
//               alt={product.name}
//               style={{ width: "100%", height: "auto", border: "1px solid #ccc" }}
//             />
//             <p style={{ fontSize: "12px", textAlign: "center", color: "gray" }}>
//               * Hình ảnh chỉ mang tính chất minh họa *
//             </p>
//           </div>
//           <div className="modalDetails" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
//             <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>{product.name}</h2>
//             <p style={{ fontSize: "18px", marginBottom: "10px" }}>{product.description}</p>
//             <p style={{ fontSize: "22px", marginBottom: "15px" }}>
//               <span style={{ fontWeight: "bold" }}>{formatPrice(getTotalPrice())}</span>
//             </p>
//             <div style={{ marginBottom: "20px" }}>
//               <p><strong>Số lượng có sẵn:</strong> {maxQuantity}</p>
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <Button onClick={decrementQuantity} disabled={quantity <= 1} style={{ backgroundColor: "#0046ad", borderColor: "#0046ad" }}>
//                   -
//                 </Button>
//                 <input
//                   type="number"
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   min="1"
//                   max={maxQuantity}
//                   style={{ width: "50px", textAlign: "center", margin: "0 10px" }}
//                 />
//                 <Button onClick={incrementQuantity} disabled={quantity >= maxQuantity} style={{ backgroundColor: "#0046ad", borderColor: "#0046ad" }}>
//                   +
//                 </Button>
//               </div>
//             </div>

//             {/* Kiểm tra nếu sản phẩm có đơn vị */}
//             {product.units && product.units.length > 0 && (
//               <div>
//                 <p><strong>Chọn đơn vị:</strong></p>
//                 <div style={{ display: "flex", gap: "10px" }}>
//                   {product.units[0].details.map((unit) => (
//                     <div
//                       key={unit._id}
//                       style={{
//                         padding: "10px 20px",
//                         border: `2px solid ${selectedUnit && selectedUnit._id === unit._id ? "#0046ad" : "#cccccc"}`,
//                         borderRadius: "5px",
//                         cursor: "pointer",
//                         textAlign: "center",
//                         minWidth: "80px",
//                         color: "black",
//                       }}
//                       onClick={() => handleUnitClick(unit)}
//                     >
//                       {unit.name}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <p style={{ marginTop: "10px" }}><strong>Danh mục:</strong> {product.category.name}</p>
//             <p><strong>Nhà cung cấp:</strong> {product.supplier.name}</p>
//           </div>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button
//           style={{ backgroundColor: "#0046ad", borderColor: "#0046ad" }}
//           onClick={handleAddToCart} // Cập nhật để sử dụng hàm mới
//           disabled={buttonDisabled}
//         >
//           Thêm vào giỏ hàng
//         </Button>
//         <Button
//           style={{ backgroundColor: "#0046ad", borderColor: "#0046ad" }}
//           onClick={onClose}
//         >
//           Đóng
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// export default ProductsModalAdmin;
import { useContext, useState } from "react";
import { message } from "antd"; // Import message từ Ant Design
import { Modal, Button } from "react-bootstrap"; // Import Modal từ React-Bootstrap

function ProductsModalAdmin({
  product,
  onClose,
  onAddToCart,
  setSelectedUnit,
  selectedUnit,
  handleQuantityChange,
  setQuantity,
  quantity,
}) {
  const maxQuantity = product.quantity || 0;
  const [cart, setCart] = useState([]);

  // Hàm để định dạng giá thành VND
  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Hàm để tính toán giá dựa trên đơn vị được chọn
  const getTotalPrice = () => {
    if (!selectedUnit || !product.currentPrice) return product.currentPrice;
    return product.currentPrice * selectedUnit.value;
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
                {formatPrice(getTotalPrice())}
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

export default ProductsModalAdmin;