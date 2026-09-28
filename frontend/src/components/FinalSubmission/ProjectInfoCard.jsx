import { FaProjectDiagram, FaUserGraduate, FaIdCard, FaBuilding } from "react-icons/fa";

function ProjectInfoCard({ formData }) {
  return (
    <div className="submission-card">
      <h2 className="card-title">
        <FaProjectDiagram className="card-icon" />
        Project Information
      </h2>

      {/* Student Meta Row */}
      {(formData.studentName || formData.enrollmentNo) && (
        <div className="student-meta-summary">
          {formData.studentName && (
            <div className="meta-badge-item">
              <FaUserGraduate className="meta-icon" />
              <span>Student: <strong>{formData.studentName}</strong></span>
            </div>
          )}
          {formData.enrollmentNo && (
            <div className="meta-badge-item">
              <FaIdCard className="meta-icon" />
              <span>Enrollment: <strong>{formData.enrollmentNo}</strong></span>
            </div>
          )}
          {formData.department && (
            <div className="meta-badge-item">
              <FaBuilding className="meta-icon" />
              <span>Dept: <strong>{formData.department}</strong></span>
            </div>
          )}
        </div>
      )}

      <div className="form-group">
        <label>Project Title</label>
        <input
          type="text"
          value={formData.projectTitle || ""}
          readOnly
          placeholder="Project Title"
          className="readonly-input"
        />
      </div>

      <div className="form-group">
        <label>Project Domain</label>
        <input
          type="text"
          value={formData.projectDomain || ""}
          readOnly
          placeholder="Project Domain"
          className="readonly-input"
        />
      </div>

      <div className="form-group">
        <label>Technologies Used</label>
        <input
          type="text"
          value={formData.technologiesUsed || ""}
          readOnly
          placeholder="Technologies Used"
          className="readonly-input"
        />
      </div>
    </div>
  );
}

export default ProjectInfoCard;