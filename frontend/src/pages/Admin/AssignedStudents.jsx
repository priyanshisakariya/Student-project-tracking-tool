
import { useEffect, useState } from "react";
import "./AssignedStudents.css";

const GET_ALL_URL = "http://localhost:8081/api/studentAdminControls/all";
const UPDATE_URL = "http://localhost:8081/api/studentAdminControls";
const DELETE_URL = "http://localhost:8081/api/studentAdminControls/delete";

function StudentManagement() {

  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Status");
  const [projectFilter, setProjectFilter] =
    useState("All Projects");

  const [showModal, setShowModal] =
    useState(false);

  const [modalType, setModalType] =
    useState("");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  // =========================================================
  // FORM DATA
  // ONLY PROJECT + STATUS CAN BE EDITED
  // =========================================================

  const [formData, setFormData] = useState({
    project: "",
    status: "Pending",
  });

  // =========================================================
  // GET ALL STUDENTS
  // =========================================================

  const fetchStudents = async () => {

    try {

      setLoading(true);

      const response =
        await fetch(GET_ALL_URL);

      if (!response.ok) {
        throw new Error(
          "Failed to fetch students"
        );
      }

      const data =
        await response.json();

      console.log(
        "GET STUDENTS RESPONSE:",
        data
      );

      setStudents(data);

    } catch (error) {

      console.error(
        "Fetch students error:",
        error
      );

      alert(
        "Unable to load students from backend."
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // LOAD STUDENTS
  // =========================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================================================
  // GET UNIQUE PROJECTS
  // =========================================================

  const projects = [
    ...new Set(
      students
        .map(
          (student) =>
            String(
              student.project ?? ""
            ).trim()
        )
        .filter(
          (project) =>
            project !== "" &&
            project !== "-"
        )
    ),
  ];

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredStudents =
    students.filter((student) => {

      const name =
        String(
          student.name ?? ""
        )
          .toLowerCase()
          .trim();

      const enrollment =
        String(
          student.enrollment ?? ""
        )
          .toLowerCase()
          .trim();

      const project =
        String(
          student.project ?? ""
        )
          .toLowerCase()
          .trim();

      const faculty =
        String(
          student.faculty ?? ""
        )
          .toLowerCase()
          .trim();

      const status =
        String(
          student.status ?? ""
        )
          .toLowerCase()
          .trim();

      const searchText =
        search
          .toLowerCase()
          .trim();

      // -------------------------------------------------------
      // SEARCH
      // -------------------------------------------------------

      const matchesSearch =
        searchText === "" ||
        name.includes(searchText) ||
        enrollment.includes(searchText) ||
        project.includes(searchText) ||
        faculty.includes(searchText) ||
        status.includes(searchText);

      // -------------------------------------------------------
      // STATUS FILTER
      // -------------------------------------------------------

      const matchesStatus =
        statusFilter === "All Status" ||
        status ===
          statusFilter
            .toLowerCase()
            .trim();

      // -------------------------------------------------------
      // PROJECT FILTER
      // -------------------------------------------------------

      const matchesProject =
        projectFilter === "All Projects" ||
        project ===
          projectFilter
            .toLowerCase()
            .trim();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProject
      );
    });

  // =========================================================
  // OPEN EDIT MODAL
  // ONLY PROJECT + STATUS
  // =========================================================

  const handleEdit = (student) => {

    setFormData({
      project:
        student.project === "-"
          ? ""
          : student.project || "",

      status:
        student.status || "Pending",
    });

    setSelectedStudent(student);

    setModalType("edit");

    setShowModal(true);
  };

  // =========================================================
  // VIEW STUDENT
  // =========================================================

  const handleView = (student) => {

    setSelectedStudent(student);

    setModalType("view");

    setShowModal(true);
  };

  // =========================================================
  // DELETE STUDENT
  // =========================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      setLoading(true);

      const response =
        await fetch(
          `${DELETE_URL}/${id}`,
          {
            method: "DELETE",
          }
        );

      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            "Failed to delete student"
        );
      }

      // Remove student from frontend
      setStudents(
        (prevStudents) =>
          prevStudents.filter(
            (student) =>
              student.id !== id
          )
      );

      alert(
        "Student deleted successfully."
      );

      closeModal();

    } catch (error) {

      console.error(
        "Delete error:",
        error
      );

      alert(
        "Failed to delete student: " +
          error.message
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData(
      (prev) => ({
        ...prev,
        [name]: value,
      })
    );
  };

  // =========================================================
  // UPDATE PROJECT + STATUS
  // =========================================================

  const updateStudent = async () => {

    const studentData = {

      // Keep existing student information.
      // Backend will only update project/status.

      project:
        formData.project.trim(),

      status:
        formData.status,
    };

    console.log(
      "PUT REQUEST:",
      studentData
    );

    const response =
      await fetch(
        `${UPDATE_URL}/${selectedStudent.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              studentData
            ),
        }
      );

    const responseText =
      await response.text();

    console.log(
      "PUT RESPONSE:",
      responseText
    );

    if (!response.ok) {

      throw new Error(
        responseText ||
          "Failed to update student"
      );
    }

    const updatedStudent =
      JSON.parse(responseText);

    console.log(
      "UPDATED STUDENT:",
      updatedStudent
    );

    setStudents(
      (prevStudents) =>
        prevStudents.map(
          (student) =>
            student.id ===
            selectedStudent.id
              ? updatedStudent
              : student
        )
    );
  };

  // =========================================================
  // SUBMIT EDIT
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !formData.project.trim()
    ) {

      alert(
        "Project name is required"
      );

      return;
    }

    if (
      !formData.status.trim()
    ) {

      alert(
        "Status is required"
      );

      return;
    }

    try {

      setLoading(true);

      await updateStudent();

      alert(
        "Student updated successfully."
      );

      setShowModal(false);

      setSelectedStudent(null);

    } catch (error) {

      console.error(
        "Update student error:",
        error
      );

      alert(
        error.message ||
          "Something went wrong."
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {

    setShowModal(false);

    setSelectedStudent(null);
  };

  // =========================================================
  // JSX
  // =========================================================

  return (

    <div className="student-management">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="student-page-header">

        <h1>
          Student Management
        </h1>

      </div>

      {/* =====================================================
          SEARCH + FILTERS
      ===================================================== */}

      <div className="student-filters">

        <div className="search-box">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search by name, enrollment or project..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <div className="filter-row">

          {/* STATUS FILTER */}

          <div className="filter-group">

            <label>
              Status
            </label>

            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option>
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Submitted">
                Submitted
              </option>

              <option value="Not Submitted">
                Not Submitted
              </option>

            </select>

          </div>

          {/* PROJECT FILTER */}

          <div className="filter-group">

            <label>
              Project
            </label>

            <select
              value={
                projectFilter
              }
              onChange={(e) =>
                setProjectFilter(
                  e.target.value
                )
              }
            >

              <option>
                All Projects
              </option>

              {projects.map(
                (project) => (

                  <option
                    key={project}
                    value={project}
                  >
                    {project}
                  </option>

                )
              )}

            </select>

          </div>

        </div>

      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="student-table-container">

        <table className="student-table">

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
                Faculty
              </th>

              <th>
                Status
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="6"
                  className="no-students"
                >
                  Loading students...
                </td>

              </tr>

            ) : filteredStudents.length > 0 ? (

              filteredStudents.map(
                (student) => (

                  <tr
                    key={
                      student.id
                    }
                  >

                    <td>
                      {
                        student.name ||
                        "-"
                      }
                    </td>

                    <td>
                      {
                        student.enrollment ||
                        "-"
                      }
                    </td>

                    <td>
                      {
                        student.project ||
                        "-"
                      }
                    </td>

                    <td>
                      {
                        student.faculty ||
                        "-"
                      }
                    </td>

                    <td>

                      <span
                        className={`status-badge ${
                          student.status
                            ?.toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            ) || ""
                        }`}
                      >
                        {
                          student.status ||
                          "-"
                        }
                      </span>

                    </td>

                    <td>

                      <div className="action-buttons">

                        {/* VIEW */}

                        <button
                          className="view-btn"
                          title="View Student"
                          onClick={() =>
                            handleView(
                              student
                            )
                          }
                        >
                          👁
                        </button>

                        {/* EDIT */}

                        <button
                          className="edit-btn"
                          title="Edit Project and Status"
                          onClick={() =>
                            handleEdit(
                              student
                            )
                          }
                        >
                          ✏
                        </button>

                        {/* DELETE */}

                        <button
                          className="delete-btn"
                          title="Delete Student"
                          onClick={() =>
                            handleDelete(
                              student.id
                            )
                          }
                        >
                          🗑
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="no-students"
                >
                  No students found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={
            closeModal
          }
        >

          <div
            className="student-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* =================================================
                VIEW STUDENT
            ================================================= */}

            {modalType === "view" &&
              selectedStudent && (

                <>

                  <div className="modal-header">

                    <h2>
                      Student Details
                    </h2>

                    <button
                      onClick={
                        closeModal
                      }
                    >
                      ×
                    </button>

                  </div>

                  <div className="student-details">

                    {/* NAME */}

                    <div>

                      <strong>
                        Name
                      </strong>

                      <span>
                        {
                          selectedStudent.name ||
                          "-"
                        }
                      </span>

                    </div>

                    {/* ENROLLMENT */}

                    <div>

                      <strong>
                        Enrollment
                      </strong>

                      <span>
                        {
                          selectedStudent.enrollment ||
                          "-"
                        }
                      </span>

                    </div>

                    {/* PROJECT */}

                    <div>

                      <strong>
                        Project
                      </strong>

                      <span>
                        {
                          selectedStudent.project ||
                          "-"
                        }
                      </span>

                    </div>

                    {/* FACULTY */}

                    <div>

                      <strong>
                        Faculty
                      </strong>

                      <span>
                        {
                          selectedStudent.faculty ||
                          "-"
                        }
                      </span>

                    </div>

                    {/* STATUS */}

                    <div>

                      <strong>
                        Status
                      </strong>

                      <span
                        className={`status-badge ${
                          selectedStudent.status
                            ?.toLowerCase()
                            .replace(
                              /\s+/g,
                              "-"
                            ) || ""
                        }`}
                      >
                        {
                          selectedStudent.status ||
                          "-"
                        }
                      </span>

                    </div>

                  </div>

                  <button
                    className="close-modal-btn"
                    onClick={
                      closeModal
                    }
                  >
                    Close
                  </button>

                </>

              )}

            {/* =================================================
                EDIT PROJECT + STATUS
            ================================================= */}

            {modalType === "edit" && (

              <>

                <div className="modal-header">

                  <h2>
                    Edit Student Project
                  </h2>

                  <button
                    onClick={
                      closeModal
                    }
                  >
                    ×
                  </button>

                </div>

                <form
                  onSubmit={
                    handleSubmit
                  }
                >

                  {/* ------------------------------------------------
                      NAME - VIEW ONLY
                  ------------------------------------------------ */}

                  <div className="form-group">

                    <label>
                      Student Name
                    </label>

                    <input
                      type="text"
                      value={
                        selectedStudent?.name ||
                        ""
                      }
                      disabled
                    />

                  </div>

                  {/* ------------------------------------------------
                      ENROLLMENT - VIEW ONLY
                  ------------------------------------------------ */}

                  <div className="form-group">

                    <label>
                      Enrollment Number
                    </label>

                    <input
                      type="text"
                      value={
                        selectedStudent?.enrollment ||
                        ""
                      }
                      disabled
                    />

                  </div>

                  {/* ------------------------------------------------
                      PROJECT - EDITABLE
                  ------------------------------------------------ */}

                  <div className="form-group">

                    <label>
                      Project
                    </label>

                    <input
                      type="text"
                      name="project"
                      placeholder="Enter project name"
                      value={
                        formData.project
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  {/* ------------------------------------------------
                      FACULTY - VIEW ONLY
                  ------------------------------------------------ */}

                  <div className="form-group">

                    <label>
                      Faculty
                    </label>

                    <input
                      type="text"
                      value={
                        selectedStudent?.faculty ||
                        ""
                      }
                      disabled
                    />

                  </div>

                  {/* ------------------------------------------------
                      STATUS - EDITABLE
                  ------------------------------------------------ */}

                  <div className="form-group">

                    <label>
                      Status
                    </label>

                    <select
                      name="status"
                      value={
                        formData.status
                      }
                      onChange={
                        handleChange
                      }
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Active">
                        Active
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Submitted">
                        Submitted
                      </option>

                      <option value="Not Submitted">
                        Not Submitted
                      </option>

                    </select>

                  </div>

                  {/* ------------------------------------------------
                      BUTTONS
                  ------------------------------------------------ */}

                  <div className="modal-actions">

                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={
                        closeModal
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="save-btn"
                      disabled={
                        loading
                      }
                    >

                      {loading
                        ? "Saving..."
                        : "Save Changes"}

                    </button>

                  </div>

                </form>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default StudentManagement;
