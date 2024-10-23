import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, message, Table } from "antd";
import { createUnitList, createUnitLine, createUnitDetail, getAllUnitHeaders, getUnitLinesByHeaderId, getDetailsByLineId, deleteUnitDetail, updateUnitDetail } from "../../untills/unitApi"; 
import './UnitManager.css'; 
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
const UnitManager = () => {
    const [headers, setHeaders] = useState([]);
    const [lines, setLines] = useState({});
    const [details, setDetails] = useState({});

    const [currentHeaderId, setCurrentHeaderId] = useState(null);
    const [currentLineId, setCurrentLineId] = useState(null);

    const [lineModalVisible, setLineModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [headerModalVisible, setHeaderModalVisible] = useState(false); 
    const [detailFormValues, setDetailFormValues] = useState({});

    useEffect(() => {
        const fetchHeaders = async () => {
            try {
                const headersData = await getAllUnitHeaders();
                setHeaders(headersData);

               
                const linesData = {};
                for (const header of headersData) {
                    linesData[header._id] = await getUnitLinesByHeaderId(header._id);
                }
                setLines(linesData);
            } catch (error) {
                message.error("Lỗi khi tải dữ liệu");
            }
        };

        fetchHeaders();
    }, []);

    const handleCreateHeader = async (values) => {
        try {
            const header = await createUnitList(values);
            setHeaders((prevHeaders) => [...prevHeaders, header]);
            message.success("Tiêu đề đơn vị đã được tạo thành công!");
            setHeaderModalVisible(false);
        } catch (error) {
            message.error("Lỗi khi tạo tiêu đề đơn vị");
        }
    };

    const handleCreateLine = async (values) => {
        try {
            const line = await createUnitLine({ ...values, headerId: currentHeaderId });
            setLines((prev) => ({
                ...prev,
                [currentHeaderId]: [...(prev[currentHeaderId] || []), line],
            }));
            message.success("Dòng đã được tạo thành công!");
            setLineModalVisible(false);
        } catch (error) {
            message.error("Lỗi khi tạo dòng đơn vị");
        }
    };

    const handleCreateDetail = async (values) => {
        try {
            await createUnitDetail({ ...values, lineId: currentLineId });
            // Gọi lại dữ liệu từ API để làm mới danh sách
            await fetchDetailsByLineId(currentLineId);
            message.success("Chi tiết đã được tạo thành công!");
            setDetailModalVisible(false);
        } catch (error) {
            message.error("Lỗi khi tạo chi tiết đơn vị");
        }
    };
    
    
    const fetchDetailsByLineId = async (lineId) => {
        try {
            const detailData = await getDetailsByLineId(lineId);
    
            // Kiểm tra mã trạng thái nếu có
            if (!detailData) {
                // Nếu không có dữ liệu trả về từ API
                setDetails((prev) => ({
                    ...prev,
                    [lineId]: [], // Thiết lập giá trị là mảng rỗng nếu không có dữ liệu
                }));
                return; // Không hiển thị thông báo lỗi
            }
    
            // Nếu detailData là mảng nhưng rỗng
            if (Array.isArray(detailData) && detailData.length === 0) {
                setDetails((prev) => ({
                    ...prev,
                    [lineId]: [], // Thiết lập giá trị là mảng rỗng
                }));
                return; // Không hiển thị thông báo lỗi
            }
    
            // Cập nhật chi tiết nếu có dữ liệu hợp lệ
            setDetails((prev) => ({
                ...prev,
                [lineId]: detailData,
            }));
        } catch (error) {
            console.error("Lỗi khi tải chi tiết:", error);
    
            // Chỉ hiển thị thông báo lỗi nếu mã trạng thái là một trong các mã lỗi
            if (error.response && error.response.status !== 404) {
                message.error("Lỗi khi tải chi tiết");
            }
        }
    };
    
    
    const handleLineExpand = async (lineId) => {
        if (!details[lineId]) {
            await fetchDetailsByLineId(lineId);
        }
        setCurrentLineId(lineId); // Set current line ID to be used for creating details
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            onHeaderCell: () => ({
                style: {
                  backgroundColor: '#F5F5DC',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            onHeaderCell: () => ({
                style: {
                  backgroundColor: '#F5F5DC',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description', 
            key: 'description',
            onHeaderCell: () => ({
                style: {
                  backgroundColor: '#F5F5DC',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            onHeaderCell: () => ({
                style: {
                  backgroundColor: '#F5F5DC',
                  color: '#333',
                  fontWeight: 'bold',
                },
              }),
            render: (status) => status || "Chưa xác định",
        },
    ];
// Hàm xử lý chỉnh sửa

const [editDetailModalVisible, setEditDetailModalVisible] = useState(false);
// const [detailFormValues, setDetailFormValues] = useState({});


// Hàm chỉnh sửa chi tiết
const handleEditDetail = (record, lineId) => {
    console.log('Chỉnh sửa:', record);
    
    // Thiết lập giá trị form cho chi tiết được chọn
    setDetailFormValues(record); // Lưu giá trị chi tiết vào state
    setEditDetailModalVisible(true); 
    setCurrentLineId(lineId); 
};


const handleUpdateDetail = async (values) => {
    try {
        const detailId = detailFormValues._id; // Lấy ID chi tiết
        const lineId = currentLineId; // Lấy lineId từ state

        // Thực hiện cập nhật chi tiết
        await updateUnitDetail(detailId, values);
        message.success('Cập nhật chi tiết thành công!');
        
        // Cập nhật danh sách chi tiết
        setDetails((prev) => {
            const updatedLineDetails = prev[lineId].map(detail =>
                detail._id === detailId ? { ...detail, ...values } : detail
            );
            return {
                ...prev,
                [lineId]: updatedLineDetails,
            };
        });

        setEditDetailModalVisible(false); // Đóng modal
    } catch (error) {
        message.error('Cập nhật chi tiết thất bại!');
        console.error('Lỗi khi cập nhật chi tiết:', error);
    }
};


// Xóa detail

const handleDeleteDetail = (record, lineId) => {
    Modal.confirm({
        title: 'Xác nhận xóa',
        content: `Bạn có chắc chắn muốn xóa chi tiết đơn vị: ${record.name}?`,
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
        onOk: async () => {
            try {
                const detailId = record._id; // Lấy detailId từ record

                // Thực hiện xóa chi tiết
                await deleteUnitDetail(detailId);
                message.success("Xóa chi tiết thành công");
                
                setDetails((prev) => {
                    if (!prev[lineId]) {
                        return prev; // Nếu lineId không tồn tại, trả về trạng thái cũ
                    }
                    
                    const updatedDetails = prev[lineId].filter(detail => detail._id !== detailId);
                
                    // Nếu không còn chi tiết nào, có thể muốn thiết lập lại hoặc xử lý theo cách khác
                    if (updatedDetails.length === 0) {
                        console.log(`No details remaining for line ID: ${lineId}`);
                        return {
                            ...prev,
                            [lineId]: [], // Thiết lập giá trị là mảng rỗng nếu không còn chi tiết nào
                        };
                    }
                
                    return {
                        ...prev,
                        [lineId]: updatedDetails, // Cập nhật danh sách chi tiết
                    };
                });
                
            } catch (error) {
                message.error("Lỗi khi xóa chi tiết");
                console.error("Lỗi khi xóa chi tiết:", error);
            }
        }
    });
};

    return (
        <div className="unit-manager">
            <h1>Quản Lý Đơn Vị</h1>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
    <Button type="primary" onClick={() => setHeaderModalVisible(true)}>
        Thêm Bảng Đơn Vị
    </Button>
</div>

            <Modal
                title="Thêm Tiêu Đề Đơn Vị"
                visible={headerModalVisible}
                onCancel={() => setHeaderModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleCreateHeader}>
                    <Form.Item label="Tên Tiêu Đề" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên tiêu đề!' }]}>
                        <Input placeholder="Nhập tên tiêu đề" />
                    </Form.Item>
                    <Form.Item label="Mô Tả" name="description">
                        <Input placeholder="Nhập mô tả" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Tạo Tiêu Đề</Button>
                </Form>
            </Modal>

            <Table
                dataSource={headers.map(header => ({ ...header, key: header._id }))} 
                columns={columns}
                pagination={false}
                expandable={{
                    expandedRowRender: (record) => (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4>Danh Sách Dòng</h4>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setCurrentHeaderId(record._id);
                                        setLineModalVisible(true);
                                    }}
                                >
                                    Thêm Dòng Đơn Vị
                                </Button>
                            </div>
                            <Table
                                dataSource={lines[record._id]?.map(line => ({ ...line, key: line._id })) || []}
                                columns={[
                                    { title: 'Tên Dòng', dataIndex: 'name', key: 'name', onHeaderCell: () => ({
                                        style: {
                                          backgroundColor: '#F5F5DC',
                                          color: '#333',
                                          fontWeight: 'bold',
                                        },
                                      }), },
                                    { title: 'Mô Tả', dataIndex: 'description', key: 'description', onHeaderCell: () => ({
                                        style: {
                                          backgroundColor: '#F5F5DC',
                                          color: '#333',
                                          fontWeight: 'bold',
                                        },
                                      }), },
                                ]}
                                pagination={false}
                                expandable={{
                                    expandedRowRender: (line) => (
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h4>Danh Sách Chi Tiết Bảng Đơn Vị</h4>
                                                <Button
                                                    type="primary"
                                                    onClick={() => {
                                                        setCurrentLineId(line._id);
                                                        setDetailModalVisible(true);
                                                    }}
                                                >
                                                    Thêm Đơn Vị
                                                </Button>
                                            </div>
                                            <Table
                                                dataSource={details[line._id]?.map(detail => ({ ...detail, key: detail._id })) || []}
                                                columns={[
                                                    { title: 'Tên Chi Tiết', dataIndex: 'name', key: 'name', onHeaderCell: () => ({
                                                        style: {
                                                          backgroundColor: '#F5F5DC',
                                                          color: '#333',
                                                          fontWeight: 'bold',
                                                        },
                                                      }), }, 
                                                    { title: 'Giá Trị', dataIndex: 'value', key: 'value',    onHeaderCell: () => ({
                                                        style: {
                                                          backgroundColor: '#F5F5DC',
                                                          color: '#333',
                                                          fontWeight: 'bold',
                                                        },
                                                      }), }, 
                                                    {
                                                        title: 'Hành Động',
                                                        key: 'action',    
                                                        onHeaderCell: () => ({
                                                            style: {
                                                              backgroundColor: '#F5F5DC',
                                                              color: '#333',
                                                              fontWeight: 'bold',
                                                            },
                                                          }),
                                                        render: (text, record) => (
                                                            <>
                                                                <Button
                                                                    type="link"
                                                                    icon={<EditOutlined />}
                                                                    onClick={() => handleEditDetail(record,line._id)}
                                                                    style={{ marginRight: 8 }}
                                                                />
                                                                <Button
                                                                    type="link"
                                                                    icon={<DeleteOutlined />}
                                                                    onClick={() => handleDeleteDetail(record, line._id)}
                                                                    danger
                                                                />
                                                            </>
                                                        ),
                                                    },
                                                ]}
                                                pagination={false}
                                            />
                                        </div>
                                    ),
                                    onExpand: (expanded, line) => {
                                        if (expanded) {
                                            handleLineExpand(line._id);
                                        }
                                    },
                                    rowExpandable: (line) => true,
                                }}
                            />
                        </div>
                    ),
                    rowExpandable: (record) => true,
                }}
            />

            <Modal
                title="Thêm Dòng"
                visible={lineModalVisible}
                onCancel={() => setLineModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleCreateLine}>
                    <Form.Item label="Tên Dòng" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên dòng!' }]}>
                        <Input placeholder="Nhập tên dòng" />
                    </Form.Item>
                    <Form.Item label="Mô Tả" name="description">
                        <Input placeholder="Nhập mô tả" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Tạo Dòng</Button>
                </Form>
            </Modal>
            <Modal
    title="Chỉnh Sửa Chi Tiết"
    visible={editDetailModalVisible}
    onCancel={() => setEditDetailModalVisible(false)}
    footer={null}
>
    <Form
        layout="vertical"
        initialValues={detailFormValues} 
        onFinish={handleUpdateDetail} 
    >
        <Form.Item
            label="Tên Chi Tiết"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên chi tiết!' }]}
        >
            <Input placeholder="Nhập tên chi tiết" />
        </Form.Item>
        <Form.Item label="Giá Trị" name="value">
            <Input placeholder="Nhập giá trị" />
        </Form.Item>
        <Button type="primary" htmlType="submit">Cập Nhật Chi Tiết</Button>
    </Form>
</Modal>

            <Modal
                title="Thêm Đơn Vị Mới"
                visible={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleCreateDetail}>
                    <Form.Item label="Tên Đơn Vị" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên đơn vị!' }]}>
                        <Input placeholder="Nhập tên đơn vị" />
                    </Form.Item>
                    <Form.Item label="Giá trị" name="value" rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}>
                        <Input placeholder="Nhập giá trị" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Thêm Đơn Vị</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default UnitManager;
