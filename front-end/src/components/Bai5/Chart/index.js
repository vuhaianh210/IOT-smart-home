import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

function Chart() {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.addEventListener('message', (event) => {
      const newData = JSON.parse(event.data);

      // Kiểm tra nếu giá trị mới khác "ok" thì mới thêm vào dataPoints
      if (newData.value !== "ok") {
        setDataPoints((prevData) => {
          const updatedData = [...prevData, newData.value];
          // Giữ lại 10 giá trị mới nhất
          return updatedData.slice(-10);
        });
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  // Cấu hình cho biểu đồ
  const chartData = {
    labels: Array.from({ length: dataPoints.length }, (_, i) => i + 1),  // Các nhãn từ 1 đến 10
    datasets: [
      {
        label: 'Giá trị cảm biến',
        data: dataPoints,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>Biểu đồ cảm biến</h2>
      <Line data={chartData} />
    </div>
  );
}

export default Chart;
