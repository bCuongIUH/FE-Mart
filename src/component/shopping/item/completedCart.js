import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton, Row, Col, Modal } from 'antd';
import { getBillOffline } from '../../../untills/api'; 

const CompletedCart = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [billData, setBillData] = useState([]);
  const [list, setList] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null); 
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false); 

  useEffect(() => {
    const fetchBillOffline = async () => {
      try {
        const data = await getBillOffline();
        setBillData(data);
        setList(data);
        setInitLoading(false);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu hóa đơn');
        console.error(error);
      }
    };

    fetchBillOffline();
  }, []);

  const onLoadMore = () => {
    setLoading(true);
    setLoading(false);
  };

  const showModal = (bill) => {
    setSelectedBill(bill);
    setIsModalVisible(true); 
  };

  const handleCancel = () => {
    setIsModalVisible(false); 
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>Tải thêm</Button>
      </div>
    ) : null;

  return (
    <>
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key="list-loadmore-edit">edit</a>,
              <a key="list-loadmore-more">more</a>
            ]}
          >
            <Skeleton avatar title={false} loading={initLoading} active>
              <List.Item.Meta
                // avatar={<Avatar src="https://via.placeholder.com/40" />}
                title={<a onClick={() => showModal(item)}>Hóa đơn #{item._id}</a>} 
              />
              <Row gutter={20} style={{ width: '100%', alignItems: 'center' }}>
                <Col span={6} style={{ marginLeft:'250px' }}>
                  <strong>Tổng tiền:</strong> {item.totalAmount} VND
                </Col>
                <Col span={6}>
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
          title={`Chi tiết hóa đơn #${selectedBill._id}`}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Đóng
            </Button>
          ]}
        >
          <p><strong>Tổng tiền:</strong> {selectedBill.totalAmount} VND</p>
          <p><strong>Ngày mua:</strong> {new Date(selectedBill.createdAt).toLocaleDateString()}</p>
          <p><strong>Phương thức thanh toán:</strong> {selectedBill.paymentMethod === 'Card' ? 'Thẻ' : 'Tiền mặt'}</p>
          {/* <p><strong>Trạng thái:</strong> {selectedBill.status}</p> */}

          {/* Lặp qua các sản phẩm trong hóa đơn */}
          <h4>Sản phẩm:</h4>
          {selectedBill.items.map((item, index) => (
            <div key={index}>
              <p><strong>Tên sản phẩm:</strong> {item.product.name}</p>
              <p><strong>Số lượng:</strong> {item.quantity}</p>
              <p><strong>Giá mỗi sản phẩm:</strong> {item.unitPrice} VND</p>
              <p><strong>Tổng:</strong> {selectedBill.totalAmount} VND</p>
              <hr />
            </div>
          ))}
        </Modal>
      )}
    </>
  );
};

export default CompletedCart;
