import { useEffect, useMemo, useState } from "react";
import "./GenerateMarksheet.css";
import html2pdf from "html2pdf.js";

const API_BASE_URL =
  "http://localhost:8081/api/generate-marksheet";

function GenerateMarksheet() {

  const [students, setStudents] = useState([]);

  const [selectedStudentId, setSelectedStudentId] =
    useState("");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [subject, setSubject] = useState(
    "Software Development Project"
  );

  const [finalVivaDate, setFinalVivaDate] =
    useState("");

  const [remarks, setRemarks] = useState("");

  const [showPreview, setShowPreview] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [loadingStudent, setLoadingStudent] =
    useState(false);

  const [error, setError] =
    useState("");

  const getFacultyInfo = () => {
    const stored = JSON.parse(localStorage.getItem("faculty")) || JSON.parse(localStorage.getItem("user")) || {};
    return {
      facultyId: stored.facultyId || stored.id || localStorage.getItem("facultyId") || "",
      facultyName: stored.facultyName || stored.name || localStorage.getItem("facultyName") || ""
    };
  };

  // =========================================================
  // LOAD STUDENTS WITH MARKS
  // =========================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {

    try {

      setLoading(true);
      setError("");

      const { facultyId, facultyName } = getFacultyInfo();
      const params = new URLSearchParams();
      if (facultyId) params.append("facultyId", facultyId);
      if (facultyName) params.append("facultyName", facultyName);

      const response = await fetch(
        `${API_BASE_URL}/students?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load students with marks."
        );
      }

      const data = await response.json();

      console.log(
        "Generate Marksheet students:",
        data
      );

      setStudents(data);

      if (data.length > 0) {

        setSelectedStudentId(
          data[0].studentId
        );

        setSelectedStudent(data[0]);

        setRemarks(
          data[0].overallComments || ""
        );
      }

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to load students."
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================================================
  // SELECT STUDENT
  // =========================================================

  const handleStudentChange = async (event) => {

    const studentId = Number(
      event.target.value
    );

    setSelectedStudentId(studentId);

    setShowPreview(false);

    try {

      setLoadingStudent(true);
      setError("");

      const { facultyId, facultyName } = getFacultyInfo();
      const params = new URLSearchParams();
      if (facultyId) params.append("facultyId", facultyId);
      if (facultyName) params.append("facultyName", facultyName);

      const response = await fetch(
        `${API_BASE_URL}/student/${studentId}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load student's marks."
        );
      }

      const data = await response.json();

      console.log(
        "Selected student marks:",
        data
      );

      setSelectedStudent(data);

      setRemarks(
        data.overallComments || ""
      );

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to load student marks."
      );

      setSelectedStudent(null);

    } finally {

      setLoadingStudent(false);

    }
  };

  // =========================================================
  // TOTAL
  // =========================================================

  const total = useMemo(() => {

    if (!selectedStudent) {
      return 0;
    }

    return (
      Number(
        selectedStudent.proposalMarks || 0
      ) +

      Number(
        selectedStudent.weeklyProgressMarks || 0
      ) +

      Number(
        selectedStudent.finalReportMarks || 0
      ) +

      Number(
        selectedStudent.presentationVivaMarks || 0
      ) +

      Number(
        selectedStudent.sourceCodeMarks || 0
      )
    );

  }, [selectedStudent]);

  // =========================================================
  // PERCENTAGE
  // =========================================================

  const percentage = useMemo(() => {

    if (!selectedStudent) {
      return "0.00";
    }

    return Number(
      selectedStudent.percentage ?? total
    ).toFixed(2);

  }, [selectedStudent, total]);

  // =========================================================
  // GRADE
  // =========================================================

  const grade = useMemo(() => {

    const marks = Number(total);

    if (marks >= 85) return "A+";
    if (marks >= 75) return "A";
    if (marks >= 65) return "B+";
    if (marks >= 50) return "B";

    return "C";

  }, [total]);

  // =========================================================
  // RESULT
  // =========================================================

  const result = useMemo(() => {

    if (selectedStudent?.result) {
      return selectedStudent.result;
    }

    return total >= 40
      ? "PASS"
      : "FAIL";

  }, [selectedStudent, total]);

  // =========================================================
  // GENERATE
  // =========================================================

  const handleGenerate = (event) => {

    event.preventDefault();

    if (!selectedStudent) {

      setError(
        "Please select a student."
      );

      return;
    }

    setError("");

    setShowPreview(true);
  };

  // =========================================================
  // RESET PREVIEW
  // =========================================================

  const handleReset = () => {

    setShowPreview(false);

  };

  // =========================================================
  // PRINT / DOWNLOAD
  // =========================================================

const handleDownload = () => {
  const element = document.querySelector(".gm-preview");

  if (!element) {
    alert("Please generate the marksheet first.");
    return;
  }

  const options = {
    margin: 0.3,
    filename: `${selectedStudent?.studentName || "Student"}_Marksheet.pdf`,
    image: {
      type: "jpeg",
      quality: 0.98,
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      unit: "in",
      format: "a4",
      orientation: "portrait",
    },
  };

  html2pdf()
    .set(options)
    .from(element)
    .save();
};

  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="gm-container">

      <div className="gm-header">

        <h1>
          Generate Marksheet
        </h1>

        <p>
          Select a student, preview the marksheet,
          and download it as a printable report.
        </p>

      </div>

      {/* ERROR */}

      {error && (

        <div
          style={{
            padding: "12px",
            marginBottom: "15px",
            background: "#ffe5e5",
            color: "#c62828",
            borderRadius: "8px"
          }}
        >
          {error}
        </div>

      )}

      {/* FORM */}

      <form
        onSubmit={handleGenerate}
        className="gm-form"
      >

        <div className="gm-grid-2">

          {/* STUDENT */}

          <label>

            Student

            <select
              value={selectedStudentId}
              onChange={handleStudentChange}
              className="gm-input"
              disabled={
                loading ||
                loadingStudent
              }
            >

              {loading ? (

                <option>
                  Loading students...
                </option>

              ) : students.length === 0 ? (

                <option>
                  No students with marks
                </option>

              ) : (

                students.map((student) => (

                  <option
                    key={student.studentId}
                    value={student.studentId}
                  >

                    {student.studentName}
                    {" — "}
                    {student.enrollment}

                  </option>

                ))

              )}

            </select>

          </label>

          {/* SUBJECT */}

          <label>

            Subject

            <input
              type="text"
              value={subject}
              onChange={(event) =>
                setSubject(
                  event.target.value
                )
              }
              className="gm-input"
            />

          </label>

          {/* VIVA DATE */}

          <label>

            Final Viva Date

            <input
              type="date"
              value={finalVivaDate}
              onChange={(event) =>
                setFinalVivaDate(
                  event.target.value
                )
              }
              className="gm-input"
            />

          </label>

          {/* PROJECT */}

          <label>

            Project Title

            <input
              type="text"
              value={
                selectedStudent?.projectTitle ||
                ""
              }
              disabled
              className="gm-input gm-disabled"
            />

          </label>

        </div>

        {/* LOADING */}

        {loadingStudent && (

          <p>
            Loading student's marks...
          </p>

        )}

        {/* MARKS */}

        {selectedStudent &&
          !loadingStudent && (

          <>

            <div className="gm-grid-3">

              <label>

                Proposal (20)

                <input
                  type="text"
                  value={
                    selectedStudent.proposalMarks ??
                    0
                  }
                  disabled
                  className="gm-input gm-disabled"
                />

              </label>

              <label>

                Weekly Review (30)

                <input
                  type="text"
                  value={
                    selectedStudent.weeklyProgressMarks ??
                    0
                  }
                  disabled
                  className="gm-input gm-disabled"
                />

              </label>

              <label>

                Final Report (20)

                <input
                  type="text"
                  value={
                    selectedStudent.finalReportMarks ??
                    0
                  }
                  disabled
                  className="gm-input gm-disabled"
                />

              </label>

            </div>

            <div className="gm-grid-3">

              <label>

                Presentation / Viva (20)

                <input
                  type="text"
                  value={
                    selectedStudent.presentationVivaMarks ??
                    0
                  }
                  disabled
                  className="gm-input gm-disabled"
                />

              </label>

              <label>

                Source Code (10)

                <input
                  type="text"
                  value={
                    selectedStudent.sourceCodeMarks ??
                    0
                  }
                  disabled
                  className="gm-input gm-disabled"
                />

              </label>

              <label>

                Total (100)

                <input
                  type="text"
                  value={total}
                  disabled
                  className="gm-input gm-disabled"
                />

              </label>

            </div>

            {/* REMARKS */}

            <label>

              Faculty Remarks

              <textarea
                rows="3"
                value={remarks}
                onChange={(event) =>
                  setRemarks(
                    event.target.value
                  )
                }
                className="gm-textarea"
              />

            </label>

            {/* ACTIONS */}

            <div className="gm-actions">

              <button
                type="button"
                onClick={handleReset}
                className="gm-btn gm-btn-primary"
              >
                Reset Preview
              </button>

              <button
                type="submit"
                className="gm-btn gm-btn-primary"
                disabled={!selectedStudent}
              >
                Generate Marksheet
              </button>

            </div>

          </>
        )}

      </form>

      {/* =====================================================
          PREVIEW
          ===================================================== */}

      {showPreview &&
        selectedStudent && (

        <section className="gm-preview">

          <div className="gm-preview-header">

            <div>

              <h2 className="gm-preview-title">
                Sardar Vallabhbhai Global University              </h2>

              <p className="gm-muted">
                Department of Computer Applications
              </p>

            </div>

            <div className="gm-preview-date">

              <p className="gm-strong">
                Final Viva Date
              </p>

              <p className="gm-small">
                {finalVivaDate || "Not specified"}
              </p>

            </div>

          </div>

          {/* STUDENT DETAILS */}

          <div className="gm-grid-2 gm-preview-details">

            <div>

              <p className="gm-strong gm-no-margin">
                Student Name
              </p>

              <p className="gm-small">
                {selectedStudent.studentName}
              </p>

            </div>

            <div>

              <p className="gm-strong gm-no-margin">
                Enrollment No
              </p>

              <p className="gm-small">
                {selectedStudent.enrollment}
              </p>

            </div>

            <div>

              <p className="gm-strong gm-no-margin">
                Project Title
              </p>

              <p className="gm-small">
                {selectedStudent.projectTitle}
              </p>

            </div>

            <div>

              <p className="gm-strong gm-no-margin">
                Guide Name
              </p>

              <p className="gm-small">
                {selectedStudent.guideName || "-"}
              </p>

            </div>

            <div>

              <p className="gm-strong gm-no-margin">
                Subject
              </p>

              <p className="gm-small">
                {subject}
              </p>

            </div>

          </div>

          {/* MARKS TABLE */}

          <table className="gm-table">

            <thead>

              <tr>

                <th>
                  Component
                </th>

                <th className="gm-right">
                  Marks Obtained
                </th>

                <th className="gm-right">
                  Max Marks
                </th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td>
                  Proposal
                </td>

                <td className="gm-right">
                  {selectedStudent.proposalMarks}
                </td>

                <td className="gm-right">
                  20
                </td>

              </tr>

              <tr>

                <td>
                  Weekly Review
                </td>

                <td className="gm-right">
                  {selectedStudent.weeklyProgressMarks}
                </td>

                <td className="gm-right">
                  30
                </td>

              </tr>

              <tr>

                <td>
                  Final Report
                </td>

                <td className="gm-right">
                  {selectedStudent.finalReportMarks}
                </td>

                <td className="gm-right">
                  20
                </td>

              </tr>

              <tr>

                <td>
                  Presentation / Viva
                </td>

                <td className="gm-right">
                  {selectedStudent.presentationVivaMarks}
                </td>

                <td className="gm-right">
                  20
                </td>

              </tr>

              <tr>

                <td>
                  Source Code
                </td>

                <td className="gm-right">
                  {selectedStudent.sourceCodeMarks}
                </td>

                <td className="gm-right">
                  10
                </td>

              </tr>

              <tr className="gm-total-row">

                <td>
                  Total
                </td>

                <td className="gm-right">
                  {total}
                </td>

                <td className="gm-right">
                  100
                </td>

              </tr>

            </tbody>

          </table>

          {/* SUMMARY */}

          <div className="gm-grid-2 gm-summary">

            <div>

              <p className="gm-strong gm-no-margin">
                Percentage
              </p>

              <p className="gm-small">
                {percentage}%
              </p>

            </div>

            <div>

              <p className="gm-strong gm-no-margin">
                Grade
              </p>

              <p className="gm-small">
                {grade}
              </p>

            </div>

            <div>

              <p className="gm-strong gm-no-margin">
                Result
              </p>

              <p
                className={
                  result === "PASS"
                    ? "gm-result pass"
                    : "gm-result fail"
                }
              >
                {result}
              </p>

            </div>

            <div>

              <p className="gm-strong gm-no-margin">
                Faculty Signature
              </p>

              <p className="gm-small">
                ________________________
              </p>

            </div>

          </div>

          {/* REMARKS */}

          <div className="gm-remarks-block">

            <p className="gm-strong gm-no-margin">
              Remarks
            </p>

            <p className="gm-remarks">
              {remarks || "No remarks provided."}
            </p>

          </div>

          {/* DOWNLOAD */}

          <div className="gm-actions gm-actions-end">

            <button
              type="button"
              onClick={handleDownload}
              className="gm-btn gm-btn-primary"
            >
              Download
            </button>

          </div>

        </section>

      )}

    </div>
  );
}

export default GenerateMarksheet;