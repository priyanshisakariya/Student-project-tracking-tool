import "./Topbar.css";
import logo from "../../assets/logo1.jpeg";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBell, FaBars } from "react-icons/fa";
import { getStoredStudent, getOrRecoverStudent } from "../../utils/studentSession";

function Topbar({ sidebarOpen, setSidebarOpen }) {

  const location = useLocation();
  const navigate = useNavigate();

  const [student, setStudent] = useState(() => {
    return getStoredStudent();
  });

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // If student is not yet loaded, auto-recover from backend/cookies
    if (!student || !student.fullName) {
      getOrRecoverStudent().then((recovered) => {
        if (recovered) {
          setStudent(recovered);
        }
      });
    }

    const params = new URLSearchParams(location.search);

    const googleLogin = params.get("googleLogin");
    const name = params.get("name");
    const email = params.get("email");

    if (googleLogin === "true" && name && email) {

      const googleStudent = {
        fullName: name,
        email: email
      };

      // Save Google student
      localStorage.setItem(
        "student",
        JSON.stringify(googleStudent)
      );

      // Update Topbar immediately
      setStudent(googleStudent);

      // Remove Google parameters from URL
      window.history.replaceState(
        {},
        document.title,
        "/student-portal"
      );
    }

    // Fetch unread notifications
    const studentData = getStoredStudent() || JSON.parse(localStorage.getItem("user") || "{}");
    const studentId = studentData.id || studentData.studentId || localStorage.getItem("studentId");
    if (studentId) {
      fetch(`http://localhost:8081/api/notifications/student/${studentId}/unread-count`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data.unreadCount === "number") {
            setUnreadCount(data.unreadCount);
          }
        })
        .catch(() => {});
    }

  }, [location]);

  return (
    <header className="topbar">

      {/* Left */}
      <div className="top-left">

        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>

        <h2 className="portal-title">
          Student Portal
        </h2>

      </div>

      {/* Right */}
      <div className="user-section">

        <div
          className="notification"
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => navigate("/student-portal/notification")}
          title="Notifications"
        >
          <FaBell />
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "#ef4444",
                color: "#ffffff",
                borderRadius: "10px",
                minWidth: "18px",
                height: "18px",
                fontSize: "11px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
                border: "2px solid #173B63",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>

        <div className="profile">
          <img
            src={logo}
            alt="Profile"
            className="profile-img"
          />
        </div>

        <div className="profile-info">

          <h4>
            {student?.fullName || "Student"}
          </h4>

          <p>Student</p>

        </div>

      </div>

    </header>
  );
}

export default Topbar;