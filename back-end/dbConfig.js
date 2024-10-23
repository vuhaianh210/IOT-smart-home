const sql = require("mssql");

const config = {
  user: "sa",
  password: "12345678",
  server: "localhost",
  database: "IOT",
  options: {
    encrypt: true, // Sử dụng nếu kết nối đến Azure
    trustServerCertificate: true, // Bỏ qua nếu bạn tự quản lý SQL Server
  },
};

sql
  .connect(config)
  .then(() => {
    console.log("Connected to SQL Server");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

module.exports = sql;
