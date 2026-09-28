import { useEffect, useState } from "react";
import "./MentorAssignment.css";

const API_URL =
  "http://localhost:8081/api/mentor-assignments";

function MentorAssignment() {

  // =====================================================
  // STATE
  // =====================================================

  const [assignments, setAssignments] = useState([]);

  const [facultyList, setFacultyList] = useState([]);

  const [editId, setEditId] = useState(null);

  const [selectedFaculty, setSelectedFaculty] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [facultyLoading, setFacultyLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // FETCH ASSIGNMENTS
  // =====================================================

  const fetchAssignments = async () => {

    try {

      const response =
        await fetch(API_URL);

      if (!response.ok) {

        throw new Error(
          `Failed to load assignments: ${response.status}`
        );
      }

      const data =
        await response.json();

      if (!Array.isArray(data)) {

        throw new Error(
          "Invalid assignments response"
        );
      }

      return data;

    } catch (error) {

      console.error(
        "FETCH ASSIGNMENTS ERROR:",
        error
      );

      throw error;
    }
  };


  // =====================================================
  // FETCH FACULTY
  // =====================================================

  const fetchFaculty = async () => {

    try {

      const response =
        await fetch(`${API_URL}/faculty`);

      if (!response.ok) {

        throw new Error(
          `Failed to load faculty: ${response.status}`
        );
      }

      const data =
        await response.json();

      if (!Array.isArray(data)) {

        throw new Error(
          "Invalid faculty response"
        );
      }

      return data;

    } catch (error) {

      console.error(
        "FETCH FACULTY ERROR:",
        error
      );

      throw error;
    }
  };


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    let cancelled = false;

    const loadData = async () => {

      try {

        const [
          assignmentsData,
          facultyData
        ] = await Promise.all([
          fetchAssignments(),
          fetchFaculty()
        ]);

        if (cancelled) {
          return;
        }

        setAssignments(
          assignmentsData
        );

        setFacultyList(
          facultyData
        );

        setError("");

      } catch (error) {

        if (cancelled) {
          return;
        }

        console.error(
          "LOAD DATA ERROR:",
          error
        );

        setError(
          "Unable to load data. Make sure Spring Boot is running on port 8081."
        );

      } finally {

        if (!cancelled) {

          setLoading(false);

          setFacultyLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };

  }, []);


  // =====================================================
  // DELETE ASSIGNMENT
  // =====================================================

  const deleteAssignment = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this assignment?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const response =
        await fetch(
          `${API_URL}/${id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {

        throw new Error(
          `Delete failed: ${response.status}`
        );
      }

      setAssignments(
        (previousAssignments) =>
          previousAssignments.filter(
            (assignment) =>
              assignment.id !== id
          )
      );

      if (editId === id) {

        setEditId(null);

        setSelectedFaculty("");
      }

      alert(
        "Assignment deleted successfully."
      );

    } catch (error) {

      console.error(
        "DELETE ERROR:",
        error
      );

      alert(
        "Unable to delete assignment. Please check the backend."
      );
    }
  };


  // =====================================================
  // ASSIGN MENTOR
  // =====================================================

 const assignMentor = async (assignmentId) => {

    if (!selectedFaculty) {
        alert("Please select a faculty.");
        return;
    }

    console.log("ASSIGNMENT ID:", assignmentId);
    console.log("SELECTED FACULTY ID:", selectedFaculty);

    try {

        const url =
            `${API_URL}/${assignmentId}/assign/${selectedFaculty}`;

        console.log("ASSIGN MENTOR URL:", url);

        const response = await fetch(
            url,
            {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                },
            }
        );

        const responseText =
            await response.text();

        console.log(
            "ASSIGN MENTOR STATUS:",
            response.status
        );

        console.log(
            "ASSIGN MENTOR RESPONSE:",
            responseText
        );

        if (!response.ok) {

            throw new Error(
                `Assignment failed: ${response.status} - ${responseText}`
            );
        }

        const updatedAssignment =
            JSON.parse(responseText);

        setAssignments(
            (previousAssignments) =>
                previousAssignments.map(
                    (assignment) =>
                        assignment.id === assignmentId
                            ? updatedAssignment
                            : assignment
                )
        );

        setEditId(null);
        setSelectedFaculty("");

        alert(
            "Mentor assigned successfully."
        );

    } catch (error) {

        console.error(
            "ASSIGN MENTOR ERROR:",
            error
        );

        alert(
            error.message ||
            "Unable to assign mentor."
        );
    }
};


  // =====================================================
  // SEARCH
  // =====================================================

  const filteredAssignments =
    assignments.filter(
      (assignment) => {

        const search =
          searchTerm
            .trim()
            .toLowerCase();

        if (!search) {
          return true;
        }

        return (

          // Group Number
          String(
            assignment.groupNumber || ""
          )
            .toLowerCase()
            .includes(search)

          ||

          // Project
          (assignment.project || "")
            .toLowerCase()
            .includes(search)

          ||

          // Mentor
          (assignment.mentor || "")
            .toLowerCase()
            .includes(search)

          ||

          // Department
          (assignment.department || "")
            .toLowerCase()
            .includes(search)

          ||

          // Status
          (assignment.status || "")
            .toLowerCase()
            .includes(search)
        );
      }
    );


  // =====================================================
  // COUNTS
  // =====================================================

  const totalAssignments =
    assignments.length;

  const assignedCount =
    assignments.filter(
      (assignment) =>
        assignment.status === "Assigned"
    ).length;

  const pendingCount =
    assignments.filter(
      (assignment) =>
        assignment.status === "Pending"
    ).length;


  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEdit = (id) => {

    setEditId(id);

    setSelectedFaculty("");
  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const cancelEdit = () => {

    setEditId(null);

    setSelectedFaculty("");
  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="mentor-page">

      {/* =================================================
          PAGE TITLE
      ================================================= */}

      <h1>
        Mentor Assignment
      </h1>


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="mentor-cards">

        {/* TOTAL */}

        <div className="mentor-card">

          <h2>
            {totalAssignments}
          </h2>

          <p>
            Total Assignments
          </p>

        </div>


        {/* ASSIGNED */}

        <div className="mentor-card">

          <h2>
            {assignedCount}
          </h2>

          <p>
            Assigned
          </p>

        </div>


        {/* PENDING */}

        <div className="mentor-card">

          <h2>
            {pendingCount}
          </h2>

          <p>
            Pending
          </p>

        </div>

      </div>


      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="mentor-search">

        <input
          type="text"
          placeholder="Search Group Number, Project or Mentor..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(
              event.target.value
            )
          }
        />

      </div>


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="mentor-table">

        {loading ? (

          <p className="loading-text">
            Loading assignments...
          </p>

        ) : (

          <table>

            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <thead>

              <tr>

                <th>
                  Group Number
                </th>

                <th>
                  Project
                </th>

                <th>
                  Mentor
                </th>

                <th>
                  Department
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody>

              {filteredAssignments.length === 0 ? (

                <tr>

                  <td colSpan="6">

                    No assignments found.

                  </td>

                </tr>

              ) : (

                filteredAssignments.map(
                  (assignment) => (

                    <tr
                      key={assignment.id}
                    >

                      {/* =================================================
                          GROUP NUMBER
                      ================================================= */}

                      <td>

                        {assignment.groupNumber}

                      </td>


                      {/* =================================================
                          PROJECT
                      ================================================= */}

                      <td>

                        {assignment.project ||
                          "-"}

                      </td>


                      {/* =================================================
                          MENTOR
                      ================================================= */}

                      <td>

                        {assignment.mentor ||
                          "-"}

                      </td>


                      {/* =================================================
                          DEPARTMENT
                      ================================================= */}

                      <td>

                        {assignment.department ||
                          "-"}

                      </td>


                      {/* =================================================
                          STATUS
                      ================================================= */}

                      <td>

                        <span
                          className={
                            assignment.status ===
                            "Assigned"
                              ? "status assigned"
                              : "status pending"
                          }
                        >

                          {assignment.status ||
                            "Pending"}

                        </span>

                      </td>


                      {/* =================================================
                          ACTION
                      ================================================= */}

                      <td>

                        {editId ===
                        assignment.id ? (

                          <div className="assign-section">

                            {/* FACULTY SELECT */}

                            <select
                              value={
                                selectedFaculty
                              }
                              onChange={(
                                event
                              ) =>
                                setSelectedFaculty(
                                  event.target
                                    .value
                                )
                              }
                              disabled={
                                facultyLoading
                              }
                            >

                              <option value="">

                                {facultyLoading
                                  ? "Loading Faculty..."
                                  : "Select Faculty"}

                              </option>


                              {facultyList.map(
                                (faculty) => (

                                 <option
    key={faculty.id ?? faculty.facultyId}
    value={faculty.id ?? faculty.facultyId}
>
    {faculty.name ?? faculty.facultyName}
    {faculty.department
        ? ` (${faculty.department})`
        : ""}
</option>

                                )
                              )}

                            </select>


                            {/* ASSIGN */}

                            <button
                              type="button"
                              className="assign-btn"
                              onClick={() =>
                                assignMentor(
                                  assignment.id
                                )
                              }
                              disabled={
                                facultyLoading ||
                                !selectedFaculty
                              }
                            >

                              Assign

                            </button>


                            {/* CANCEL */}

                            <button
                              type="button"
                              className="cancel-btn"
                              onClick={
                                cancelEdit
                              }
                            >

                              Cancel

                            </button>

                          </div>

                        ) : (

                          <div className="action-buttons">

                            {/* EDIT */}

                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() =>
                                openEdit(
                                  assignment.id
                                )
                              }
                            >

                              Edit

                            </button>


                            {/* DELETE */}

                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                deleteAssignment(
                                  assignment.id
                                )
                              }
                            >

                              Delete

                            </button>

                          </div>

                        )}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}

export default MentorAssignment;