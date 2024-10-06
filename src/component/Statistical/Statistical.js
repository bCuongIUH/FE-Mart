import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Statistical.css';

// Đăng ký các module cần thiết của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StatisticsChart() {
  const [viewMode, setViewMode] = useState('day');

  // Dữ liệu giả lập cho biểu đồ
  const dailyData = {
    labels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: [2000000, 4500000, 3200000, 5000000, 6000000, 3000000, 4000000], 
        backgroundColor: '#007bff',
      },
    ],
  };

  const weeklyData = {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'], 
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: [15000000, 20000000, 18000000, 22000000],
        backgroundColor: '#00d084',
      },
    ],
  };

  const monthlyData = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: [40000000, 50000000, 45000000, 60000000, 55000000, 70000000],
        backgroundColor: '#ff6384',
      },
    ],
  };

  // Lựa chọn dữ liệu dựa trên chế độ xem hiện tại
  const chartData = viewMode === 'day' ? dailyData : viewMode === 'week' ? weeklyData : monthlyData;

  const handleBackButtonClick = () => {
    window.history.back(); // Hoặc điều hướng đến trang khác
  };

  // Giả lập tổng tiền doanh thu
  const totalRevenue = chartData.datasets[0].data.reduce((acc, cur) => acc + cur, 0);
  
  // Giả lập danh sách hóa đơn bán
  const bills = [
    { id: 1, total: 2000000 },
    { id: 2, total: 4500000 },
    { id: 3, total: 3200000 },
    { id: 4, total: 5000000 },
  ];

  return (
    <div style={{ paddingTop: '100px' }}> 
      <header className="header">
        {/* <h1 className="header-title">C'Mart</h1> */}
        <button className="header-title" onClick={handleBackButtonClick}>
        C'Mart
        </button>
      </header>

      <div className="statistics-container">
        <h2>Thống kê doanh thu</h2>
        <div className="button-group">
          <button onClick={() => setViewMode('day')}>Xem theo ngày</button>
          <button onClick={() => setViewMode('week')}>Xem theo tuần</button>
          <button onClick={() => setViewMode('month')}>Xem theo tháng</button>
        </div>

        <div className="chart-revenue-container">
          <div className="chart">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: `Doanh thu theo ${viewMode === 'day' ? 'ngày' : viewMode === 'week' ? 'tuần' : 'tháng'}`,
                  },
                },
              }}
            />
          </div>
          <div className="revenue-summary">
            <h3>Tổng doanh thu: {totalRevenue.toLocaleString()} VND</h3>
            <h4>Danh sách hóa đơn:</h4>
            <ul>
              {bills.map(bill => (
                <li key={bill.id}>Hóa đơn {bill.id}: {bill.total.toLocaleString()} VND</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsChart;
