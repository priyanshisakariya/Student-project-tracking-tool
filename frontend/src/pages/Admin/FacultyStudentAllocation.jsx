import { useEffect, useState } from "react";
import "./FacultyStudentAllocation.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = "http://localhost:8081/api/faculty-student-reports";

function FacultyStudentAllocation() {

  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH REPORT DATA FROM BACKEND
  // =====================================================

  const fetchStudentAllocation = async () => {
    try {

      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to load report: ${response.status}`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid report response");
      }

      setStudentData(data);

    } catch (error) {

      console.error(
        "FACULTY STUDENT REPORT ERROR:",
        error
      );

      setError(
        "Unable to load faculty student allocation report."
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // LOAD DATA WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchStudentAllocation();
  }, []);

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const downloadPDF = () => {

    if (studentData.length === 0) {
      alert("No data available to generate PDF.");
      return;
    }

    // Landscape A4 because the table has many columns
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // =====================================================
    // PDF TITLE
    // =====================================================

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(75, 46, 131);

    doc.text(
      "Faculty Student Allocation",
      148.5,
      15,
      {
        align: "center",
      }
    );

    // =====================================================
    // PDF SUBTITLE
    // =====================================================

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);

    doc.text(
      "Faculty and Student Group Allocation",
      148.5,
      22,
      {
        align: "center",
      }
    );

    // =====================================================
    // TABLE HEADERS
    // =====================================================

    const tableHeaders = [
      [
        "Group No",
        "1st Student\nEnrollment No",
        "1st Student Name",
        "2nd Student\nEnrollment No",
        "2nd Student Name",
        "3rd Student\nEnrollment No",
        "3rd Student Name",
        "Faculty Guide",
      ],
    ];

    // =====================================================
    // TABLE ROWS
    // =====================================================

    const tableRows = studentData.map((student) => [

      student.groupNo,

      student.student1EnrollmentNo,

      student.student1Name,

      student.student2EnrollmentNo,

      student.student2Name,

      student.student3EnrollmentNo,

      student.student3Name,

      student.facultyGuide,

    ]);

    // =====================================================
    // GENERATE PDF TABLE
    // =====================================================

    autoTable(doc, {

      head: tableHeaders,

      body: tableRows,

      startY: 28,

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 7,
        textColor: [40, 40, 40],
        cellPadding: 3,
        valign: "middle",
        halign: "center",
        lineColor: [210, 210, 210],
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: [91, 63, 140],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 7.5,
        halign: "center",
        valign: "middle",
        cellPadding: 3,
      },

      bodyStyles: {
        minCellHeight: 14,
      },

      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },

      columnStyles: {

        0: {
          cellWidth: 15,
        },

        1: {
          cellWidth: 28,
        },

        2: {
          cellWidth: 43,
        },

        3: {
          cellWidth: 28,
        },

        4: {
          cellWidth: 43,
        },

        5: {
          cellWidth: 28,
        },

        6: {
          cellWidth: 43,
        },

        7: {
          cellWidth: 25,
        },

      },

      // Make student names bold
      didParseCell: function (data) {

        if (
          data.section === "body" &&
          (
            data.column.index === 2 ||
            data.column.index === 4 ||
            data.column.index === 6
          )
        ) {

          data.cell.styles.fontStyle = "bold";

        }

      },

      margin: {
        left: 8,
        right: 8,
      },

    });

    // =====================================================
    // FOOTER
    // =====================================================

    const pageCount =
      doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {

      doc.setPage(i);

      doc.setFontSize(8);
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(
        100,
        100,
        100
      );

      doc.text(
        `Faculty Student Allocation | Page ${i} of ${pageCount}`,
        148.5,
        202,
        {
          align: "center",
        }
      );

    }

    // =====================================================
    // DOWNLOAD PDF
    // =====================================================

    doc.save(
      "Faculty_Student_Allocation.pdf"
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="faculty-allocation-container">

      {/* HEADER */}

      <div className="allocation-header">

        <h1 className="table-title">
          Faculty Student Allocation
        </h1>

        <button
          className="download-pdf-btn"
          onClick={downloadPDF}
          disabled={
            loading ||
            studentData.length === 0
          }
        >
          <span className="download-icon">
            ↓
          </span>

          Download PDF

        </button>

      </div>

      {/* ERROR */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}

      {/* LOADING */}

      {loading ? (

        <div className="loading-message">
          Loading faculty student allocation...
        </div>

      ) : (

        /* TABLE */

        <div className="table-responsive">

          <table className="allocation-table">

            <thead>

              <tr>

                <th>
                  Group No
                </th>

                <th>
                  1st Student
                  <br />
                  Enrollment No
                </th>

                <th>
                  1st Student Name
                </th>

                <th>
                  2nd Student
                  <br />
                  Enrollment No
                </th>

                <th>
                  2nd Student Name
                </th>

                <th>
                  3rd Student
                  <br />
                  Enrollment No
                </th>

                <th>
                  3rd Student Name
                </th>

                <th>
                  Faculty Guide
                </th>

              </tr>

            </thead>

            <tbody>

              {studentData.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No faculty student allocation
                    records found.

                  </td>

                </tr>

              ) : (

                studentData.map((student) => (

                  <tr key={student.id}>

                    <td>
                      {student.groupNo}
                    </td>

                    <td>
                      {student.student1EnrollmentNo}
                    </td>

                    <td>
                      {student.student1Name}
                    </td>

                    <td>
                      {student.student2EnrollmentNo}
                    </td>

                    <td>
                      {student.student2Name}
                    </td>

                    <td>
                      {student.student3EnrollmentNo}
                    </td>

                    <td>
                      {student.student3Name}
                    </td>

                    <td>
                      {student.facultyGuide}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );
}

export default FacultyStudentAllocation;