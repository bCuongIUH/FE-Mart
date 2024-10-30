import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton, Row, Col, Modal } from 'antd';
import { getBillOffline, getAllUsers } from '../../../untills/api';

const CompletedCart = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [billData, setBillData] = useState([]);
  const [list, setList] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchBillOffline = async () => {
      try {
        const data = await getBillOffline();
        // Sắp xếp hóa đơn theo ngày tạo, hóa đơn mới nhất sẽ ở đầu danh sách
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

    fetchBillOffline();
    fetchUsers(); // Gọi hàm lấy danh sách người dùng
  }, []);

  const onLoadMore = () => {
    // Logic tải thêm hóa đơn
  };

  const showModal = (bill) => {
    setSelectedBill(bill);
    console.log("Selected Bill:", bill);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const loadMore =
    !initLoading && !loading ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        <Button onClick={onLoadMore}>Tải thêm</Button>
      </div>
    ) : null;

  // Hàm để lấy tên người tạo hóa đơn dựa trên ID
  const getCreatorName = (creatorId) => {
    const creator = users.find(user => user._id === creatorId);
    return creator ? creator.fullName : 'Không xác định';
  };

  return (
    <>
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => (
          <List.Item actions={[<a key="list-loadmore-more">.</a>]}>
            <Skeleton avatar title={false} loading={initLoading} active>
              <List.Item.Meta
                title={<a onClick={() => showModal(item)}>Hóa đơn #{item._id}</a>}
              />
              <Row gutter={20} style={{ width: '100%', alignItems: 'center' }}>
                <Col span={6} style={{ marginLeft: '250px' }}>
                  <strong>Tổng tiền:</strong> {item.totalAmount} VND
                </Col><Col span={6}>
                  <strong>Ngày mua:</strong> {new Date(item.createdAt).toLocaleDateString()}
                </Col>
                <Col span={6}>
                  <strong>Phương thức thanh toán:</strong> {item.paymentMethod === 'Card' ? 'Thẻ' : 'Tiền mặt'}
                </Col>
              </Row>
            </Skeleton>
          </List.Item>
        )}
      />

      {/* Modal hiển thị chi tiết hóa đơn */}
      {selectedBill && (
        <Modal
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[<Button key="back" onClick={handleCancel}>Đóng</Button>]}
        >
          <h4 style={{ textAlign: 'center', fontWeight: 'bold' }}>Hóa Đơn Siêu Thị C'Mart</h4>
          <br />
          {/* <p><strong>NV bán hàng:</strong> {getCreatorName(selectedBill.items[0]?.createBy)}</p> */}
          <p><strong>Ngày mua:</strong> {new Date(selectedBill.createdAt).toLocaleDateString()}</p>
          <p><strong>Phương thức thanh toán:</strong> {selectedBill.paymentMethod === 'Card' ? 'Thẻ' : 'Tiền mặt'}</p>

          {/* Bảng hiển thị sản phẩm */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Tên sản phẩm</th>
                <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Số lượng</th>
                <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Đơn vị</th>
                <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Giá</th>
                <th style={{ border: '1px dashed #ddd', padding: '8px' }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {selectedBill.items.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.product.name}</td>
                  <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.unit}</td>
                  <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.quantity}</td>
                  <td style={{ border: '1px dashed #ddd', padding: '8px' }}>{item.currentPrice} VND</td>
                  <td style={{ border: '1px dashed #ddd', padding: '8px' }}>
                    {item.currentPrice * item.quantity} VND
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng cộng:</td>
                <td style={{ padding: '8px', fontWeight: 'bold' }}>{selectedBill.totalAmount} VND</td>
              </tr>
            </tbody>
          </table>

          <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold', color: '#888' }}>
            Cảm ơn quý khách, hẹn gặp lại!
          </p>
        </Modal>

      )}

    </>
  );
};

export default CompletedCart;