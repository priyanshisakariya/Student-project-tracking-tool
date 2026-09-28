import { useState, useEffect } from "react";
import NotificationList from "../../components/Notifications/NotificationList";
import EmptyNotification from "../../components/Notifications/EmptyNotification";
import "./Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStudentId = () => {
    const student = JSON.parse(localStorage.getItem("student")) || JSON.parse(localStorage.getItem("user")) || {};
    return student.id || student.studentId || student.Id || localStorage.getItem("studentId");
  };

  const fetchNotifications = async () => {
    const studentId = getStudentId();
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await fetch(`http://localhost:8081/api/notifications/student/${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching student notifications:", err);
      setError("Unable to load notifications. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    const studentId = getStudentId();
    try {
      await fetch(`http://localhost:8081/api/notifications/${id}/read?studentId=${studentId || ""}`, {
        method: "PUT",
      });
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
    } catch (e) {
      console.error("Failed to mark notification as read:", e);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    const studentId = getStudentId();
    await Promise.all(
      unread.map((n) =>
        fetch(`http://localhost:8081/api/notifications/${n.id}/read?studentId=${studentId || ""}`, {
          method: "PUT",
        })
      )
    );
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <div className="notifications-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Notifications</h1>
          <p className="page-subtitle" style={{ margin: "5px 0 0 0" }}>
            Stay updated with project activities, viva schedules, marks, and department announcements.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchNotifications}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #2563eb",
            background: "#2563eb",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "13px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          🔄 {loading ? "Checking..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          Loading notifications...
        </div>
      ) : notifications.length > 0 ? (
        <NotificationList
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      ) : (
        <EmptyNotification />
      )}
    </div>
  );
}

export default Notifications;