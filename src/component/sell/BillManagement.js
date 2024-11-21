import React, { useState, useEffect, useRef } from 'react';
import { Table, Input, DatePicker, Select, Button, Space, Tag, Modal, message } from 'antd';
import { EyeOutlined, PrinterOutlined, RedoOutlined, ReloadOutlined, RollbackOutlined, UndoOutlined } from '@ant-design/icons';
import { getBillOffline, returnPurchaseBill } from '../../untills/api';
import { getAllEmployee } from '../../untills/employeesApi';
import { getAllCustomers } from '../../untills/customersApi';
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
    customerPhone: '',
    dateRange: [],
    status: 'all'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const billData = (await getBillOffline())
          .map((bill) => ({
            ...bill,
            createdAt: dayjs(bill.createdAt), 
          }))
          .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
  
        const employeeData = await getAllEmployee();
        const customerData = await getAllCustomers();
  
        // setBills(billData);
        setBills(Array.isArray(billData) ? billData : []);
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
        (bill.billCode?.toLowerCase() || '').includes(filters.billCode?.toLowerCase() || '') &&
        (getCreatorName(bill.createBy)?.toLowerCase() || '').includes(filters.employeeName?.toLowerCase() || '') &&
        (getCustomerName(bill.customer)?.toLowerCase() || '').includes(filters.customerName?.toLowerCase() || '') &&
        (getCustomerPhone(bill.customer)?.toLowerCase() || '').includes(filters.customerPhone?.toLowerCase() || '') &&
        (filters.status === 'all' || bill.status === filters.status)
      );
    });
    
  
    setFilteredBills(filtered);
  };
  
  
  const isDateInRange = (date, range) => {
    if (!range || range.length !== 2) return true;
    const [startDate, endDate] = range;
    const billDate = dayjs(date);
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

  const getCustomerPhone = (customerId) => {
    const customerPhone = customers.find(cust => cust._id === customerId);
    return customerPhone ? customerPhone.phoneNumber : 'Chưa cập nhật';
  };

  const fetchBills = async () => {
    try {
      const billData = (await getBillOffline())
        .map((bill) => ({
          ...bill,
          createdAt: dayjs(bill.createdAt), 
        }))
        .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf());
  
      setBills(billData);
      setFilteredBills(billData);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error.message);
      message.error('Không thể tải danh sách hóa đơn. Vui lòng thử lại.');
    }
  };
  useEffect(() => {
    fetchBills();
  }, []);
    
 // Hoàn trả đơn hàng
const handleReturn = (record) => {
  Modal.confirm({
    title: 'Xác nhận hoàn trả',
    content: `Bạn có chắc chắn muốn hoàn trả hóa đơn: ${record.billCode}?`,
    okText: 'Hoàn trả',
    cancelText: 'Hủy',
    onOk: async () => {
      try {
        // Call the API 
        const response = await returnPurchaseBill(record._id, []); 
        
        // Success Modal
        Modal.success({
          title: 'Hoàn trả thành công!',
          content: `Hóa đơn ${record.billCode} đã được hoàn trả.`,
        });

       
        await fetchBills(); // Gọi lại API để render trạng thái mới
        // message.success('Danh sách hóa đơn đã được cập nhật.');
      } catch (error) {
        console.error('Lỗi khi hoàn trả hóa đơn:', error);
        // Error Modal
        Modal.error({
          title: 'Lỗi hoàn trả!',
          content: `Không thể hoàn trả hóa đơn ${record.billCode}. Vui lòng thử lại.`,
        });
      }
    },
  });
};


  const handlePrint = (bill) => {
    const printContent = generatePrintContent(bill);
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

  const generatePrintContent = (bill) => {
    const title =
      bill.status === "HoanTra"
        ? "Hóa Đơn Trả Siêu Thị C'Mart"
        : "Hóa Đơn Siêu Thị C'Mart";
  
    return `
      <div>
        <h4 style="text-align: center; font-weight: bold;">${title}</h4><br />
        <div style="text-align: center; margin-bottom: 10px;">
          <p>Địa chỉ: 12 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
          <p>Hotline: 076 848 6006</p>
          <p>* * *</p>
        </div>
         <p><strong>Mã hóa đơn:</strong> ${bill.billCode}</p> 
        <p><strong>Người tạo đơn:</strong> ${getCreatorName(bill.createBy)}</p>
        <p><strong>Tên khách hàng:</strong> ${getCustomerName(bill.customer)}</p>
        <p><strong>Ngày tạo:</strong> ${dayjs(bill.createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>
  
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px dashed #ddd; padding: 8px;">Tên sản phẩm</th>
              <th style="border: 1px dashed #ddd; padding: 8px;">Đơn vị</th>
              <th style="border: 1px dashed #ddd; padding: 8px;">Số lượng</th>
              <th style="border: 1px dashed #ddd; padding: 8px;">Đơn giá</th>
              <th style="border: 1px dashed #ddd; padding: 8px;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${bill.items
              .map(
                (item) => `
              <tr>
                <td style="border: 1px dashed #ddd; padding: 8px;">${item.product.name}</td>
                <td style="border: 1px dashed #ddd; padding: 8px;">${item.unit}</td>
                <td style="border: 1px dashed #ddd; padding: 8px;">${item.quantity}</td>
                <td style="border: 1px dashed #ddd; padding: 8px;">${item.currentPrice.toLocaleString()} VND</td>
                <td style="border: 1px dashed #ddd; padding: 8px;">${(item.currentPrice * item.quantity).toLocaleString()} VND</td>
              </tr>
            `
              )
              .join("")}
            ${(() => {
              const actualTotal = bill.items.reduce(
                (acc, item) => acc + item.currentPrice * item.quantity,
                0
              );
              const discountAmount = actualTotal - bill.totalAmount;
              return `
                <tr>
                  <td colspan="4" style="text-align: right; font-weight: bold;">Thành tiền:</td>
                  <td style="padding: 8px; font-weight: bold;">${actualTotal.toLocaleString()} VND</td>
                </tr>
                <tr>
                  <td colspan="4" style="text-align: right; font-weight: bold;">Chiết khấu:</td>
                  <td style="padding: 8px; font-weight: bold;">${discountAmount.toLocaleString()} VND</td>
                </tr>
                <tr>
                  <td colspan="4" style="text-align: right; font-weight: bold;">Tổng cộng:</td>
                  <td style="padding: 8px; font-weight: bold;">${bill.totalAmount.toLocaleString()} VND</td>
                </tr>
              `;
            })()}
          </tbody>
        </table>
  
        <p style="text-align: center; margin-top: 20px; font-weight: bold; color: #888;">
          Cảm ơn quý khách, hẹn gặp lại!
        </p>
      </div>
    `;
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
      title: 'SĐT KHÁCH HÀNG',
      dataIndex: 'customer',
      key: 'customerPhone',
      width: 150,
      render: (customer) => getCustomerPhone(customer),
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
      render: (status) => {
        let color = '';
        let text = '';
        switch (status) {
          case 'HoanThanh':
            color = 'green';
            text = 'Đã Thanh Toán';
            break;
          case 'HoanTra':
            color = 'red';
            text = 'Hoàn Trả';
            break;
          default:
            color = 'orange';
            text = status;
        }
        return <Tag color={color}>{text}</Tag>;
      },
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
            onClick={() => handlePrint(record)}
          />
           <Button
          // type="text"
          icon={<UndoOutlined />} 
          onClick={() => handleReturn(record)}
          disabled={record.status !== 'HoanThanh'} 
        >
  
        </Button>
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
              placeholder="Nhập mã HĐ..." 
              value={filters.billCode}
              onChange={(e) => setFilters({...filters, billCode: e.target.value})}
            />
          </div>

          <div>
            <div style={{ marginBottom: '8px' }}>Nhân viên lập</div>
            <Input 
              style={{ height: 30 }} 
              placeholder="Nhập tên..." 
              value={filters.employeeName}
              onChange={(e) => setFilters({...filters, employeeName: e.target.value})}
            />
          </div>
          <div>
            <div style={{ marginBottom: '8px' }}>Khách hàng</div>
            <Input 
              style={{ height: 30 }} 
              placeholder="Nhập tên..." 
              value={filters.customerName}
              onChange={(e) => setFilters({...filters, customerName: e.target.value})}
            />
          </div>
          <div>
            <div style={{ marginBottom: '8px' }}>Khách hàng</div>
            <Input 
              style={{ height: 30 }} 
              placeholder="Nhập SĐT..." 
              value={filters.customerPhone}
              onInput={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, ''); 
                if (numericValue.length <= 10) { // Giới hạn tối đa 10 số
                  setFilters({ ...filters, customerPhone: numericValue });
                }
              }}
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
                { value: 'HoanTra', label: 'Hoàn Trả' },
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
          <Button key="print" onClick={() => handlePrint(selectedBill)}>
            In hóa đơn
          </Button>,
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedBill && (
          <div>
            <h4 style={{ textAlign: 'center', fontWeight: 'bold' }}>Hóa Đơn Siêu Thị C'Mart</h4><br />
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <p>Địa chỉ: 12 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
              <p>Hotline: 076 848 6006</p>
              <p>* * *</p>
            </div>
            <p><strong>Mã hóa đơn:</strong> {selectedBill.billCode}</p> 
            <p><strong>Người tạo đơn:</strong> {getCreatorName(selectedBill.createBy)}</p>
            <p><strong>Tên khách hàng:</strong> {getCustomerName(selectedBill.customer)}</p>
            <p><strong>Ngày tạo:</strong> {dayjs(selectedBill.createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Tên sản phẩm</th>
                  <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Đơn vị</th>
                  <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Số lượng</th>
                  <th style={{ border: '1px dashed #ddd', padding: '8px'}}>Đơn giá</th>
                  <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.items.map((item, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.product.name}</td>
                    <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.unit}</td>
                    <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.quantity}</td>
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