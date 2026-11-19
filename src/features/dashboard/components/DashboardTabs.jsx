import { NavLink } from "react-router";
import "./DashboardTabs.css";

const DashboardTabs = () => {
  return (
    <div className="DashboardTabs_wrap">
      <NavLink
        to="operation"
        className={({ isActive }) => (isActive ? "selected" : "")}
      >
        운영 현황
      </NavLink>

      <NavLink
        to="orders"
        className={({ isActive }) => (isActive ? "selected" : "")}
      >
        주문 관리
      </NavLink>
    </div>
  );
};

export default DashboardTabs;
