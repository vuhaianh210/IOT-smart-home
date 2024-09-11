import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import ActionHistory from "./components/ActionHistory";
import Profile from "./components/Profile";
import DataSensor from "./components/DataSensor";
import Layout from "./components/Layout";
import { SensorDataProvider } from "./components/UseSensorData";

function App() {
  return (
    <>
      <SensorDataProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/data-sensor" element={<DataSensor />} />
            <Route path="/action-history" element={<ActionHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </SensorDataProvider>
    </>
  );
}

export default App;
