import { useEffect, useState } from "react";
import axios from "axios";
import "./FacultyDashboard.css";

const API_URL = "http://localhost:8081";

function FacultyDashboard() {
  const [faculty, setFaculty] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    assignedStudents: 0,
    pendingProposals: 0,
    weeklyReviews: 0,
    notifications: 0,
  });

  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  const [notices, setNotices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const storedFaculty = JSON.parse(localStorage.getItem("faculty")) || {};
      const facultyId = storedFaculty.facultyId || storedFaculty.id || localStorage.getItem("facultyId");
      const facultyName = storedFaculty.facultyName || storedFaculty.name || "";

      setFaculty({ name: facultyName || "Faculty", ...storedFaculty });

      const response = await axios.get(
        `${API_URL}/api/faculty/dashboard`,
        {
          params: {
            facultyId: facultyId || undefined,
            name: facultyName || undefined,
          },
        }
      );

      const data = response.data || {};

      setDashboardData({
        assignedStudents: data.assignedStudentsCount || 0,
        pendingProposals: data.pendingProposalsCount || 0,
        weeklyReviews: data.weeklyReviewsCount || 0,
        notifications: data.notificationsCount || 0,
      });

      setStudents(data.students || []);
      setActivities(data.activities || []);
      setNotices(data.notices || []);
      if (data.facultyName) {
        setFaculty((prev) => ({ ...prev, name: data.facultyName }));
      }

    } catch (err) {
      console.error("FACULTY DASHBOARD ERROR:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Assigned Students",
      value: dashboardData.assignedStudents,
      icon: "👨‍🎓",
      color: "#2F80ED",
    },
    {
      title: "Pending Proposals",
      value: dashboardData.pendingProposals,
      icon: "📄",
      color: "#F2994A",
    },
    {
      title: "Weekly Reviews",
      value: dashboardData.weeklyReviews,
      icon: "📅",
      color: "#27AE60",
    },
    {
      title: "Notifications",
      value: dashboardData.notifications,
      icon: "🔔",
      color: "#EB5757",
    },
  ];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}

      <div className="dashboard-header">
        <h1>
          Good Morning,{" "}
          {faculty?.name ||
            faculty?.fullName ||
            "Faculty"}{" "}
          👋
        </h1>

        <p>
          View summary of assigned students and pending work.
        </p>
      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {/* ================= CARDS ================= */}

      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            className="card"
            key={index}
            style={{
              borderTop: `5px solid ${card.color}`,
            }}
          >
            <div className="icon">
              {card.icon}
            </div>

            <h2>{card.value}</h2>

            <p>{card.title}</p>
          </div>
        ))}
      </div>

      {/* ================= STUDENTS + ACTIVITIES ================= */}

      <div className="dashboard-content">

        {/* Student Progress */}

        <div className="progress-box">
          <h2>Student Progress</h2>

          {students.length === 0 ? (
            <p className="empty-message">
              No students assigned yet.
            </p>
          ) : (
            students.map((student) => (
              <div
                key={student.id}
                className="student-progress"
              >
                <div className="student-name">
                  {student.name}
                </div>

                <div className="progress">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(
                        Math.max(student.progress, 0),
                        100
                      )}%`,
                    }}
                  >
                    {student.progress}%
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Activities */}

        <div className="activity-box">
          <h2>Recent Activities</h2>

          {activities.length === 0 ? (
            <p className="empty-message">
              No recent activities.
            </p>
          ) : (
            <ul>
              {activities.map((activity) => (
                <li key={activity.id}>
                  {activity.icon} {activity.text}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* ================= DEADLINES + NOTICES ================= */}

      <div className="dashboard-content">

        {/* Upcoming Deadlines */}

        <div className="deadline-box">
          <h2>Upcoming Deadlines</h2>

          {deadlines.length === 0 ? (
            <p className="empty-message">
              No upcoming deadlines.
            </p>
          ) : (
            <ul>
              {deadlines.map((deadline) => (
                <li key={deadline.id}>
                  📅 {deadline.title} -{" "}
                  {deadline.date}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Faculty Notices */}

        <div className="announcement-box">
          <h2>Faculty Notices</h2>

          {notices.length === 0 ? (
            <p className="empty-message">
              No new notices.
            </p>
          ) : (
            <ul>
              {notices.map((notice) => (
                <li key={notice.id}>
                  📢 {notice.message}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

    </div>
  );
}

export default FacultyDashboard;