import NotificationCard from "./NotificationCard";

function NotificationList({ notifications = [], onMarkAsRead, onMarkAllAsRead }) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatTime = (isoString, fallbackDate) => {
    if (!isoString) return fallbackDate || "Recently";
    try {
      const d = new Date(isoString);
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } catch {
      return fallbackDate || "Recently";
    }
  };

  return (
    <div>
      {unreadCount > 0 && onMarkAllAsRead && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <span style={{ fontSize: "14px", color: "#64748b" }}>
            You have <strong style={{ color: "#2563eb" }}>{unreadCount}</strong> unread notification{unreadCount > 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={onMarkAllAsRead}
            style={{
              background: "none",
              border: "none",
              color: "#2563eb",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "4px",
            }}
          >
            Mark all as read
          </button>
        </div>
      )}

      {notifications.map((item) => (
        <NotificationCard
          key={item.id}
          id={item.id}
          type={item.type}
          title={item.title}
          message={item.message}
          time={formatTime(item.createdAt, item.date)}
          isRead={item.isRead}
          senderName={item.senderName}
          onMarkAsRead={onMarkAsRead}
        />
      ))}
    </div>
  );
}

export default NotificationList;