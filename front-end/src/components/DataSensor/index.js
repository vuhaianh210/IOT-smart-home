import React, { useState, useEffect } from "react";
import "./DataSensor.css";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import axios from "axios";

const DataSensor = () => {
  const [data, setData] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [light, setLight] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      const startISO = startTime ? new Date(startTime).toISOString() : "";
      const endISO = endTime ? new Date(endTime).toISOString() : "";
      try {
        const response = await axios.get(
          `http://localhost:5000/api/sensors/data`,
          {
            params: {
              page: currentPage,
              limit,
              startTime: startISO,
              endTime: endISO,
              temperature,
              humidity,
              light,
              sortColumn,
              sortDirection: sortDirection.toUpperCase(),
            },
          }
        );
        setData(response.data.results);
        setFilteredData(response.data.results);
        setTotalPages(Math.ceil(response.data.total / limit));
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchData();
  }, [
    currentPage,
    startTime,
    endTime,
    temperature,
    humidity,
    light,
    sortColumn,
    sortDirection,
  ]);

  const handleSearch = () => {
    setCurrentPage(1); // Đặt lại trang về 1 khi tìm kiếm
  };

  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const renderPagination = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Nếu tổng số trang ít hơn hoặc bằng 5, hiển thị tất cả các trang
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Chỉ hiển thị "Trang đầu" nếu trang hiện tại không phải là trang đầu
      if (currentPage > 2) {
        pages.push("First page");
      }
      // Hiển thị dấu ba chấm trước nếu trang hiện tại > 2
      if (currentPage > 2) {
        pages.push("...");
      }
      // Hiển thị 2 trang trước và sau trang hiện tại
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      // Hiển thị dấu ba chấm sau nếu trang hiện tại < tổng số trang - 3
      if (currentPage < totalPages - 1) {
        pages.push("...");
      }
      // Chỉ hiển thị "Trang cuối" nếu trang hiện tại không phải là trang cuối
      if (currentPage < totalPages - 1) {
        pages.push("Last page");
      }
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page === "..." || page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="data-sensors-container">
      <div className="filter">
        <label>
          Start Time:
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label>
          End Time:
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <label>
          Temperature:
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
        </label>
        <label>
          Humidity:
          <input
            type="number"
            value={humidity}
            onChange={(e) => setHumidity(e.target.value)}
          />
        </label>
        <label>
          Light:
          <input
            type="number"
            value={light}
            onChange={(e) => setLight(e.target.value)}
          />
        </label>
        <div className="button-container">
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      <table className="data-sensors">
        <thead>
          <tr>
            <th className="top-left">
              ID
              <span className="button-sort">
                <span
                  onClick={() => handleSort("id", "asc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleUp />
                </span>
                <span
                  onClick={() => handleSort("id", "desc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleDown />
                </span>
              </span>
            </th>
            <th>
              Temperature
              <span className="button-sort">
                <span
                  onClick={() => handleSort("temperature", "asc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleUp />
                </span>
                <span
                  onClick={() => handleSort("temperature", "desc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleDown />
                </span>
              </span>
            </th>
            <th>
              Humidity
              <span className="button-sort">
                <span
                  onClick={() => handleSort("humidity", "asc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleUp />
                </span>
                <span
                  onClick={() => handleSort("humidity", "desc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleDown />
                </span>
              </span>
            </th>
            <th>
              Light
              <span className="button-sort">
                <span
                  onClick={() => handleSort("light", "asc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleUp />
                </span>
                <span
                  onClick={() => handleSort("light", "desc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleDown />
                </span>
              </span>
            </th>
            <th>
              Time
              <span className="button-sort">
                <span
                  onClick={() => handleSort("timestamp", "asc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleUp />
                </span>
                <span
                  onClick={() => handleSort("timestamp", "desc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleDown />
                </span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.timestamp}>
                <td>{item.id}</td>
                <td>{item.temperature}</td>
                <td>{item.humidity}</td>
                <td>{item.light}</td>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {renderPagination().map((page, index) => (
          <button
            key={index}
            onClick={() => {
              if (page === "First page") {
                handlePageChange(1);
              } else if (page === "Last page") {
                handlePageChange(totalPages);
              } else {
                handlePageChange(page);
              }
            }}
            className={currentPage === page ? "active" : ""}
            disabled={
              (page === "First page" && currentPage === 1) ||
              (page === "Last page" && currentPage === totalPages)
            }
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataSensor;
