import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import { getTop5ProductSpending } from "../../services/statisticsService";

// Đăng ký các phần tử chart.js cần thiết
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const SalesStatistics = () => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu top 5 sản phẩm bán chạy nhất
    const fetchData = async () => {
      try {
        const data = await getTop5ProductSpending(); // API lấy dữ liệu
        setProductData(data);
      } catch (error) {
        console.error("Có lỗi khi lấy thống kê sản phẩm:", error);
      }
    };
    fetchData();
  }, []);

  // Chuyển dữ liệu thành định dạng phù hợp cho biểu đồ
  const chartData = {
    labels: productData.map((item) => item.productName), // Tên sản phẩm
    datasets: [
      {
        label: "Tổng doanh thu",
        data: productData.map((item) => item.totalRevenue), // Tổng doanh thu của sản phẩm
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
        text: "Biểu đồ doanh thu theo sản phẩm",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value.toLocaleString()} VNĐ`, // Định dạng tiền tệ
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Thống kê mặt hàng bán chạy</h3>
      <Bar data={chartData} options={options} /> 
      <p className="text-gray-600 mt-4">
Chúng tôi cung cấp nhiều loại sản phẩm thuộc nhiều danh mục để đáp ứng mọi nhu cầu mua sắm của bạn.
      </p>
    </div>
  );
};

export default SalesStatistics;
