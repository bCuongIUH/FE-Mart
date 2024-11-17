import React, { useState, useEffect } from "react";
import { Table, Button, Switch, message, Popconfirm, Form, Tag } from "antd";
import {
  getAllPromotionPrograms,
  createPromotionProgram,
  updatePromotionProgram,
  deletePromotionProgram,
  changePromotionStatus,
} from "../../services/promotionProgramService";
import {
  getVoucherByPromotionProgramId,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "../../services/voucherService";
import moment from "moment";
import AddPromotionProgramModal from "./Components/AddPromotionProgramModal";
import EditPromotionProgramModal from "./Components/EditPromotionProgramModal";
import AddVoucherModal from "./Components/AddVoucherModal";
import EditVoucherModal from "./Components/EditVoucherModal";
import { EditOutlined, DeleteOutlined, DownOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";

const PromotionProgramList = () => {
  const [promotionPrograms, setPromotionPrograms] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [voucherData, setVoucherData] = useState({});
  const [isAddVoucherModalVisible, setIsAddVoucherModalVisible] =
    useState(false);
  const [isEditVoucherModalVisible, setIsEditVoucherModalVisible] =
    useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [currentPromotionId, setCurrentPromotionId] = useState(null);
  const [form] = Form.useForm();
  useEffect(() => {
    fetchPromotionPrograms();
  }, []);

  const fetchPromotionPrograms = async () => {
    try {
      const data = await getAllPromotionPrograms();
      setPromotionPrograms(data);
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải danh sách chương trình khuyến mãi");
    }
  };

  // Gọi API để lấy danh sách voucher khi mở rộng một dòng
  const fetchVouchers = async (promotionProgramId) => {
    try {
      const vouchers = await getVoucherByPromotionProgramId(promotionProgramId);
      setVoucherData((prev) => ({ ...prev, [promotionProgramId]: vouchers }));
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải danh sách voucher");
    }
  };

  const handleAddNew = () => {
    setIsAddModalVisible(true);
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setIsEditModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deletePromotionProgram(id);
      message.success("Chương trình khuyến mãi đã được xóa");
      fetchPromotionPrograms();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa chương trình khuyến mãi");
    }
  };

  const handleSwitchChange = async (id, isActive) => {
    try {
      await changePromotionStatus(id, isActive);
      message.success("Trạng thái chương trình khuyến mãi đã được cập nhật");
      fetchPromotionPrograms();
    } catch (error) {
      message.error("Có lỗi xảy ra khi thay đổi trạng thái");
    }
  };

  const handleVoucherSubmit = async (values) => {
    try {
      if (editingVoucher) {
        // Cập nhật voucher
        await updateVoucher(editingVoucher._id, values);
        message.success("Cập nhật khuyến mãi thành công");
      } else {
        // Tạo mới voucher
        await createVoucher({
          ...values,
          promotionProgramId: currentPromotionId,
        });
        message.success("Tạo mới khuyến mãi thành công");
      }
      setIsAddVoucherModalVisible(false);
      setIsEditVoucherModalVisible(false);
      fetchVouchers(currentPromotionId);
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu khuyến mãi");
    }
  };

  const handleVoucherDelete = async (voucherId, promotionProgramId) => {
    // Tìm chương trình khuyến mãi tương ứng với voucher
    const promotionProgram = promotionPrograms.find(
      (program) => program._id === promotionProgramId
    );

    // Kiểm tra nếu chương trình đang hoạt động
    if (promotionProgram && promotionProgram.isActive) {
      message.error("Không thể xóa khuyến mãi vì chương trình khuyến mãi đang hoạt động");
      return;
    }

    try {
      await deleteVoucher(voucherId);
      message.success("Khuyến mãi đã được xóa");
      fetchVouchers(promotionProgramId);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa khuyến mãi");
    }
  };

  const handleVoucherEdit = (voucher, promotionProgramId) => {
    const promotionProgram = promotionPrograms.find(
      (program) => program._id === promotionProgramId
    );

    if (!promotionProgram.isActive) {
      setEditingVoucher(voucher);
      setCurrentPromotionId(promotionProgramId);
      setIsEditVoucherModalVisible(true);
    } else {
      message.error(
        "Không thể chỉnh sửa khuyến mãi vì chương trình khuyến mãi đang hoạt động"
      );
    }
  };

  const handleAddVoucher = (promotionProgramId) => {
    setCurrentPromotionId(promotionProgramId);
    setEditingVoucher(null);
    setIsAddVoucherModalVisible(true);
  };

  // Xử lý mở rộng bảng để hiển thị danh sách voucher
  const handleExpand = async (expanded, record) => {
    if (expanded) {
      if (!voucherData[record._id]) {
        await fetchVouchers(record._id); // Gọi API nếu chưa có dữ liệu voucher
      }
      setExpandedRowKeys([record._id]); // Mở rộng dòng hiện tại
    } else {
      setExpandedRowKeys([]); // Đóng dòng
    }
  };
  const voucherTypeNames = {
    BuyXGetY: "Mua hàng Tặng quà",
    FixedDiscount: "Giảm giá cố định",
    PercentageDiscount: "Giảm giá theo phần trăm",
  };

  // Bảng hiển thị voucher khi mở rộng một dòng
  const expandedRowRender = (record) => {
    const vouchers = voucherData[record._id] || [];
    const voucherColumns = [
      {
        title: "Mã Khuyến Mãi",
        dataIndex: "code",
        key: "code",
      },
      {
        title: "Loại Khuyến Mãi",
        dataIndex: "type",
        key: "type",
        render: (text) => voucherTypeNames[text] || text,
      },
      {
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "isActive",
        render: (isActive) => (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
          </Tag>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (text, voucher) => (
          <>
            <EditOutlined
              style={{ marginRight: 8, color: "blue", cursor: "pointer" }}
              onClick={() => handleVoucherEdit(voucher, record._id)}
            />
            <Popconfirm
              title="Bạn có chắc muốn xóa khuyến mãi này không?"
              onConfirm={() => handleVoucherDelete(voucher._id, record._id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
            </Popconfirm>
          </>
        ),
      },
    ];

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 16,
          }}
        >
          <Button
            type="primary"
            onClick={() => handleAddVoucher(record._id)}
            danger
          >
            Thêm mới khuyến mãi
          </Button>
        </div>

        <Table
          columns={voucherColumns}
          dataSource={vouchers}
          pagination={false}
          rowKey="_id"
        />
      </div>
    );
  };

  const columns = [
    {
      title: "Tên chương trình",
      dataIndex: "name",
      key: "name",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F5F5DC",
          color: "#333",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F5F5DC",
          color: "#333",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F5F5DC",
          color: "#333",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F5F5DC",
          color: "#333",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
        </Tag>
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F5F5DC",
          color: "#333",
          fontWeight: "bold",
        },
      }),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <>
          <EditOutlined
            style={{ marginRight: 8, color: "black", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa chương trình này không?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </>
      ),
      onHeaderCell: () => ({
        style: {
          backgroundColor: "#F5F5DC",
          color: "#333",
          fontWeight: "bold",
        },
      }),
    },
  ];

  return (
    <div>
      <Title style={{ fontWeight: "bold", fontStyle: "italic" }} level={2}>
        Quản lí chương trình khuyến mãi
      </Title>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          onClick={handleAddNew}
          danger
          style={{ marginTop: 16 }}
        >
          Thêm mới chương trình khuyến mãi
        </Button>
      </div>

      <Table
        dataSource={promotionPrograms}
        columns={columns}
        rowKey="_id"
        expandable={{
          expandedRowRender,
          onExpand: handleExpand,
          expandedRowKeys,
        }}
      />

      {/* Modal thêm mới chương trình khuyến mãi */}
      <AddPromotionProgramModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        refreshPromotionPrograms={fetchPromotionPrograms}
      />

      {/* Modal sửa chương trình khuyến mãi */}
      <EditPromotionProgramModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        editingProgram={editingProgram}
        refreshPromotionPrograms={fetchPromotionPrograms}
      />

      {/* Modal thêm mới voucher */}
      <AddVoucherModal
        visible={isAddVoucherModalVisible}
        onCancel={() => setIsAddVoucherModalVisible(false)}
        onSubmit={handleVoucherSubmit}
      />

      {/* Modal sửa voucher */}
      <EditVoucherModal
        visible={isEditVoucherModalVisible}
        onCancel={() => setIsEditVoucherModalVisible(false)}
        onSubmit={handleVoucherSubmit}
        editingVoucher={editingVoucher}
      />
      
    </div>
  );
};

export default PromotionProgramList;
