import "./ReviewProposal.css";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaFilePdf,
} from "react-icons/fa";

function ReviewProposal() {
  return (
    <div className="review-container">

      {/* ==========================================
                  PAGE HEADER
      ========================================== */}

      <div className="review-header">
        <h2>Project Proposal Review</h2>
        <p>Review and evaluate the submitted project proposal.</p>
      </div>

      {/* ==========================================
                PROJECT INFORMATION
      ========================================== */}

      <div className="card">
        <h3>Project Information</h3>

        <div className="grid">
          <div>
            <label>Project ID</label>
            <p>PRJ001</p>
          </div>

          <div>
            <label>Project Title</label>
            <p>AI Based Attendance System</p>
          </div>

          <div>
            <label>Department</label>
            <p>Computer Engineering</p>
          </div>

          <div>
            <label>Domain</label>
            <p>Artificial Intelligence</p>
          </div>

          <div>
            <label>Guide</label>
            <p>Dr. Amit Patel</p>
          </div>

          <div>
            <label>Team Size</label>
            <p>4 Students</p>
          </div>
        </div>
      </div>

      {/* ==========================================
                  TEAM MEMBERS
      ========================================== */}

      <div className="card">
        <h3>Team Members</h3>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Enrollment No</th>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>220120101001</td>
                <td>Rahul Patel</td>
                <td>Leader</td>
              </tr>

              <tr>
                <td>220120101002</td>
                <td>Meet Shah</td>
                <td>Member</td>
              </tr>

              <tr>
                <td>220120101003</td>
                <td>Priya Patel</td>
                <td>Member</td>
              </tr>

              <tr>
                <td>220120101004</td>
                <td>Krunal Patel</td>
                <td>Member</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
                 PROPOSAL SUMMARY
      ========================================== */}

      <div className="card">
        <h3>Proposal Summary</h3>

        <p>
          <strong>Problem Statement:</strong>
          <br />
          Manual attendance systems are time-consuming and prone to errors.
        </p>

        <br />

        <p>
          <strong>Objectives:</strong>
        </p>

        <ul>
          <li>Automate attendance using AI.</li>
          <li>Reduce manual work.</li>
          <li>Generate attendance reports.</li>
        </ul>

        <br />

        <p>
          <strong>Technology Stack:</strong>
        </p>

        <p>React, Node.js, Express, MySQL, Face Recognition</p>
      </div>

      {/* ==========================================
                   EVALUATION
      ========================================== */}

      <div className="card">
        <h3>Evaluation</h3>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Criteria</th>
                <th>Max Marks</th>
                <th>Given Marks</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Problem Definition</td>
                <td>10</td>
                <td>
                  <input type="number" min="0" max="10" />
                </td>
              </tr>

              <tr>
                <td>Innovation</td>
                <td>10</td>
                <td>
                  <input type="number" min="0" max="10" />
                </td>
              </tr>

              <tr>
                <td>Technical Feasibility</td>
                <td>10</td>
                <td>
                  <input type="number" min="0" max="10" />
                </td>
              </tr>

              <tr>
                <td>Presentation</td>
                <td>10</td>
                <td>
                  <input type="number" min="0" max="10" />
                </td>
              </tr>

              <tr>
                <td>Documentation</td>
                <td>10</td>
                <td>
                  <input type="number" min="0" max="10" />
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Total</strong>
                </td>

                <td>
                  <strong>50</strong>
                </td>

                <td>
                  <strong>--</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ==========================================
                 REVIEWER COMMENTS
      ========================================== */}

      <div className="card">
        <h3>Reviewer Comments</h3>

        <textarea
          rows="5"
          placeholder="Write your comments..."
        ></textarea>
      </div>

      {/* ==========================================
                    DECISION
      ========================================== */}

      <div className="card">
        <h3>Decision</h3>

        <div className="decision">

          <label>
            <input type="radio" name="status" />
            Approved
          </label>

          <label>
            <input type="radio" name="status" />
            Approved with Changes
          </label>

          <label>
            <input type="radio" name="status" />
            Rejected
          </label>

        </div>
      </div>

      {/* ==========================================
                 ACTION BUTTONS
      ========================================== */}

      <div className="actions">

        <button className="pdf-btn">
          <FaFilePdf />
          Download Proposal
        </button>

        <button className="edit-btn">
          <FaEdit />
          Request Changes
        </button>

        <button className="reject-btn">
          <FaTimesCircle />
          Reject
        </button>

        <button className="approve-btn">
          <FaCheckCircle />
          Approve
        </button>

      </div>

    </div>
  );
}

export default ReviewProposal;