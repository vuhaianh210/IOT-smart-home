import React, { useEffect, useState } from 'react';
import './Alert.css';

function Alert() {
  const [isBlinking, setIsBlinking] = useState(false); // Trạng thái nhấp nháy của icon

  useEffect(() => {
    // Kết nối WebSocket
    const socket = new WebSocket('ws://localhost:8080'); 

    socket.addEventListener('open', () => {
      console.log('Kết nối đến WebSocket server');
    });

    // Lắng nghe các thông điệp từ WebSocket
    socket.addEventListener('message', (event) => {
      const alertData = JSON.parse(event.data);

      // Kiểm tra cảnh báo "wind" để bật/tắt nhấp nháy
      if (alertData.sensor === "wind" && parseFloat(alertData.value) > 60) {
        setIsBlinking(true);
      } else if (alertData.sensor === "wind" && alertData.value === "ok") {
        setIsBlinking(false);
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div  className="alert">
      <div className={`icon-alert ${isBlinking ? 'blinking' : ''}`}>
        ⚠️ {/* Icon cảnh báo luôn hiển thị */}
      </div>
    </div>
  );
}

export default Alert;
