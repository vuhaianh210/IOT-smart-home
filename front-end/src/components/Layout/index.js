import { NavLink, Outlet } from "react-router-dom";
import "./Layout.css";
import Alert from "../Alert";
function Layout() {
  const navLinkActive = (e) => {
    return e.isActive ? "actived" : "";
  };
  return (
    <>
      <div className="layout">
        <div className="menu-container">
        <div className="menu">
          <ul>
            <li>
              <NavLink to="/" className={navLinkActive}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/data-sensor" className={navLinkActive}>
                DataSensor
              </NavLink>
            </li>
            <li>
              <NavLink to="/action-history" className={navLinkActive}>
                ActionHistory
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={navLinkActive}>
                Profile
              </NavLink>
            </li>
          </ul>
        </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
        <Alert />
      </div>
    </>
  );
}

export default Layout;
