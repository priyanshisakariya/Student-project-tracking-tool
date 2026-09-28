import "./FacultyTopbar.css";
import logo from "../../assets/logo1.jpeg";

import {
  FaBell,
  FaBars,
  FaUserShield
} from "react-icons/fa";

function FacultyTopbar({ sidebarOpen, setSidebarOpen }) {

return (
    <header className="topbar">

      {/* =========================================
          LEFT SECTION
      ========================================= */}

      <div className="top-left">

        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Sidebar"
        >
          <FaBars />
        </button>

        <h2 className="portal-title">
          Faculty Portal
        </h2>

      </div>


      {/* =========================================
          RIGHT SECTION
      ========================================= */}

      <div className="user-section">

        <div className="profile">

          {/* React Admin Icon */}
          <div className="profile-icon">
            <FaUserShield />
          </div>

          <div className="profile-info">

            <h4>
              Faculty
            </h4>

            <p>
              Faculty Member
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default FacultyTopbar;
