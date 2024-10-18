import React, { useState, useEffect } from "react";
import { Table, Button, Switch, message, Popconfirm } from "antd";
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
} from "../../services/voucherService"; // Import voucher service
import moment from "moment";
import AddPromotionProgramModal from "./Components/AddPromotionProgramModal";
import EditPromotionProgramModal from "./Components/EditPromotionProgramModal";
import AddVoucherModal from "./Components/AddVoucherModal"; // Modal thêm mới voucher
import EditVoucherModal from "./Components/EditVoucherModal"; // Modal sửa voucher
import { EditOutlined, DeleteOutlined, DownOutlined } from "@ant-design/icons"; // Import các biểu tượng

const PromotionProgramList = () => {
  const [promotionPrograms, setPromotionPrograms] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]); // Quản lý các dòng được mở rộng
  const [voucherData, setVoucherData] = useState({}); // Lưu danh sách voucher theo chương trình
  const [isAddVoucherModalVisible, setIsAddVoucherModalVisible] =
    useState(false);
  const [isEditVoucherModalVisible, setIsEditVoucherModalVisible] =
    useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [currentPromotionId, setCurrentPromotionId] = useState(null);

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
        message.success("Cập nhật voucher thành công");
      } else {
        // Tạo mới voucher
        await createVoucher({
          ...values,
          promotionProgramId: currentPromotionId,
        });
        message.success("Tạo mới voucher thành công");
      }
      setIsAddVoucherModalVisible(false);
      setIsEditVoucherModalVisible(false);
      fetchVouchers(currentPromotionId);
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu voucher");
    }
  };

  const handleVoucherDelete = async (voucherId, promotionProgramId) => {
    try {
      await deleteVoucher(voucherId);
      message.success("Voucher đã được xóa");
      fetchVouchers(promotionProgramId);
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa voucher");
    }
  };

  const handleVoucherEdit = (voucher, promotionProgramId) => {
    setEditingVoucher(voucher);
    setCurrentPromotionId(promotionProgramId);
    setIsEditVoucherModalVisible(true);
  };

  const handleAddVoucher = (promotionProgramId) => {
    setCurrentPromotionId(promotionProgramId);
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
    PercentageDiscount: "Giảm giá theo phần trăm"
  };
  
  // Bảng hiển thị voucher khi mở rộng một dòng
  const expandedRowRender = (record) => {
    const vouchers = voucherData[record._id] || [];
    const voucherColumns = [
      {
        title: "Mã voucher",
        dataIndex: "code",
        key: "code",
      },
      {
        title: "Loại voucher",
        dataIndex: "type",
        key: "type",
        render: (text) => voucherTypeNames[text] || text,
      },
      {
        title: "Trạng thái",
        dataIndex: "isActive",
        key: "isActive",
        render: (text, voucher) => (
          <Switch checked={voucher.isActive} disabled />
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
              title="Bạn có chắc muốn xóa voucher này không?"
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
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={() => handleAddVoucher(record._id)}
        >
          Thêm mới voucher
        </Button>
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
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (text, record) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => handleSwitchChange(record._id, checked)}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <>
          <EditOutlined
            style={{ marginRight: 8, color: "blue", cursor: "pointer" }}
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
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={handleAddNew}
        style={{ marginBottom: 16 }}
      >
        Thêm mới chương trình khuyến mãi
      </Button>
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
