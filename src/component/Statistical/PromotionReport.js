import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  message,
  Row,
  Col,
  DatePicker,
  Tag,
  Tooltip,
} from "antd";
import { getVoucherStatistics } from "../../services/statisticsService";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { formatCurrency } from "../../untills/formatCurrency";

const { RangePicker } = DatePicker;

function PromotionReport() {
  const today = dayjs();
  const yesterday = dayjs().subtract(1, "day");


  const [dateRange, setDateRange] = useState([yesterday, today]);
  const [buyXGetYData, setBuyXGetYData] = useState([]);
  const [otherVoucherData, setOtherVoucherData] = useState([]);
  console.log('checkk', buyXGetYData);
  const voucherTypeTranslations = {
    BuyXGetY: "Mua hàng tặng hàng",
    FixedDiscount: "Giảm Giá Cố Định",
    PercentageDiscount: "Giảm Giá Phần Trăm",
  };
  console.log("2",otherVoucherData);
  useEffect(() => {
    fetchVoucherStatistics();
  }, []);

  const fetchVoucherStatistics = async () => {
    if (dateRange.length !== 2) {
      message.warning("Vui lòng chọn khoảng thời gian hợp lệ!");
      return;
    }

    try {
      const [startDate, endDate] = dateRange;
      const data = await getVoucherStatistics(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD")
      );

      const buyXGetY = data.buyXGetYDetails || [];
      const others = data.voucherStatistics.map((voucher) => ({
        ...voucher,
        voucherType:
          voucherTypeTranslations[voucher.voucherType] || voucher.voucherType,
      }));

      setBuyXGetYData(buyXGetY);
      setOtherVoucherData(others);
    } catch (error) {
      console.error("Error fetching voucher statistics:", error);
      message.error("Lỗi khi lấy thống kê voucher!");
    }
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    } else {
      setDateRange([yesterday, today]);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Báo cáo Khuyến Mãi");

    // Header section
    worksheet.mergeCells("A1:J1");
    worksheet.getCell("A1").value = "Tên Cửa Hàng: C'Mart";
    worksheet.getCell("A1").font = {
      name: "Times New Roman",
      bold: true,
      size: 16,
      color: { argb: "FF0000" },
    };
    worksheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(1).height = 25;

    worksheet.mergeCells("A2:J2");
    worksheet.getCell("A2").value = "Địa chỉ: 12 Nguyễn Văn Bảo, P.4, Gò Vấp";
    worksheet.getCell("A2").font = {
      name: "Times New Roman",
      bold: true,
      size: 16,
      color: { argb: "FF0000" },
    };
    worksheet.getCell("A2").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(2).height = 25;

    worksheet.mergeCells("A3:J3");
    worksheet.getCell(
      "A3"
    ).value = `Ngày in: ${new Date().toLocaleDateString()}`;
    worksheet.getCell("A3").font = { name: "Times New Roman" };
    worksheet.getCell("A3").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(3).height = 20;

    worksheet.mergeCells("A4:J4");
    worksheet.getCell("A4").value = `Từ ngày: ${dateRange[0].format(
      "DD/MM/YYYY"
    )} đến ngày: ${dateRange[1].format("DD/MM/YYYY")}`;
    worksheet.getCell("A4").font = { name: "Times New Roman" };
    worksheet.getCell("A4").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    worksheet.getRow(4).height = 20;

    worksheet.addRow([]);
    worksheet.mergeCells("A5:J5");
    worksheet.getCell("A5").value = "Khuyến mãi Mua hàng Tặng hàng";
    worksheet.getCell("A5").font = {
      name: "Times New Roman",
      bold: true,
      size: 14,
    };
    worksheet.getCell("A5").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    const buyXGetYHeaders = [
      "STT",
      "Mã Khuyến mãi",
      "Loại Khuyến mãi",
      "Điều Kiện", 
      "Ngày Bắt Đầu",
      "Ngày Kết Thúc",
      "Mã SP Tặng",
      "Tên SP Tặng",
      "SL Sử Dụng",
      "Số Lượng Tặng",
      "Đon Vị Tính",
    ];
    
    const buyXGetYHeaderRow = worksheet.addRow(buyXGetYHeaders);
    buyXGetYHeaderRow.font = { name: "Times New Roman", bold: true, size: 13 };
    buyXGetYHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
    buyXGetYHeaderRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD700" } 
      };
    });
    
    buyXGetYData.forEach((item, index) => {
      const row = worksheet.addRow([
        index + 1,
        item.voucherCode,
        "Mua hàng Tặng hàng",
        item.conditions
          ?.map(
            (cond) =>
              `Mua ${cond.quantityX} ${cond.unitX} ${cond.productXName || cond.productXId}`
          )
          .join("; "),
        dayjs(item.startDate).format("DD/MM/YYYY"),
        dayjs(item.endDate).format("DD/MM/YYYY"),
        item.giftProducts[0]?.productYId,
        item.giftProducts[0]?.productYName,
        item.usageCount,
        item.giftProducts[0]?.quantityY,
        item.giftProducts[0]?.unitY,
       
      ]);
      row.font = { name: "Times New Roman", size: 12 };
      row.height = 20;
    });


    // Add an empty row between two sections
    worksheet.addRow([]);
    worksheet.mergeCells(
      `A${worksheet.lastRow.number + 1}:J${worksheet.lastRow.number + 1}`
    );
    // Add an empty row between two sections
    worksheet.addRow([]);
    worksheet.mergeCells(
      `A${worksheet.lastRow.number + 1}:J${worksheet.lastRow.number + 1}`
    );

    worksheet.addRow([]);
    worksheet.mergeCells(
      `A${worksheet.lastRow.number + 1}:J${worksheet.lastRow.number + 1}`
    );
    worksheet.getCell(`A${worksheet.lastRow.number}`).value =
      "Khuyến mãi Giảm Giá Cố Định & Giảm Giá Phần Trăm";
    worksheet.getCell(`A${worksheet.lastRow.number}`).font = {
      name: "Times New Roman",
      bold: true,
      size: 14,
    };
    worksheet.getCell(`A${worksheet.lastRow.number}`).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    const otherVoucherHeaders = [
      "STT",
      "Mã Khuyến Mãi",
      "Loại Khuyến Mãi",
      "Điều Kiện", // Đưa cột Điều Kiện lên thứ 4
      "Ngày Bắt Đầu",
      "Ngày Kết Thúc",
      "Số Lần Sử Dụng",
      "Tổng Tiền Đã Chiết Khấu",
    ];
    
    const otherVoucherHeaderRow = worksheet.addRow(otherVoucherHeaders);
    otherVoucherHeaderRow.font = {
      name: "Times New Roman",
      bold: true,
      size: 13,
    };
    otherVoucherHeaderRow.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    otherVoucherHeaderRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD700" },
      };
    });

    let totalDiscountAmount = 0;

    otherVoucherData.forEach((item, index) => {
      totalDiscountAmount += item.totalDiscountAmount || 0;
      const conditions = item.conditions
        ?.map((condGroup) =>
          condGroup.conditions
            ?.map((cond) =>
              cond.discountAmount
                ? `Số tiền tối thiểu: ${formatCurrency(
                    cond.minOrderValue
                  )}, Giảm giá: ${formatCurrency(cond.discountAmount)}`
                : `Số tiền tối thiểu: ${formatCurrency(
                    cond.minOrderValue
                  )}, Giảm giá: ${cond.discountPercentage || 0}%, Tối đa: ${formatCurrency(
                    cond.maxDiscountAmount || 0
                  )}`
            )
            .join("; ")
        )
        .join("; ");
      const row = worksheet.addRow([
        index + 1,
        item.voucherCode,
        item.voucherType,
        conditions,
        dayjs(item.startDate).format("DD/MM/YYYY"),
        dayjs(item.endDate).format("DD/MM/YYYY"),
        item.usageCount,
        `${formatCurrency(item.totalDiscountAmount)}`, 
      ]);
      row.font = { name: "Times New Roman", size: 12 };
      row.height = 20;
    });
    

    const totalRow = worksheet.addRow([
      "",
      "",
      "",
      "Tổng cộng:",
      totalDiscountAmount,
    ]);
    totalRow.font = { name: "Times New Roman", bold: true, size: 13 };
    totalRow.alignment = { horizontal: "center", vertical: "middle" };
    totalRow.getCell(5).numFmt = "#,##0";
    totalRow.height = 20;

 
    worksheet.columns.forEach((column, index) => {
      if (index === 4) { 
        column.width = 20;
      } else if (index === 5) {
        column.width = 20; 
      } else if (index === 1) {
        column.width = 15; 
      } else if (index === 6) { 
        column.width = 30; 
      } else if (index === 3) {
        column.width = 45; 
      } else if (index === 0) {
        column.width = 10; 
      } else {
        column.width = 20; 
      }
    });
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `BaoCaoKhuyenMai_${dayjs().format("YYYYMMDD")}.xlsx`
    );
    message.success("Xuất dữ liệu ra Excel thành công!");
  };

  const buyXGetYColumns = [
    { title: "Mã Khuyến mãi", dataIndex: "voucherCode", key: "voucherCode" },
    { 
      title: "Loại Khuyến mãi", 
      dataIndex: "voucherName", 
      key: "voucherName",
      render: () => "Mua hàng Tặng hàng"
    },
    {
      title: "Điều Kiện",
      dataIndex: "conditions",
      key: "conditions",
      render: (conditions, record) => (
        <div>
          {conditions?.map((cond, index) => (
            <div key={index} style={{ marginBottom: "8px" }}>
              <div style={{ fontSize: "14px", padding: "5px 10px" }}>
                Mua {cond.quantityX} {cond.unitX} {cond.productXName || cond.productXId}
              </div>
            </div>
          ))}
          <div>
            {record.giftProducts?.map((gift, index) => (
              <div key={index} style={{ fontSize: "14px", padding: "5px 10px", color: "green" }}>
               
              </div>
            ))}
          </div>
        </div>
      ),
    },
    { 
      title: "Ngày Bắt Đầu", 
      dataIndex: "startDate", 
      key: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    { 
      title: "Ngày Kết Thúc", 
      dataIndex: "endDate", 
      key: "endDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    { 
      title: "Mã Sản Phẩm Tặng", 
      dataIndex: "giftProducts", 
      key: "giftProducts",
      render: (giftProducts) => giftProducts?.map(gift => `${gift.productYId}`).join(", ")
    },
    { 
      title: "Sản Phẩm Tặng", 
      dataIndex: "giftProducts", 
      key: "giftProducts",
      render: (giftProducts) => giftProducts?.map(gift => `${gift.productYName} `).join(", ")
    },
,
    { title: "Số Lần Sử Dụng", dataIndex: "usageCount", key: "usageCount" },
    { 
      title: "Số Lượng Tặng", 
      dataIndex: "giftProducts", 
      key: "quantityY",
      render: (giftProducts) => giftProducts?.map(gift => `${gift.quantityY} `).join(", ")
    },
    { 
      title: "Đơn Vị Tính", 
      dataIndex: "giftProducts", 
      key: "quantityY",
      render: (giftProducts) => giftProducts?.map(gift => ` ${gift.unitY}`).join(", ")
    }
  ];

  const otherVoucherColumns = [
    { title: "Mã Khuyến Mãi", dataIndex: "voucherCode", key: "voucherCode" },
    {
      title: "Loại Khuyến Mãi",
      dataIndex: "voucherType",
      key: "voucherType",
      render: (text) => voucherTypeTranslations[text] || text,
    },
    {
      title: "Điều Kiện",
      dataIndex: "conditions",
      key: "conditions",
      render: (conditions) =>
        conditions?.map((condGroup, groupIndex) => (
          <div key={groupIndex} style={{ marginBottom: "8px" }}>
            {condGroup.conditions?.map((cond, index) => (
              <div
                color={cond.discountAmount ? "red" : "purple"}
                key={`${groupIndex}-${index}`}
                style={{
                  fontSize: "14px", // Tăng kích thước chữ
                  padding: "5px 10px", // Tăng khoảng cách padding
                  borderRadius: "5px", // Bo góc thẻ Tag
                }}
              >
                {cond.discountAmount
                  ? `Số tiền tối thiểu: ${formatCurrency(
                    cond.minOrderValue
                  )}, Giảm giá: ${formatCurrency(cond.discountAmount)}`
                  : `Số tiền tối thiểu: ${formatCurrency(
                    cond.minOrderValue
                  )}, Giảm giá: ${cond.discountPercentage || 0
                  }%, Tối đa: ${formatCurrency(cond.maxDiscountAmount || 0)}`}
              </div>
            ))}
          </div>
        )),
    },
    { title: "Ngày Bắt Đầu", dataIndex: "startDate", key: "startDate" },
    { title: "Ngày Kết Thúc", dataIndex: "endDate", key: "endDate" },
    { title: "Số Lần Sử Dụng", dataIndex: "usageCount", key: "usageCount" },
    {
      title: "Tổng Tiền Đã Chiết Khấu",
      dataIndex: "totalDiscountAmount",
      key: "totalDiscountAmount",
      render: (text) =>
        `${formatCurrency(text)}`, 
    },
    

  ];

  return (
    <div style={{ paddingTop: "50px" }}>
      <div className="statistics-container">
        <h2 style={{fontWeight: 'bold'}}>Thống Kê Khuyến mãi</h2>
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col>
            <RangePicker
              onChange={handleDateChange}
              value={dateRange}
              format="YYYY-MM-DD"
            />
          </Col>
          <Col>
            <Button type="primary" onClick={fetchVoucherStatistics}>
              Lấy Dữ Liệu
            </Button>
          </Col>
          <Col>
            <Button type="default" onClick={exportToExcel}>
              Xuất Excel
            </Button>
          </Col>
        </Row>
        <h3 style={{ marginTop: "20px" }}>Khuyến mãi mua hàng tặng  hàng</h3>
        <Table
          columns={buyXGetYColumns}
          dataSource={buyXGetYData.map((item, index) => ({
            ...item,
            key: index,
            render: (date) => dayjs(date).format("DD/MM/YYYY")
            // render: (date) => dayjs(date).format("DD/MM/YYYY")
          }))}
          pagination={{ pageSize: 5 }}
          style={{ marginTop: 20 }}
        />
        <h3 style={{ marginTop: "20px" }}>
          Khuyến mãi Giảm Giá Cố Định & Giảm Giá Phần Trăm
        </h3>
        <Table
          columns={otherVoucherColumns}
          dataSource={otherVoucherData.map((item, index) => ({
            ...item,
            key: index,
            startDate: dayjs(item.startDate).format("DD/MM/YYYY"), // Chuyển đổi ngày bắt đầu
            endDate: dayjs(item.endDate).format("DD/MM/YYYY"),     // Chuyển đổi ngày kết thúc
          }))}
          pagination={{ pageSize: 5 }}
          style={{ marginTop: 20 }}
        />
      </div>
    </div>
  );
}

export default PromotionReport;

