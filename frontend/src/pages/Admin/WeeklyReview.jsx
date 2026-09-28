import "./WeeklyReview.css";
import {
  FaSearch,
  FaEye,
  FaClipboardCheck,
  FaClock,
  FaUsers,
  FaTasks,
} from "react-icons/fa";

const reviews = [
  {
    id: 1,
    projectId: "PRJ001",
    title: "AI Attendance System",
    team: "Team Alpha",
    guide: "Dr. Amit Patel",
    department: "Computer Engineering",
    week: "Week 6",
    progress: 75,
    status: "Reviewed",
    lastReview: "15 Aug 2026",
  },
  {
    id: 2,
    projectId: "PRJ002",
    title: "Smart Parking System",
    team: "Team Beta",
    guide: "Dr. Neha Shah",
    department: "IT",
    week: "Week 6",
    progress: 60,
    status: "Pending",
    lastReview: "12 Aug 2026",
  },
  {
    id: 3,
    projectId: "PRJ003",
    title: "Online Examination",
    team: "Team Gamma",
    guide: "Dr. Raj Mehta",
    department: "Computer Engineering",
    week: "Week 6",
    progress: 90,
    status: "Approved",
    lastReview: "16 Aug 2026",
  },
];

function WeeklyReview() {
  return (
    <div className="weekly-review-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Weekly Reviews</h2>
          <p>Track weekly project progress of all teams.</p>
        </div>

        <button className="review-btn">
          + New Review
        </button>
      </div>

      {/* Summary */}
      <div className="summary">

        <div className="summary-card">
          <FaUsers className="summary-icon" />
          <h2>25</h2>
          <p>Total Teams</p>
        </div>

        <div className="summary-card">
          <FaClipboardCheck className="summary-icon green" />
          <h2>18</h2>
          <p>Reviewed</p>
        </div>

        <div className="summary-card">
          <FaClock className="summary-icon orange" />
          <h2>7</h2>
          <p>Pending</p>
        </div>

        <div className="summary-card">
          <FaTasks className="summary-icon blue" />
          <h2>Week 6</h2>
          <p>Current Week</p>
        </div>

      </div>

      {/* Toolbar */}
      <div className="toolbar">

        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search Project..."
          />
        </div>

        <select>
          <option>All Departments</option>
          <option>Computer Engineering</option>
          <option>IT</option>
          <option>CSE</option>
        </select>

        <select>
          <option>All Status</option>
          <option>Reviewed</option>
          <option>Pending</option>
          <option>Approved</option>
        </select>

      </div>

      {/* Table */}
      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Title</th>
              <th>Team</th>
              <th>Guide</th>
              <th>Department</th>
              <th>Week</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Last Review</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {reviews.map((item) => (
              <tr key={item.id}>

                <td>{item.projectId}</td>
                <td>{item.title}</td>
                <td>{item.team}</td>
                <td>{item.guide}</td>
                <td>{item.department}</td>
                <td>{item.week}</td>

                <td>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>

                  <small>{item.progress}%</small>
                </td>

                <td>
                  <span
                    className={`status ${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td>{item.lastReview}</td>

                <td>
                  <button className="view-btn">
                    <FaEye />
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default WeeklyReview;