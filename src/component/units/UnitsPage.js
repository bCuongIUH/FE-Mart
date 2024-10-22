import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, message, Table } from "antd";
import { createUnitList, createUnitLine, createUnitDetail, getAllUnitHeaders, getUnitLinesByHeaderId, getDetailsByLineId } from "../../untills/unitApi"; 
import './UnitManager.css'; // Import file CSS

const UnitManager = () => {
    const [headers, setHeaders] = useState([]);
    const [lines, setLines] = useState({});
    const [details, setDetails] = useState({}); // State để lưu trữ chi tiết của từng dòng

    const [currentHeaderId, setCurrentHeaderId] = useState(null);
    const [currentLineId, setCurrentLineId] = useState(null);

    const [lineModalVisible, setLineModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [headerModalVisible, setHeaderModalVisible] = useState(false); // Modal cho tiêu đề

    // State để quản lý hàng đã mở rộng
    const [expandedRows, setExpandedRows] = useState({});

    useEffect(() => {
        const fetchHeaders = async () => {
            try {
                const headersData = await getAllUnitHeaders();
                setHeaders(headersData);

                // Fetch lines for each header after loading headers
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
            const detail = await createUnitDetail({ ...values, lineId: currentLineId });
            setDetails((prev) => ({
                ...prev,
                [currentLineId]: [...(prev[currentLineId] || []), detail],
            }));
            message.success("Chi tiết đã được tạo thành công!");
            setDetailModalVisible(false);
        } catch (error) {
            message.error("Lỗi khi tạo chi tiết đơn vị");
        }
    };

    const toggleHeader = (id) => {
        const isExpanded = expandedRows[id];
        
        // Cập nhật trạng thái mở rộng của hàng
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !isExpanded,
        }));
    };

    const fetchDetailsByLineId = async (lineId) => {
        try {
            const detailData = await getDetailsByLineId(lineId); // Gọi API để lấy chi tiết
            setDetails((prev) => ({
                ...prev,
                [lineId]: detailData,
            }));
        } catch (error) {
            message.error("Lỗi khi tải chi tiết");
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mô Tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => status || "Chưa xác định",
        },
    ];

    return (
        <div className="unit-manager">
            <h1>Quản Lý Đơn Vị</h1>

            <Button type="primary" onClick={() => setHeaderModalVisible(true)}>
                Thêm Bảng Đơn Vị
            </Button>

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
                                    Thêm Dòng
                                </Button>
                            </div>
                            <Table
                                dataSource={lines[record._id]?.map(line => ({ ...line, key: line._id })) || []}
                                columns={[
                                    { title: 'Tên Dòng', dataIndex: 'name', key: 'name' },
                                    { title: 'Mô Tả', dataIndex: 'description', key: 'description' },
                                    {
                                        title: 'Hành Động',
                                        key: 'action',
                                        render: (_, line) => (
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    setCurrentLineId(line._id);
                                                    fetchDetailsByLineId(line._id); // Lấy chi tiết khi nhấn nút
                                                    setDetailModalVisible(true);
                                                }}
                                            >
                                                Xem Chi Tiết
                                            </Button>
                                        ),
                                    },
                                ]}
                                pagination={false}
                                expandable={{
                                    expandedRowRender: (line) => (
                                        <Table
                                            dataSource={details[line._id]?.map(detail => ({ ...detail, key: detail._id })) || []}
                                            columns={[
                                                { title: 'Tên Chi Tiết', dataIndex: 'detailName', key: 'detailName' },
                                                { title: 'Mô Tả', dataIndex: 'description', key: 'description' },
                                            ]}
                                            pagination={false}
                                        />
                                    ),
                                    rowExpandable: (line) => true, // Allow expandable row
                                }}
                            />
                        </div>
                    ),
                    rowExpandable: (record) => true, // Allow expandable row
                }}
                onRow={(record) => ({
                    onClick: () => toggleHeader(record._id),
                })}
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
                title="Thêm Chi Tiết"
                visible={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleCreateDetail}>
                    <Form.Item label="Tên Chi Tiết" name="detailName" rules={[{ required: true, message: 'Vui lòng nhập tên chi tiết!' }]}>
                        <Input placeholder="Nhập tên chi tiết" />
                    </Form.Item>
                    <Form.Item label="Mô Tả" name="description">
                        <Input placeholder="Nhập mô tả" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Tạo Chi Tiết</Button>
                </Form>
            </Modal>
        </div>
    );
};

export default UnitManager;
