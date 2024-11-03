// import React, { useEffect, useState } from "react";
// import { Modal, Form, Input, Select, Switch } from "antd";
// import { getAllProducts } from "../../../untills/api";

// const AddVoucherModal = ({ visible, onCancel, onSubmit }) => {
//   const [form] = Form.useForm();
//   const [voucherType, setVoucherType] = useState("");
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const data = await getAllProducts();
//         setProducts(data);
//       } catch (error) {
//         console.error("Lỗi khi tải danh sách sản phẩm", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const handleOk = () => {
//     form.submit();
//   };

//   const renderConditionsFields = () => {
//     switch (voucherType) {
//       case "BuyXGetY":
//         return (
//           <>
//             {/* Các trường điều kiện cho BuyXGetY */}
//           </>
//         );
//       case "FixedDiscount":
//         return (
//           <>
//             <Form.Item
//               name={["conditions", "minOrderValue"]}
//               label="Giá trị đơn hàng tối thiểu"
//               rules={[
//                 { required: true, message: "Vui lòng nhập giá trị đơn hàng tối thiểu" },
//               ]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Input type="number" min={0} />
//             </Form.Item>
//             <Form.Item
//               name={["conditions", "discountAmount"]}
//               label="Số tiền giảm giá"
//               dependencies={["conditions", "minOrderValue"]}
//               rules={[
//                 { required: true, message: "Vui lòng nhập số tiền giảm giá" },
//                 ({ getFieldValue }) => ({
//                   validator(_, value) {
//                     const minOrderValue = getFieldValue(["conditions", "minOrderValue"]);
//                     if (!value || (minOrderValue && value <= minOrderValue)) {
//                       return Promise.resolve();
//                     }
//                     return Promise.reject(
//                       new Error("Số tiền giảm giá phải nhỏ hơn hoặc bằng giá trị đơn hàng tối thiểu")
//                     );
//                   },
//                 }),
//               ]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Input type="number" min={0} />
//             </Form.Item>
//           </>
//         );
//       case "PercentageDiscount":
//         return (
//           <>
//             <Form.Item
//               name={["conditions", "minOrderValue"]}
//               label="Giá trị đơn hàng tối thiểu"
//               rules={[
//                 { required: true, message: "Vui lòng nhập giá trị đơn hàng tối thiểu" },
//               ]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Input type="number" min={0} />
//             </Form.Item>
//             <Form.Item
//               name={["conditions", "discountPercentage"]}
//               label="Phần trăm giảm giá"
//               rules={[
//                 { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
//                 {
//                   validator(_, value) {
//                     if (value >= 1 && value <= 100) {
//                       return Promise.resolve();
//                     }
//                     return Promise.reject(
//                       new Error("Phần trăm giảm giá phải nằm trong khoảng từ 1% đến 100%")
//                     );
//                   },
//                 },
//               ]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Input type="number" min={1} max={100} />
//             </Form.Item>
//             <Form.Item
//               name={["conditions", "maxDiscountAmount"]}
//               label="Số tiền giảm giá tối đa"
//               dependencies={["conditions", "minOrderValue"]}
//               rules={[
//                 ({ getFieldValue }) => ({
//                   validator(_, value) {
//                     const minOrderValue = getFieldValue(["conditions", "minOrderValue"]);
//                     if (!value || (minOrderValue && value <= minOrderValue)) {
//                       return Promise.resolve();
//                     }
//                     return Promise.reject(
//                       new Error("Số tiền giảm giá tối đa phải thấp hơn hoặc bằng giá trị đơn hàng tối thiểu")
//                     );
//                   },
//                 }),
//               ]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Input type="number" min={0} />
//             </Form.Item>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       title="Thêm Mới Khuyến Mãi"
//       okText="Thêm"
//       cancelText="Hủy"
//       onCancel={onCancel}
//       onOk={handleOk}
//       style={{ marginTop: '20px' }}
//     >
//       <Form form={form} onFinish={onSubmit} layout="vertical">
//         <Form.Item
//           name="code"
//           label="Mã Khuyến Mãi"
//           rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
//           style={{ marginBottom: "50px" }}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="type"
//           label="Loại Khuyến Mãi"
//           rules={[{ required: true, message: "Vui lòng chọn loại voucher" }]}
//           style={{ marginBottom: "50px" }}
//         >
//           <Select onChange={(value) => setVoucherType(value)}>
//             <Select.Option value="BuyXGetY">Mua hàng tặng quà</Select.Option>
//             <Select.Option value="FixedDiscount">Tặng tiền theo hóa đơn</Select.Option>
//             <Select.Option value="PercentageDiscount">Giảm %</Select.Option>
//           </Select>
//         </Form.Item>
//         <Form.Item
//           name="isActive"
//           label="Kích hoạt"
//           valuePropName="checked"
//           style={{ marginBottom: "50px" }}
//         >
//           <Switch />
//         </Form.Item>

//         {/* Hiển thị các trường điều kiện dựa trên loại voucher */}
//         {renderConditionsFields()}
//       </Form>
//     </Modal>
//   );
// };

// export default AddVoucherModal;
// import React, { useEffect, useState } from "react";
// import { Modal, Form, Input, Select, Switch, message } from "antd";
// import { getAllProducts } from "../../../untills/api";

// const AddVoucherModal = ({ visible, onCancel, onSubmit }) => {
//   const [form] = Form.useForm();
//   const [voucherType, setVoucherType] = useState("");
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const data = await getAllProducts();
//         setProducts(data);
//       } catch (error) {
//         console.error("Lỗi khi tải danh sách sản phẩm", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const handleOk = () => {
//     form
//       .validateFields()
//       .then(values => {
//         onSubmit(values);
//         form.resetFields();
//         message.success("Thêm voucher thành công!");
//       })
//       .catch(info => {
//         console.error("Lỗi khi thêm voucher:", info);
//       });
//   };

//   const renderConditionsFields = () => {
//     switch (voucherType) {
//       case "BuyXGetY":
//         return (
//           <>
//             <Form.Item
//               name={["conditions", "productXId"]}
//               label="Sản phẩm mua"
//               rules={[{ required: true, message: "Vui lòng chọn sản phẩm X" }]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Select placeholder="Chọn sản phẩm mua">
//                 {products.map((product) => (
//                   <Select.Option key={product._id} value={product._id}>
//                     {product.name}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//             <Form.Item
//               name={["conditions", "quantityX"]}
//               label="Số lượng mua"
//               rules={[{ required: true, message: "Vui lòng nhập số lượng X" }]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Input type="number" min={1} />
//             </Form.Item>
//             <Form.Item
//               name={["conditions", "productYId"]}
//               label="Sản phẩm tặng"
//               rules={[{ required: true, message: "Vui lòng chọn sản phẩm Y" }]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Select placeholder="Chọn sản phẩm tặng">
//                 {products.map((product) => (
//                   <Select.Option key={product._id} value={product._id}>
//                     {product.name}
//                   </Select.Option>
//                 ))}
//               </Select>
//             </Form.Item>
//             <Form.Item
//               name={["conditions", "quantityY"]}
//               label="Số lượng tặng"
//               rules={[{ required: true, message: "Vui lòng nhập số lượng Y" }]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Input type="number" min={1} />
//             </Form.Item>
//           </>
//         );
//       case "FixedDiscount":
//         return (
//           <>
//             <Form.Item
//               name={["conditions", "minOrderValue"]}
//               label="Giá trị đơn hàng tối thiểu"
//               rules={[{ required: true, message: "Vui lòng nhập giá trị đơn hàng tối thiểu" }]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Input type="number" min={1} />
//             </Form.Item>
//             <Form.Item
//               name={["conditions", "discountAmount"]}
//               label="Số tiền giảm giá"
//               rules={[
//                 { required: true, message: "Vui lòng nhập số tiền giảm giá" },
//                 ({ getFieldValue }) => ({
//                   validator(_, value) {
//                     const minOrderValue = Number(getFieldValue(["conditions", "minOrderValue"]));
//                     const discountAmount = Number(value);
//                     if (!value || discountAmount <= minOrderValue) {
//                       return Promise.resolve();
//                     }
//                     return Promise.reject(
//                       new Error("Số tiền giảm giá phải nhỏ hơn hoặc bằng giá trị đơn hàng tối thiểu")
//                     );
//                   },
//                 }),
//               ]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Input type="number" min={1} />
//             </Form.Item>
//           </>
//         );
//       case "PercentageDiscount":
//         return (
//           <>
//             <Form.Item
//               name={["conditions", "minOrderValue"]}
//               label="Giá trị đơn hàng tối thiểu"
//               rules={[{ required: true, message: "Vui lòng nhập giá trị đơn hàng tối thiểu" }]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Input type="number" min={1} />
//             </Form.Item>
//             <Form.Item
//               name={["conditions", "discountPercentage"]}
//               label="Phần trăm giảm giá"
//               rules={[
//                 { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
//                 {
//                   validator(_, value) {
//                     const discountPercentage = Number(value);
//                     if (discountPercentage >= 1 && discountPercentage <= 100) {
//                       return Promise.resolve();
//                     }
//                     return Promise.reject(
//                       new Error("Phần trăm giảm giá phải nằm trong khoảng từ 1% đến 100%")
//                     );
//                   },
//                 },
//               ]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Input type="number" min={1} max={100} />
//             </Form.Item>
//             <Form.Item
//               name={["conditions", "maxDiscountAmount"]}
//               label="Số tiền giảm giá tối đa"
//               rules={[
//                 ({ getFieldValue }) => ({
//                   validator(_, value) {
//                     const minOrderValue = Number(getFieldValue(["conditions", "minOrderValue"]));
//                     const maxDiscountAmount = Number(value);
//                     if (!value || maxDiscountAmount <= minOrderValue) {
//                       return Promise.resolve();
//                     }
//                     return Promise.reject(
//                       new Error("Số tiền giảm giá tối đa phải nhỏ hơn hoặc bằng giá trị đơn hàng tối thiểu")
//                     );
//                   },
//                 }),
//               ]}
//               style={{ marginBottom: "30px" }}
//             >
//               <Input type="number" min={0} />
//             </Form.Item>
//           </>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       title="Thêm Mới Voucher"
//       okText="Thêm"
//       cancelText="Hủy"
//       onCancel={onCancel}
//       onOk={handleOk}
//       style={{ marginTop: '20px' }}
//     >
//       <Form form={form} onFinish={onSubmit} layout="vertical">
//         <Form.Item
//           name="code"
//           label="Mã voucher"
//           rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
//           style={{ marginBottom: "50px" }}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="type"
//           label="Loại voucher"
//           rules={[{ required: true, message: "Vui lòng chọn loại voucher" }]}
//           style={{ marginBottom: "50px" }}
//         >
//           <Select onChange={(value) => setVoucherType(value)}>
//             <Select.Option value="BuyXGetY">Mua hàng tặng quà</Select.Option>
//             <Select.Option value="FixedDiscount">Tặng tiền theo hóa đơn</Select.Option>
//             <Select.Option value="PercentageDiscount">Giảm %</Select.Option>
//           </Select>
//         </Form.Item>
//         <Form.Item
//           name="isActive"
//           label="Kích hoạt"
//           valuePropName="checked"
//           style={{ marginBottom: "50px" }}
//         >
//           <Switch />
//         </Form.Item>
//         {renderConditionsFields()}
//       </Form>
//     </Modal>
//   );
// };

// export default AddVoucherModal;
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Switch } from "antd";
import { getAllProducts } from "../../../untills/api"; // Import hàm API để lấy danh sách sản phẩm

const AddVoucherModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [voucherType, setVoucherType] = useState(""); // State để lưu loại voucher
  const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm

  // Lấy danh sách sản phẩm khi component được mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm", error);
      }
    };
    fetchProducts();
  }, []);

  const handleOk = () => {
    form.submit();
  };

  // Điều kiện tương ứng dựa trên loại voucher
  const renderConditionsFields = () => {
    switch (voucherType) {
      case "BuyXGetY":
        return (
          <>
            <Form.Item
              name={["conditions", "productXId"]}
              label="Sản phẩm mua"
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm X" }]}
              style={{ marginBottom: "50px" }}
            >
              <Select placeholder="Chọn sản phẩm mua">
                {products.map((product) => (
                  <Select.Option key={product._id} value={product._id}>
                    {product.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={["conditions", "quantityX"]}
              label="Số lượng mua"
              rules={[{ required: true, message: "Vui lòng nhập số lượng X" }]}
              style={{ marginBottom: "50px" }}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name={["conditions", "productYId"]}
              label="Sản phẩm tặng"
              rules={[{ required: true, message: "Vui lòng chọn sản phẩm tặng" }]}
              style={{ marginBottom: "50px" }}
            >
              <Select placeholder="Chọn sản phẩm tặng">
                {products.map((product) => (
                  <Select.Option key={product._id} value={product._id}>
                    {product.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={["conditions", "quantityY"]}
              label="Số lượng tặng"
              rules={[{ required: true, message: "Vui lòng nhập số lượng tặng" }]}
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" />
            </Form.Item>
          </>
        );
      case "FixedDiscount":
        return (
          <>
            <Form.Item
              name={["conditions", "minOrderValue"]}
              label="Giá trị đơn hàng tối thiểu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá trị đơn hàng tối thiểu",
                },
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name={["conditions", "discountAmount"]}
              label="Số tiền giảm giá"
              rules={[
                { required: true, message: "Vui lòng nhập số tiền giảm giá" },
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" />
            </Form.Item>
          </>
        );
      case "PercentageDiscount":
        return (
          <>
            <Form.Item
              name={["conditions", "minOrderValue"]}
              label="Giá trị đơn hàng tối thiểu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá trị đơn hàng tối thiểu",
                },
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name={["conditions", "discountPercentage"]}
              label="Phần trăm giảm giá"
              rules={[
                { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
              ]}
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name={["conditions", "maxDiscountAmount"]}
              label="Số tiền giảm giá tối đa"
              style={{ marginBottom: "30px" }}
            >
              <Input type="number" />
            </Form.Item>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      title="Thêm Mới Voucher"
      okText="Thêm"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={handleOk}
      style={{ marginTop: '20px' }}
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="code"
          label="Mã voucher"
          rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
          style={{ marginBottom: "50px" }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại voucher"
          rules={[{ required: true, message: "Vui lòng chọn loại voucher" }]}
          style={{ marginBottom: "50px" }}
        >
          <Select onChange={(value) => setVoucherType(value)}>
          <Select.Option value="BuyXGetY">Mua hàng tặng quà</Select.Option>
            <Select.Option value="FixedDiscount">Tặng tiền theo hóa đơn</Select.Option>
            <Select.Option value="PercentageDiscount">
              Giảm %
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="isActive"
          label="Kích hoạt"
          valuePropName="checked"
          style={{ marginBottom: "50px" }}
        >
          <Switch />
        </Form.Item>

        {/* Hiển thị các trường điều kiện dựa trên loại voucher */}
        {renderConditionsFields()}
      </Form>
    </Modal>
  );
};

export default AddVoucherModal;