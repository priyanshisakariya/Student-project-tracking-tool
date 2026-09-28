import { useEffect, useState } from "react";
import "./AssignedStudentToFaculty.css";
import PdfModal from "../../components/FileViewer/PdfModal";
import ZipViewerModal from "../../components/FileViewer/ZipViewerModal";
import SqlViewerModal from "../../components/FileViewer/SqlViewerModal";

const API_URL = "http://localhost:8081/api/faculty-assigned-students";

function AssignedStudentToFaculty() {

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [studentProposal, setStudentProposal] = useState(null);
  const [studentFinalSubmission, setStudentFinalSubmission] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [pdfModal, setPdfModal] = useState({ open: false, path: "", title: "" });
  const [zipModal, setZipModal] = useState({ open: false, path: "", title: "" });
  const [sqlModal, setSqlModal] = useState({ open: false, path: "", title: "" });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getFacultyInfo = () => {
    const stored = JSON.parse(localStorage.getItem("faculty")) || JSON.parse(localStorage.getItem("user")) || {};
    return {
      facultyId: stored.facultyId || stored.id || localStorage.getItem("facultyId") || "",
      facultyName: stored.facultyName || stored.name || localStorage.getItem("facultyName") || ""
    };
  };

  // =====================================================
  // FETCH ASSIGNED STUDENTS
  // =====================================================

 const fetchAssignedStudents = async () => {
  try {
    setLoading(true);
    setError("");

    const { facultyId, facultyName } = getFacultyInfo();

    if (!facultyName && !facultyId) {
      throw new Error(
        "Faculty information not found. Please login again."
      );
    }

    // ============================================
    // FETCH ASSIGNED STUDENTS
    // ============================================

    const params = new URLSearchParams();
    if (facultyId) params.append("facultyId", facultyId);
    if (facultyName) params.append("facultyName", facultyName);

    const response = await fetch(
      `${API_URL}?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to load assigned students: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("ASSIGNED STUDENTS RESPONSE:", data);

    if (!Array.isArray(data)) {
      throw new Error(
        "Invalid response from server."
      );
    }

    setStudents(data);

  } catch (err) {
    console.error(
      "ASSIGNED STUDENTS ERROR:",
      err
    );

    setError(err.message);

  } finally {
    setLoading(false);
  }
};

  const handleOpenStudentModal = async (student) => {
    setSelectedStudent(student);
    setStudentProposal(null);
    setStudentFinalSubmission(null);
    setDetailsLoading(true);

    const { facultyId, facultyName } = getFacultyInfo();

    try {
      // 1. Fetch Proposal
      try {
        const propRes = await fetch(`http://localhost:8081/proposal/student/${student.id}`);
        if (propRes.ok) {
          const propData = await propRes.json();
          setStudentProposal(propData);
        }
      } catch (e) {
        console.warn("No proposal found for student:", e);
      }

      // 2. Fetch Final Submission
      try {
        const finalRes = await fetch(
          `http://localhost:8081/final-submission/student/${student.id}?facultyId=${facultyId}&facultyName=${encodeURIComponent(facultyName)}`
        );
        if (finalRes.ok) {
          const finalData = await finalRes.json();
          setStudentFinalSubmission(finalData);
        }
      } catch (e) {
        console.warn("No final submission found for student:", e);
      }
    } finally {
      setDetailsLoading(false);
    }
  };


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchAssignedStudents();
  }, []);


  // =====================================================
  // FILTER STUDENTS
  // =====================================================

  const filteredStudents = students.filter((student) => {

    const searchText = search.toLowerCase();

    const searchMatch =
      (student.name || "")
        .toLowerCase()
        .includes(searchText) ||

      (student.enrollment || "")
        .toLowerCase()
        .includes(searchText);

    const departmentMatch =
      department === "All" ||
      student.department === department;

    const statusMatch =
      status === "All" ||
      student.status === status;

    return (
      searchMatch &&
      departmentMatch &&
      statusMatch
    );
  });


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="assigned-page">

      <div className="assigned-header">

        <h1>
          Assigned Students
        </h1>

        <p>
          View students assigned to you by the administrator.
        </p>

      </div>


      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* ================================================= */}
      {/* TOOLBAR */}
      {/* ================================================= */}

      <div className="toolbar">

        <input
          type="text"
          placeholder="Search by Name or Enrollment..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <select
          value={department}
          onChange={(e) =>
            setDepartment(e.target.value)
          }
        >

          <option value="All">
            All
          </option>

          <option value="BCA">
            BCA
          </option>

          <option value="MCA">
            MCA
          </option>

        </select>


        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >

          <option value="All">
            All
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Completed">
            Completed
          </option>

        </select>

      </div>


      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading ? (

        <div className="loading-message">
          Loading assigned students...
        </div>

      ) : (

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>Name</th>

                <th>Enrollment</th>

                <th>Department</th>

                <th>Project</th>

                <th>Progress</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>


            <tbody>

              {filteredStudents.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center"
                    }}
                  >
                    No assigned students found.
                  </td>

                </tr>

              ) : (

                filteredStudents.map((student) => (

                  <tr key={student.id}>

                    <td>
                      {student.name}
                    </td>

                    <td>
                      {student.enrollment}
                    </td>

                    <td>
                      {student.department}
                    </td>

                    <td>
                      {student.project}
                    </td>

                    <td>

                      <div className="progress-bar">

                        <div
                          className="progress-fill"
                          style={{
                            width: `${student.progress || 0}%`
                          }}
                        >
                          {student.progress || 0}%
                        </div>

                      </div>

                    </td>


                    <td>

                      <span
                        className={`status ${(student.status || "")
                          .toLowerCase()}`}
                      >
                        {student.status}
                      </span>

                    </td>


                    <td>

                      <button
                        className="view-btn"
                        onClick={() =>
                          handleOpenStudentModal(student)
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      )}


      {/* ================================================= */}
      {/* STUDENT DETAILS MODAL */}
      {/* ================================================= */}

      {selectedStudent && (

        <div className="modal-overlay">

          <div className="student-modal" style={{ maxHeight: "85vh", overflowY: "auto" }}>

            <h2>
              {selectedStudent.name}
            </h2>


            <div className="profile-grid">

              <p>
                <strong>Enrollment :</strong>{" "}
                {selectedStudent.enrollment}
              </p>

              <p>
                <strong>Department :</strong>{" "}
                {selectedStudent.department}
              </p>

              <p>
                <strong>Project :</strong>{" "}
                {selectedStudent.project}
              </p>

              <p>
                <strong>Status :</strong>{" "}
                {selectedStudent.status}
              </p>

            </div>


            <h3>
              Overall Progress
            </h3>


            <div className="progress-bar large">

              <div
                className="progress-fill"
                style={{
                  width: `${selectedStudent.progress || 0}%`
                }}
              >
                {selectedStudent.progress || 0}%
              </div>

            </div>

            {/* ================================================= */}
            {/* PROPOSAL & SUBMISSION DETAILS */}
            {/* ================================================= */}
            {detailsLoading && (
              <p style={{ marginTop: "15px", color: "#64748b", fontStyle: "italic" }}>
                Loading submission files...
              </p>
            )}

            {/* PROPOSAL SECTION */}
            {studentProposal && (
              <div style={{ marginTop: "20px", padding: "15px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>📄 Project Proposal</h4>
                <p style={{ margin: "4px 0", fontSize: "14px" }}>
                  <strong>Title:</strong> {studentProposal.projectTitle}
                </p>
                <p style={{ margin: "4px 0", fontSize: "14px" }}>
                  <strong>Domain:</strong> {studentProposal.projectDomain} | <strong>Tech:</strong> {studentProposal.technologyStack}
                </p>
                {studentProposal.proposalFile && (
                  <div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      type="button"
                      style={{ padding: "6px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}
                      onClick={() => setPdfModal({ open: true, path: studentProposal.proposalFile, title: "Proposal Document" })}
                    >
                      📄 View Proposal PDF
                    </button>
                    <a
                      href={`http://localhost:8081/api/files/download?path=${encodeURIComponent(studentProposal.proposalFile)}&facultyId=${getFacultyInfo().facultyId}&facultyName=${encodeURIComponent(getFacultyInfo().facultyName)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: "6px 12px", background: "#059669", color: "#fff", textDecoration: "none", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}
                    >
                      ⬇ Download PDF
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* FINAL SUBMISSION SECTION */}
            {studentFinalSubmission && (
              <div style={{ marginTop: "20px", padding: "15px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>📦 Final Project Submission</h4>
                {studentFinalSubmission.githubRepository && (
                  <p style={{ margin: "4px 0", fontSize: "14px" }}>
                    <strong>GitHub:</strong>{" "}
                    <a href={studentFinalSubmission.githubRepository} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
                      {studentFinalSubmission.githubRepository}
                    </a>
                  </p>
                )}
                {studentFinalSubmission.liveProjectUrl && (
                  <p style={{ margin: "4px 0", fontSize: "14px" }}>
                    <strong>Live Demo:</strong>{" "}
                    <a href={studentFinalSubmission.liveProjectUrl} target="_blank" rel="noreferrer" style={{ color: "#2563eb" }}>
                      {studentFinalSubmission.liveProjectUrl}
                    </a>
                  </p>
                )}

                {/* FILE ATTACHMENTS */}
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {/* Final Report */}
                  {studentFinalSubmission.finalReportFile && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px", padding: "8px 12px", background: "#ffffff", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>📄 Final Report (PDF)</span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          style={{ padding: "5px 10px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                          onClick={() => setPdfModal({ open: true, path: studentFinalSubmission.finalReportFile, title: "Final Report PDF" })}
                        >
                          View PDF
                        </button>
                        <a
                          href={`http://localhost:8081/api/files/download?path=${encodeURIComponent(studentFinalSubmission.finalReportFile)}&facultyId=${getFacultyInfo().facultyId}&facultyName=${encodeURIComponent(getFacultyInfo().facultyName)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ padding: "5px 10px", background: "#059669", color: "#fff", textDecoration: "none", borderRadius: "5px", fontSize: "12px", fontWeight: "600" }}
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Source Code */}
                  {studentFinalSubmission.sourceCodeFile && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px", padding: "8px 12px", background: "#ffffff", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>🗜 Source Code (ZIP)</span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          style={{ padding: "5px 10px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                          onClick={() => setZipModal({ open: true, path: studentFinalSubmission.sourceCodeFile, title: "Source Code Archive" })}
                        >
                          Explore Code
                        </button>
                        <a
                          href={`http://localhost:8081/api/files/download?path=${encodeURIComponent(studentFinalSubmission.sourceCodeFile)}&facultyId=${getFacultyInfo().facultyId}&facultyName=${encodeURIComponent(getFacultyInfo().facultyName)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ padding: "5px 10px", background: "#059669", color: "#fff", textDecoration: "none", borderRadius: "5px", fontSize: "12px", fontWeight: "600" }}
                        >
                          Download ZIP
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Database */}
                  {studentFinalSubmission.databaseFile && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px", padding: "8px 12px", background: "#ffffff", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#334155" }}>🗄 Database Script (.sql)</span>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          style={{ padding: "5px 10px", background: "#d97706", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}
                          onClick={() => setSqlModal({ open: true, path: studentFinalSubmission.databaseFile, title: "Database Schema Script" })}
                        >
                          View SQL
                        </button>
                        <a
                          href={`http://localhost:8081/api/files/download?path=${encodeURIComponent(studentFinalSubmission.databaseFile)}&facultyId=${getFacultyInfo().facultyId}&facultyName=${encodeURIComponent(getFacultyInfo().facultyName)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ padding: "5px 10px", background: "#059669", color: "#fff", textDecoration: "none", borderRadius: "5px", fontSize: "12px", fontWeight: "600" }}
                        >
                          Download SQL
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!detailsLoading && !studentFinalSubmission && (
              <div style={{ marginTop: "20px", padding: "14px", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1", textAlign: "center" }}>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>📦 Final Project: Not submitted yet</span>
              </div>
            )}

            <button
              className="close-btn"
              onClick={() =>
                setSelectedStudent(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* FILE VIEWER MODALS */}
      {/* ================================================= */}
      {pdfModal.open && (
        <PdfModal
          filePath={pdfModal.path}
          title={pdfModal.title}
          facultyId={getFacultyInfo().facultyId}
          facultyName={getFacultyInfo().facultyName}
          onClose={() => setPdfModal({ open: false, path: "", title: "" })}
        />
      )}

      {zipModal.open && (
        <ZipViewerModal
          filePath={zipModal.path}
          title={zipModal.title}
          facultyId={getFacultyInfo().facultyId}
          facultyName={getFacultyInfo().facultyName}
          onClose={() => setZipModal({ open: false, path: "", title: "" })}
        />
      )}

      {sqlModal.open && (
        <SqlViewerModal
          filePath={sqlModal.path}
          title={sqlModal.title}
          facultyId={getFacultyInfo().facultyId}
          facultyName={getFacultyInfo().facultyName}
          onClose={() => setSqlModal({ open: false, path: "", title: "" })}
        />
      )}

    </div>

  );
}

export default AssignedStudentToFaculty;