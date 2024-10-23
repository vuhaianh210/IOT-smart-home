import "./SensorInfo.css";
import { FaTemperatureHalf } from "react-icons/fa6";
import { IoIosWater } from "react-icons/io";
import { FaSun } from "react-icons/fa";
import CalculateColor from "../../CalculateColor";

function SensorInfo({ data }) {
  if (!data) {
    return <div>Loading data...</div>; // Hiển thị khi chưa có dữ liệu
  }
  return (
    <>
      <div className="sensor-info">
        <div
          className="sensor-1"
          style={{
            color: CalculateColor(data.temperature, 0, 50, "temperature"),
          }}
        >
          <FaTemperatureHalf />
          {data.temperature}C
        </div>
        <div
          className="sensor-2"
          style={{
            color: CalculateColor(data.humidity, 0, 100, "humidity"),
          }}
        >
          <IoIosWater />
          {data.humidity}%
        </div>
        <div
          className="sensor-3"
          style={{ color: CalculateColor(data.light, 0, 100, "light") }}
        >
          <FaSun />
          {data.light} lux
        </div>
      </div>
    </>
  );
}

export default SensorInfo;
