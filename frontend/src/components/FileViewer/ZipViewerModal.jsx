import React, { useState, useEffect, useMemo } from "react";
import "./ZipViewerModal.css";
import {
  FaFileArchive,
  FaFolder,
  FaFolderOpen,
  FaFileCode,
  FaFileAlt,
  FaFileImage,
  FaDownload,
  FaTimes,
  FaSearch,
  FaFile,
} from "react-icons/fa";

export default function ZipViewerModal({
  filePath,
  title = "Source Code Archive",
  facultyId,
  facultyName,
  studentId,
  onClose,
}) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [openFolders, setOpenFolders] = useState({});

  const getAuthParams = () => {
    const params = new URLSearchParams();
    params.append("path", filePath);
    if (facultyId) params.append("facultyId", facultyId);
    if (facultyName) params.append("facultyName", facultyName);
    if (studentId) params.append("studentId", studentId);
    return params.toString();
  };

  const downloadUrl = `http://localhost:8081/api/files/download?${getAuthParams()}`;

  useEffect(() => {
    if (!filePath) return;
    fetchZipContents();
  }, [filePath]);

  const fetchZipContents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`http://localhost:8081/api/files/zip-contents?${getAuthParams()}`);
      if (!response.ok) {
        throw new Error("Failed to load ZIP contents.");
      }
      const data = await response.json();
      setEntries(data || []);

      // Auto select first readable code/text file
      const firstTextFile = data.find((e) => !e.isDirectory && (e.isText || e.isImage));
      if (firstTextFile) {
        handleSelectFile(firstTextFile);
      }
    } catch (err) {
      console.error("ZIP fetch error:", err);
      setError(err.message || "Unable to read ZIP contents.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFile = async (entry) => {
    if (entry.isDirectory) return;
    setSelectedFile(entry);
    setContentLoading(true);
    setFileContent(null);

    try {
      const params = new URLSearchParams();
      params.append("path", filePath);
      params.append("entryPath", entry.name);
      if (facultyId) params.append("facultyId", facultyId);
      if (facultyName) params.append("facultyName", facultyName);
      if (studentId) params.append("studentId", studentId);

      const response = await fetch(`http://localhost:8081/api/files/zip-entry?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch file content.");
      }
      const data = await response.json();
      setFileContent(data);
    } catch (err) {
      console.error("Error reading entry:", err);
      setFileContent({
        type: "error",
        message: "Failed to load file content from ZIP.",
      });
    } finally {
      setContentLoading(false);
    }
  };

  const getFileIcon = (entry) => {
    if (entry.isDirectory) {
      return openFolders[entry.name] ? <FaFolderOpen className="icon-folder" /> : <FaFolder className="icon-folder" />;
    }
    if (entry.isText) return <FaFileCode className="icon-code" />;
    if (entry.isImage) return <FaFileImage className="icon-image" />;
    return <FaFile className="icon-file" />;
  };

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return entries;
    return entries.filter((e) => e.name.toLowerCase().includes(search.toLowerCase().trim()));
  }, [entries, search]);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes <= 0) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="zip-modal-overlay" onClick={onClose}>
      <div className="zip-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="zip-modal-header">
          <div className="zip-header-left">
            <FaFileArchive className="zip-header-icon" />
            <div>
              <h3>{title}</h3>
              <span className="zip-file-name">
                {filePath.split("/").pop()} • {entries.length} entries
              </span>
            </div>
          </div>
          <div className="zip-header-actions">
            <a
              href={downloadUrl}
              className="zip-action-btn download"
              target="_blank"
              rel="noreferrer"
              title="Download Complete ZIP"
            >
              <FaDownload />
              <span>Download ZIP</span>
            </a>
            <button className="zip-action-btn close" onClick={onClose} title="Close">
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="zip-modal-content">
          {/* Left: File Tree / List */}
          <div className="zip-sidebar">
            <div className="zip-search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Filter files in ZIP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="clear-search" onClick={() => setSearch("")}>
                  ×
                </button>
              )}
            </div>

            <div className="zip-file-tree">
              {loading ? (
                <div className="zip-loading-sidebar">Reading ZIP contents...</div>
              ) : error ? (
                <div className="zip-error-sidebar">{error}</div>
              ) : filteredEntries.length === 0 ? (
                <div className="zip-empty-sidebar">No matching files found.</div>
              ) : (
                <ul className="zip-entry-list">
                  {filteredEntries.map((entry, idx) => (
                    <li
                      key={idx}
                      className={`zip-entry-item ${entry.isDirectory ? "directory" : "file"} ${
                        selectedFile?.name === entry.name ? "selected" : ""
                      }`}
                      onClick={() => handleSelectFile(entry)}
                    >
                      <span className="entry-icon">{getFileIcon(entry)}</span>
                      <span className="entry-name" title={entry.name}>
                        {entry.name}
                      </span>
                      {!entry.isDirectory && (
                        <span className="entry-size">{formatFileSize(entry.size)}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right: Code / Content Preview */}
          <div className="zip-preview-pane">
            {!selectedFile ? (
              <div className="zip-preview-placeholder">
                <FaFileCode size={40} className="placeholder-icon" />
                <h4>Select a code or text file to inspect</h4>
                <p>Click on any file in the left explorer to view its contents safely without extracting.</p>
              </div>
            ) : (
              <div className="zip-preview-wrapper">
                <div className="zip-preview-header">
                  <div className="preview-file-info">
                    <span className="preview-filename">{selectedFile.name}</span>
                    <span className="preview-meta">
                      Size: {formatFileSize(selectedFile.size)} • Extension: .{selectedFile.extension}
                    </span>
                  </div>
                </div>

                <div className="zip-preview-body">
                  {contentLoading ? (
                    <div className="preview-loading">Loading file preview...</div>
                  ) : fileContent?.type === "text" ? (
                    <pre className="code-display">
                      <code>{fileContent.content}</code>
                    </pre>
                  ) : fileContent?.type === "image" ? (
                    <div className="image-display">
                      <img src={fileContent.content} alt={selectedFile.name} />
                    </div>
                  ) : fileContent?.truncated ? (
                    <div className="preview-notice warning">
                      <p>{fileContent.message}</p>
                    </div>
                  ) : (
                    <div className="preview-notice info">
                      <p>
                        {fileContent?.message ||
                          "This binary or non-text file cannot be displayed directly in the code viewer. You can download the complete ZIP archive to view it."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
