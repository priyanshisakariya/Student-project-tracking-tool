import React, { useState, useEffect } from "react";
import "./PdfModal.css";
import { FaFilePdf, FaDownload, FaExternalLinkAlt, FaTimes, FaExclamationTriangle } from "react-icons/fa";

export default function PdfModal({ filePath, title = "Document Preview", facultyId, facultyName, studentId, onClose }) {
  const [checking, setChecking] = useState(true);
  const [fileNotFound, setFileNotFound] = useState(false);

  if (!filePath) return null;

  const getAuthParams = () => {
    const params = new URLSearchParams();
    params.append("path", filePath);
    if (facultyId) params.append("facultyId", facultyId);
    if (facultyName) params.append("facultyName", facultyName);
    if (studentId) params.append("studentId", studentId);
    return params.toString();
  };

  const viewUrl = `http://localhost:8081/api/files/view?${getAuthParams()}`;
  const downloadUrl = `http://localhost:8081/api/files/download?${getAuthParams()}`;

  useEffect(() => {
    setChecking(true);
    setFileNotFound(false);

    fetch(viewUrl)
      .then((res) => {
        if (!res.ok) {
          setFileNotFound(true);
        }
      })
      .catch(() => {
        setFileNotFound(true);
      })
      .finally(() => {
        setChecking(false);
      });
  }, [filePath, facultyId, facultyName, studentId]);

  return (
    <div className="pdf-modal-overlay" onClick={onClose}>
      <div className="pdf-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-modal-header">
          <div className="pdf-modal-title">
            <FaFilePdf className="pdf-header-icon" />
            <div>
              <h3>{title}</h3>
              <span className="pdf-file-name">{filePath.split("/").pop()}</span>
            </div>
          </div>
          <div className="pdf-modal-actions">
            {!fileNotFound && (
              <>
                <a
                  href={downloadUrl}
                  className="pdf-action-btn download"
                  target="_blank"
                  rel="noreferrer"
                  title="Download PDF"
                >
                  <FaDownload />
                  <span>Download</span>
                </a>
                <a
                  href={viewUrl}
                  className="pdf-action-btn external"
                  target="_blank"
                  rel="noreferrer"
                  title="Open in new tab"
                >
                  <FaExternalLinkAlt />
                  <span>New Tab</span>
                </a>
              </>
            )}
            <button className="pdf-action-btn close" onClick={onClose} title="Close">
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="pdf-modal-body">
          {checking ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748b" }}>
              Loading PDF preview...
            </div>
          ) : fileNotFound ? (
            <div style={{ padding: "50px 25px", textAlign: "center" }}>
              <FaExclamationTriangle style={{ fontSize: "52px", color: "#f59e0b", marginBottom: "15px" }} />
              <h3 style={{ color: "#1e293b", fontSize: "20px", marginBottom: "10px" }}>File Not Found On Server</h3>
              <p style={{ color: "#64748b", maxWidth: "520px", margin: "0 auto 15px", lineHeight: "1.6", fontSize: "14px" }}>
                The document <strong>"{filePath.split("/").pop()}"</strong> was submitted prior to real file upload support or the file is no longer on the server disk.
              </p>
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px 18px", borderRadius: "8px", display: "inline-block", color: "#1e40af", fontSize: "14px" }}>
                💡 <strong>Resolution:</strong> Please ask the student to re-submit their proposal or project PDF via the Student Portal.
              </div>
            </div>
          ) : (
            <iframe
              src={viewUrl}
              title={title}
              className="pdf-viewer-iframe"
            />
          )}
        </div>
      </div>
    </div>
  );
}
