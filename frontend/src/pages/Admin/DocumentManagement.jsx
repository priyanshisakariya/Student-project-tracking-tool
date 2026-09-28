import "./DocumentManagement.css";
import {
  Search,
  Upload,
  Eye,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";

const documents = [
  {
    id: 1,
    name: "Employee Handbook.pdf",
    category: "HR",
    department: "HR",
    version: "v2.1",
    uploadedBy: "John",
    date: "12 Jun 2026",
    status: "Approved",
  },
  {
    id: 2,
    name: "Invoice_Template.docx",
    category: "Finance",
    department: "Finance",
    version: "v1.0",
    uploadedBy: "Admin",
    date: "20 Jun 2026",
    status: "Pending",
  },
  {
    id: 3,
    name: "Safety Policy.pdf",
    category: "Operations",
    department: "Admin",
    version: "v3.2",
    uploadedBy: "Sarah",
    date: "25 Jun 2026",
    status: "Expired",
  },
];

const stats = [
  { title: "Total Documents", value: "1,245" },
  { title: "Approved", value: "980" },
  { title: "Pending", value: "120" },
  { title: "Expired", value: "45" },
];

export default function DocumentManagement() {
  const statusClass = (status) => {
    switch (status) {
      case "Approved":
        return "approved";
      case "Pending":
        return "pending";
      case "Expired":
        return "expired";
      default:
        return "";
    }
  };

  return (
    <div className="document-page">
      {/* Header */}

      <div className="page-header">
        <div>
          <h1>📄 Document Management</h1>
          <p>Manage all company documents from one place.</p>
        </div>

        <button className="upload-btn">
          <Upload size={18} />
          Upload Document
        </button>
      </div>

      {/* Dashboard */}

      <div className="stats-grid">
        {stats.map((item) => (
          <div className="stat-card" key={item.title}>
            <h3>{item.title}</h3>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* Search */}

      <div className="search-box">
        <div className="search-grid">
          <input type="text" placeholder="Search document..." />

          <select>
            <option>Category</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Operations</option>
          </select>

          <select>
            <option>Status</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Expired</option>
          </select>

          <button className="filter-btn">
            <Search size={18} />
            Apply
          </button>
        </div>
      </div>

      {/* Table */}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Document</th>
              <th>Category</th>
              <th>Department</th>
              <th>Version</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.category}</td>
                <td>{doc.department}</td>
                <td>{doc.version}</td>
                <td>{doc.uploadedBy}</td>
                <td>{doc.date}</td>

                <td>
                  <span className={`status ${statusClass(doc.status)}`}>
                    {doc.status}
                  </span>
                </td>

                <td>
                  <div className="action-buttons">
                    <button className="icon-btn view">
                      <Eye size={18} />
                    </button>

                    <button className="icon-btn edit">
                      <Pencil size={18} />
                    </button>

                    <button className="icon-btn download">
                      <Download size={18} />
                    </button>

                    <button className="icon-btn delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}

        <div className="table-footer">
          <p>
            Showing 1-{documents.length} of {documents.length} documents
          </p>

          <div className="pagination">
            <button>{"<"}</button>
            <button className="active">1</button>
            <button>{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}