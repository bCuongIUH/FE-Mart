import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, DatePicker, Select, Button, Space, Tag, Modal } from 'antd';
import { getBillOffline } from '../../../untills/api';
import { getAllEmployee } from '../../../untills/employeesApi';
import { getAllCustomers } from '../../../untills/customersApi';
import { EyeOutlined, PrinterOutlined } from '@ant-design/icons';
import moment from 'moment';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

const ManagerBill = () => {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    billCode: '',
    employeeName: '',
    customerName: '',
    dateRange: [],
    status: 'all'
  });
  const invoiceRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const billData = (await getBillOffline()).map((bill) => ({
          ...bill,
          createdAt: dayjs(bill.createdAt), // Sử dụng Day.js
        }));
    
        const employeeData = await getAllEmployee();
        const customerData = await getAllCustomers();
    
        setBills(billData);
        setFilteredBills(billData);
        setEmployees(employeeData);
        setCustomers(customerData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error.message);
      }
    };
    
  
    fetchData();
  }, []);
  

  useEffect(() => {
    applyFilters();
  }, [filters, bills]);

  const handleDateChange = (dates) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      dateRange: dates || [],
    }));
  };
  
  const applyFilters = () => {
    const filtered = bills.filter((bill) => {
      const dateRangeMatch = isDateInRange(bill.createdAt, filters.dateRange);
  
      return (
        dateRangeMatch &&
        bill.billCode.toLowerCase().includes(filters.billCode?.toLowerCase() || '') &&
        getCreatorName(bill.createBy).toLowerCase().includes(filters.employeeName?.toLowerCase() || '') &&
        getCustomerName(bill.customer).toLowerCase().includes(filters.customerName?.toLowerCase() || '') &&
        (filters.status === 'all' || bill.status === filters.status)
      );
    });
  
    setFilteredBills(filtered);
  };
  ;
  
  
  const isDateInRange = (date, range) => {
    if (!range || range.length !== 2) return true;
    const [startDate, endDate] = range;
    const billDate = dayjs(date); // Chuyển sang Day.js
    return billDate.isBetween(dayjs(startDate), dayjs(endDate), 'day', '[]');
  };
  
  

  const handleViewDetail = (bill) => {
    setSelectedBill(bill);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedBill(null);
  };

  const getCreatorName = (creatorId) => {
    const employee = employees.find(emp => emp._id === creatorId);
    return employee ? employee.fullName : 'Không xác định';
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(cust => cust._id === customerId);
    return customer ? customer.fullName : 'Khách vãng lai';
  };

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>In hóa đơn</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .invoice-header { text-align: center; margin-bottom: 20px; }
            .invoice-details { margin-bottom: 20px; }
            .product-list { width: 100%; border-collapse: collapse; }
            .product-list th, .product-list td { border-bottom: 1px dashed #ccc; padding: 8px; text-align: left; }
            .product-list th { font-weight: bold; }
            .promotional-item { font-style: italic; color: red; }
            .total-section { margin-top: 20px; text-align: right; }
            .thank-you { text-align: center; margin-top: 20px; font-weight: bold; color: #888; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
      width: 20, 
      render: (text, record, index) => index + 1,
    },
    {
      title: 'MÃ HĐ BÁN',
      dataIndex: 'billCode',
      key: 'billCode',
      width: 150, 
    },
    {
      title: 'NHÂN VIÊN LẬP',
      dataIndex: 'createBy',
      key: 'createBy',
      width: 150, 
      render: (createBy) => getCreatorName(createBy),
    },
    {
      title: 'KHÁCH HÀNG',
      dataIndex: 'customer',
      key: 'customer',
      width: 150, 
      render: (customer) => getCustomerName(customer),
    },
    {
      title: 'NGÀY LẬP',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm:ss'), 
    },
    {
      title: 'TỔNG THANH TOÁN',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150, 
      render: (amount) => `${amount.toLocaleString()} VND`,
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      key: 'status',
      width: 100, 
      render: (status) => (
        <Tag color={status === 'HoanThanh' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'THAO TÁC',
      key: 'action',
      width: 50, 
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          />
          <Button
            type="text"
            icon={<PrinterOutlined />}
            onClick={() => {
              setSelectedBill(record);
              setTimeout(() => handlePrint(), 0);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
        HÓA ĐƠN BÁN
      </h1>

      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ marginBottom: '8px' }}>Mã hóa đơn bán</div>
            <Input 
              style={{ height: 30 }} 
              placeholder="Nhập..." 
              value={filters.billCode}
              onChange={(e) => setFilters({...filters, billCode: e.target.value})}
            />
          </div>

          <div>
            <div style={{ marginBottom: '8px' }}>Nhân viên lập</div>
            <Input 
              style={{ height: 30 }} 
              placeholder="Nhập" 
              value={filters.employeeName}
              onChange={(e) => setFilters({...filters, employeeName: e.target.value})}
            />
          </div>

          <div>
            <div style={{ marginBottom: '8px' }}>Khách hàng</div>
            <Input 
              style={{ height: 30 }} 
              placeholder="Nhập..." 
              value={filters.customerName}
              onChange={(e) => setFilters({...filters, customerName: e.target.value})}
            />
          </div>
          <div>
            <div style={{ marginBottom: '8px' }}>Ngày lập</div>
            <RangePicker
              style={{ width: '100%' }}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
            />
          </div>
          <div>
            <div style={{ marginBottom: '8px' }}>Trạng thái</div>
            <Select
              style={{ width: '100%' }}
              placeholder="Tất cả"
              value={filters.status}
              onChange={(value) => setFilters({...filters, status: value})}
              options={[
                { value: 'all', label: 'Tất cả' },
                { value: 'HoanThanh', label: 'Hoàn Thành' },
                { value: 'ChuaThanhToan', label: 'Chưa Thanh Toán' },
              ]}
            />
          </div>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredBills}
        rowKey="_id"
        pagination={{
          total: filteredBills.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} mục`,
        }}
        bordered
      />

      <Modal
        visible={isModalVisible}
        title="Chi tiết hóa đơn"
        onCancel={handleCancel}
        footer={[
          <Button key="print" onClick={handlePrint}>
            In hóa đơn
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedBill && (
          <div ref={invoiceRef}>
            <h4 style={{ textAlign: 'center', fontWeight: 'bold' }}>Hóa Đơn Siêu Thị C'Mart</h4><br />
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <p>Địa chỉ: 04 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
              <p>Hotline: 076 848 6006</p>
              <p>* * *</p>
            </div>
            <p><strong>Người tạo đơn:</strong> {getCreatorName(selectedBill.createBy)}</p>
            <p><strong>Tên khách hàng:</strong> {getCustomerName(selectedBill.customer)}</p>
            <p><strong>Ngày tạo:</strong> {dayjs(selectedBill.createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Tên sản phẩm</th>
                  <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Số lượng</th>
                  <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Đơn vị</th>
                  <th style={{ border: '1px dashed #ddd', padding: '8px'}}>Giá</th>
                  <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.items.map((item, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.product.name}</td>
                    <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.quantity}</td>
                    <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.unit}</td>
                    <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.currentPrice.toLocaleString()} VND</td>
                    <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{(item.currentPrice * item.quantity).toLocaleString()} VND</td>
                  </tr>
                ))}
                {(() => {
                  const actualTotal = selectedBill.items.reduce((acc, item) => acc + item.currentPrice * item.quantity, 0);
                  const discountAmount = actualTotal - selectedBill.totalAmount;
                  return (
                    <>
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Thành tiền:</td>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{actualTotal.toLocaleString()} VND</td>
                      </tr>
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Chiết khấu:</td>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{discountAmount.toLocaleString()} VND</td>
                      </tr>
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng cộng:</td>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{selectedBill.totalAmount.toLocaleString()} VND</td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>

            <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold', color: '#888' }}>
              Cảm ơn quý khách, hẹn gặp lại!
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagerBill;