import React, { useState, useEffect } from "react";
import Control from "./Control";
import SensorInfo from "./SensorInfo";
import "./Dashboard.css";
import ChartComponent from "./ChartComponent";
import axios from "axios";

function Dashboard() {
  const [sensorData, setSensorData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sensors/data?page=1&limit=10&sortColumn=timestamp&sortDirection=desc');
      const data = response.data;
      console.log(data);
      setSensorData(data.results);  // Lưu dữ liệu vào sensorData
      setLatestData(data.results[0]);  // Lấy dữ liệu cảm biến mới nhất
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData(); 
    const intervalId = setInterval(() => fetchData(), 5000); // Cập nhật dữ liệu mỗi 5 giây
    return () => clearInterval(intervalId); // Cleanup khi component bị hủy
  }, []);

  return (
    <div className="dashboard">
      <SensorInfo data={latestData} />
      <div className="chart-control">
        <ChartComponent data={sensorData} />
        <Control />
      </div>
    </div>
  );
}

export default Dashboard;
