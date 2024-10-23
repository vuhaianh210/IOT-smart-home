import React, { useEffect, useState } from 'react';
import './Alert.css';

function Alert() {
  const [alerts, setAlerts] = useState([]); 
  const [alertCount, setAlertCount] = useState({
    temperature: 0,
    humidity: 0,
    light: 0,
  });
  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const response = await fetch('/api/sensors/alerts?temperature=30&humidity=70&light=500');
        const data = await response.json();

        setAlertCount({
          temperature: data.temperatureAlertCount || 0,
          humidity: data.humidityAlertCount || 0,
          light: data.lightAlertCount || 0,
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API", error);
      }
    };
    fetchAlertCount();
  }, []);

  return (
    <div>
      <div className="alert-container">
        {alerts.map((alert, index) => (
          <div key={index} className="alert-box">
            <strong>Cảnh báo vượt ngưỡng!</strong> {alert.sensor}: {alert.value}
          </div>
        ))}
      </div>
      <div className="alert-counter">
        <div>Số lần vượt ngưỡng nhiệt độ trong ngày: {alertCount.temperature}</div>
        <div>Số lần vượt ngưỡng độ ẩm trong ngày: {alertCount.humidity}</div>
        <div>Số lần vượt ngưỡng ánh sáng trong ngày: {alertCount.light}</div>
      </div>
    </div>
  );
}

export default Alert;
