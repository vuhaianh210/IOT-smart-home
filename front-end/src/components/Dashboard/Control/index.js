import { useState } from "react";
import "./Control.css";
import { FaFan } from "react-icons/fa";
import { TbAirConditioningDisabled } from "react-icons/tb";
import { WiWindy } from "react-icons/wi";
import { FaLightbulb } from "react-icons/fa6";
import axios from "axios";

function Control() {
  const [statusFan, setStatusFan] = useState(false);
  const [loadingFan, setLoadingFan] = useState(false);
  const [statusAC, setStatusAC] = useState(false);
  const [loadingAC, setLoadingAC] = useState(false); // Thêm trạng thái loading cho AC
  const [statusLight, setStatusLight] = useState(false);
  const [loadingLight, setLoadingLight] = useState(false); // Thêm trạng thái loading cho Light

  const sendControlCommand = async (device, action, setStatus, setLoading) => {
    setLoading(true); // Hiển thị trạng thái chờ khi gửi lệnh
    try {
      const response = await axios.post("http://localhost:5000/api/devices/control", { device, action });
      if (response.status === 200) {
        const responseData = response.data;
        if (responseData.device === device) {
          setStatus(responseData.status === "On"); // Cập nhật trạng thái dựa trên phản hồi
        }
      }
    } catch (error) {
      console.error("Error sending control command:", error);
    } finally {
      setLoading(false); // Tắt trạng thái loading sau khi nhận phản hồi
    }
  };
  

  const handleStatusFan = () => {
    const action = statusFan ? "Off" : "On"; // Nếu đang bật thì gửi lệnh tắt và ngược lại
    sendControlCommand("Fan", action, setStatusFan, setLoadingFan);
  };

  const handleStatusAC = () => {
    const action = statusAC ? "Off" : "On";
    sendControlCommand("Air-conditioner", action, setStatusAC, setLoadingAC);
  };

  const handleStatusLight = () => {
    const action = statusLight ? "Off" : "On";
    sendControlCommand("Light", action, setStatusLight, setLoadingLight);
  };

  return (
    <>
      <div className="control">
        <div className="device">
          <div className="icon">
            <FaFan className={statusFan ? "fan fan-on" : "fan"} />
          </div>
          <div className="button">
            <button onClick={handleStatusFan} className={statusFan ? "on" : "off"} disabled={loadingFan}>
              {loadingFan ? "Đang điều khiển..." : statusFan ? "Tắt" : "Bật"}
              {/* Nếu đang bật thì hiện nút tắt và ngược lại */}
            </button>
          </div>
        </div>

        <div className="device">
          <div className="icon">
            <TbAirConditioningDisabled className={statusAC ? "AC AC-on" : "AC"} />
            <div className="down">
              {statusAC && <WiWindy className="blowing-1" />}
              {statusAC && <WiWindy className="blowing-2" />}
            </div>
          </div>
          <div className="button">
            <button onClick={handleStatusAC} className={statusAC ? "on" : "off"} disabled={loadingAC}>
              {loadingAC ? "Đang điều khiển..." : statusAC ? "Tắt" : "Bật"}
            </button>
          </div>
        </div>

        <div className="device">
          <div className="icon">
            <FaLightbulb className={statusLight ? "light light-on" : "light"} />
          </div>
          <div className="button">
            <button onClick={handleStatusLight} className={statusLight ? "on" : "off"} disabled={loadingLight}>
              {loadingLight ? "Đang điều khiển..." : statusLight ? "Tắt" : "Bật"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Control;
