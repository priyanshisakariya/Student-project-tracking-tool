import { useState } from "react";
import "./ProjectManagement.css";

function ProjectManagement() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Student Portal",
      student: "Khushi Undhad",
      mentor: "Dr. Patel",
      domain: "Web Development",
      status: "In Progress",
      start: "2026-07-20",
    },
    {
      id: 2,
      title: "Library Management",
      student: "Priyanshi",
      mentor: "Prof. Shah",
      domain: "Java",
      status: "Approved",
      start: "2026-07-18",
    },
  ]);

  const [project, setProject] = useState({
    title: "",
    student: "",
    mentor: "",
    domain: "",
    technology: "",
    status: "Pending",
    start: "",
    end: "",
  });

  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProject = {
      id: projects.length + 1,
      ...project,
    };

    setProjects([...projects, newProject]);

    setProject({
      title: "",
      student: "",
      mentor: "",
      domain: "",
      technology: "",
      status: "Pending",
      start: "",
      end: "",
    });
  };

  return (
    <div className="project-page">

      <h1>Project Management</h1>

      {/* Dashboard Cards */}

      <div className="cards">

        <div className="card">
          <h2>{projects.length}</h2>
          <p>Total Projects</p>
        </div>

        <div className="card">
          <h2>{projects.filter(p=>p.status==="Pending").length}</h2>
          <p>Pending</p>
        </div>

        <div className="card">
          <h2>{projects.filter(p=>p.status==="Approved").length}</h2>
          <p>Approved</p>
        </div>

        <div className="card">
          <h2>{projects.filter(p=>p.status==="In Progress").length}</h2>
          <p>In Progress</p>
        </div>

      </div>

      {/* Form */}

      <div className="form-box">

        <h2>Add New Project</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Project Title"
            name="title"
            value={project.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="Student Name"
            name="student"
            value={project.student}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="Mentor Name"
            name="mentor"
            value={project.mentor}
            onChange={handleChange}
            required
          />

          <select
            name="domain"
            value={project.domain}
            onChange={handleChange}
          >
            <option value="">Select Domain</option>
            <option>Web Development</option>
            <option>Java</option>
            <option>Cloud Computing</option>
            <option>AI / ML</option>
            <option>Cyber Security</option>
          </select>

          <input
            type="text"
            placeholder="Technology Stack"
            name="technology"
            value={project.technology}
            onChange={handleChange}
          />

          <select
            name="status"
            value={project.status}
            onChange={handleChange}
          >
            <option>Pending</option>
            <option>Approved</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <input
            type="date"
            name="start"
            value={project.start}
            onChange={handleChange}
          />

          <input
            type="date"
            name="end"
            value={project.end}
            onChange={handleChange}
          />

          <button type="submit">
            Add Project
          </button>

        </form>

      </div>

      {/* Search */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Search Project..."
        />

      </div>

      {/* Table */}

      <div className="table-box">

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Project</th>
              <th>Student</th>
              <th>Mentor</th>
              <th>Domain</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {projects.map((p) => (

              <tr key={p.id}>

                <td>{p.id}</td>
                <td>{p.title}</td>
                <td>{p.student}</td>
                <td>{p.mentor}</td>
                <td>{p.domain}</td>
                <td>{p.status}</td>
                <td>{p.start}</td>

                <td>

                  <button>Edit</button>

                  <button
                    onClick={() =>
                      setProjects(projects.filter(x => x.id !== p.id))
                    }
                  >
                    Delete
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

export default ProjectManagement;