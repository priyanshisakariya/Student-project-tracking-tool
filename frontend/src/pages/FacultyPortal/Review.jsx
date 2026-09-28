import { useEffect, useState } from "react";
import axios from "axios";
import "./Review.css";
import PdfModal from "../../components/FileViewer/PdfModal";

function Review() {

  // =====================================================
  // STATES
  // =====================================================

  const [proposals, setProposals] = useState([]);

  const [selectedProposal, setSelectedProposal] = useState(null);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [previewPdfPath, setPreviewPdfPath] = useState(null);


  // =====================================================
  // BACKEND API URL & FACULTY INFO
  // =====================================================

  const API_URL = "http://localhost:8081/review-proposal";

  const getFacultyInfo = () => {
    const stored = JSON.parse(localStorage.getItem("faculty")) || JSON.parse(localStorage.getItem("user")) || {};
    return {
      facultyId: stored.facultyId || stored.id || localStorage.getItem("facultyId") || "",
      facultyName: stored.facultyName || stored.name || localStorage.getItem("facultyName") || ""
    };
  };

  // =====================================================
  // GET ALL PROPOSALS
  // =====================================================

  useEffect(() => {

    fetchProposals();

  }, []);


  const fetchProposals = async () => {

    try {

      setLoading(true);
      setError("");

      const { facultyId, facultyName } = getFacultyInfo();

      const response = await axios.get(API_URL, {
        params: {
          facultyId: facultyId || undefined,
          facultyName: facultyName || undefined,
        }
      });

      console.log("Review proposals:", response.data);

      setProposals(response.data);

    } catch (error) {

      console.error(
        "Error fetching review proposals:",
        error
      );

      setError(
        "Unable to load proposals. Please make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // VIEW SINGLE PROPOSAL
  // =====================================================

  const handleViewProposal = async (reviewProposalId) => {

    try {

      const { facultyId, facultyName } = getFacultyInfo();

      const response = await axios.get(
        `${API_URL}/${reviewProposalId}`,
        {
          params: {
            facultyId: facultyId || undefined,
            facultyName: facultyName || undefined,
          }
        }
      );

      console.log(
        "Selected proposal:",
        response.data
      );

      setSelectedProposal(response.data);

    } catch (error) {

      console.error(
        "Error fetching proposal:",
        error
      );

      alert("Unable to load proposal.");

    }
  };


  // =====================================================
  // UPDATE PROPOSAL STATUS
  // =====================================================

 const handleStatusChange = async (
  reviewProposalId,
  status
) => {
  try {
    const { facultyId, facultyName } = getFacultyInfo();

    const response = await axios.put(
      `${API_URL}/${reviewProposalId}/status`,
      {
        status: status,
      },
      {
        params: {
          facultyId: facultyId || undefined,
          facultyName: facultyName || undefined,
        }
      }
    );

    console.log("Updated proposal:", response.data);

    // Update proposal in the cards
    setProposals((previousProposals) =>
      previousProposals.map((proposal) =>
        proposal.reviewProposalId ===
        response.data.reviewProposalId
          ? response.data
          : proposal
      )
    );

    // Close the modal automatically
    setSelectedProposal(null);

  } catch (error) {
    console.error(
      "Error updating proposal status:",
      error
    );

    // No popup
    setError(
      error.response?.data?.message ||
      "Unable to update proposal status."
    );
  }
};


  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredProposals = proposals.filter(
    (proposal) => {

      const searchText =
        search.toLowerCase().trim();


      const matchSearch =
        proposal.projectTitle
          ?.toLowerCase()
          .includes(searchText) ||

        String(proposal.studentId)
          .includes(searchText);


      const matchFilter =
        filter === "All" ||
        proposal.status === filter;


      return matchSearch && matchFilter;
    }
  );


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="review-page">

        <div className="review-header">

          <h1>
            Project Proposal Review
          </h1>

          <p>
            Loading student proposals...
          </p>

        </div>

      </div>

    );
  }


  // =====================================================
  // MAIN UI
  // =====================================================

  return (

    <div className="review-page">


      {/* =================================================
          HEADER
      ================================================== */}

      <div className="review-header">

        <h1>
          Project Proposal Review
        </h1>

        <p>
          Review, approve or reject student project proposals.
        </p>

      </div>


      {/* =================================================
          ERROR MESSAGE
      ================================================== */}

      {error && (

        <div className="error-message">

          <p>{error}</p>

          <button onClick={fetchProposals}>
            Retry
          </button>

        </div>

      )}


      {/* =================================================
          SEARCH + FILTER
      ================================================== */}

      <div className="review-toolbar">

        <input
          type="text"
          placeholder="Search Student / Project..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >

          <option value="All">
            All
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="APPROVED">
            Approved
          </option>

          <option value="REJECTED">
            Rejected
          </option>

          <option value="CHANGES_REQUESTED">
            Request Changes
          </option>

        </select>

      </div>


      {/* =================================================
          PROPOSAL GRID
      ================================================== */}

      <div className="proposal-grid">

        {filteredProposals.length === 0 ? (

          <p>
            No proposals found.
          </p>

        ) : (

          filteredProposals.map((proposal) => (

            <div
              className="proposal-card"
              key={proposal.reviewProposalId}
            >


              {/* =========================================
                  CARD TOP
              ========================================== */}

              <div className="proposal-top">

                <h3>
                  {proposal.projectTitle}
                </h3>


                <span
                  className={`status ${proposal.status
                    ?.toLowerCase()
                    .replace("_", "-")}`}
                >

                  {proposal.status === "CHANGES_REQUESTED"
                    ? "Request Changes"
                    : proposal.status}

                </span>

              </div>


              {/* =========================================
                  STUDENT
              ========================================== */}

              <p>

                <strong>
                  Student :
                </strong>{" "}

                {proposal.studentId}

              </p>


              {/* =========================================
                  DOMAIN
              ========================================== */}

              <p>

                <strong>
                  Domain :
                </strong>{" "}

                {proposal.projectDomain}

              </p>


              {/* =========================================
                  TECHNOLOGY
              ========================================== */}

              <p>

                <strong>
                  Technology :
                </strong>{" "}

                {proposal.technologyStack}

              </p>


              {/* =========================================
                  VIEW BUTTON
              ========================================== */}

              <button
                className="view-btn"
                onClick={() =>
                  handleViewProposal(
                    proposal.reviewProposalId
                  )
                }
              >

                View Proposal

              </button>

            </div>

          ))

        )}

      </div>


      {/* =================================================
          PROPOSAL MODAL
      ================================================== */}

      {selectedProposal && (

        <div className="modal-overlay">

          <div className="proposal-modal">


            {/* =========================================
                TITLE
            ========================================== */}

            <h2>
              {selectedProposal.projectTitle}
            </h2>


            {/* =========================================
                STUDENT
            ========================================== */}

            <p>

              <strong>
                Student :
              </strong>{" "}

              {selectedProposal.studentId}

            </p>


            {/* =========================================
                DOMAIN
            ========================================== */}

            <p>

              <strong>
                Domain :
              </strong>{" "}

              {selectedProposal.projectDomain}

            </p>


            {/* =========================================
                TECHNOLOGY
            ========================================== */}

            <p>

              <strong>
                Technology :
              </strong>{" "}

              {selectedProposal.technologyStack}

            </p>


            {/* =========================================
                OTHER TECHNOLOGY
            ========================================== */}

            {selectedProposal.otherTechnology && (

              <p>

                <strong>
                  Other Technology :
                </strong>{" "}

                {selectedProposal.otherTechnology}

              </p>

            )}


            {/* =========================================
                MEMBER 2
            ========================================== */}

            {selectedProposal.member2Name && (

              <p>

                <strong>
                  Member 2 :
                </strong>{" "}

                {selectedProposal.member2Name}

                {selectedProposal.member2Enrollment &&
                  ` (${selectedProposal.member2Enrollment})`
                }

              </p>

            )}


            {/* =========================================
                MEMBER 3
            ========================================== */}

            {selectedProposal.member3Name && (

              <p>

                <strong>
                  Member 3 :
                </strong>{" "}

                {selectedProposal.member3Name}

                {selectedProposal.member3Enrollment &&
                  ` (${selectedProposal.member3Enrollment})`
                }

              </p>

            )}


            {/* =========================================
                PROJECT DESCRIPTION
            ========================================== */}

            <p>

              <strong>
                Project Description :
              </strong>

            </p>


            <p>
              {selectedProposal.projectDescription}
            </p>


            {/* =========================================
                PROPOSAL FILE
            ========================================== */}

            <div style={{ margin: "14px 0", padding: "12px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <strong>Proposal File:</strong>{" "}
                  <span style={{ color: "#475569", wordBreak: "break-all" }}>
                    {selectedProposal.proposalFile ? selectedProposal.proposalFile.split("/").pop() : "No file attached"}
                  </span>
                </div>
                {selectedProposal.proposalFile && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      style={{
                        padding: "6px 12px",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                      onClick={() => setPreviewPdfPath(selectedProposal.proposalFile)}
                    >
                      📄 View Proposal PDF
                    </button>
                    <a
                      href={`http://localhost:8081/api/files/download?path=${encodeURIComponent(selectedProposal.proposalFile)}&facultyId=${getFacultyInfo().facultyId}&facultyName=${encodeURIComponent(getFacultyInfo().facultyName)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "6px 12px",
                        background: "#059669",
                        color: "#fff",
                        textDecoration: "none",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      ⬇ Download PDF
                    </a>
                  </div>
                )}
              </div>
            </div>


            {/* =========================================
                CURRENT STATUS
            ========================================== */}

            <p>

              <strong>
                Current Status :
              </strong>{" "}

              <span
                className={`status ${selectedProposal.status
                  ?.toLowerCase()
                  .replace("_", "-")}`}
              >

                {selectedProposal.status ===
                "CHANGES_REQUESTED"
                  ? "Request Changes"
                  : selectedProposal.status}

              </span>

            </p>


            {/* =================================================
                ACTION BUTTONS
            ================================================== */}

            <div className="modal-buttons">


              {/* =============================================
                  APPROVE
              ============================================== */}

              <button
                className="approve"
                onClick={() =>
                  handleStatusChange(
                    selectedProposal.reviewProposalId,
                    "APPROVED"
                  )
                }
                disabled={
                  selectedProposal.status ===
                  "APPROVED"
                }
              >

                Approve

              </button>


              {/* =============================================
                  REJECT
              ============================================== */}

              <button
                className="reject"
                onClick={() =>
                  handleStatusChange(
                    selectedProposal.reviewProposalId,
                    "REJECTED"
                  )
                }
                disabled={
                  selectedProposal.status ===
                  "REJECTED"
                }
              >

                Reject

              </button>


              {/* =============================================
                  REQUEST CHANGES
              ============================================== */}

              <button
                className="changes"
                onClick={() =>
                  handleStatusChange(
                    selectedProposal.reviewProposalId,
                    "CHANGES_REQUESTED"
                  )
                }
                disabled={
                  selectedProposal.status ===
                  "CHANGES_REQUESTED"
                }
              >

                Request Changes

              </button>

            </div>


            {/* =================================================
                CLOSE
            ================================================== */}

            <button
              className="close-btn"
              onClick={() =>
                setSelectedProposal(null)
              }
            >

              Close

            </button>

          </div>

        </div>

      )}

      {/* ================================================= */}
      {/* PDF PREVIEW MODAL */}
      {/* ================================================= */}
      {previewPdfPath && (
        <PdfModal
          filePath={previewPdfPath}
          title="Project Proposal Preview"
          facultyId={getFacultyInfo().facultyId}
          facultyName={getFacultyInfo().facultyName}
          onClose={() => setPreviewPdfPath(null)}
        />
      )}

    </div>

  );
}

export default Review;