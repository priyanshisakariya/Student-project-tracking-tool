import { useEffect, useState } from "react";
import "./MarkManagement.css";

const API_BASE_URL = "http://localhost:8081";

function MarkManagement() {

  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [marks, setMarks] = useState({
    proposal: 0,
    weekly: 0,
    implementation: 0,
    documentation: 0,
    presentation: 0,
    viva: 0,
    remarks: "",
  });


  const getFacultyInfo = () => {
    const stored = JSON.parse(localStorage.getItem("faculty")) || JSON.parse(localStorage.getItem("user")) || {};
    return {
      facultyId: stored.facultyId || stored.id || localStorage.getItem("facultyId") || "",
      facultyName: stored.facultyName || stored.name || localStorage.getItem("facultyName") || ""
    };
  };

  // --------------------------------------------------
  // LOAD STUDENTS FROM BACKEND
  // --------------------------------------------------

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
        `${API_BASE_URL}/marks/students?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to load students.");
      }

      const data = await response.json();

      setStudents(data);

    } catch (err) {

      console.error("Error loading students:", err);

      setError(
        err.message ||
        "Unable to load students from server."
      );

    } finally {

      setLoading(false);
    }
  };


  // --------------------------------------------------
  // OPEN MARK MODAL
  // --------------------------------------------------

  const openMarksModal = async (student) => {

    setSelectedStudent(student);

    setError("");

    // Reset form first
    setMarks({
      proposal: 0,
      weekly: 0,
      implementation: 0,
      documentation: 0,
      presentation: 0,
      viva: 0,
      remarks: "",
    });


    try {

      const { facultyId, facultyName } = getFacultyInfo();
      const stId = student.studentId || student.id;
      const params = new URLSearchParams();
      if (facultyId) params.append("facultyId", facultyId);
      if (facultyName) params.append("facultyName", facultyName);

      const response = await fetch(
        `${API_BASE_URL}/marks/student/${stId}?${params.toString()}`
      );


      // Student does not have marks yet
      if (response.status === 404) {
        return;
      }


      if (!response.ok) {
        throw new Error("Failed to load student marks.");
      }


      const data = await response.json();


      /*
       * Database has:
       *
       * presentation_viva_marks
       *
       * instead of separate presentation and viva
       *
       * So we display the stored combined value as Viva
       * while Presentation starts from 0 when reopening.
       */

      setMarks({
        proposal: data.proposalMarks ?? 0,

        weekly: data.weeklyProgressMarks ?? 0,

        implementation: data.sourceCodeMarks ?? 0,

        documentation: data.finalReportMarks ?? 0,

        presentation: 0,

        viva: data.presentationVivaMarks ?? 0,

        remarks: data.overallComments ?? "",
      });

    } catch (err) {

      console.error("Error loading marks:", err);

      setError(
        err.message ||
        "Unable to load marks."
      );
    }
  };


  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {

    const { name, value } = e.target;

    setMarks((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // --------------------------------------------------
  // TOTAL
  // --------------------------------------------------

  const total =
    Number(marks.proposal || 0) +
    Number(marks.weekly || 0) +
    Number(marks.implementation || 0) +
    Number(marks.documentation || 0) +
    Number(marks.presentation || 0) +
    Number(marks.viva || 0);


  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredStudents = students.filter((student) => {

    const searchValue = search.toLowerCase();

    return (
      student.name?.toLowerCase().includes(searchValue) ||
      student.enrollment?.toLowerCase().includes(searchValue) ||
      student.project?.toLowerCase().includes(searchValue)
    );
  });


  // --------------------------------------------------
  // SAVE MARKS
  // --------------------------------------------------

  const handleSaveMarks = async () => {

    if (!selectedStudent) {
      return;
    }


    // Frontend validation

    if (
      Number(marks.proposal) < 0 ||
      Number(marks.proposal) > 20
    ) {
      alert("Proposal marks must be between 0 and 20.");
      return;
    }


    if (
      Number(marks.weekly) < 0 ||
      Number(marks.weekly) > 30
    ) {
      alert("Weekly Review marks must be between 0 and 30.");
      return;
    }


    if (
      Number(marks.implementation) < 0 ||
      Number(marks.implementation) > 20
    ) {
      alert("Implementation marks must be between 0 and 20.");
      return;
    }


    if (
      Number(marks.documentation) < 0 ||
      Number(marks.documentation) > 10
    ) {
      alert("Documentation marks must be between 0 and 10.");
      return;
    }


    if (
      Number(marks.presentation) < 0 ||
      Number(marks.presentation) > 10
    ) {
      alert("Presentation marks must be between 0 and 10.");
      return;
    }


    if (
      Number(marks.viva) < 0 ||
      Number(marks.viva) > 10
    ) {
      alert("Viva marks must be between 0 and 10.");
      return;
    }


    // Presentation + Viva = presentation_viva_marks

    const presentationViva =
      Number(marks.presentation || 0) +
      Number(marks.viva || 0);


    try {

      setSaving(true);
      setError("");


      const requestBody = {

        studentId: selectedStudent.studentId || selectedStudent.id,

        /*
         * Keep null until FinalSubmission is connected.
         */
        submissionId: null,

        proposalMarks:
          Number(marks.proposal || 0),

        weeklyProgressMarks:
          Number(marks.weekly || 0),

        finalReportMarks:
          Number(marks.documentation || 0),

        presentationVivaMarks:
          presentationViva,

        sourceCodeMarks:
          Number(marks.implementation || 0),

        strengths: "",

        areasForImprovement: "",

        overallComments:
          marks.remarks || "",
      };


      const { facultyId, facultyName } = getFacultyInfo();
      const saveParams = new URLSearchParams();
      if (facultyId) saveParams.append("facultyId", facultyId);
      if (facultyName) saveParams.append("facultyName", facultyName);

      const response = await fetch(
        `${API_BASE_URL}/marks?${saveParams.toString()}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(requestBody),
        }
      );


      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          "Failed to save marks."
        );
      }


      const savedData =
        await response.json();


      console.log(
        "Marks saved:",
        savedData
      );


      alert("Marks saved successfully!");


      // Close modal
      setSelectedStudent(null);


      // Reload dynamic table
      await fetchStudents();


    } catch (err) {

      console.error(
        "Error saving marks:",
        err
      );

      setError(
        err.message ||
        "Unable to save marks."
      );

      alert(
        err.message ||
        "Unable to save marks."
      );

    } finally {

      setSaving(false);
    }
  };


  return (

    <div className="mark-page">

      {/* HEADER */}

      <div className="mark-header">

        <h1>
          Mark Management
        </h1>

        <p>
          Assign marks based on student performance.
        </p>

      </div>


      {/* ERROR */}

      {error && !selectedStudent && (

        <div
          style={{
            color: "red",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>

      )}


      {/* SEARCH */}

      <input
        className="search-box"
        type="text"
        placeholder="Search Student..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />


      {/* TABLE */}

      {loading ? (

        <p>
          Loading students...
        </p>

      ) : (

        <div style={{ overflowX: "auto", width: "100%", borderRadius: "12px", boxShadow: "0 5px 18px rgba(0,0,0,.08)" }}>
          <table className="student-table" style={{ margin: 0 }}>

            <thead>

              <tr>

                <th>
                  Name
                </th>

                <th>
                  Enrollment
                </th>

                <th>
                  Project
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredStudents.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No students found.
                  </td>

                </tr>

              ) : (

                filteredStudents.map(
                  (student) => (

                    <tr
                      key={student.studentId}
                    >

                      <td>
                        {student.name}
                      </td>

                      <td>
                        {student.enrollment}
                      </td>

                      <td>
                        {student.project}
                      </td>

                      <td>

                        <button
                          className="assign-btn"
                          onClick={() =>
                            openMarksModal(student)
                          }
                        >
                          {student.marksId
                            ? "Edit Marks"
                            : "Assign Marks"}
                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>
        </div>

      )}


      {/* MODAL */}

      {selectedStudent && (

        <div className="modal-overlay">

          <div className="mark-modal" style={{ maxHeight: "90vh", overflowY: "auto" }}>


            {/* STUDENT */}

            <h2>
              {selectedStudent.name}
            </h2>


            <p>
              {selectedStudent.project}
            </p>


            {/* ERROR INSIDE MODAL */}

            {error && (

              <div
                style={{
                  color: "red",
                  marginBottom: "10px",
                }}
              >
                {error}
              </div>

            )}


            {/* MARK GRID */}

            <div className="mark-grid">


              {/* PROPOSAL */}

              <div>

                <label>
                  Proposal (20)
                </label>

                <input
                  type="number"
                  min="0"
                  max="20"
                  name="proposal"
                  value={marks.proposal}
                  onChange={handleChange}
                />

              </div>


              {/* WEEKLY */}

              <div>

                <label>
                  Weekly Review (30)
                </label>

                <input
                  type="number"
                  min="0"
                  max="30"
                  name="weekly"
                  value={marks.weekly}
                  onChange={handleChange}
                />

              </div>


              {/* IMPLEMENTATION */}

              <div>

                <label>
                  Implementation (20)
                </label>

                <input
                  type="number"
                  min="0"
                  max="20"
                  name="implementation"
                  value={marks.implementation}
                  onChange={handleChange}
                />

              </div>


              {/* DOCUMENTATION */}

              <div>

                <label>
                  Documentation (10)
                </label>

                <input
                  type="number"
                  min="0"
                  max="10"
                  name="documentation"
                  value={marks.documentation}
                  onChange={handleChange}
                />

              </div>


              {/* PRESENTATION */}

              <div>

                <label>
                  Presentation (10)
                </label>

                <input
                  type="number"
                  min="0"
                  max="10"
                  name="presentation"
                  value={marks.presentation}
                  onChange={handleChange}
                />

              </div>


              {/* VIVA */}

              <div>

                <label>
                  Viva (10)
                </label>

                <input
                  type="number"
                  min="0"
                  max="10"
                  name="viva"
                  value={marks.viva}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* TOTAL */}

            <h3>
              Total : {total} / 100
            </h3>


            {/* REMARKS */}

            <textarea
              name="remarks"
              placeholder="Faculty Remarks..."
              value={marks.remarks}
              onChange={handleChange}
            />


            {/* BUTTONS */}

            <div className="button-group">

              <button
                className="save-btn"
                onClick={handleSaveMarks}
                disabled={saving}
              >

                {saving
                  ? "Saving..."
                  : "Save Marks"}

              </button>


              <button
                className="cancel-btn"
                onClick={() =>
                  setSelectedStudent(null)
                }
                disabled={saving}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default MarkManagement;


/*
import { useState } from "react";
import "./MarkManagement.css";

function MarkManagement() {
  const students = [
    {
      id: 1,
      name: "Rahul Patel",
      enrollment: "23BCA001",
      project: "Student Project Tracking Tool",
    },
    {
      id: 2,
      name: "Priya Shah",
      enrollment: "23BCA002",
      project: "Hospital Management System",
    },
    {
      id: 3,
      name: "Jay Mehta",
      enrollment: "23BCA003",
      project: "AI Resume Analyzer",
    },
  ];

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [marks, setMarks] = useState({
    proposal: 0,
    weekly: 0,
    implementation: 0,
    documentation: 0,
    presentation: 0,
    viva: 0,
    remarks: "",
  });

  const handleChange = (e) => {
    setMarks({
      ...marks,
      [e.target.name]: e.target.value,
    });
  };

  const total =
    Number(marks.proposal) +
    Number(marks.weekly) +
    Number(marks.implementation) +
    Number(marks.documentation) +
    Number(marks.presentation) +
    Number(marks.viva);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mark-page">

      <div className="mark-header">
        <h1>Mark Management</h1>
        <p>Assign marks based on student performance.</p>
      </div>

      <input
        className="search-box"
        type="text"
        placeholder="Search Student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="student-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Enrollment</th>
            <th>Project</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredStudents.map((student) => (

            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.enrollment}</td>
              <td>{student.project}</td>

              <td>

                <button
                  className="assign-btn"
                  onClick={() => setSelectedStudent(student)}
                >
                  Assign Marks
                </button>

              </td>
            </tr>

          ))}

        </tbody>

      </table>

      {selectedStudent && (

        <div className="modal-overlay">

          <div className="mark-modal">

            <h2>{selectedStudent.name}</h2>

            <p>{selectedStudent.project}</p>

            <div className="mark-grid">

              <div>
                <label>Proposal (20)</label>
                <input
                  type="number"
                  name="proposal"
                  value={marks.proposal}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Weekly Review (30)</label>
                <input
                  type="number"
                  name="weekly"
                  value={marks.weekly}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Implementation (20)</label>
                <input
                  type="number"
                  name="implementation"
                  value={marks.implementation}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Documentation (10)</label>
                <input
                  type="number"
                  name="documentation"
                  value={marks.documentation}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Presentation (10)</label>
                <input
                  type="number"
                  name="presentation"
                  value={marks.presentation}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Viva (10)</label>
                <input
                  type="number"
                  name="viva"
                  value={marks.viva}
                  onChange={handleChange}
                />
              </div>

            </div>

            <h3>Total : {total} / 100</h3>

            <textarea
              name="remarks"
              placeholder="Faculty Remarks..."
              value={marks.remarks}
              onChange={handleChange}
            />

            <div className="button-group">

              <button className="save-btn">
                Save Marks
              </button>

              <button
                className="cancel-btn"
                onClick={() => setSelectedStudent(null)}
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default MarkManagement;
*/