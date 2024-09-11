import { useState } from "react";
import "./DataSensor.css";
import { GoTriangleUp, GoTriangleDown } from "react-icons/go";

const DataSensor = () => {
  // Hàm tạo dữ liệu giả lập cho cảm biến
  const generateFakeData = () => {
    return Array.from({ length: 50 }, (_, index) => ({
      id: index + 1,
      temperature: Math.floor(Math.random() * 35) + 15,
      humidity: Math.floor(Math.random() * 100),
      light: Math.floor(Math.random() * 1000),
      timestamp: new Date(
        Date.now() - Math.floor(Math.random() * 100000000)
      ).toISOString(),
    }));
  };

  const [data] = useState(generateFakeData());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State cho tìm kiếm theo thời gian
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [filteredData, setFilteredData] = useState(data); // State cho dữ liệu đã lọc
  // State cho sắp xếp
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  // Hàm lọc dữ liệu theo khoảng thời gian
  const handleSearch = () => {
    if (!startTime || !endTime) {
      setFilteredData(data); // Hiển thị tất cả dữ liệu nếu không có thời gian lọc
      return;
    }

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    const newFilteredData = data.filter((item) => {
      const itemTime = new Date(item.timestamp).getTime();
      return itemTime >= start && itemTime <= end;
    });

    setFilteredData(newFilteredData); // Cập nhật dữ liệu đã lọc
    setCurrentPage(1); // Đặt lại trang về 1
  };
  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);

    const sortedData = [...filteredData].sort((a, b) => {
      if (column === "timestamp") {
        return direction === "asc"
          ? new Date(a[column]) - new Date(b[column])
          : new Date(b[column]) - new Date(a[column]);
      } else {
        return direction === "asc"
          ? a[column] - b[column]
          : b[column] - a[column];
      }
    });

    setFilteredData(sortedData);
  };

  // Tính toán chỉ số phần tử hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="data-sensors-container">
      {/* Trường nhập cho khoảng thời gian */}
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
        <div className="button-container">
          <button onClick={handleSearch}>Tìm kiếm</button>
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
              Nhiệt độ
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
              Độ ẩm
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
              Ánh sáng
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
            <th className="top-right">
              Thời gian
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
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => {
              const isLastRow = index === currentItems.length - 1;
              return (
                <tr key={item.timestamp}>
                  <td className={isLastRow ? "bot-left" : ""}>{item.id}</td>
                  <td>{item.temperature} °C</td>
                  <td>{item.humidity} %</td>
                  <td>{item.light} lux</td>
                  <td className={isLastRow ? "bot-right" : ""}>
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DataSensor;
