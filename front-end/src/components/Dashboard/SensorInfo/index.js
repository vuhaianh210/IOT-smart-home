import "./SensorInfo.css";
import { FaTemperatureHalf } from "react-icons/fa6";
import { IoIosWater } from "react-icons/io";
import { FaSun } from "react-icons/fa";
import { useSensorData } from "../../UseSensorData";
import CalculateColor from "../../CalculateColor";

function SensorInfo() {
  const sensorData = useSensorData();
  return (
    <>
      <div className="sensor-info">
        <div
          className="sensor-1"
          style={{
            color: CalculateColor(sensorData.temperature, 0, 50, "temperature"),
          }}
        >
          <FaTemperatureHalf />
          {sensorData.temperature}C
        </div>
        <div
          className="sensor-2"
          style={{
            color: CalculateColor(sensorData.humidity, 0, 100, "humidity"),
          }}
        >
          <IoIosWater />
          {sensorData.humidity}%
        </div>
        <div
          className="sensor-3"
          style={{ color: CalculateColor(sensorData.light, 0, 100, "light") }}
        >
          <FaSun />
          {sensorData.light} lux
        </div>
      </div>
    </>
  );
}

export default SensorInfo;
