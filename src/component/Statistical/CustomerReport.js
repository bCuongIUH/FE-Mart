import React, { useState, useEffect } from "react";
import { Table, Button, message, Row, Col, DatePicker, Select } from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "./CustomerReport.css";
import { getCustomerStatistics } from "../../services/statisticsService";
import { getAllCustomers } from "../../untills/customersApi";
import { formatCurrency } from "../../untills/formatCurrency";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

function CustomerReport() {
  const today = dayjs();
  const yesterday = dayjs().subtract(1, "day");

  const [dateRange, setDateRange] = useState([yesterday, today]);
  const [customerStatistics, setCustomerStatistics] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);

  console.log("Processed data for table:", customerStatistics);


  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomers();
        setCustomers(response);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách khách hàng");
      }
    };

    fetchCustomers();
    fetchCustomerStatistics();
  }, []);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    } else {
      setDateRange([yesterday, today]);
    }
  };

  const fetchCustomerStatistics = async () => {
    if (dateRange.length !== 2) {
      message.warning("Please select a valid date range!");
      return;
    }

    try {
      const [startDate, endDate] = dateRange;
      let data = await getCustomerStatistics(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD"),
        selectedCustomer
      );

      // Sort data first by customer phone number, then by date in ascending order
      data = data.sort((a, b) => {
        if (a.phoneNumber === b.phoneNumber) {
          return new Date(a.date) - new Date(b.date);
        }
        return a.phoneNumber > b.phoneNumber ? 1 : -1;
      });

      setCustomerStatistics(processDataForRowSpan(data));
    } catch (error) {
      console.error("Error fetching customer statistics:", error);
      message.error("Lỗi khi lấy thống kê khách hàng!");
    }
  };

  const processDataForRowSpan = (data) => {
    let lastPhoneNumber = null;
    let lastDate = null;
    let customerIndex = 1;

    return data.map((stat, index) => {
      if (stat.phoneNumber !== lastPhoneNumber) {
        stat.rowSpanCustomer = data.filter(
          (item) => item.phoneNumber === stat.phoneNumber
        ).length;
        stat.stt = customerIndex++;
        lastPhoneNumber = stat.phoneNumber;
        lastDate = null; // Reset lastDate for new customer
      } else {
        stat.rowSpanCustomer = 0;
      }

      if (stat.date !== lastDate || stat.rowSpanCustomer > 0) {
        stat.rowSpanDate = data.filter(
          (item) =>
            item.date === stat.date && item.phoneNumber === stat.phoneNumber
        ).length;
        lastDate = stat.date;
      } else {
        stat.rowSpanDate = 0;
      }

      return stat;
    });
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("DOANH SỐ THEO KHÁCH HÀNG");

    // Store title
    worksheet.mergeCells("A1:L1");
    worksheet.getCell("A1").value = "Tên Cửa Hàng: C'Mart";
    worksheet.getCell("A1").font = {
      name: "Times New Roman",
      bold: true,
      size: 16,
      color: { argb: "FF0000" },
    };
    worksheet.getCell("A1").alignment = { horizontal: "center" };
    worksheet.getRow(1).height = 30;

    // Print date
    worksheet.mergeCells("A3:L3");
    worksheet.getCell(
      "A3"
    ).value = `Ngày in: ${new Date().toLocaleDateString()}`;
    worksheet.getCell("A3").font = { name: "Times New Roman" };
    worksheet.getCell("A3").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(3).height = 25;

    // Report title
    worksheet.mergeCells("A4:L4");
    worksheet.getCell("A4").value = "DOANH SỐ THEO KHÁCH HÀNG";
    worksheet.getCell("A4").font = {
      name: "Times New Roman",
      bold: true,
      size: 18,
    };
    worksheet.getCell("A4").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(4).height = 30;

    // Date range
    worksheet.mergeCells("A5:L5");
    worksheet.getCell("A5").value = `Từ ngày: ${dateRange[0].format(
      "DD/MM/YYYY"
    )} đến ngày: ${dateRange[1].format("DD/MM/YYYY")}`;
    worksheet.getCell("A5").font = { name: "Times New Roman" };
    worksheet.getCell("A5").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(5).height = 20;

    // Customer name if selected
    if (selectedCustomer) {
      const selectedCustomerInfo = customers.find(
        (cust) => cust._id === selectedCustomer
      );
      if (selectedCustomerInfo) {
        worksheet.mergeCells("A6:L6");
        worksheet.getCell(
          "A6"
        ).value = `Khách hàng: ${selectedCustomerInfo.fullName}`;
        worksheet.getCell("A6").font = {
          name: "Times New Roman",
          bold: true,
          size: 14,
        };
        worksheet.getCell("A6").alignment = { horizontal: "center" };
        worksheet.getRow(6).height = 20;
      }
    }

    // Header row
    const headerRow = worksheet.addRow([
      "STT",
      "Ngày",
      "Số điện thoại",
      "Tên KH",
      "Số nhà",
      "Phường/Xã",
      "Quận/Huyện",
      "Tỉnh/Thành phố",
      "Danh mục",
      "Tổng Số Tiền",
      "Chiết Khấu",
      "Tổng Sau CK",
    ]);

    headerRow.font = { name: "Times New Roman", bold: true, size: 14 };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD700" },
      };
    });
    worksheet.getRow(headerRow.number).height = 30;

    // Set column widths
    const columnWidths = [8, 15, 30, 25, 25, 15, 15, 20, 25, 18, 18, 20];
    columnWidths.forEach(
      (width, i) => (worksheet.getColumn(i + 1).width = width)
    );

    // Data rows with conditional STT and Ngày display
    let customerCounter = 1;
    let lastPhoneNumber = null;
    let lastDate = null;

    customerStatistics.forEach((stat) => {
      const showCustomerNumber = stat.phoneNumber !== lastPhoneNumber;
      const showDate = stat.date !== lastDate || showCustomerNumber;

      const row = worksheet.addRow([
        showCustomerNumber ? customerCounter++ : "", // Show STT only once per customer
        showDate ? stat.date : "", // Show date only once per unique date per customer
        stat.phoneNumber,
        stat.customerName,
        stat.address?.houseNumber || "Chưa cập nhật",
        stat.address?.ward || "Chưa cập nhật",
        stat.address?.district || "Chưa cập nhật",
        stat.address?.province || "Chưa cập nhật",
        stat.category,
        stat.actualTotalAmount,
        stat.discountAmount,
        stat.totalAmount,
      ]);

      row.font = { name: "Times New Roman", size: 12 };
      row.alignment = { horizontal: "center", vertical: "middle" };

      // Set height for the current row
      row.height = 25;

      // Apply number formatting for totals without currency symbols
      row.getCell(10).numFmt = "#,##0"; // Tổng Số Tiền
      row.getCell(11).numFmt = "#,##0"; // Chiết Khấu
      row.getCell(12).numFmt = "#,##0"; // Tổng Sau CK

      lastPhoneNumber = stat.phoneNumber;
      lastDate = stat.date;
    });

    // Export the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Customer_Report.xlsx`);
    message.success("Xuất dữ liệu ra Excel thành công!");
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (_, record) => (record.rowSpanCustomer ? record.stt : ""),
      align: "center",
      onCell: (record) => ({
        rowSpan: record.rowSpanCustomer,
      }),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (_, record) => (record.rowSpanDate ? record.date : ""),
      onCell: (record) => ({
        rowSpan: record.rowSpanDate,
      }),
    },
    { title: "Số điện thoại", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Tên Khách Hàng", dataIndex: "customerName", key: "customerName" },
    {
      title: "Số nhà",
      dataIndex: ["address", "houseNumber"],
      key: "houseNumber",
      render: (text) => text || "Chưa cập nhật",
    },
    {
      title: "Phường/Xã",
      dataIndex: ["address", "ward"],
      key: "ward",
      render: (text) => text || "Chưa cập nhật",
    },
    {
      title: "Quận/Huyện",
      dataIndex: ["address", "district"],
      key: "district",
      render: (text) => text || "Chưa cập nhật",
    },
    {
      title: "Tỉnh/Thành phố",
      dataIndex: ["address", "province"],
      key: "province",
      render: (text) => text || "Chưa cập nhật",
    },
    { title: "Danh mục", dataIndex: "category", key: "category" },
    {
      title: "Tổng Số Tiền",
      dataIndex: "actualTotalAmount",
      key: "actualTotalAmount",
      render: (text) => formatCurrency(text),
    },
    {
      title: "Chiết Khấu",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (text) => formatCurrency(text),
    },
    {
      title: "Tổng Sau CK",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => formatCurrency(text),
    },
  ];

  return (
    <div style={{ paddingTop: "50px" }}>
      <div className="statistics-container">
      <h2 style={{fontWeight: "bold", padding: "5px" }}>Thống kê doanh thu khách hàng</h2>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col>
            <RangePicker
              onChange={handleDateChange}
              value={dateRange}
              format="YYYY-MM-DD"
              defaultPickerValue={[yesterday, today]}
            />
          </Col>
          <Col>
            <Select
              placeholder="Chọn khách hàng"
              style={{ width: 300 }}
              onChange={(value) => setSelectedCustomer(value)}
              optionLabelProp="label"
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              allowClear
            >
              {customers.map((customer) => (
                <Option
                  key={customer._id}
                  value={customer._id}
                  label={customer.fullName}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "bold" }}>
                      {customer.fullName}
                    </span>
                    <span>Số điện thoại: {customer.phoneNumber}</span>
                    <span>Email: {customer.email}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={fetchCustomerStatistics}>
              Lấy dữ liệu
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={exportToExcel}
              style={{ marginLeft: 8 }}
            >
              Xuất Excel
            </Button>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={customerStatistics.map((stat, index) => ({
            ...stat,
            key: index,
          }))}
          style={{ marginTop: 20 }}
          pagination={{ pageSize: 1000 }}
        />
      </div>
    </div>
  );
}

export default CustomerReport;