import {
  FaFolderOpen,
  FaUserTie,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

function ProjectDetailsCard({ projectDetails }) {
  return (
    <div className="marks-card">

      <h2 className="card-title">
        <FaFolderOpen className="card-icon" />
        Project Details
      </h2>

      <div className="details-grid">

        <div className="detail-item">
          <span className="detail-label">
            <FaFolderOpen className="detail-icon" />
            Project Title
          </span>

          <span className="detail-value">
            {projectDetails.projectTitle || "Loading..."}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">
            <FaUserTie className="detail-icon" />
            Faculty Guide
          </span>

          <span className="detail-value">
            {projectDetails.guideName || "Not Assigned"}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">
            <FaCalendarAlt className="detail-icon" />
            Submission Date
          </span>

          <span className="detail-value">
            {projectDetails.submissionDate || "Loading..."}
          </span>
        </div>

        <div className="detail-item">
          <span className="detail-label">
            <FaCheckCircle className="detail-icon" />
            Status
          </span>

          <span className="status completed">
            {projectDetails.status || "Submitted"}
          </span>
        </div>

      </div>

    </div>
  );
}

export default ProjectDetailsCard;