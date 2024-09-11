import { createContext, useContext, useState, useEffect } from "react";

// Tạo Context
const SensorDataContext = createContext();

// Tạo Provider cho Context
export const SensorDataProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState({
    id: [],
    temperature: [],
    humidity: [],
    light: [],
    timestamp: [],
  });

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/sensor-data");
        const data = await response.json();
        if (JSON.stringify(data) !== JSON.stringify(sensorData)) {
          setSensorData(data);
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
    fetchSensorData();
    const intervalId = setInterval(fetchSensorData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <SensorDataContext.Provider value={sensorData}>
      {children}
    </SensorDataContext.Provider>
  );
};

// Custom hook để sử dụng SensorDataContext
export const useSensorData = () => {
  return useContext(SensorDataContext);
};
