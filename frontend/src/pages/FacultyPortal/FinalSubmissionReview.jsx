import { useEffect, useState } from "react";
import axios from "axios";
import "./FinalSubmissionReview.css";
import PdfModal from "../../components/FileViewer/PdfModal";
import ZipViewerModal from "../../components/FileViewer/ZipViewerModal";
import SqlViewerModal from "../../components/FileViewer/SqlViewerModal";

function FinalSubmissionReview() {
  const API_URL = "http://localhost:8081/final-submission";

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");

  const [pdfModal, setPdfModal] = useState({ open: false, path: "", title: "" });
  const [zipModal, setZipModal] = useState({ open: false, path: "", title: "" });
  const [sqlModal, setSqlModal] = useState({ open: false, path: "", title: "" });

  const getFacultyInfo = () => {
    const stored = JSON.parse(localStorage.getItem("faculty")) || JSON.parse(localStorage.getItem("user")) || {};
    return {
      facultyId: stored.facultyId || stored.id || localStorage.getItem("facultyId") || "",
      facultyName: stored.facultyName || stored.name || localStorage.getItem("facultyName") || "",
    };
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const { facultyId, facultyName } = getFacultyInfo();
      const response = await axios.get(API_URL, {
        params: {
          facultyId: facultyId || undefined,
          facultyName: facultyName || undefined,
        },
      });

      console.log("FINAL SUBMISSIONS RESPONSE:", response.data);
      setSubmissions(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching final submissions:", err);
      setError("Unable to load final project submissions.");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter((item) => {
    const studentName = (item.studentName || `Student ${item.studentId || ""}`).toLowerCase();
    const enrollment = (item.enrollmentNo || "").toLowerCase();
    const title = (item.projectTitle || "").toLowerCase();
    const query = search.toLowerCase().trim();

    const matchesSearch =
      query === "" ||
      studentName.includes(query) ||
      enrollment.includes(query) ||
      title.includes(query);

    const matchesDomain = domainFilter === "All" || item.projectDomain === domainFilter;

    return matchesSearch && matchesDomain;
  });

  const domains = Array.from(
    new Set(submissions.map((s) => s.projectDomain).filter(Boolean))
  );

  return (
    <div className="final-sub-page">
      {/* Header */}
      <div className="final-sub-header">
        <h1>Final Project Submissions</h1>
        <p>Review student project reports, explore source code archives, and inspect database scripts.</p>
      </div>

      {/* Toolbar */}
      <div className="final-sub-toolbar">
        <input
          type="text"
          placeholder="Search by Student Name, Enrollment, or Project Title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
        >
          <option value="All">All Domains</option>
          {domains.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: "12px 16px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          <h3>Loading Final Submissions...</h3>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredSubmissions.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px 20px", background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ color: "#1e293b", marginBottom: "8px" }}>No Final Submissions Found</h3>
          <p style={{ color: "#64748b" }}>No students have submitted final project deliverables yet.</p>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && filteredSubmissions.length > 0 && (
        <div className="final-sub-grid">
          {filteredSubmissions.map((sub) => {
            const displayName = sub.studentName || `Student ${sub.studentId || ""}`;
            const facultyInfo = getFacultyInfo();

            return (
              <div className="final-sub-card" key={sub.submissionId}>
                <div>
                  <div className="final-card-top">
                    <div className="final-card-student">
                      <h3>{displayName}</h3>
                      <span>
                        {sub.enrollmentNo ? `Enrollment: ${sub.enrollmentNo}` : `Student ID: ${sub.studentId}`}
                        {sub.department ? ` • ${sub.department}` : ""}
                      </span>
                    </div>
                    <span className="final-badge-submitted">Submitted</span>
                  </div>

                  <div className="final-project-title">
                    {sub.projectTitle || "Project Title"}
                  </div>

                  <div className="final-meta-row">
                    {sub.projectDomain && <span><strong>Domain:</strong> {sub.projectDomain}</span>}
                    {sub.technologiesUsed && <span><strong>Tech:</strong> {sub.technologiesUsed}</span>}
                  </div>

                  {/* Links Row */}
                  {(sub.githubRepository || sub.liveProjectUrl) && (
                    <div className="final-links-row">
                      {sub.githubRepository && (
                        <div>
                          <strong>GitHub: </strong>
                          <a href={sub.githubRepository} target="_blank" rel="noreferrer">
                            {sub.githubRepository}
                          </a>
                        </div>
                      )}
                      {sub.liveProjectUrl && (
                        <div>
                          <strong>Live Demo: </strong>
                          <a href={sub.liveProjectUrl} target="_blank" rel="noreferrer">
                            {sub.liveProjectUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Deliverables Files */}
                  <div className="final-files-container">
                    {/* Final Report */}
                    {sub.finalReportFile && (
                      <div className="final-file-item">
                        <span className="final-file-name">📄 Final Report (PDF)</span>
                        <div className="final-file-actions">
                          <button
                            type="button"
                            className="final-btn-view"
                            onClick={() =>
                              setPdfModal({
                                open: true,
                                path: sub.finalReportFile,
                                title: `${displayName} - Final Report`,
                              })
                            }
                          >
                            View PDF
                          </button>
                          <a
                            href={`http://localhost:8081/api/files/download?path=${encodeURIComponent(sub.finalReportFile)}&facultyId=${facultyInfo.facultyId}&facultyName=${encodeURIComponent(facultyInfo.facultyName)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="final-btn-download"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Source Code */}
                    {sub.sourceCodeFile && (
                      <div className="final-file-item">
                        <span className="final-file-name">🗜 Source Code (ZIP)</span>
                        <div className="final-file-actions">
                          <button
                            type="button"
                            className="final-btn-explore"
                            onClick={() =>
                              setZipModal({
                                open: true,
                                path: sub.sourceCodeFile,
                                title: `${displayName} - Source Code`,
                              })
                            }
                          >
                            Explore Code
                          </button>
                          <a
                            href={`http://localhost:8081/api/files/download?path=${encodeURIComponent(sub.sourceCodeFile)}&facultyId=${facultyInfo.facultyId}&facultyName=${encodeURIComponent(facultyInfo.facultyName)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="final-btn-download"
                          >
                            Download ZIP
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Database SQL */}
                    {sub.databaseFile && (
                      <div className="final-file-item">
                        <span className="final-file-name">🗄 Database Script (.sql)</span>
                        <div className="final-file-actions">
                          <button
                            type="button"
                            className="final-btn-sql"
                            onClick={() =>
                              setSqlModal({
                                open: true,
                                path: sub.databaseFile,
                                title: `${displayName} - Database Schema`,
                              })
                            }
                          >
                            View SQL
                          </button>
                          <a
                            href={`http://localhost:8081/api/files/download?path=${encodeURIComponent(sub.databaseFile)}&facultyId=${facultyInfo.facultyId}&facultyName=${encodeURIComponent(facultyInfo.facultyName)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="final-btn-download"
                          >
                            Download SQL
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {sub.submissionDate && (
                  <div className="final-date-footer">
                    Submitted on: {new Date(sub.submissionDate).toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* File Modals */}
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

export default FinalSubmissionReview;
