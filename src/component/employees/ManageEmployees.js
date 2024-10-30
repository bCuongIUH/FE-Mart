import React, { useEffect, useState } from 'react';
import { List, Button, Modal, message } from 'antd';
import { getAllEmployee, deleteEmployee } from '../../untills/employeesApi';
import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployee();
      setEmployees(response);
    } catch (error) {
      message.error('Lỗi khi lấy danh sách nhân viên');
    }
  };

  const confirmDeleteEmployee = (employeeId, e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra List.Item

    confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa nhân viên này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => handleDeleteEmployee(employeeId),
    });
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      message.success('Xóa nhân viên thành công');
      fetchEmployees();
    } catch (error) {
      message.error('Không thể xóa nhân viên');
    }
  };

  const showEditModal = (employee, e) => {
    e.stopPropagation();
    setSelectedEmployee(employee);
    setIsEditModalVisible(true);
    setIsDetailModalVisible(false);
  };

  const showDetailModal = (employee) => {
    setSelectedEmployee(employee);
    setIsDetailModalVisible(true);
    setIsEditModalVisible(false);
  };

  return (
    <div>
      <h2>Quản lý nhân viên</h2>
      <Button type="primary" onClick={() => setIsAddModalVisible(true)} style={{ marginBottom: '20px' }}>
        Thêm nhân viên
      </Button>

      <List
        bordered
        dataSource={employees}
        renderItem={(employee) => (
          <List.Item
            actions={[
              <EditOutlined
                key="edit"
                onClick={(e) => showEditModal(employee, e)}
                style={{ color: 'blue' }}
              />,
              <DeleteOutlined
                key="delete"
                onClick={(e) => confirmDeleteEmployee(employee._id, e)}
                style={{ color: 'red' }}
              />,
            ]}
            onClick={() => showDetailModal(employee)}
          >
            <List.Item.Meta
              title={employee.fullName}
              description={` ${employee.MaNV}, SĐT: ${employee.phoneNumber}, Địa chỉ: ${employee.addressLines?.houseNumber || ''}, ${employee.addressLines?.ward || ''}, ${employee.addressLines?.district || ''}, ${employee.addressLines?.province || ''}`}
            />
          </List.Item>
        )}
      />

      {/* Modal Thêm Nhân Viên */}
      <AddEmployeeModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddSuccess={fetchEmployees}
      />

      {/* Modal Sửa Nhân Viên */}
      <EditEmployeeModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        employeeData={selectedEmployee}
        onUpdateSuccess={fetchEmployees}
      />

      {/* Modal Chi Tiết Nhân Viên */}
      <Modal
        title="Chi tiết nhân viên"
        visible={isDetailModalVisible && !isEditModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
      >
        {selectedEmployee && (
          <div>
            <p><strong>Mã Nhân Viên:</strong> {selectedEmployee.MaNV}</p>
            <p><strong>Họ và tên:</strong> {selectedEmployee.fullName}</p>
            <p><strong>Email:</strong> {selectedEmployee.email}</p>
            <p><strong>SĐT:</strong> {selectedEmployee.phoneNumber}</p>
            <p><strong>Địa chỉ:</strong> 
            {`${selectedEmployee.addressLines?.houseNumber || ''}, ${selectedEmployee.addressLines?.ward || ''}, ${selectedEmployee.addressLines?.district || ''}, ${selectedEmployee.addressLines?.province || ''}`}
            </p>
            <p><strong>Giới tính:</strong> {selectedEmployee.gender}</p>
            <p><strong>Ngày sinh:</strong> {selectedEmployee.dateOfBirth}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageEmployees;
