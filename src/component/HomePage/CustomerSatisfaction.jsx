import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { getTop5CustomerSpending } from "../../services/statisticsService";

// Đăng ký các phần tử chart.js cần thiết
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const CustomerSatisfaction = () => {
  // State để lưu dữ liệu khách hàng
  const [customerData, setCustomerData] = useState([]);

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTop5CustomerSpending();
        setCustomerData(data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khách hàng:", error);
      }
    };

    fetchData();
  }, []); // Chỉ chạy một lần khi component mount

  // Sắp xếp dữ liệu khách hàng theo tổng tiền chi tiêu giảm dần
  const sortedCustomerData = customerData.sort((a, b) => b.totalSpent - a.totalSpent);

  // Dữ liệu biểu đồ
  const data = {
    labels: sortedCustomerData.map((customer) => customer.customerName), 
    datasets: [
      {
        label: "Tổng tiền đã mua",
        data: sortedCustomerData.map((customer) => customer.totalSpent), 
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Cấu hình biểu đồ
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Biểu đồ tổng tiền mua hàng của khách hàng",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} VNĐ`, // Định dạng số thành tiền Việt Nam
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Khách hàng thường xuyên</h3>
      {customerData.length > 0 ? (
        <Bar data={data} options={options} /> // Render biểu đồ Bar nếu có dữ liệu
      ) : (
        <p>Đang tải dữ liệu...</p> // Hiển thị thông báo khi chưa có dữ liệu
      )}
      <p className="text-gray-600 mt-4">
        Chúng tôi cam kết mang lại chất lượng và dịch vụ tốt nhất, kết quả là mức độ hài lòng của khách hàng luôn đạt
        kết quả cao.
      </p>
    </div>
  );
};

export default CustomerSatisfaction;
