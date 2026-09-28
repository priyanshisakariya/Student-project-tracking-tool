import { useEffect, useState } from "react";
import "./AdminHome.css";

import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaFileAlt,
  FaHandSparkles,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

import { useNavigate } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    assignedStudents: 0,
    mentorAssignments: 0,
    reports: 0,
  });

  const [projectStatusData, setProjectStatusData] = useState([
    { name: "Completed", value: 0 },
    { name: "In Progress", value: 0 },
    { name: "Pending", value: 0 },
  ]);

  const [mentorData, setMentorData] = useState([]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:8081/api/admin/dashboard-stats");
      if (!response.ok) {
        throw new Error("Failed to fetch admin stats");
      }
      const data = await response.json();

      setStats({
        assignedStudents: data.assignedStudents ?? data.totalStudents ?? 0,
        mentorAssignments: data.mentorAssignments ?? data.totalProjects ?? 0,
        reports: data.reports ?? data.totalProjects ?? 0,
      });

      if (data.projectStatusData && data.projectStatusData.length > 0) {
        setProjectStatusData(data.projectStatusData);
      }

      if (data.mentorData) {
        setMentorData(data.mentorData);
      }

      if (data.reportData) {
        setReportData(data.reportData);
      }
    } catch (err) {
      console.error("ADMIN HOME DASHBOARD ERROR:", err);
      setError("Unable to connect to backend stats API.");
    } finally {
      setLoading(false);
    }
  };

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
  ];

  return (
    <div className="admin-home">

      {/* =========================
          WELCOME SECTION
      ========================== */}
      <div className="welcome-section">
        <div className="welcome-content">

          <h1 className="dashboard-title">
            Welcome Admin
            <FaHandSparkles className="welcome-icon" />
          </h1>

          <p className="dashboard-subtitle">
            Manage students, mentors, projects and reports
            from your dashboard.
          </p>

        </div>
      </div>

      {error && (
        <div style={{ color: "#ef4444", padding: "12px", background: "#fee2e2", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {/* =========================
          STATISTICS CARDS
      ========================== */}
      <div className="dashboard-cards">

        {/* Assigned Students */}
        <div
          className="dashboard-card"
          onClick={() =>
            navigate("/admin-dashboard/assigned-students")
          }
        >
          <div className="card-icon">
            <FaUserGraduate />
          </div>

          <div className="card-content">
            <h2>{loading ? "..." : stats.assignedStudents}</h2>
            <p>Assigned Students</p>
          </div>
        </div>


        {/* Mentor Assignment */}
        <div
          className="dashboard-card"
          onClick={() =>
            navigate("/admin-dashboard/mentor-assignment")
          }
        >
          <div className="card-icon">
            <FaChalkboardTeacher />
          </div>

          <div className="card-content">
            <h2>{loading ? "..." : stats.mentorAssignments}</h2>
            <p>Mentor Assignment</p>
          </div>
        </div>


        {/* Reports */}
        <div
          className="dashboard-card"
          onClick={() =>
            navigate("/admin-dashboard/notifications")
          }
        >
          <div className="card-icon">
            <FaFileAlt />
          </div>

          <div className="card-content">
            <h2>{loading ? "..." : stats.reports}</h2>
            <p>Reports</p>
          </div>
        </div>

      </div>


      {/* =========================
          ALL CHARTS - SIDE BY SIDE
      ========================== */}
      <div className="charts-container">


        {/* =========================
            PROJECT STATUS
        ========================== */}
        <div className="chart-card">

          <div className="chart-header">
            <h2>Project Status</h2>

            <p>
              Current project progress
            </p>
          </div>

          <div className="chart-box">

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  dataKey="value"
                  label
                >

                  {projectStatusData.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          COLORS[index % COLORS.length]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* =========================
            STUDENTS BY MENTOR
        ========================== */}
        <div className="chart-card">

          <div className="chart-header">

            <h2>Students By Mentor</h2>

            <p>
              Number of students assigned
            </p>

          </div>

          <div className="chart-box">

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart
                data={mentorData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="mentor"
                  tick={{ fontSize: 10 }}
                />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="students"
                  name="Students"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* =========================
            MONTHLY REPORTS
        ========================== */}
        <div className="chart-card">

          <div className="chart-header">

            <h2>Monthly Reports</h2>

            <p>
              Reports generated during the year
            </p>

          </div>

          <div className="chart-box">

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <LineChart
                data={reportData}
                margin={{
                  top: 10,
                  right: 15,
                  left: -10,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="month"
                />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="reports"
                  name="Reports"
                  stroke="#2563eb"
                  strokeWidth={3}
                  activeDot={{
                    r: 7,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminHome;