import React, { useEffect, useState } from 'react';
import './Wind.css';

function Wind() {
  const [windValue, setWindValue] = useState(null); // Tạo state để lưu giá trị từ WebSocket

  useEffect(() => {
    // Kết nối WebSocket
    const socket = new WebSocket('ws://localhost:8080'); 

    socket.addEventListener('open', () => {
      console.log('Kết nối đến WebSocket server');
    });

    // Lắng nghe các thông điệp từ WebSocket
    socket.addEventListener('message', (event) => {
      const alertData = JSON.parse(event.data);

      // Cập nhật state nếu sensor là "wind"
      if (alertData.sensor === "wind" && alertData.value !== "ok") {
        setWindValue(alertData.value);
      }
    });

    // Đóng kết nối WebSocket khi component unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className='wind'>
      Wind: {(windValue !== null)? windValue : "Đang tải..."}
    </div>
  );
}

export default Wind;
