import { Link } from "react-router-dom";
import "./AdminSidebar.css";

import {
  FaTachometerAlt,
  FaUserGraduate,
  FaUserTie,
  FaFileAlt,
  FaSignOutAlt,
  FaUniversity,
} from "react-icons/fa";

function AdminSidebar({ sidebarOpen }) {
  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "close"}`}>

      {/* Logo / Project Name */}
      <div className="sidebar-header">

        <div className="sidebar-logo-icon">
          <FaUniversity />
        </div>

        <h2 className="sidebar-title">
          CampusProject
        </h2>

      </div>


      {/* Navigation */}
      <nav className="sidebar-menu">

        {/* Dashboard */}
        <Link to="/admin-dashboard">
          <FaTachometerAlt className="icon" />
          <span>Dashboard</span>
        </Link>


        {/* Student Management */}
        <Link to="/admin-dashboard/assigned-students">
          <FaUserGraduate className="icon" />
          <span>Student Management</span>
        </Link>


        {/* Mentor Assignment */}
        <Link to="/admin-dashboard/mentor-assignment">
          <FaUserTie className="icon" />
          <span>Mentor Assignment</span>
        </Link>


        {/* Report */}
        <Link to="/admin-dashboard/notifications">
          <FaFileAlt className="icon" />
          <span>Report</span>
        </Link>


        {/* Logout */}
        <Link to="/">
          <FaSignOutAlt className="icon" />
          <span>Logout</span>
        </Link>

      </nav>

    </aside>
  );
}

export default AdminSidebar;