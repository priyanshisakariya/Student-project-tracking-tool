import { FaBellSlash } from "react-icons/fa";

function EmptyNotification() {
  return (
    <div className="empty-notification">

      <FaBellSlash className="empty-icon" />

      <h2>No Notifications</h2>

      <p>
        You're all caught up!
      </p>

      <span>
        New project updates, viva schedules,
        marks, and announcements will appear here.
      </span>

    </div>
  );
}

export default EmptyNotification;