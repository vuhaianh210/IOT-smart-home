const express = require("express");
const bodyParser = require("body-parser");
const sql = require("./dbConfig");
const mqttClient = require("./mqttClient");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());

// 1. Điều khiển thiết bị từ backend (MQTT) và lưu vào database
app.post("/api/devices/control", async (req, res) => {
  const { device, action } = req.body;

  try {
    // Gửi lệnh điều khiển qua MQTT
    mqttClient.publish(`control/${device}`, action);

    // Tạo một Promise để lắng nghe phản hồi từ MQTT
    const waitForResponse = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Timeout waiting for device response"));
      }, 30000); // Timeout sau 30 giây
      // Lắng nghe tin nhắn MQTT
      mqttClient.on("message", (topic, message) => {
        console.log("Đã nhận được tin nhắn từ MQTT topic:", topic);
        console.log("Nội dung tin nhắn:", message.toString());
        if (topic === `response/${device}`) {
          try {
            const parsedMessage = JSON.parse(message.toString());
            const { device: responseDevice, status } = parsedMessage;

            // Kiểm tra xem phản hồi có đúng thiết bị và trạng thái hợp lệ không
            if (
              responseDevice === device &&
              (status === "On" || status === "Off")
            ) {
              clearTimeout(timeout); // Xóa timeout khi nhận được phản hồi
              resolve(status); // Trả về trạng thái thiết bị
            }
          } catch (error) {
            console.error("Lỗi phân tích phản hồi:", error);
            reject(new Error("Invalid response format"));
          }
        }
      });
    });
    // Chờ phản hồi từ thiết bị
    const deviceStatus = await waitForResponse;
    // Lưu lịch sử điều khiển vào database nếu nhận được phản hồi
    const request = new sql.Request();
    await request.query(`
      INSERT INTO actionhistory (device, action, timestamp)
      VALUES ('${device}', '${action}', SWITCHOFFSET(GETDATE(), '+07:00'))
    `);
    // Gửi phản hồi thành công về phía client
    return res.status(200).send({ device, status: deviceStatus });
  } catch (error) {
    // Gửi phản hồi lỗi về phía client nếu có vấn đề
    return res.status(500).send({
      error: error.message || "Failed to control device or save to database",
    });
  }
});

// 2.
app.get("/api/sensors/data", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    startTime,
    endTime,
    temperature,
    humidity,
    light,
    sortColumn = "timestamp",
    sortDirection = "DESC",
  } = req.query;
  const offset = (page - 1) * limit;

  try {
    const request = new sql.Request();

    // Tạo các điều kiện lọc nếu có
    const conditions = [];
    if (startTime && endTime)
      conditions.push(`timestamp BETWEEN '${startTime}' AND '${endTime}'`);
    if (temperature) conditions.push(`temperature = ${temperature}`);
    if (humidity) conditions.push(`humidity = ${humidity}`);
    if (light) conditions.push(`light = ${light}`);

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Đảm bảo rằng chỉ các cột hợp lệ mới được sắp xếp
    const validSortColumns = ["timestamp", "temperature", "humidity", "light"];
    const sortColumnSafe = validSortColumns.includes(sortColumn)
      ? sortColumn
      : "timestamp"; // Mặc định là timestamp nếu cột không hợp lệ
    const sortDirectionSafe =
      sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"; // Mặc định là DESC nếu không hợp lệ

    // Truy vấn dữ liệu với các điều kiện lọc, phân trang và sắp xếp
    const result = await request.query(`
      SELECT * FROM datasensor
      ${whereClause}
      ORDER BY ${sortColumnSafe} ${sortDirectionSafe}
      OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
    `);

    // Truy vấn tổng số bản ghi
    const totalResult = await request.query(`
      SELECT COUNT(*) as total FROM datasensor
      ${whereClause}
    `);

    const total = totalResult.recordset[0].total;

    res.status(200).send({
      results: result.recordset,
      total, // Trả về tổng số bản ghi để tính phân trang
    });
  } catch (error) {
    res.status(500).send({ error: "Database error" });
  }
});

// 3.
app.get("/api/devices/history", async (req, res) => {
  const {
    page = 1,
    limit = 10,
    startTime,
    endTime,
    device,
    action,
    sortColumn = "timestamp", // Thêm tham số sortColumn
    sortDirection = "DESC", // Thêm tham số sortDirection
  } = req.query;
  const offset = (page - 1) * limit;

  try {
    const request = new sql.Request();

    // Tạo các điều kiện lọc nếu có
    const conditions = [];
    if (startTime && endTime)
      conditions.push(`timestamp BETWEEN '${startTime}' AND '${endTime}'`);
    if (device) conditions.push(`device = '${device}'`);
    if (action) conditions.push(`action = '${action}'`);

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Đảm bảo rằng chỉ các cột hợp lệ mới được sắp xếp
    const validSortColumns = ["timestamp", "device", "action", "id"];
    const sortColumnSafe = validSortColumns.includes(sortColumn)
      ? sortColumn
      : "timestamp"; // Mặc định là timestamp nếu cột không hợp lệ
    const sortDirectionSafe =
      sortDirection.toUpperCase() === "ASC" ? "ASC" : "DESC"; // Mặc định là DESC nếu không hợp lệ

    // Truy vấn dữ liệu với các điều kiện lọc, phân trang và sắp xếp
    const result = await request.query(`
      SELECT * FROM actionhistory
      ${whereClause}
      ORDER BY ${sortColumnSafe} ${sortDirectionSafe}  -- Sắp xếp theo cột và hướng, với collate cho chuỗi
      OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
    `);

    // Truy vấn tổng số bản ghi
    const totalResult = await request.query(`
      SELECT COUNT(*) as total FROM actionhistory
      ${whereClause}
    `);
    const total = totalResult.recordset[0].total;

    res.status(200).send({
      results: result.recordset,
      total, // Trả về tổng số bản ghi để tính phân trang
    });
  } catch (error) {
    res.status(500).send({ error: "Database error" });
  }
});

// 4.
app.get("/api/sensors/alerts", async (req, res) => {
  const { temperature, humidity, light } = req.query;

  try {
    const request = new sql.Request();

    // Validate thresholds
    if (temperature && isNaN(temperature)) {
      return res.status(400).send({ error: "Invalid temperature threshold" });
    }
    if (humidity && isNaN(humidity)) {
      return res.status(400).send({ error: "Invalid humidity threshold" });
    }
    if (light && isNaN(light)) {
      return res.status(400).send({ error: "Invalid light threshold" });
    }

    let temperatureAlertCount = 0;
    if (temperature) {
      const temperatureResult = await request.input(
        "temperature",
        sql.Float,
        temperature
      ).query(`
          SELECT COUNT(*) AS temperatureAlertCount
          FROM (
              SELECT 
                  temperature,
                  LAG(temperature) OVER (ORDER BY timestamp) AS previous_temperature
              FROM DataSensor
              WHERE timestamp BETWEEN 
                  DATEADD(HOUR, 7, CAST(CAST(GETDATE() AS DATE) AS DATETIME)) 
                  AND DATEADD(HOUR, 7, GETDATE())
          ) AS temperature_changes
          WHERE temperature > @temperature AND previous_temperature <= @temperature;
        `);
      temperatureAlertCount =
        temperatureResult.recordset[0].temperatureAlertCount;
    }

    let humidityAlertCount = 0;
    if (humidity) {
      const humidityResult = await request.input(
        "humidity",
        sql.Float,
        humidity
      ).query(`
          SELECT COUNT(*) AS humidityAlertCount
          FROM (
              SELECT 
                  humidity,
                  LAG(humidity) OVER (ORDER BY timestamp) AS previous_humidity
              FROM DataSensor
              WHERE timestamp BETWEEN 
                  DATEADD(HOUR, 7, CAST(CAST(GETDATE() AS DATE) AS DATETIME)) 
                  AND DATEADD(HOUR, 7, GETDATE())
          ) AS humidity_changes
          WHERE humidity > @humidity AND previous_humidity <= @humidity;
        `);
      humidityAlertCount = humidityResult.recordset[0].humidityAlertCount;
    }

    let lightAlertCount = 0;
    if (light) {
      const lightResult = await request.input("light", sql.Float, light).query(`
        SELECT COUNT(*) AS lightAlertCount
          FROM (
              SELECT 
                  light,
                  LAG(light) OVER (ORDER BY timestamp) AS previous_light
              FROM DataSensor
              WHERE timestamp BETWEEN 
                  DATEADD(HOUR, 7, CAST(CAST(GETDATE() AS DATE) AS DATETIME)) 
                  AND DATEADD(HOUR, 7, GETDATE())
          ) AS light_changes
          WHERE light > @light AND previous_light <= @light;
        `);
      lightAlertCount = lightResult.recordset[0].lightAlertCount;
    }

    res.status(200).send({
      temperatureAlertCount,
      humidityAlertCount,
      lightAlertCount,
    });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).send({ error: "An unexpected error occurred" });
  }
});

// Chạy server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
