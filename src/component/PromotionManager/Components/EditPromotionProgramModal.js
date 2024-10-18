import React, { useState, useEffect } from "react";
import { Modal, Form, Input, DatePicker, Switch, Spin, message } from "antd";
import { updatePromotionProgram } from "../../../services/promotionProgramService"; // Import hàm gọi API
import moment from "moment";

const EditPromotionProgramModal = ({
  visible,
  onCancel,
  refreshPromotionPrograms,
  editingProgram, // Chương trình khuyến mãi đang được chỉnh sửa
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Quản lý loading

  useEffect(() => {
    // Điền giá trị của chương trình khuyến mãi hiện tại vào form khi modal được mở
    if (editingProgram) {
      form.setFieldsValue({
        name: editingProgram.name,
        description: editingProgram.description,
        startDate: moment(editingProgram.startDate),
        endDate: moment(editingProgram.endDate),
        isActive: editingProgram.isActive,
      });
    }
  }, [editingProgram, form]);

  const handleFinish = async (values) => {
    setLoading(true); // Bắt đầu loading

    // Chuẩn bị dữ liệu gửi đi
    const updatedProgram = {
      name: values.name,
      description: values.description,
      startDate: values.startDate.format("YYYY-MM-DD"),
      endDate: values.endDate.format("YYYY-MM-DD"),
      isActive: values.isActive,
    };

    // Gọi API để cập nhật chương trình khuyến mãi
    try {
      await updatePromotionProgram(editingProgram._id, updatedProgram); // Sử dụng ID của chương trình hiện tại
      refreshPromotionPrograms(); // Làm mới danh sách chương trình khuyến mãi
      form.resetFields();
      onCancel(); // Đóng modal
      message.success("Cập nhật chương trình khuyến mãi thành công");
    } catch (error) {
      message.error("Cập nhật chương trình khuyến mãi thất bại");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <Modal
      visible={visible}
      title="Chỉnh Sửa Chương Trình Khuyến Mãi"
      okText="Cập nhật"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={() => form.submit()} // Gọi submit form khi nhấn OK
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Tên Chương Trình"
          rules={[
            { required: true, message: "Vui lòng nhập tên chương trình!" },
          ]}
          style={{ marginBottom: "30px" }} // Giảm khoảng cách giữa các fields
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Mô Tả"
          style={{ marginBottom: "30px" }}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Ngày Bắt Đầu"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
          style={{ marginBottom: "30px" }}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="endDate"
          label="Ngày Kết Thúc"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
          style={{ marginBottom: "30px" }}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          name="isActive"
          label="Kích Hoạt"
          valuePropName="checked" // Chuyển đổi giá trị sang boolean cho Switch
          style={{ marginBottom: "30px" }}
        >
          <Switch />
        </Form.Item>
      </Form>
      {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}{" "}
      {/* Hiển thị spinner khi đang loading */}
    </Modal>
  );
};

export default EditPromotionProgramModal;
