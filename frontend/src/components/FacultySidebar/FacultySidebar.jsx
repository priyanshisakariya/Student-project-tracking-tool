import { NavLink } from "react-router-dom";
import "./FacultySidebar.css";

import {
  FaUniversity,
  FaHome,
  FaUsers,
  FaFileAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaAward,
  FaChartBar,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";

function FacultySidebar({ sidebarOpen }) {
  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "close"}`}>

      {/* Logo / Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <FaUniversity className="project-logo-icon" />
          <span className="sidebar-title">CampusProject</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">

        <NavLink to="/faculty-portal" end className={({ isActive }) => (isActive ? "active" : "")}>
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/faculty-portal/assigned-students" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaUsers />
          <span>Assigned Students</span>
        </NavLink>

        <NavLink to="/faculty-portal/review" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaFileAlt />
          <span>Review Proposal</span>
        </NavLink>

        <NavLink to="/faculty-portal/weekly-review" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaCalendarAlt />
          <span>Weekly Review</span>
        </NavLink>

        <NavLink to="/faculty-portal/final-submissions" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaCheckCircle />
          <span>Final Submissions</span>
        </NavLink>

        <NavLink to="/faculty-portal/mark-management" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaAward />
          <span>Mark Management</span>
        </NavLink>

        <NavLink to="/faculty-portal/generate-marksheet" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaChartBar />
          <span>Generate Marksheet</span>
        </NavLink>

        <NavLink to="/faculty-portal/notifications" className={({ isActive }) => (isActive ? "active" : "")}>
          <FaBell />
          <span>Notifications</span>
        </NavLink>

      </nav>

      {/* Logout */}
      <div className="logout-area">
        <NavLink to="/">
          <FaSignOutAlt />
          <span>Logout</span>
        </NavLink>
      </div>

    </aside>
  );
}

export default FacultySidebar;
