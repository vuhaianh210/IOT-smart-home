import Control from "./Control";
import SensorInfo from "./SensorInfo";
import "./Dashboard.css";
import ChartComponent from "./ChartComponent";

function Dashboard() {
  return (
    <>
      <div className="dashboard">
        <SensorInfo />
        <div className="chart-control">
          <ChartComponent />
          <Control />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
