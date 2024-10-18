import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Switch,
  Button,
  Spin,
  message,
} from "antd";
import { createPromotionProgram } from "../../../services/promotionProgramService"; 
import moment from "moment";

const AddPromotionProgramModal = ({
  visible,
  onCancel,
  refreshPromotionPrograms,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // Quản lý loading

  const handleFinish = async (values) => {
    setLoading(true); // Bắt đầu loading

    // Chuẩn bị dữ liệu gửi đi
    const newProgram = {
      name: values.name,
      description: values.description,
      startDate: values.startDate.format("YYYY-MM-DD"),
      endDate: values.endDate.format("YYYY-MM-DD"),
      isActive: values.isActive,
    };

    // Gọi API để tạo mới chương trình khuyến mãi
    try {
      await createPromotionProgram(newProgram);
      refreshPromotionPrograms(); // Làm mới danh sách chương trình khuyến mãi
      form.resetFields();
      onCancel(); // Đóng modal
      message.success("Thêm chương trình khuyến mãi thành công");
    } catch (error) {
      message.error("Thêm chương trình khuyến mãi thất bại");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <Modal
      visible={visible}
      title="Thêm Mới Chương Trình Khuyến Mãi"
      okText="Thêm"
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
          style={{ marginBottom: "40px" }} 
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
        <div style={{ display: 'flex', gap: '20px' }}>
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
            style={{ marginBottom: "-30px" }}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        </div>


        <Form.Item
          name="isActive"
          label="Kích Hoạt"
          valuePropName="checked"
          style={{ marginBottom: "-30px" }}
        >
          <Switch />
        </Form.Item>
      </Form>
      {loading && <Spin style={{ display: "block", margin: "20px auto" }} />}{" "}
      {/* Hiển thị spinner khi đang loading */}
    </Modal>
  );
};

export default AddPromotionProgramModal;
