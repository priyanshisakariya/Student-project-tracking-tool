import React, { useState, useEffect } from "react";
import "./SqlViewerModal.css";
import { FaDatabase, FaDownload, FaTimes, FaCopy, FaCheck } from "react-icons/fa";

export default function SqlViewerModal({
  filePath,
  title = "Database SQL Schema / Script",
  facultyId,
  facultyName,
  studentId,
  onClose,
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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
    if (!filePath) return;
    fetchSqlContent();
  }, [filePath]);

  const fetchSqlContent = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(viewUrl);
      if (!response.ok) {
        throw new Error("Failed to load SQL file.");
      }
      const text = await response.text();
      setContent(text);
    } catch (err) {
      console.error("SQL fetch error:", err);
      setError("Unable to load SQL file content from server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sql-modal-overlay" onClick={onClose}>
      <div className="sql-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="sql-modal-header">
          <div className="sql-header-left">
            <FaDatabase className="sql-header-icon" />
            <div>
              <h3>{title}</h3>
              <span className="sql-file-name">{filePath.split("/").pop()}</span>
            </div>
          </div>

          <div className="sql-header-actions">
            <button className="sql-action-btn copy" onClick={handleCopy} title="Copy SQL">
              {copied ? <FaCheck /> : <FaCopy />}
              <span>{copied ? "Copied" : "Copy SQL"}</span>
            </button>
            <a
              href={downloadUrl}
              className="sql-action-btn download"
              target="_blank"
              rel="noreferrer"
              title="Download SQL File"
            >
              <FaDownload />
              <span>Download SQL</span>
            </a>
            <button className="sql-action-btn close" onClick={onClose} title="Close">
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="sql-modal-body">
          {loading ? (
            <div className="sql-loading">Loading SQL content...</div>
          ) : error ? (
            <div className="sql-error">{error}</div>
          ) : (
            <pre className="sql-code-display">
              <code>{content}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
