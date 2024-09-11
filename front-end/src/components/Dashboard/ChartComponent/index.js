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
import { useSensorData } from "../../UseSensorData";
import "./ChartComponent.css";

// Register the components you need
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

const ChartComponent = () => {
  const sensorData = useSensorData();

  const [labels, setLabels] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Ánh sáng",
        data: [],
        borderColor: "yellow",
        backgroundColor: "yellow",
        fill: false,
        yAxisID: "lightAxis", // Liên kết với trục y cho ánh sáng
        tension: 0.4,
      },
      {
        label: "Độ ẩm",
        data: [],
        borderColor: "blue",
        backgroundColor: "blue",
        fill: false,
        yAxisID: "tempHumidityAxis", // Liên kết với trục y cho nhiệt độ và độ ẩm
        tension: 0.4,
      },
      {
        label: "Nhiệt độ",
        data: [],
        borderColor: "red",
        backgroundColor: "red",
        fill: false,
        yAxisID: "tempHumidityAxis", // Liên kết với trục y cho nhiệt độ và độ ẩm
        tension: 0.4,
      },
    ],
  });
  useEffect(() => {
    const currentTime = new Date();
    const timeLabel = currentTime.toLocaleTimeString();
  
    setLabels((prevLabels) => {
      const updatedLabels = [...prevLabels, timeLabel].slice(-10);
      return updatedLabels;
    });
  
    setChartData((prevChartData) => {
      const updatedLabels = [...labels, timeLabel].slice(-10);
      const updatedDatasets = prevChartData.datasets.map((dataset, index) => {
        const newData = [
          ...dataset.data,
          index === 0
            ? sensorData.light
            : index === 1
            ? sensorData.humidity
            : sensorData.temperature,
        ];
        return { ...dataset, data: newData.slice(-10) };
      });
  
      return {
        ...prevChartData,
        labels: updatedLabels,
        datasets: updatedDatasets,
      };
    });
    
  }, [sensorData]);
  const options = {
    responsive: true,
    color: "#ffffff",
    scales: {
      x: {
        ticks: {
          color: "#00ff00", // Đổi màu nhãn thời gian trục x (màu xanh lá)
        },
      },
      lightAxis: {
        type: "linear",
        position: "right", // Trục ánh sáng ở bên phải
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
        position: "left", // Trục nhiệt độ và độ ẩm ở bên trái
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
