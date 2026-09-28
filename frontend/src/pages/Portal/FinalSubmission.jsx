import { useState, useEffect } from "react";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaCalendarAlt,
  FaFileAlt,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

import ProjectInfoCard from "../../components/FinalSubmission/ProjectInfoCard";
import ProjectLinksCard from "../../components/FinalSubmission/ProjectLinksCard";
import UploadDocumentsCard from "../../components/FinalSubmission/UploadDocumentsCard";
import DeclarationCard from "../../components/FinalSubmission/DeclarationCard";

import "./FinalSubmission.css";

export default function FinalSubmission() {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    enrollmentNo: "",
    department: "",

    projectTitle: "",
    projectDomain: "",
    technologiesUsed: "",

    githubRepository: "",
    liveProjectUrl: "",
    demoVideoUrl: "",

    finalReportFile: null,
    sourceCodeFile: null,
    databaseFile: null,

    existingReportFile: null,
    existingSourceFile: null,
    existingDatabaseFile: null,

    declaration: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [submissionDate, setSubmissionDate] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("Submitted");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Load student profile & existing final submission
  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));

    if (!student) {
      console.log("Student not found in localStorage");
      setLoading(false);
      return;
    }

    const studentId = student.id || student.Id;
    const studentName = student.name || student.fullName || "";
    const enrollmentNo = student.enrollmentNo || student.enrollment || "";
    const department = student.department || "";

    setFormData((prev) => ({
      ...prev,
      studentId: studentId,
      studentName: studentName,
      enrollmentNo: enrollmentNo,
      department: department,
    }));

    // Step 1: Check if final submission already exists for this student
    fetch(`http://localhost:8081/final-submission/student/${studentId}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((submission) => {
        if (submission && submission.submissionId) {
          console.log("Existing Final Submission loaded:", submission);
          setIsSubmitted(true);
          setSubmissionId(submission.submissionId);
          setSubmissionDate(submission.submissionDate);
          setSubmissionStatus(submission.status || "Submitted");

          setFormData((prev) => ({
            ...prev,
            projectTitle: submission.projectTitle || "",
            projectDomain: submission.projectDomain || "",
            technologiesUsed: submission.technologiesUsed || "",
            githubRepository: submission.githubRepository || "",
            liveProjectUrl: submission.liveProjectUrl || "",
            demoVideoUrl: submission.demoVideoUrl || "",
            existingReportFile: submission.finalReportFile || null,
            existingSourceFile: submission.sourceCodeFile || null,
            existingDatabaseFile: submission.databaseFile || null,
            declaration: submission.declaration ?? true,
          }));
          setLoading(false);
        } else {
          // Step 2: Fallback to proposal data to prefill title and domain
          fetchProposal(studentId);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch final submission, trying proposal:", err);
        fetchProposal(studentId);
      });
  }, []);

  const fetchProposal = (studentId) => {
    fetch(`http://localhost:8081/proposal/student/${studentId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch proposal");
        }
        return response.json();
      })
      .then((proposal) => {
        console.log("Proposal received for pre-filling:", proposal);
        setFormData((prev) => ({
          ...prev,
          projectTitle: proposal.projectTitle || "",
          projectDomain: proposal.projectDomain || "",
          technologiesUsed: proposal.technologyStack || "",
        }));
      })
      .catch((error) => {
        console.error("Proposal fetch error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Submit / Update
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setFeedback(null);

    if (!formData.studentId) {
      alert("Student ID not found. Please log in again.");
      return;
    }

    if (!formData.githubRepository || !formData.githubRepository.trim()) {
      alert("Please provide your GitHub Repository URL.");
      return;
    }

    const trimmedGithub = formData.githubRepository.trim();
    if (!trimmedGithub.startsWith("http://") && !trimmedGithub.startsWith("https://")) {
      alert("GitHub Repository URL must be a valid web link starting with http:// or https://");
      return;
    }

    // Document checks: must either have newly selected file or existing saved file
    if (!formData.finalReportFile && !formData.existingReportFile) {
      alert("Please upload your Final Report PDF document.");
      return;
    }

    if (!formData.sourceCodeFile && !formData.existingSourceFile) {
      alert("Please upload your Source Code ZIP archive.");
      return;
    }

    if (!formData.databaseFile && !formData.existingDatabaseFile) {
      alert("Please upload your Database SQL or ZIP script file.");
      return;
    }

    if (!formData.declaration) {
      alert("Please confirm and accept the student declaration before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const uploadData = new FormData();
      uploadData.append("studentId", formData.studentId);
      uploadData.append("projectTitle", formData.projectTitle || "Final Year Project");
      uploadData.append("projectDomain", formData.projectDomain || "General");
      uploadData.append("technologiesUsed", formData.technologiesUsed || "Standard");
      uploadData.append("githubRepository", trimmedGithub);

      if (formData.liveProjectUrl && formData.liveProjectUrl.trim()) {
        uploadData.append("liveProjectUrl", formData.liveProjectUrl.trim());
      }
      if (formData.demoVideoUrl && formData.demoVideoUrl.trim()) {
        uploadData.append("demoVideoUrl", formData.demoVideoUrl.trim());
      }

      if (formData.finalReportFile) {
        uploadData.append("finalReportFile", formData.finalReportFile);
      }
      if (formData.sourceCodeFile) {
        uploadData.append("sourceCodeFile", formData.sourceCodeFile);
      }
      if (formData.databaseFile) {
        uploadData.append("databaseFile", formData.databaseFile);
      }

      uploadData.append("declaration", formData.declaration);

      const response = await fetch("http://localhost:8081/final-submission/submit", {
        method: "POST",
        body: uploadData,
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Final submission failed. Please try again.");
        setFeedback({
          type: "error",
          message: result.message || "Final submission failed.",
        });
        return;
      }

      // SUCCESS: PRESERVE AND UPDATE STATE - DO NOT CLEAR FIELDS!
      const isUpdate = isSubmitted;
      setIsSubmitted(true);
      setSubmissionId(result.submissionId);
      setSubmissionDate(result.submissionDate || new Date().toISOString());
      setSubmissionStatus(result.status || "Submitted");

      // Update files in state so preview shows 'Currently Uploaded' and clears temporary input
      setFormData((prev) => ({
        ...prev,
        projectTitle: result.projectTitle || prev.projectTitle,
        projectDomain: result.projectDomain || prev.projectDomain,
        technologiesUsed: result.technologiesUsed || prev.technologiesUsed,
        githubRepository: result.githubRepository || prev.githubRepository,
        liveProjectUrl: result.liveProjectUrl || prev.liveProjectUrl,
        demoVideoUrl: result.demoVideoUrl || prev.demoVideoUrl,
        existingReportFile: result.finalReportFile || prev.existingReportFile,
        existingSourceFile: result.sourceCodeFile || prev.existingSourceFile,
        existingDatabaseFile: result.databaseFile || prev.existingDatabaseFile,
        finalReportFile: null,
        sourceCodeFile: null,
        databaseFile: null,
        declaration: true,
      }));

      const successMsg = isUpdate
        ? "Final Project details and files updated successfully!"
        : "Final Project submitted successfully!";

      setFeedback({
        type: "success",
        message: successMsg,
      });

      alert(successMsg);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Cannot connect to server. Please verify backend is running.");
      setFeedback({
        type: "error",
        message: "Cannot connect to backend server. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submission-container">
      {/* Header */}
      <div className="submission-header-block">
        <h1 className="page-title">Final Project Submission</h1>
        <p className="page-subtitle">
          Submit your completed project documentation, source code repositories, and database scripts for final faculty review and viva evaluation.
        </p>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="submission-loading-card">
          <div className="loading-spinner"></div>
          <p>Loading your project submission details...</p>
        </div>
      )}

      {/* SUBMISSION STATUS BANNER (SHOWN WHEN SUBMITTED) */}
      {!loading && isSubmitted && (
        <div className="submission-status-banner">
          <div className="status-banner-top">
            <div className="status-badge-group">
              <span className="status-badge-label">Submission Status:</span>
              <span className="status-pill status-submitted-pill">
                <FaCheckCircle className="status-pill-icon" />
                {submissionStatus}
              </span>
              {submissionId && (
                <span className="submission-id-tag">ID: #{submissionId}</span>
              )}
            </div>

            {submissionDate && (
              <div className="submission-time-badge">
                <FaCalendarAlt className="time-icon" />
                <span>Submitted: {formatDateTime(submissionDate)}</span>
              </div>
            )}
          </div>

          <div className="status-banner-body">
            <FaInfoCircle className="banner-info-icon" />
            <div className="banner-text-content">
              <strong>Your final project is recorded in the university system.</strong>
              <p>
                All your details, repository links, and uploaded files are preserved below so you can review them. You can update any links or upload replacement files at any time before final grading.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK TOAST / ALERT */}
      {feedback && (
        <div className={`feedback-alert feedback-${feedback.type}`}>
          {feedback.type === "success" ? (
            <FaCheck className="feedback-icon" />
          ) : (
            <FaExclamationTriangle className="feedback-icon" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit}>
        <ProjectInfoCard formData={formData} />

        <ProjectLinksCard formData={formData} setFormData={setFormData} />

        <UploadDocumentsCard
          formData={formData}
          setFormData={setFormData}
          isSubmitted={isSubmitted}
        />

        <DeclarationCard
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          isSubmitted={isSubmitted}
          submitting={submitting}
        />
      </form>
    </div>
  );
}
