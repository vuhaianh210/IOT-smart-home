import { useState } from "react";
import "./Control.css";
import { FaFan } from "react-icons/fa";
import { TbAirConditioningDisabled } from "react-icons/tb";
import { WiWindy } from "react-icons/wi";
import { FaLightbulb } from "react-icons/fa6";

function Control() {
  const [statusFan, setStatusFan] = useState(false);

  const handleStatusFan = () => {
    setStatusFan(!statusFan);
  };

  const [statusAC, setStatusAC] = useState(false);

  const handleStatusAC = () => {
    setStatusAC(!statusAC);
  };

  const [statusLight, setStatusLight] = useState(false);

  const handleStatusLight = () => {
    setStatusLight(!statusLight);
  };

  return (
    <>
      <div className="control">
        <div className="device">
          <div className="icon">
            <FaFan className={statusFan ? "fan fan-on" : "fan"} />
          </div>
          <div className="button">
            <button
              onClick={handleStatusFan}
              className={statusFan ? "on" : "off"}
            >
              {statusFan ? "Tắt" : "Bật"}
            </button>
          </div>
        </div>
        <div className="device">
          <div className="icon">
            <TbAirConditioningDisabled
              className={statusAC ? "AC AC-on" : "AC"}
            />
            <div className="down">
              {statusAC && <WiWindy className="blowing-1" />}
              {statusAC && <WiWindy className="blowing-2" />}
            </div>
          </div>
          <div className="button">
            <button
              onClick={handleStatusAC}
              className={statusAC ? "on" : "off"}
            >
              {statusAC ? "Tắt" : "Bật"}
            </button>
          </div>
        </div>
        <div className="device">
          <div className="icon">
            <FaLightbulb className={statusLight ? "light light-on" : "light"} />
          </div>
          <div className="button">
            <button
              onClick={handleStatusLight}
              className={statusLight ? "on" : "off"}
            >
              {statusLight ? "Tắt" : "Bật"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Control;
