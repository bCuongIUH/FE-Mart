import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Modal, List, Image, message, Button, Tooltip } from 'antd';
import { formatCurrency } from '../../untills/formatCurrency';
import dayjs from 'dayjs';
import { gettAllBillReturnOnline, updateBillStatusOnl } from '../../untills/api';
import { getAllPriceProduct } from '../../untills/priceApi';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const billsResponse = await gettAllBillReturnOnline();
  
      // Fetch product details
      const productsResponse = await getAllPriceProduct();
      const productsMap = productsResponse.prices.reduce((map, product) => {
        map[product.productId] = product.productName; 
        return map;
      }, {});
  
    
      const formattedOrders = billsResponse.data
        .map((order) => {
          const updatedItems = order.items.map((item) => ({
            ...item,
            productName: productsMap[item.product] || 'Không xác định', 
          }));
          return { ...order, items: updatedItems };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
  
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };
  

  // Show order detail modal
  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  // Close detail modal
  const closeDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedOrder(null);
  };

  // Handle accept or reject actions
  const handleAcceptReturn = async (order) => {
    try {
      const response = await updateBillStatusOnl(order._id, 'accept');
      message.success(response.message || 'Cập nhật trạng thái thành công');
      fetchOrders(); // Làm mới danh sách đơn hàng sau khi cập nhật
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại.');
    }
  };
  
const handleRejectReturn = async (order) => {
  try {
    const response = await updateBillStatusOnl(order._id, 'reject');
    message.success(response.message || 'Cập nhật trạng thái thành công');
    fetchOrders(); // Làm mới danh sách đơn hàng sau khi cập nhật
  } catch (error) {
    message.error('Cập nhật trạng thái thất bại.');
  }
};
const statusMap = {
  HoanThanh: 'Đã Thanh toán',
  HoanTra: 'Hoàn Trả',
  DangXuLy: 'Yêu cầu trả hàng',
  KiemHang: 'Kiểm tra hàng',
  Canceled: 'Từ Chối Trả Hàng',
};

  // Table columns
  const columns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'billCode',
      key: 'billCode',
      render: (text, record) => (
        <a onClick={() => showOrderDetail(record)}>{text}</a>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => formatCurrency(text),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        switch (status) {
          case 'DangXuLy':
          case 'KiemHang':
            color = 'gold'; // Màu vàng cho Đang xử lý và Kiểm tra hàng
            break;
          case 'Canceled':
            color = 'red'; // Màu đỏ cho Từ chối trả hàng
            break;
          case 'HoanThanh':
            color = 'green'; // Màu xanh cho Đã thanh toán
            break;
          case 'HoanTra':
            color = 'green'; // Màu xanh dương cho Hoàn trả
            break;
          default:
            color = 'default'; // Mặc định
        }
        return <Tag color={color}>{statusMap[status] || status}</Tag>;
      },
    },
    {
      title: 'Yêu cầu hoàn trả',
      key: 'returnRequests',
      render: (_, record) => (
        <Space>
          {['DangXuLy', 'KiemHang'].includes(record.status) && (
            <>
              <Tooltip title="Chấp nhận">
                <CheckOutlined
                  style={{ color: 'green', fontSize: '24px', cursor: 'pointer' }}
                  onClick={() => handleAcceptReturn(record)}
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <CloseOutlined
                  style={{ color: 'red', fontSize: '24px', cursor: 'pointer' }}
                  onClick={() => handleRejectReturn(record)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Theo dõi đơn hàng</h1>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="_id"
        loading={loading}
      />
      <Modal
        title="Chi tiết đơn hàng"
        visible={detailModalVisible}
        onCancel={closeDetailModal}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <p><strong>Mã hóa đơn:</strong> {selectedOrder.billCode}</p>
            <p>
              <strong>Ngày tạo:</strong>{' '}
              {dayjs(selectedOrder.createdAt).format('DD/MM/YYYY HH:mm')}
            </p>
            <p><strong>Tổng tiền:</strong> {formatCurrency(selectedOrder.totalAmount)}</p>
            <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
            <p><strong>Phương thức thanh toán:</strong> {selectedOrder.paymentMethod}</p>

            <h3 className="font-bold mt-4 mb-2">Sản phẩm:</h3>
            <List
              dataSource={selectedOrder.items}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.productName} - ${item.quantity} ${item.unit}`}
                    description={`Giá: ${formatCurrency(item.currentPrice)}`}
                  />
                </List.Item>
              )}
            />

            <h3 className="font-bold mt-4 mb-2">Yêu cầu hoàn trả:</h3>
            {selectedOrder.returnRequests.length > 0 ? (
              <List
                dataSource={selectedOrder.returnRequests}
                renderItem={(request) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`Lý do: ${request.reason}`}
                      description={
                        <>
                          <p>Trạng thái: {request.status}</p>
                          <p>
                            Ngày tạo: {dayjs(request.createdAt).format('DD/MM/YYYY HH:mm')}
                          </p>
                          {request.images && request.images.length > 0 && (
                            <Image
                              src={request.images[0]}
                              alt="Return request image"
                              width={200}
                            />
                          )}
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <p>Không có yêu cầu hoàn trả</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderTracking;
