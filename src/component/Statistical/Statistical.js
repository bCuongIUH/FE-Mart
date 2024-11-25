import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  message,
  Card,
  Row,
  Col,
  DatePicker,
  Select,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  UserOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "./Statistical.css";
import {
  getStatistics,
  getDailyRevenue,
} from "../../services/statisticsService";
import { getAllEmployee } from "../../untills/employeesApi";
import { formatCurrency } from "../../untills/formatCurrency";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

function StatisticsChart() {
  const today = dayjs();
  const yesterday = dayjs().subtract(1, "day");

  const [dateRange, setDateRange] = useState([yesterday, today]);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    } else {
      setDateRange([yesterday, today]);
    }
  };

  const [statistics, setStatistics] = useState({
    totalProducts: 0,
    totalBills: 0,
    totalCustomers: 0,
    todayRevenue: 0,
    yesterdayRevenue: 0, // Added yesterday's revenue
    todayGrowth: 0,
    currentMonthRevenue: 0,
    lastMonthRevenue: 0, // Added last month's revenue
    monthlyGrowth: 0,
    currentYearRevenue: 0,
    lastYearRevenue: 0, // Added last year's revenue
    yearlyGrowth: 0,
  });

  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [employees, setEmployees] = useState([]);
console.log(dailyRevenue);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getStatistics();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        message.error("Cannot load statistics data!");
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployee();
        setEmployees(response);
      } catch (error) {
        message.error("Lỗi khi lấy danh sách nhân viên");
      }
    };

    fetchStatistics();
    fetchEmployees();
    fetchDailyRevenue();
  }, []);

  const fetchDailyRevenue = async () => {
    if (dateRange.length !== 2) {
      message.warning("Please select a valid date range!");
      return;
    }

    try {
      const [startDate, endDate] = dateRange;
      const data = await getDailyRevenue(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD"),
        selectedUser
      );
      setDailyRevenue(data);
    } catch (error) {
      console.error("Error fetching daily revenue:", error);
      message.error("Lỗi khi lấy doanh thu!");
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Doanh thu");

    // Title with custom font, size, and color for Tên Cửa Hàng
    worksheet.mergeCells("A1:G1");
    worksheet.getCell("A1").value = "Tên Cửa Hàng: C'Mart";
    worksheet.getCell("A1").font = {
      name: "Times New Roman",
      bold: true,
      size: 16,
      color: { argb: "FF0000" }, // Red color
    };
    worksheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(1).height = 25;

    // Address with custom font, size, and color for Địa chỉ
    worksheet.mergeCells("A2:G2");
    worksheet.getCell("A2").value = "Địa chỉ: 12 Nguyễn Văn Bảo, P.4, Gò Vấp";
    worksheet.getCell("A2").font = {
      name: "Times New Roman",
      bold: true,
      size: 16,
      color: { argb: "FF0000" }, // Red color
    };
    worksheet.getCell("A2").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(2).height = 25;

    // Printed date
    worksheet.mergeCells("A3:G3");
    worksheet.getCell(
      "A3"
    ).value = `Ngày in: ${new Date().toLocaleDateString()}`;
    worksheet.getCell("A3").font = { name: "Times New Roman" };
    worksheet.getCell("A3").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(3).height = 20;

    // Report title
    worksheet.mergeCells("A4:G4");
    worksheet.getCell("A4").value = "DOANH SỐ BÁN HÀNG THEO NGÀY";
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
    worksheet.mergeCells("A5:G5");
    worksheet.getCell("A5").value = `Từ ngày: ${dateRange[0].format(
      "DD/MM/YYYY"
    )} đến ngày: ${dateRange[1].format("DD/MM/YYYY")}`;
    worksheet.getCell("A5").font = { name: "Times New Roman" };
    worksheet.getCell("A5").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(5).height = 20;

    // Add selected employee name if an employee is selected
    if (selectedUser) {
      const selectedEmployee = employees.find(
        (emp) => emp._id === selectedUser
      );
      if (selectedEmployee) {
        worksheet.mergeCells("A6:G6");
        worksheet.getCell(
          "A6"
        ).value = `Nhân viên: ${selectedEmployee.fullName}`;
        worksheet.getCell("A6").font = {
          name: "Times New Roman",
          bold: true,
          size: 14,
        };
        worksheet.getCell("A6").alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        worksheet.getRow(6).height = 20;
      }
    }

    // Shift header row down by 1 if employee name is added
    const headerRowStart = selectedUser ? 7 : 6;

    // Header row styling
    const headerRow = worksheet.addRow([
      "STT",
      "Mã NV",
      "Tên NV",
      "Ngày",
      "Doanh số trước CK",
      "Chiết khấu",
      "Doanh số sau CK",
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
    worksheet.getRow(headerRow.number).height = 25;

    // Column widths
    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 25;
    worksheet.getColumn(6).width = 25;
    worksheet.getColumn(7).width = 25;

    // Data rows
    dailyRevenue.forEach((dayData, index) => {
      const totalRow = worksheet.addRow([
        index + 1,
        "",
        "",
        dayData.date,
        dayData.totalAmount ,
        dayData.discountAmount,
        dayData.revenueAfterDiscount,
      ]);
      totalRow.font = { name: "Times New Roman", bold: true, size: 12 };
      totalRow.alignment = { horizontal: "center", vertical: "middle" };
      totalRow.getCell(5).numFmt = "#,##0"; // No decimal places
      totalRow.getCell(6).numFmt = "#,##0";
      totalRow.getCell(7).numFmt = "#,##0";

      dayData.employees.forEach((employee) => {
        const empRow = worksheet.addRow([
          "",
          employee.employeeCode,
          employee.employeeName,
          "",
         
          employee.totalAmount,
          employee.discountAmount,
          employee.revenueAfterDiscount,
        ]);
        empRow.font = { name: "Times New Roman", size: 12 };
        empRow.alignment = { horizontal: "center", vertical: "middle" };
        empRow.getCell(5).numFmt = "#,##0"; // No decimal places
        empRow.getCell(6).numFmt = "#,##0";
        empRow.getCell(7).numFmt = "#,##0";
      });

      worksheet.addRow([]); // Empty row for spacing
    });

    // Final summary row
    const finalRow = worksheet.addRow([
      "Tổng cộng",
      "",
      "",
      "",
      dailyRevenue.reduce((sum, item) => sum + item.totalAmount , 0),
      dailyRevenue.reduce((sum, item) => sum + item.discountAmount, 0),
      dailyRevenue.reduce((sum, item) => sum + item.revenueAfterDiscount, 0),
    ]);
    finalRow.font = { name: "Times New Roman", bold: true, size: 14 };
    finalRow.alignment = { horizontal: "center", vertical: "middle" };
    finalRow.getCell(5).numFmt = "#,##0"; // No decimal places
    finalRow.getCell(6).numFmt = "#,##0";
    finalRow.getCell(7).numFmt = "#,##0";

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `DoanhThu_ThongKe.xlsx`);
    message.success("Xuất dữ liệu ra Excel thành công!");
  };


  const columns = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Mã Nhân Viên", dataIndex: "employeeCode", key: "employeeCode" },
    { title: "Tên Nhân Viên", dataIndex: "employeeName", key: "employeeName" },
    
    {
      title: "Doanh Thu Trước CK",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => formatCurrency(text),
    },
    {
      title: "Chiết Khấu",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (text) => formatCurrency(text),
    },
    {
      title: "Doanh Thu Sau CK",
      dataIndex: "revenueAfterDiscount",
      key: "revenueAfterDiscount",
      render: (text) => formatCurrency(text),
    },
  ];

  const dataSource = dailyRevenue.flatMap((day, index) => {
    const dayTotal = {
      key: `${day.date}-total`,
      date: day.date,
      discountAmount: day.discountAmount,
      totalAmount: day.totalAmount,
      revenueAfterDiscount: day.revenueAfterDiscount,
      isTotal: true,
    };
    const employeeRows = day.employees.map((employee, empIndex) => ({
      key: `${day.date}-${empIndex}`,
      date: "",
      employeeCode: employee.employeeCode,
      employeeName: employee.employeeName,
      discountAmount: employee.discountAmount,
      totalAmount: employee.totalAmount,
      revenueAfterDiscount: employee.revenueAfterDiscount,
    }));
    return [dayTotal, ...employeeRows];
  });
  const renderGrowthIcon = (growth) => {
    if (growth > 0) {
      return <ArrowUpOutlined style={{ color: "green" }} />;
    } else if (growth < 0) {
      return <ArrowDownOutlined style={{ color: "red" }} />;
    }
    return null;
  };
  return (
    <div style={{ paddingTop: "50px" }}>
      <div className="statistics-container">
        <h2 style={{fontWeight: "bold", padding: "5px" }}>Thống kê doanh thu</h2>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card
              title={
                <>
                  <ShoppingCartOutlined /> Tổng sản phẩm
                </>
              }
              bordered={false}
            >
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                {statistics.totalProducts}
              </span>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title={
                <>
                  <FileTextOutlined /> Tổng hóa đơn
                </>
              }
              bordered={false}
            >
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                {statistics.totalBills}
              </span>
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title={
                <>
                  <UserOutlined /> Tổng khách hàng
                </>
              }
              bordered={false}
            >
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                {statistics.totalCustomers}
              </span>
            </Card>
          </Col>

          <Col span={8}>
            <Card
              title={
                <>
                  <DollarCircleOutlined /> Doanh thu hôm nay
                </>
              }
              bordered={false}
            >
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                {formatCurrency(statistics.todayRevenue)}{" "}
                {renderGrowthIcon(statistics.todayGrowth)}{" "}
                <span
                  style={{
                    color: statistics.todayGrowth > 0 ? "green" : "red",
                  }}
                >
                  ({statistics.todayGrowth.toFixed(2)}%)
                </span>
              </span>
              <div
                style={{ fontSize: "12px", color: "gray", marginTop: "4px" }}
              >
                Hôm qua: {formatCurrency(statistics.yesterdayRevenue)}
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card
              title={
                <>
                  <DollarCircleOutlined /> Doanh thu tháng này
                </>
              }
              bordered={false}
            >
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                {formatCurrency(statistics.currentMonthRevenue)}{" "}
                {renderGrowthIcon(statistics.monthlyGrowth)}{" "}
                <span
                  style={{
                    color: statistics.monthlyGrowth > 0 ? "green" : "red",
                  }}
                >
                  ({statistics.monthlyGrowth.toFixed(2)}%)
                </span>
              </span>
              <div
                style={{ fontSize: "12px", color: "gray", marginTop: "4px" }}
              >
                Tháng trước: {formatCurrency(statistics.lastMonthRevenue)}
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card
              title={
                <>
                  <DollarCircleOutlined /> Doanh thu năm nay
                </>
              }
              bordered={false}
            >
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                {formatCurrency(statistics.currentYearRevenue)}{" "}
                {renderGrowthIcon(statistics.yearlyGrowth)}{" "}
                <span
                  style={{
                    color: statistics.yearlyGrowth > 0 ? "green" : "red",
                  }}
                >
                  ({statistics.yearlyGrowth.toFixed(2)}%)
                </span>
              </span>
              <div
                style={{ fontSize: "12px", color: "gray", marginTop: "4px" }}
              >
                Năm trước: {formatCurrency(statistics.lastYearRevenue)}
              </div>
            </Card>
          </Col>
        </Row>
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
              placeholder="Chọn nhân viên"
              style={{ width: 300 }}
              onChange={(value) => setSelectedUser(value)}
              optionLabelProp="label"
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              allowClear
            >
              {employees.map((employee) => (
                <Option
                  key={employee._id}
                  value={employee._id}
                  label={employee.fullName} // Display the name as the label
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: "bold" }}>
                      {employee.fullName}
                    </span>
                    <span>Mã NV: {employee.MaNV}</span>
                    <span>Email: {employee.email}</span>
                    <span>Số điện thoại: {employee.phoneNumber}</span>
                  </div>
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={fetchDailyRevenue}>
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
          dataSource={dataSource}
          rowKey="key"
          style={{ marginTop: 20 }}
          pagination={{ pageSize: 1000 }}
        />
      </div>
    </div>
  );
}

export default StatisticsChart;
