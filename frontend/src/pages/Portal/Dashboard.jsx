import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
} from "recharts";

function Dashboard() {
  const student =
    JSON.parse(localStorage.getItem("student")) ||
    JSON.parse(localStorage.getItem("user")) ||
    {};
  const studentId =
    student.id ||
    student.studentId ||
    student.Id ||
    localStorage.getItem("studentId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [projectCompletion, setProjectCompletion] = useState(0);
  const [proposalStatus, setProposalStatus] = useState("Not Submitted");
  const [finalSubmissionStatus, setFinalSubmissionStatus] = useState("Pending");

  const [weeklyProgressData, setWeeklyProgressData] = useState([
    { week: "W1", submitted: 0, background: 1 },
    { week: "W2", submitted: 0, background: 1 },
    { week: "W3", submitted: 0, background: 1 },
    { week: "W4", submitted: 0, background: 1 },
    { week: "W5", submitted: 0, background: 1 },
    { week: "W6", submitted: 0, background: 1 },
  ]);

  const [submittedReports, setSubmittedReports] = useState(0);
  const totalReports = 6;

  const [projectMarks, setProjectMarks] = useState(0);
  const [facultyNotifications, setFacultyNotifications] = useState([]);

  useEffect(() => {
    if (studentId) {
      fetchStudentDashboard();
    } else {
      setLoading(false);
    }
  }, [studentId]);

  const fetchStudentDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://localhost:8081/student/${studentId}/dashboard`);
      let data = {};
      if (response.ok) {
        data = await response.json();
        setProjectCompletion(data.projectCompletion || 0);
        setProposalStatus(data.proposalStatus || "Not Submitted");
        setFinalSubmissionStatus(data.finalSubmissionStatus || "Pending");
        setSubmittedReports(data.submittedWeeklyReports || 0);
        setProjectMarks(data.projectMarks || 0);

        if (data.weeklyProgressData && data.weeklyProgressData.length > 0) {
          setWeeklyProgressData(data.weeklyProgressData);
        }
      }

      // Fetch dynamic faculty notifications directly (same endpoint as Notifications page)
      try {
        const notifRes = await fetch(`http://localhost:8081/api/notifications/student/${studentId}`);
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          if (Array.isArray(notifData)) {
            setFacultyNotifications(notifData);
          }
        } else if (data.facultyNotifications && data.facultyNotifications.length > 0) {
          setFacultyNotifications(data.facultyNotifications);
        } else if (data.notifications && data.notifications.length > 0) {
          setFacultyNotifications(
            data.notifications.map((msg, idx) => ({
              id: idx,
              title: "Faculty Notice",
              message: msg,
              senderName: "Faculty Guide",
              isRead: true,
              date: "Recent",
            }))
          );
        }
      } catch (nErr) {
        console.warn("Faculty notification fetch warning:", nErr);
        if (data.facultyNotifications && data.facultyNotifications.length > 0) {
          setFacultyNotifications(data.facultyNotifications);
        }
      }
    } catch (err) {
      console.error("STUDENT DASHBOARD ERROR:", err);
      setError("Failed to load live dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const projectStatusData = [
    {
      name: "Completed",
      value: projectCompletion,
      color: "#3B82F6",
    },
    {
      name: "Remaining",
      value: Math.max(0, 100 - projectCompletion),
      color: "#E5E7EB",
    },
  ];

  const weeklyPercentage = Math.round((submittedReports / totalReports) * 100);

  const marksChartData = [
    {
      name: "Obtained",
      value: projectMarks,
      fill: "#F59E0B",
    },
    {
      name: "Remaining",
      value: Math.max(0, 100 - projectMarks),
      fill: "#FEF3C7",
    },
  ];

  return (
    <div className="dashboard">
      {/* ==========================================
          WELCOME
      ========================================== */}

      <div className="dashboard-header">
        <h1>Welcome, {student?.fullName || "Student"} 👋</h1>

        <p className="dashboard-text">
          Track your academic project progress, weekly submissions, and
          performance from one place.
        </p>
      </div>

      {error && (
        <div style={{ color: "#ef4444", padding: "12px", background: "#fee2e2", borderRadius: "8px", marginBottom: "16px" }}>
          {error}
        </div>
      )}

      {/* ==========================================
          ANALYTICS
      ========================================== */}

      <div className="dashboard-analytics">
        {/* ========================================
            PROJECT STATUS
        ======================================== */}

        <div className="analytics-card">
          <div className="analytics-header">
            <div>
              <h2>Project Status</h2>

              <p>Overall project progress</p>
            </div>

            <span className="analytics-icon purple">📊</span>
          </div>

          <div className="project-chart">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="project-chart-center">
              <strong>{projectCompletion}%</strong>

              <span>Completed</span>
            </div>
          </div>

          {/* STATUS DETAILS */}

          <div className="status-list">
            <div className="status-item">
              <span className="status-color blue"></span>

              <span>Proposal</span>

              <strong>{proposalStatus}</strong>
            </div>

            <div className="status-item">
              <span className="status-color purple"></span>

              <span>Weekly Progress</span>

              <strong>{submittedReports} / {totalReports}</strong>
            </div>

            <div className="status-item">
              <span className="status-color green"></span>

              <span>Final Submission</span>

              <strong>{finalSubmissionStatus}</strong>
            </div>
          </div>
        </div>

        {/* ========================================
            WEEKLY PROGRESS
        ======================================== */}

        <div className="analytics-card">
          <div className="analytics-header">
            <div>
              <h2>Weekly Progress</h2>

              <p>Weekly report submissions</p>
            </div>

            <span className="analytics-icon blue-icon">📅</span>
          </div>

          <div className="weekly-chart">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={weeklyProgressData}
                margin={{
                  top: 20,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />

                <XAxis
                  dataKey="week"
                  tick={{
                    fontSize: 11,
                  }}
                />

                <YAxis domain={[0, 1]} ticks={[0, 1]} allowDecimals={false} />

                <Tooltip cursor={false} />

                <Bar
                  dataKey="background"
                  fill="#EDE9FE"
                  radius={[6, 6, 0, 0]}
                  barSize={25}
                />

                <Bar
                  dataKey="submitted"
                  fill="#8B5CF6"
                  radius={[6, 6, 0, 0]}
                  barSize={25}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="weekly-bottom">
            <div>
              <strong>
                {submittedReports} / {totalReports}
              </strong>

              <span>Reports Submitted</span>
            </div>

            <div className="progress-percentage">{weeklyPercentage}%</div>
          </div>
        </div>

        {/* ========================================
            PROJECT MARKS
        ======================================== */}

        <div className="analytics-card marks-card">
          <div className="analytics-header">
            <div>
              <h2>Project Marks</h2>

              <p>Final project evaluation</p>
            </div>

            <span className="analytics-icon orange">⭐</span>
          </div>

          <div className="marks-chart">
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="95%"
                barSize={18}
                data={marksChartData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>

            <div className="marks-center">
              <strong>{projectMarks}</strong>

              <span>/ 100</span>
            </div>
          </div>

          <div className="marks-message">Current Project Score</div>
        </div>
      </div>

      {/* ==========================================
          RECENT NOTIFICATIONS (FACULTY SENT)
      ========================================== */}

      <div className="recent-section">
        <div className="notification-header">
          <div className="notification-header-left">
            <span className="notification-icon">🔔</span>
            <div>
              <h2>Recent Faculty Notifications</h2>
              <p>Updates, reviews, and announcements sent by your faculty guide.</p>
            </div>
          </div>

          <Link to="/student-portal/notification" className="view-all-notifs-btn">
            View All ({facultyNotifications.length})
          </Link>
        </div>

        <div className="dashboard-notifs-list">
          {facultyNotifications.length === 0 ? (
            <div className="dashboard-notif-empty">
              <span className="empty-notif-icon">📭</span>
              <p className="empty-notif-title">No notifications yet</p>
              <p className="empty-notif-desc">
                When your assigned faculty guide sends weekly reviews, viva schedules, or project updates, they will appear here.
              </p>
            </div>
          ) : (
            facultyNotifications.slice(0, 4).map((item, index) => (
              <div
                key={item.id || index}
                className={`dashboard-notif-card ${item.isRead === false ? "unread" : ""}`}
              >
                <div className="dashboard-notif-badge-icon">
                  {item.type === "MARKS"
                    ? "⭐"
                    : item.type === "REVIEW"
                    ? "📝"
                    : item.type === "PROPOSAL"
                    ? "📋"
                    : "📢"}
                </div>
                <div className="dashboard-notif-content">
                  <div className="dashboard-notif-top">
                    <h4 className="dashboard-notif-title">{item.title || "Faculty Announcement"}</h4>
                    <span className="dashboard-notif-sender">
                      From: <strong>{item.senderName || "Faculty Guide"}</strong>
                    </span>
                    {item.isRead === false && (
                      <span className="dashboard-notif-new-tag">NEW</span>
                    )}
                  </div>
                  <p className="dashboard-notif-msg">{item.message}</p>
                  <div className="dashboard-notif-meta">
                    <span className="dashboard-notif-date">
                      📅 {item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent")}
                    </span>
                    {item.type && (
                      <span className="dashboard-notif-type-tag">{item.type}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
