const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;
app.use(cors());
// Dữ liệu sensor giả lập
let sensorData = {
  id: Math.floor(Math.random()*10),
  temperature: Math.floor(Math.random() * 40) + 10,
  humidity: Math.floor(Math.random() * 80) + 20,
  light: Math.floor(Math.random()*950) + 50,
  timestamp: Date.now(),
};
// Hàm cập nhật dữ liệu sensor mỗi giây
setInterval(() => {
  sensorData = {
    id: Math.floor(Math.random()*10),
    temperature: Math.floor(Math.random() * 40) + 10,
    humidity: Math.floor(Math.random() * 80) + 20,
    light: Math.floor(Math.random()*950) + 50,
    timestamp: Date.now(),
  };
  console.log("Data Sensor", sensorData);
}, 10000);
// Tạo API GET để lấy dữ liệu sensor
app.get("/api/sensor-data", (req, res) => {
  res.json(sensorData);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
