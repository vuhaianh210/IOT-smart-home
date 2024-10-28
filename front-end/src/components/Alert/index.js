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
    // Thiết lập kết nối WebSocket
    const socket = new WebSocket('ws://localhost:8080'); // Thay đổi URL nếu cần

    socket.addEventListener('open', () => {
      console.log('Kết nối đến WebSocket server');
    });

    // Lắng nghe các thông điệp từ WebSocket
    socket.addEventListener('message', (event) => {
      const alertData = JSON.parse(event.data);
      console.log(alertData)
      if (alertData.sensor === "light") {
        setAlerts((prevAlerts) => [...prevAlerts, { sensor: 'Light', value: alertData.value }]);
        setAlertCount((prevCounts) => ({
          ...prevCounts,
          light: prevCounts.light + 1,
        }));
      }

      if (alertData.sensor === "temperature") {
        setAlerts((prevAlerts) => [...prevAlerts, { sensor: 'Temperature', value: alertData.value }]);
        setAlertCount((prevCounts) => ({
          ...prevCounts,
          light: prevCounts.temperature + 1,
        }));
      }

      if (alertData.sensor === "humidity") {
        setAlerts((prevAlerts) => [...prevAlerts, { sensor: 'Humidity', value: alertData.value }]);
        setAlertCount((prevCounts) => ({
          ...prevCounts,
          light: prevCounts.humidity + 1,
        }));
      }

      // Kiểm tra nếu là thông báo "ok"
      if ((alertData.sensor === "light") && (alertData.value === "ok")) {
        setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.sensor !== 'Light'));
      }
      if ((alertData.sensor === "temperature") && (alertData.value === "ok")) {
        setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.sensor !== 'Temperature'));
      }
      if ((alertData.sensor === "humidity") && (alertData.value === "ok")) {
        setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.sensor !== 'Humidity'));
      }
    });

    // Đóng kết nối WebSocket khi component unmount
    return () => {
      socket.close();
    };
  }, []);
  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sensors/alerts?temperature=30&humidity=50&light=500');
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
