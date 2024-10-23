import React, { useState, useEffect } from "react";
import "./ActionHistory.css";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";
import axios from "axios";

const ActionHistory = () => {
  const [data, setData] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [device, setDevice] = useState("");
  const [action, setAction] = useState("");
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
      console.log("Start Time ISO 8601:", startISO);
      console.log("End Time ISO 8601:", endISO);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/devices/history`,
          {
            params: {
              page: currentPage,
              limit,
              startTime: startISO,
              endTime: endISO,
              device,
              action,
              sortColumn,
              sortDirection: sortDirection.toUpperCase(),
            },
          }
        );
        console.log("Response data:", response.data);
        setData(response.data.results);
        setFilteredData(response.data.results);
        setTotalPages(Math.ceil(response.data.total / limit));
      } catch (error) {
        console.error("Error API:", error);
      }
    };

    fetchData();
  }, [
    currentPage,
    startTime,
    endTime,
    device,
    action,
    sortColumn,
    sortDirection,
  ]);

  // Hàm lọc dữ liệu theo khoảng thời gian
  const handleSearch = () => {
    setCurrentPage(1); // Đặt lại trang về 1 khi tìm kiếm
  };

  // Hàm sắp xếp
  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  // Hàm xử lý nút phân trang
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
      // Hiển thị dấu ba chấm trước nếu trang hiện tại > 4
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
    <div className="action-history-container">
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
          Device:
          <select value={device} onChange={(e) => setDevice(e.target.value)}>
            <option value="">-- Select a Device --</option>
            <option value="Fan">Fan</option>
            <option value="Air-conditioner">Air-conditioner</option>
            <option value="Light">Light</option>
          </select>
        </label>
        <label>
          Action:
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="">-- Select an Action --</option>
            <option value="On">On</option>
            <option value="Off">Off</option>
          </select>
        </label>
        <div className="button-container">
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      <table className="action-history">
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
              Device
              <span className="button-sort">
                <span
                  onClick={() => handleSort("device", "asc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleUp />
                </span>
                <span
                  onClick={() => handleSort("device", "desc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleDown />
                </span>
              </span>
            </th>
            <th>
              Action
              <span className="button-sort">
                <span
                  onClick={() => handleSort("action", "asc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleUp />
                </span>
                <span
                  onClick={() => handleSort("action", "desc")}
                  style={{ cursor: "pointer" }}
                >
                  <GoTriangleDown />
                </span>
              </span>
            </th>
            <th className="top-right">
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
            filteredData.map((item, index) => {
              const isLastRow = index === filteredData.length - 1;
              return (
                <tr key={item.id}>
                  <td className={isLastRow ? "bot-left" : ""}>{item.id}</td>
                  <td>{item.device}</td>
                  <td>{item.action}</td>
                  <td className={isLastRow ? "bot-right" : ""}>{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Nút phân trang */}
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

export default ActionHistory;
