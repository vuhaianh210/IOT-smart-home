import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "./ChartComponent.css";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ChartComponent = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [], // Nhãn trục x
    datasets: [
      {
        label: "Ánh sáng",
        data: [],
        borderColor: "yellow",
        backgroundColor: "yellow",
        fill: false,
        yAxisID: "lightAxis",
        tension: 0.4,
      },
      {
        label: "Độ ẩm",
        data: [],
        borderColor: "blue",
        backgroundColor: "blue",
        fill: false,
        yAxisID: "tempHumidityAxis",
        tension: 0.4,
      },
      {
        label: "Nhiệt độ",
        data: [],
        borderColor: "red",
        backgroundColor: "red",
        fill: false,
        yAxisID: "tempHumidityAxis",
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    if (!data || data.length === 0) return; // Kiểm tra nếu không có dữ liệu
    // Lấy thời gian từ API (giả sử thuộc tính là 'timestamp')
    const newLabels = data.map((item) => new Date(item.timestamp).toLocaleTimeString()); // Chuyển đổi thời gian sang định dạng dễ đọc
    const lightData = data.map((item) => item.light);
    const humidityData = data.map((item) => item.humidity);
    const temperatureData = data.map((item) => item.temperature);

    setChartData((prevChartData) => ({
      ...prevChartData,
      labels: newLabels, // Cập nhật labels với giá trị thời gian
      datasets: [
        { ...prevChartData.datasets[0], data: lightData },
        { ...prevChartData.datasets[1], data: humidityData },
        { ...prevChartData.datasets[2], data: temperatureData },
      ],
    }));
  }, [data]);

  const options = {
    responsive: true,
    color: "#ffffff",
    scales: {
      x: {
        reverse: true,
        ticks: {
          color: "#00ff00",
        },
      },
      lightAxis: {
        type: "linear",
        position: "right",
        ticks: {
          beginAtZero: true,
          color: "#ffffff",
        },
        title: {
          display: true,
          text: "Ánh sáng",
          color: "#ffffff",
        },
      },
      tempHumidityAxis: {
        type: "linear",
        position: "left",
        ticks: {
          beginAtZero: true,
          color: "#ffffff",
        },
        title: {
          display: true,
          text: "Nhiệt độ và Độ ẩm",
          color: "#ffffff",
        },
      },
    },
    plugins: {
      filler: {
        propagate: true,
      },
    },
  };

  return (
    <div className="chart" style={{ width: "100%", height: "auto" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
