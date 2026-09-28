import "./AdminTopbar.css";

import {
  FaBars,
  FaUserShield,
} from "react-icons/fa";

function AdminTopbar({ sidebarOpen, setSidebarOpen }) {
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
          Admin Portal
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
              Admin
            </h4>

            <p>
              Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default AdminTopbar;