const mqtt = require("mqtt");
const sql = require("./dbConfig");
const WebSocket = require('ws');

const client = mqtt.connect("mqtt://172.20.10.11:6888", {
  username: "HA",
  password: "12345678",
});

const wss = new WebSocket.Server({ port: 8080 });

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe("datasensor", (err) => {
    if (!err) {
      console.log("Subscribed to datasensor");
    } else {
      console.error("Subscription error:", err);
    }
  });
  client.subscribe("response/Fan", (err) => {
    if (!err) {
      console.log("Subscribed to response/Fan");
    } else {
      console.error("Subscription error:", err);
    }
  });
  client.subscribe("response/Air-conditioner", (err) => {
    if (!err) {
      console.log("Subscribed to response/Air-conditioner");
    } else {
      console.error("Subscription error:", err);
    }
  });
  client.subscribe("response/Light", (err) => {
    if (!err) {
      console.log("Subscribed to response/Light");
    } else {
      console.error("Subscription error:", err);
    }
  });
  client.subscribe("sensor/alert", (err) => {
    if (!err) {
      console.log("Subscribed to sensor/alert");
    } else {
      console.error("Subscription error:", err);
    }
  });
});
// Lắng nghe dữ liệu từ MQTT topic 'datasensor'
client.on("message", async (topic, message) => {
  if (topic === "datasensor") {
    try {
      // Chuyển đổi dữ liệu từ JSON
      const { temperature, humidity, light } = JSON.parse(message.toString());
      // Lưu dữ liệu vào database
      const request = new sql.Request();
      await request.query(`
        INSERT INTO datasensor (temperature, humidity, light, timestamp)
        VALUES (${temperature}, ${humidity}, ${light}, SWITCHOFFSET(GETDATE(), '+07:00'))
      `);
      console.log("Data inserted into database:", {
        temperature,
        humidity,
        light,
      });
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  }
  if (topic === "sensor/alert") {
    const alertData = JSON.parse(message.toString());
    // Gửi dữ liệu cảnh báo tới tất cả các client WebSocket
    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(alertData));
      }
    });
  }
});

module.exports = client;
