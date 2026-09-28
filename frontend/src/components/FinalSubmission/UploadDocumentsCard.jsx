import { useRef } from "react";
import {
  FaCloudUploadAlt,
  FaFilePdf,
  FaFileArchive,
  FaDatabase,
  FaTimes,
  FaUpload,
  FaDownload,
  FaCheckCircle,
} from "react-icons/fa";

function UploadDocumentsCard({ formData, setFormData, isSubmitted }) {
  const reportRef = useRef(null);
  const codeRef = useRef(null);
  const dbRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getCleanFileName = (path) => {
    if (!path) return "";
    const clean = path.split("/").pop().split("\\").pop();
    if (clean.includes("_")) {
      return clean.substring(clean.indexOf("_") + 1);
    }
    return clean;
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleCancelFile = (field, ref) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }));
    if (ref && ref.current) {
      ref.current.value = "";
    }
  };

  const renderFileSection = ({
    label,
    field,
    existingField,
    accept,
    icon: Icon,
    inputRef,
    helperText,
  }) => {
    const newFile = formData[field];
    const existingFile = formData[existingField];

    return (
      <div className="form-group doc-upload-group">
        <label className="doc-label">
          <Icon className="input-icon" />
          <span>{label}</span>
          <span className="doc-accept-tag">({accept})</span>
          {!isSubmitted && !existingFile && <span className="req-star">*</span>}
        </label>

        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(field, e)}
        />

        {/* Case 1: Student selected a new file from device */}
        {newFile ? (
          <div className="file-active-box file-new-selected">
            <div className="file-left-side">
              <div className="file-icon-square new-doc-icon">
                <Icon />
              </div>
              <div className="file-info-text">
                <div className="file-name-line">
                  <span className="file-title-bold">{newFile.name}</span>
                  <span className="file-status-pill new-pill">New Selected File</span>
                </div>
                <span className="file-size-sub">
                  {formatFileSize(newFile.size)} • Ready to upload with final submission
                </span>
              </div>
            </div>

            <div className="file-right-side">
              {/* CANCEL FILE BUTTON */}
              <button
                type="button"
                className="cancel-doc-btn"
                onClick={() => handleCancelFile(field, inputRef)}
                title="Cancel and remove this file"
              >
                <FaTimes /> Cancel File
              </button>
            </div>
          </div>
        ) : existingFile ? (
          /* Case 2: Existing saved file from server */
          <div className="file-active-box file-existing-saved">
            <div className="file-left-side">
              <div className="file-icon-square existing-doc-icon">
                <Icon />
              </div>
              <div className="file-info-text">
                <div className="file-name-line">
                  <span className="file-title-bold">
                    {getCleanFileName(existingFile)}
                  </span>
                  <span className="file-status-pill saved-pill">
                    <FaCheckCircle style={{ marginRight: 4 }} />
                    Currently Uploaded
                  </span>
                </div>
                <span className="file-size-sub">
                  Saved on server. You can keep this file or choose a new file to replace it.
                </span>
              </div>
            </div>

            <div className="file-right-side">
              <a
                href={`http://localhost:8081/api/files/download?path=${encodeURIComponent(
                  existingFile
                )}&studentId=${formData.studentId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="download-doc-btn"
              >
                <FaDownload /> Download
              </a>
              <button
                type="button"
                className="replace-doc-btn"
                onClick={() => inputRef.current && inputRef.current.click()}
              >
                <FaUpload /> Upload New File
              </button>
            </div>
          </div>
        ) : (
          /* Case 3: No file selected yet */
          <div
            className="doc-dropzone"
            onClick={() => inputRef.current && inputRef.current.click()}
          >
            <div className="dropzone-icon">
              <Icon />
            </div>
            <div className="dropzone-text">
              <p className="dropzone-main">
                Click here or browse to select <strong>{label}</strong>
              </p>
              <p className="dropzone-hint">{helperText}</p>
            </div>
            <button
              type="button"
              className="browse-file-btn"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current && inputRef.current.click();
              }}
            >
              <FaUpload /> Select File
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="submission-card">
      <h2 className="card-title">
        <FaCloudUploadAlt className="card-icon" />
        Upload Documents
      </h2>
      <p className="card-desc">
        Please ensure all documents meet the project guidelines. You can cancel and reselect files if you pick the wrong one by mistake.
      </p>

      {/* 1. Final Report (PDF) */}
      {renderFileSection({
        label: "Final Report Document",
        field: "finalReportFile",
        existingField: "existingReportFile",
        accept: ".pdf",
        icon: FaFilePdf,
        inputRef: reportRef,
        helperText: "Upload your completed project report in PDF format (up to 50MB)",
      })}

      {/* 2. Source Code Archive (ZIP) */}
      {renderFileSection({
        label: "Complete Source Code Archive",
        field: "sourceCodeFile",
        existingField: "existingSourceFile",
        accept: ".zip",
        icon: FaFileArchive,
        inputRef: codeRef,
        helperText: "Upload your source code zipped as a single archive (.zip)",
      })}

      {/* 3. Database Script / Schema (.sql or .zip) */}
      {renderFileSection({
        label: "Database Schema / Script",
        field: "databaseFile",
        existingField: "existingDatabaseFile",
        accept: ".sql,.zip",
        icon: FaDatabase,
        inputRef: dbRef,
        helperText: "Upload database backup, schema or queries (.sql or .zip)",
      })}
    </div>
  );
}

export default UploadDocumentsCard;