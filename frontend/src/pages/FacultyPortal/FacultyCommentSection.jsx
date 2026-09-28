import { useState } from "react";
import "./FacultyCommentSection.css";

function FacultyCommentSection() {
  const [comments, setComments] = useState([
    {
      id: 1,
      student: "Rahul Patel",
      week: "Week 5",
      date: "15 Aug 2026",
      comment:
        "Excellent progress. Complete the Proposal Review module before next week.",
    },
    {
      id: 2,
      student: "Priya Shah",
      week: "Week 5",
      date: "15 Aug 2026",
      comment:
        "Database design looks good. Start integrating the backend APIs.",
    },
    {
      id: 3,
      student: "Jay Mehta",
      week: "Week 5",
      date: "15 Aug 2026",
      comment:
        "Project progress is slow. Please submit pending work before Friday.",
    },
  ]);

  const [selectedStudent, setSelectedStudent] = useState("Rahul Patel");
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");

  const filteredComments = comments.filter(
    (item) => item.student === selectedStudent
  );

  const addComment = () => {
    if (!newComment || !newComment.trim()) {
      setCommentError("Please enter feedback comment before submitting.");
      return;
    }

    if (newComment.trim().length < 5) {
      setCommentError("Comment must contain at least 5 characters.");
      return;
    }

    const comment = {
      id: comments.length + 1,
      student: selectedStudent,
      week: "Week 6",
      date: new Date().toLocaleDateString(),
      comment: newComment.trim(),
    };

    setComments([comment, ...comments]);
    setNewComment("");
    setCommentError("");
  };

  return (
    <div className="comment-page">
      <div className="comment-header">
        <h1>Faculty Comments</h1>
        <p>Review previous feedback and add comments for students.</p>
      </div>

      <div className="student-filter">
        <label>Select Student</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option>Rahul Patel</option>
          <option>Priya Shah</option>
          <option>Jay Mehta</option>
        </select>
      </div>

      <div className="comment-layout">
        <div className="history-card">
          <h2>Comment History</h2>

          {filteredComments.length === 0 ? (
            <p>No comments available.</p>
          ) : (
            filteredComments.map((item) => (
              <div className="comment-card" key={item.id}>
                <div className="comment-top">
                  <span>{item.week}</span>
                  <span>{item.date}</span>
                </div>
                <p>{item.comment}</p>
              </div>
            ))
          )}
        </div>

        <div className="add-comment-card">
          <h2>Add New Comment</h2>

          <textarea
            placeholder="Write your feedback..."
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              if (commentError) setCommentError("");
            }}
            className={commentError ? "input-error" : ""}
          />
          {commentError && (
            <span className="field-error" style={{ color: "#dc2626", fontSize: "12.5px", marginTop: "5px", display: "block" }}>
              • {commentError}
            </span>
          )}

          <button onClick={addComment}>
            Submit Comment
          </button>
        </div>
      </div>
    </div>
  );
}

export default FacultyCommentSection;