import React, { useEffect, useState, useRef } from 'react';
import { Button, List, Skeleton, Row, Col, Modal } from 'antd';
import { getBillOffline, getAllUsers } from '../../../untills/api';
import { getAllEmployee } from '../../../untills/employeesApi';
import { getAllCustomers } from '../../../untills/customersApi';

const CompletedCart = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [billData, setBillData] = useState([]);
  const [list, setList] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);

  const invoiceRef = useRef();

  useEffect(() => {
    const fetchBillOffline = async () => {
      try {
        const data = await getBillOffline();
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBillData(sortedData);
        setList(sortedData);
        setInitLoading(false);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu hóa đơn');
        console.error(error);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(usersData);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu người dùng');
        console.error(error);
      }
    };

    const fetchEmployee = async () => {
      try {
        const employeesData = await getAllEmployee();
        setEmployees(employeesData);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu nhân viên');
        console.error(error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const customersData = await getAllCustomers();
        setCustomers(customersData);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu khách hàng');
        console.error(error);
      }
    };

    fetchCustomers();
    fetchEmployee();
    fetchBillOffline();
    fetchUsers();
  }, []);

  const showModal = (bill) => {
    setSelectedBill(bill);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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

  const getCreatorName = (creatorId) => {
    const employee = employees.find(emp => emp._id === creatorId);
    return employee ? employee.fullName : 'Không xác định';
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(cust => cust._id === customerId);
    return customer ? customer.fullName : 'Khách vãng lai';
  };

  return (
    <>
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => (
          <List.Item actions={[<a key="list-loadmore-more">.</a>]}>
            <Skeleton avatar title={false} loading={initLoading} active>
              <List.Item.Meta title={<a onClick={() => showModal(item)}>{item.billCode}</a>} />
              <Row gutter={20} style={{ width: '100%', alignItems: 'center' }}>
                <Col span={6} style={{ marginLeft: '250px' }}>
                  <strong>Tổng tiền:</strong> {item.totalAmount} VND
                </Col>
                <Col span={6}><strong>Ngày mua:</strong> {new Date(item.createdAt).toLocaleDateString()}</Col>
                <Col span={6}><strong>Phương thức thanh toán:</strong> {item.paymentMethod === 'Card' ? 'Thẻ' : 'Tiền mặt'}</Col>
              </Row>
            </Skeleton>
          </List.Item>
        )}
      />

      {selectedBill && (
        <Modal
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[<Button key="back" onClick={handlePrint}>In hóa đơn</Button>]}
        >
          <div ref={invoiceRef}>
            <h4 style={{ textAlign: 'center', fontWeight: 'bold' }}>Hóa Đơn Siêu Thị C'Mart</h4><br />
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <p>Địa chỉ: 04 Nguyễn Văn Bảo, phường 4, Gò Vấp, TP.HCM</p>
              <p>Hotline: 076 848 6006</p>
              <p>* * *</p>
            </div>
            <p><strong>Người tạo đơn:</strong> {getCreatorName(selectedBill.createBy)}</p>
            <p><strong>Tên khách hàng:</strong> {getCustomerName(selectedBill.customer)}</p>
            <p><strong>Ngày tạo:</strong> {new Date(selectedBill.createdAt).toLocaleString()}</p>
            {/* <p><strong>Phương thức thanh toán:</strong> {selectedBill.paymentMethod === 'Card' ? 'Thẻ' : 'Tiền mặt'}</p> */}

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
                    <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.currentPrice} VND</td>
                    <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.currentPrice * item.quantity} VND</td>
                  </tr>
                ))}
                {(() => {
                  const actualTotal = selectedBill.items.reduce((acc, item) => acc + item.currentPrice * item.quantity, 0);
                  const discountAmount = actualTotal - selectedBill.totalAmount;
                  return (
                    <>
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Thành tiền:</td>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{actualTotal} VND</td>
                      </tr>
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Chiết khấu:</td>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{discountAmount} VND</td>
                      </tr>
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng cộng:</td>
                        <td style={{ padding: '8px', fontWeight: 'bold' }}>{selectedBill.totalAmount} VND</td>
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
        </Modal>
      )}
    </>
  );
};

export default CompletedCart;
