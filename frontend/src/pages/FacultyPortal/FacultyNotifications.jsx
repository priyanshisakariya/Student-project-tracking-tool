import { useEffect, useState } from "react";
import "./FacultyNotifications.css";

function FacultyNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("all");
  const [notificationType, setNotificationType] = useState("GENERAL");

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getFacultyInfo = () => {
    const stored = JSON.parse(localStorage.getItem("faculty")) || JSON.parse(localStorage.getItem("user")) || {};
    return {
      facultyId: stored.facultyId || stored.id || localStorage.getItem("facultyId") || "",
      facultyName: stored.facultyName || stored.name || localStorage.getItem("facultyName") || "Faculty"
    };
  };

  // ==========================================
  // FETCH ASSIGNED STUDENTS & NOTIFICATIONS
  // ==========================================

  const loadData = async () => {
    setLoading(true);
    setError("");

    const { facultyId, facultyName } = getFacultyInfo();

    try {
      // 1. Fetch Assigned Students
      const studentParams = new URLSearchParams();
      if (facultyId) studentParams.append("facultyId", facultyId);
      if (facultyName) studentParams.append("facultyName", facultyName);

      try {
        const studentRes = await fetch(`http://localhost:8081/api/faculty-assigned-students?${studentParams.toString()}`);
        if (studentRes.ok) {
          const studentsData = await studentRes.json();
          if (Array.isArray(studentsData)) {
            setAssignedStudents(studentsData);
          }
        }
      } catch (e) {
        console.warn("Could not fetch assigned students:", e);
      }

      // 2. Fetch Sent Notifications
      const notifParams = new URLSearchParams();
      if (facultyId) notifParams.append("facultyId", facultyId);
      if (facultyName) notifParams.append("facultyName", facultyName);

      const notifRes = await fetch(`http://localhost:8081/api/notifications/faculty?${notifParams.toString()}`);
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setNotifications(Array.isArray(notifData) ? notifData : []);
      }
    } catch (err) {
      console.error("Error loading notification page data:", err);
      setError("Unable to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // SEND NOTIFICATION
  // ==========================================

  const handleSendNotification = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a notification title.");
      return;
    }

    if (!message.trim()) {
      setError("Please enter a notification message.");
      return;
    }

    const { facultyId, facultyName } = getFacultyInfo();

    setSending(true);

    try {
      if (selectedStudentId === "all") {
        // Send broadcast announcement (visible to all students)
        const response = await fetch("http://localhost:8081/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            message: message.trim(),
            type: notificationType,
            studentId: null, // Broadcast to all students
            facultyId: facultyId ? Number(facultyId) : null,
            senderName: facultyName,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to send broadcast notification");
        }

        const newNotification = await response.json();
        setNotifications((prev) => [newNotification, ...prev]);
        setSuccess("Broadcast notification sent successfully to all students!");
      } else {
        // Send to single student
        const response = await fetch("http://localhost:8081/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            message: message.trim(),
            type: notificationType,
            studentId: Number(selectedStudentId),
            facultyId: facultyId ? Number(facultyId) : null,
            senderName: facultyName,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to send notification");
        }

        const newNotification = await response.json();
        setNotifications((prev) => [newNotification, ...prev]);
        setSuccess("Notification sent successfully!");
      }

      // Clear form
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error("Error sending notification:", err);
      setError(err.message || "Unable to send notification. Please try again.");
    } finally {
      setSending(false);
    }
  };

  // Helper to get student name for sent notification
  const getStudentLabel = (studentId) => {
    if (!studentId) return "All Students";
    const st = assignedStudents.find((s) => s.id === studentId);
    return st ? `${st.name} (${st.enrollment || st.department})` : `Student #${studentId}`;
  };

  return (
    <div className="notification-page">
      {/* ======================================
          HEADER
      ====================================== */}
      <div className="notification-header">
        <h1>Faculty Notifications</h1>
        <p>
          Send announcements, viva schedules, and feedback directly to your assigned students.
        </p>
      </div>

      {/* ======================================
          CREATE / SEND NOTIFICATION
      ====================================== */}
      <div className="create-notification-card" style={{ background: "white", padding: "25px", borderRadius: "14px", boxShadow: "0 5px 18px rgba(0,0,0,.08)", marginBottom: "30px" }}>
        <h2 style={{ fontSize: "20px", color: "#1e293b", marginBottom: "8px" }}>Send Notification</h2>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
          Share important information such as viva dates, submission deadlines, schedule changes, and remarks.
        </p>

        {success && (
          <div style={{ padding: "12px 16px", background: "#dcfce7", color: "#166534", borderRadius: "8px", marginBottom: "15px", fontWeight: "500", fontSize: "14px" }}>
            ✓ {success}
          </div>
        )}

        {error && (
          <div style={{ padding: "12px 16px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "15px", fontWeight: "500", fontSize: "14px" }}>
            ✕ {error}
          </div>
        )}

        <form onSubmit={handleSendNotification}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "15px", marginBottom: "15px" }}>
            {/* Recipient Student */}
            <div>
              <label htmlFor="target-student" style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#334155", fontSize: "14px" }}>
                Target Student
              </label>
              <select
                id="target-student"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
              >
                <option value="all">📢 All Students (Broadcast Announcement)</option>
                {assignedStudents.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.enrollment || st.department})
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Type */}
            <div>
              <label htmlFor="notification-type" style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#334155", fontSize: "14px" }}>
                Category / Type
              </label>
              <select
                id="notification-type"
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
              >
                <option value="GENERAL">General Notice</option>
                <option value="VIVA">Viva / Presentation</option>
                <option value="SUBMISSION">Submission Reminder</option>
                <option value="DEADLINE">Deadline Alert</option>
                <option value="MEETING">Project Meeting</option>
                <option value="FEEDBACK">Review Feedback</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="notification-title" style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#334155", fontSize: "14px" }}>
              Notification Title
            </label>
            <input
              id="notification-title"
              type="text"
              placeholder="e.g. Viva Schedule & Presentation Guidelines"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="notification-message" style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#334155", fontSize: "14px" }}>
              Message Content
            </label>
            <textarea
              id="notification-message"
              placeholder="Enter message details, timings, classroom/lab numbers, or specific review remarks..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px", fontFamily: "inherit" }}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={sending}
            style={{
              padding: "12px 24px",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: sending ? "not-allowed" : "pointer",
              opacity: sending ? 0.7 : 1,
              transition: "background 0.2s"
            }}
          >
            {sending ? "Sending Notification..." : "✉ Send Notification"}
          </button>
        </form>
      </div>

      {/* ======================================
          SENT NOTIFICATIONS HISTORY
      ====================================== */}
      <div className="sent-notifications-section">
        <div style={{ marginBottom: "15px" }}>
          <h2 style={{ fontSize: "20px", color: "#1e293b", margin: "0 0 4px 0" }}>Sent Notifications History</h2>
          <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>
            Notifications sent to your assigned students.
          </p>
        </div>

        {loading && (
          <p style={{ color: "#64748b", fontStyle: "italic", padding: "15px 0" }}>
            Loading notification history...
          </p>
        )}

        {!loading && notifications.length === 0 && (
          <div style={{ background: "white", padding: "30px", textAlign: "center", borderRadius: "12px", color: "#64748b" }}>
            No notifications sent yet. Use the form above to send an announcement.
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {notifications.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  padding: "18px 22px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  borderLeft: "4px solid #2563eb"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#1e293b" }}>{item.title}</h3>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", background: "#e0e7ff", color: "#3730a3", padding: "2px 8px", borderRadius: "12px", fontWeight: "600" }}>
                        {item.type || "GENERAL"}
                      </span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        To: <strong>{getStudentLabel(item.studentId)}</strong>
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: "12px", color: "#94a3b8" }}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : item.date || ""}
                  </div>
                </div>

                <p style={{ margin: "8px 0 0 0", color: "#334155", fontSize: "14px", lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyNotifications;