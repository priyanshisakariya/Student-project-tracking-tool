import { useState, useEffect } from "react";
import "./Profile.css";
import { FaLinkedin, FaExternalLinkAlt } from "react-icons/fa";
import {
  validateEmail,
  validatePhone,
  validateFullName,
} from "../../utils/validation";
import {
  getStoredStudent,
  getOrRecoverStudent,
  saveStudentSession,
  normalizeStudent,
} from "../../utils/studentSession";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(() => getStoredStudent());
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [editData, setEditData] = useState({
    fullName: student?.fullName || "",
    email: student?.email || "",
    mobileNo: student?.mobileNo || "",
    enrollmentNo: student?.enrollmentNo || "",
    department: student?.department || "",
    sem: student?.sem || "",
    academicYear: student?.academicYear || "",
    address: student?.address || "",
    dateOfBirth: student?.dateOfBirth || "",
    skills: student?.skills || "",
    linkedInUrl: student?.linkedInUrl || "",
  });

  // Helper to ensure external links open cleanly
  const formatLinkedInUrl = (url) => {
    if (!url) return "#";
    const clean = url.trim();
    if (clean.startsWith("http://") || clean.startsWith("https://")) {
      return clean;
    }
    return "https://" + clean;
  };

  // Sync editData whenever student state changes
  const syncEditData = (st) => {
    if (!st) return;
    setEditData({
      fullName: st.fullName || "",
      email: st.email || "",
      mobileNo: st.mobileNo || "",
      enrollmentNo: st.enrollmentNo || "",
      department: st.department || "",
      sem: st.sem || "",
      academicYear: st.academicYear || "",
      address: st.address || "",
      dateOfBirth: st.dateOfBirth || "",
      skills: st.skills || "",
      linkedInUrl: st.linkedInUrl || "",
    });
  };

  // Load / Recover student from storage or backend database
  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      // If student was already in local storage, sync edit data first
      if (student) {
        syncEditData(student);
      }

      setLoading(true);
      // Fetches fresh data from backend or auto-recovers if storage was cleared (Ctrl + Shift + Delete)
      const freshStudent = await getOrRecoverStudent();

      if (isMounted) {
        if (freshStudent) {
          setStudent(freshStudent);
          syncEditData(freshStudent);
          saveStudentSession(freshStudent);
        }
        setLoading(false);
      }
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return validateFullName(value);
      case "email":
        return validateEmail(value);
      case "mobileNo":
        return validatePhone(value);
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "mobileNo") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setEditData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (touched[name]) {
      const err = validateField(name, updatedValue);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleCancel = () => {
    syncEditData(student);
    setErrors({});
    setTouched({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    const nameErr = validateFullName(editData.fullName);
    const emailErr = validateEmail(editData.email);
    const phoneErr = validatePhone(editData.mobileNo);

    setTouched({ fullName: true, email: true, mobileNo: true });
    setErrors({ fullName: nameErr, email: emailErr, mobileNo: phoneErr });

    if (nameErr || emailErr || phoneErr) {
      alert("Please fix the validation errors before saving.");
      return;
    }

    try {
      const studentId = student?.id || student?.Id;
      if (!studentId) {
        alert("Student ID missing. Please log in again.");
        return;
      }

      const requestData = {
        fullName: editData.fullName.trim(),
        email: editData.email.trim(),
        mobileNo: editData.mobileNo.trim(),
        enrollmentNo: student.enrollmentNo,
        department: student.department,
        sem: student.sem,
        address: (editData.address || "").trim(),
        dateOfBirth: editData.dateOfBirth,
        skills: (editData.skills || "").trim(),
        linkedInUrl: (editData.linkedInUrl || "").trim(),
      };

      const response = await fetch(
        `http://localhost:8081/student/update/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        const normalized = normalizeStudent(updatedUser);

        saveStudentSession(normalized);
        setStudent(normalized);
        syncEditData(normalized);

        alert("Profile Updated Successfully!");
        setErrors({});
        setTouched({});
        setIsEditing(false);
      } else {
        const errMsg = await response.text().catch(() => "");
        alert(errMsg || "Failed to update profile!");
      }
    } catch (error) {
      console.error("Save profile error:", error);
      alert("Server Error! Check backend connection.");
    }
  };

  if (!student && !loading) {
    return (
      <div className="profile-container">
        <div className="profile-card no-session-card">
          <h2>No Student Session Found</h2>
          <p>Your session may have been cleared. Please log in to view and edit your profile.</p>
          <button className="edit-btn" onClick={() => navigate("/student-login")}>
            Go to Student Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {loading && !student && (
          <div className="profile-loading-notice">
            <span>Loading profile details...</span>
          </div>
        )}

        <div className="profile-header">
          <div className="profile-image">
            <span>{student?.fullName ? student.fullName.charAt(0).toUpperCase() : "S"}</span>
          </div>

          {isEditing ? (
            <div className="profile-edit-field">
              <input
                className={`edit-input ${touched.fullName && errors.fullName ? "input-error" : ""}`}
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={editData.fullName || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {touched.fullName && errors.fullName && (
                <span className="field-error">{errors.fullName}</span>
              )}
            </div>
          ) : (
            <h2>{student?.fullName || "Student Name"}</h2>
          )}

          <p>{student?.department ? `${student.department} Student` : "Master of Computer Applications"}</p>
        </div>

        <div className="profile-details">
          {/* EMAIL */}
          <div className="detail-box">
            <h4>Email</h4>
            {isEditing ? (
              <div>
                <input
                  className={`edit-input ${touched.email && errors.email ? "input-error" : ""}`}
                  type="email"
                  name="email"
                  value={editData.email || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>
            ) : (
              <p>{student?.email || "Not Added"}</p>
            )}
          </div>

          {/* PHONE */}
          <div className="detail-box">
            <h4>
              Phone{" "}
              {isEditing && (
                <span className="char-count">
                  ({(editData.mobileNo || "").length}/10)
                </span>
              )}
            </h4>
            {isEditing ? (
              <div>
                <input
                  className={`edit-input ${touched.mobileNo && errors.mobileNo ? "input-error" : ""}`}
                  type="text"
                  name="mobileNo"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={editData.mobileNo || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.mobileNo && errors.mobileNo && (
                  <span className="field-error">{errors.mobileNo}</span>
                )}
              </div>
            ) : (
              <p>{student?.mobileNo || "Not Added"}</p>
            )}
          </div>

          {/* ENROLLMENT NO */}
          <div className="detail-box">
            <h4>Enrollment No</h4>
            <p>{student?.enrollmentNo || "Not Added"}</p>
          </div>

          {/* DEPARTMENT */}
          <div className="detail-box">
            <h4>Department</h4>
            <p>{student?.department || "Not Added"}</p>
          </div>

          {/* ACADEMIC YEAR */}
          <div className="detail-box">
            <h4>Academic Year</h4>
            <p>{student?.academicYear || "Not Added"}</p>
          </div>

          {/* SEMESTER */}
          <div className="detail-box">
            <h4>Semester</h4>
            <p>{student?.sem || "Not Added"}</p>
          </div>

          {/* ADDRESS */}
          <div className="detail-box">
            <h4>Address</h4>
            {isEditing ? (
              <textarea
                className="edit-input"
                name="address"
                placeholder="Enter address"
                value={editData.address || ""}
                onChange={handleChange}
                rows="3"
              />
            ) : (
              <p>{student?.address || "Not Added"}</p>
            )}
          </div>

          {/* DATE OF BIRTH */}
          <div className="detail-box">
            <h4>Date of Birth</h4>
            {isEditing ? (
              <input
                className="edit-input"
                type="date"
                name="dateOfBirth"
                value={editData.dateOfBirth || ""}
                onChange={handleChange}
              />
            ) : (
              <p>{student?.dateOfBirth || "Not Added"}</p>
            )}
          </div>

          {/* SKILLS */}
          <div className="detail-box">
            <h4>Skills</h4>
            {isEditing ? (
              <input
                className="edit-input"
                type="text"
                name="skills"
                placeholder="Java, React, Spring Boot, MySQL"
                value={editData.skills || ""}
                onChange={handleChange}
              />
            ) : (
              <p>{student?.skills || "Not Added"}</p>
            )}
          </div>

          {/* LINKEDIN */}
          <div className="detail-box">
            <h4>LinkedIn</h4>
            {isEditing ? (
              <input
                className="edit-input"
                type="url"
                name="linkedInUrl"
                placeholder="e.g. https://www.linkedin.com/in/username"
                value={editData.linkedInUrl || ""}
                onChange={handleChange}
              />
            ) : student?.linkedInUrl ? (
              <a
                href={formatLinkedInUrl(student.linkedInUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-link-btn"
                title="Open LinkedIn Profile in new tab"
              >
                <FaLinkedin className="linkedin-icon" />
                <span className="linkedin-url-text">{student.linkedInUrl}</span>
                <FaExternalLinkAlt className="external-icon" />
              </a>
            ) : (
              <p className="not-added-text">Not Added</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "30px" }}>
          {isEditing ? (
            <>
              <button className="edit-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button
                className="edit-btn"
                style={{ background: "#64748b" }}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
