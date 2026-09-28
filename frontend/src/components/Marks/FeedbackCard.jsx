import {
  FaCommentDots,
  FaThumbsUp,
  FaTools,
  FaComments,
} from "react-icons/fa";

function FeedbackCard({ marks }) {

  return (

    <div className="marks-card">

      <h2 className="card-title">
        <FaCommentDots className="card-icon" />
        Faculty Feedback
      </h2>

      {/* Strengths */}

      <div className="feedback-section">

        <h3 className="feedback-heading">
          <FaThumbsUp className="feedback-icon" />
          Strengths
        </h3>

        <ul className="feedback-list">

          <li>
            {marks?.strengths || "No strengths provided yet."}
          </li>

        </ul>

      </div>


      {/* Areas for Improvement */}

      <div className="feedback-section">

        <h3 className="feedback-heading">
          <FaTools className="feedback-icon" />
          Areas for Improvement
        </h3>

        <ul className="feedback-list">

          <li>
            {marks?.areasForImprovement ||
              "No areas for improvement provided yet."}
          </li>

        </ul>

      </div>


      {/* Overall Comments */}

      <div className="feedback-section">

        <h3 className="feedback-heading">
          <FaComments className="feedback-icon" />
          Overall Comments
        </h3>

        <p className="overall-comment">
          {marks?.overallComments ||
            "No overall comments provided yet."}
        </p>

      </div>

    </div>

  );
}

export default FeedbackCard;






// import {
//   FaCommentDots,
//   FaThumbsUp,
//   FaTools,
//   FaComments,
// } from "react-icons/fa";

// function FeedbackCard() {
//   return (
//     <div className="marks-card">

//       <h2 className="card-title">
//         <FaCommentDots className="card-icon" />
//         Faculty Feedback
//       </h2>

//       <div className="feedback-section">

//         <h3 className="feedback-heading">
//           <FaThumbsUp className="feedback-icon" />
//           Strengths
//         </h3>

//         <ul className="feedback-list">
//           <li>Clean and attractive user interface.</li>
//           <li>Well-structured project architecture.</li>
//           <li>Good documentation and presentation.</li>
//         </ul>

//       </div>

//       <div className="feedback-section">

//         <h3 className="feedback-heading">
//           <FaTools className="feedback-icon" />
//           Areas for Improvement
//         </h3>

//         <ul className="feedback-list">
//           <li>Add more input validation.</li>
//           <li>Improve exception handling.</li>
//           <li>Optimize backend performance.</li>
//         </ul>

//       </div>

//       <div className="feedback-section">

//         <h3 className="feedback-heading">
//           <FaComments className="feedback-icon" />
//           Overall Comments
//         </h3>

//         <p className="overall-comment">
//           Excellent work. The project fulfills the required
//           objectives and demonstrates a good understanding of
//           React, Spring Boot, and MySQL. Continue improving
//           security and scalability.
//         </p>

//       </div>

//     </div>
//   );
// }

// export default FeedbackCard;