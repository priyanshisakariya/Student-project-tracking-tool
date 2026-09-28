import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

import {
  FaUsers,
  FaChalkboardTeacher,
  FaProjectDiagram,
  FaClock,
  FaUserPlus,
  FaUserTie,
  FaFileAlt,
  FaBell,
} from "react-icons/fa";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalProjects: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:8081/api/admin/dashboard-stats");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error("ADMIN DASHBOARD ERROR:", err);
      setError("Unable to connect to backend stats API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's an overview of your Campus Project Management System.</p>
        </div>
      </div>

      {error && (
        <div style={{ color: "#ef4444", padding: "12px", background: "#fee2e2", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="cards">

        <div className="card">
          <div className="card-icon students">
            <FaUsers />
          </div>
          <div>
            <h2>{loading ? "..." : stats.totalStudents}</h2>
            <p>Total Students</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon faculty">
            <FaChalkboardTeacher />
          </div>
          <div>
            <h2>{loading ? "..." : stats.totalFaculty}</h2>
            <p>Total Faculty</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon project">
            <FaProjectDiagram />
          </div>
          <div>
            <h2>{loading ? "..." : stats.totalProjects}</h2>
            <p>Total Projects</p>
          </div>
        </div>

        <div className="card">
          <div className="card-icon pending">
            <FaClock />
          </div>
          <div>
            <h2>{loading ? "..." : stats.pendingApprovals}</h2>
            <p>Pending Approvals</p>
          </div>
        </div>

      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">

        {/* Quick Actions */}
        <div className="dashboard-box">
          <h2>Quick Actions</h2>

          <div className="quick-actions">

            <button onClick={() => navigate("/admin/assigned-students")}>
              <FaUserPlus /> View/Manage Students
            </button>

            <button onClick={() => navigate("/admin/faculty")}>
              <FaChalkboardTeacher /> Faculty List
            </button>

            <button onClick={() => navigate("/admin/assign-mentor")}>
              <FaUserTie /> Assign Mentor
            </button>

            <button onClick={() => navigate("/admin/student-report")}>
              <FaFileAlt /> View Reports
            </button>

            <button onClick={() => navigate("/admin/notifications")}>
              <FaBell /> Send Notification
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;