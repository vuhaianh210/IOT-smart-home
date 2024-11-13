import Alert from "./Alert";
import Chart from "./Chart";
import Wind from "./Wind";
import "./Bai5.css";
function Bai5() {
  
  return (
    <div className="bai5">
      <div>
        <Wind />
      </div>
      <div className="chart">
        <Chart />
      </div>
      <div>
        <Alert />
      </div>
    </div>
  );
}

export default Bai5;
