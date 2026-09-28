import "./AssignedFaculty.css";
import {
  FaSearch,
  FaEye,
  FaUserTie,
  FaUsers,
  FaProjectDiagram,
  FaCheckCircle,
} from "react-icons/fa";

const faculty = [
  {
    id: 1,
    facultyId: "FAC001",
    name: "Dr. Amit Patel",
    department: "Computer Engineering",
    designation: "Professor",
    email: "amit@college.edu",
    phone: "9876543210",
    specialization: "Artificial Intelligence",
    students: 8,
    projects: 5,
    status: "Active",
    workload: 80,
  },
  {
    id: 2,
    facultyId: "FAC002",
    name: "Dr. Neha Shah",
    department: "Computer Engineering",
    designation: "Associate Professor",
    email: "neha@college.edu",
    phone: "9876543211",
    specialization: "Web Development",
    students: 6,
    projects: 4,
    status: "Active",
    workload: 60,
  },
  {
    id: 3,
    facultyId: "FAC003",
    name: "Dr. Raj Mehta",
    department: "IT",
    designation: "Assistant Professor",
    email: "raj@college.edu",
    phone: "9876543212",
    specialization: "Cloud Computing",
    students: 5,
    projects: 3,
    status: "Leave",
    workload: 30,
  },
];

function AssignedFaculty() {
  return (
    <div className="faculty-page">

      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Assigned Faculty</h2>
          <p>Manage faculty members assigned to student projects.</p>
        </div>

        <button className="add-btn">
          + Add Faculty
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary">

        <div className="summary-card">
          <FaUserTie className="summary-icon" />
          <h2>20</h2>
          <p>Total Faculty</p>
        </div>

        <div className="summary-card">
          <FaCheckCircle className="summary-icon green" />
          <h2>18</h2>
          <p>Active Faculty</p>
        </div>

        <div className="summary-card">
          <FaUsers className="summary-icon blue" />
          <h2>120</h2>
          <p>Assigned Students</p>
        </div>

        <div className="summary-card">
          <FaProjectDiagram className="summary-icon orange" />
          <h2>45</h2>
          <p>Projects</p>
        </div>

      </div>

      {/* Toolbar */}
      <div className="toolbar">

        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search Faculty..."
          />
        </div>

        <select className="department-select">
          <option value="">All Departments</option>
          <option value="CE">Computer Engineering</option>
          <option value="IT">Information Technology</option>
          <option value="CSE">Computer Science</option>
        </select>

      </div>

      {/* Table */}
      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Faculty ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Students</th>
              <th>Projects</th>
              <th>Status</th>
              <th>Workload</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {faculty.map((item) => (
              <tr key={item.id}>

                <td>{item.facultyId}</td>
                <td>{item.name}</td>
                <td>{item.department}</td>
                <td>{item.designation}</td>
                <td>{item.students}</td>
                <td>{item.projects}</td>

                <td>
                  <span
                    className={
                      item.status === "Active"
                        ? "badge active"
                        : "badge leave"
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${item.workload}%` }}
                    ></div>
                  </div>
                  <small>{item.workload}%</small>
                </td>

                <td>
                  <button className="view-btn">
                    <FaEye />
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AssignedFaculty;