import {
  FaFileAlt,
  FaCalendarAlt,
  FaFolderOpen,
  FaAward,
  FaBullhorn,
  FaGraduationCap,
  FaComments,
  FaClock,
} from "react-icons/fa";

function NotificationCard({
  id,
  type,
  title,
  message,
  time,
  isRead,
  senderName,
  onMarkAsRead,
}) {

  const getIcon = () => {
    const t = (type || "").toLowerCase();

    switch (t) {
      case "proposal":
        return <FaFileAlt className="notification-icon proposal" />;

      case "weekly":
        return <FaCalendarAlt className="notification-icon weekly" />;

      case "submission":
        return <FaFolderOpen className="notification-icon submission" />;

      case "marks":
        return <FaAward className="notification-icon marks" />;

      case "viva":
        return <FaGraduationCap className="notification-icon viva" />;

      case "feedback":
      case "meeting":
        return <FaComments className="notification-icon" style={{ color: "#7c3aed" }} />;

      case "deadline":
        return <FaClock className="notification-icon" style={{ color: "#dc2626" }} />;

      default:
        return <FaBullhorn className="notification-icon announcement" />;
    }
  };

  return (
    <div
      className={`notification-card ${!isRead ? "unread-card" : ""}`}
      onClick={() => onMarkAsRead && onMarkAsRead(id)}
      style={{
        cursor: "pointer",
        position: "relative",
        borderLeft: !isRead ? "4px solid #2563eb" : "1px solid #e5e7eb",
        background: !isRead ? "#f0f7ff" : "#ffffff",
      }}
    >
      <div className="notification-left">
        {getIcon()}
      </div>

      <div className="notification-right">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
          <h3 style={{ margin: 0 }}>
            {title}
            {!isRead && (
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "11px",
                  background: "#2563eb",
                  color: "#fff",
                  padding: "2px 7px",
                  borderRadius: "10px",
                  fontWeight: "600",
                }}
              >
                NEW
              </span>
            )}
          </h3>

          <span style={{ fontSize: "12px", color: "#94a3b8" }}>{time}</span>
        </div>

        {senderName && (
          <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
            From: <strong>{senderName}</strong>
          </div>
        )}

        <p style={{ margin: "4px 0", whiteSpace: "pre-wrap" }}>{message}</p>
      </div>
    </div>
  );
}

export default NotificationCard;