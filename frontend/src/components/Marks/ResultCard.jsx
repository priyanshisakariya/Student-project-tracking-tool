import {
  FaMedal,
  FaPercentage,
  FaAward,
  FaCheckCircle,
} from "react-icons/fa";

function ResultCard({ marks }) {

  return (

    <div className="marks-card">

      <h2 className="card-title">
        <FaAward className="card-icon" />
        Final Result
      </h2>

      <div className="result-grid">

        {/* Total Marks */}

        <div className="result-item">

          <FaMedal className="result-icon" />

          <div>
            <h4>Total Marks</h4>

            <p>
              {marks?.totalMarks ?? 0} / 100
            </p>
          </div>

        </div>


        {/* Percentage */}

        <div className="result-item">

          <FaPercentage className="result-icon" />

          <div>
            <h4>Percentage</h4>

            <p>
              {marks?.percentage ?? 0}%
            </p>
          </div>

        </div>


        {/* Grade */}

        <div className="result-item">

          <FaAward className="result-icon" />

          <div>
            <h4>Grade</h4>

            <p>
              {marks?.grade ?? "-"}
            </p>
          </div>

        </div>


        {/* Result */}

        <div className="result-item">

          <FaCheckCircle className="result-icon success" />

          <div>
            <h4>Result</h4>

            <p
              className={
                marks?.result === "PASS"
                  ? "pass"
                  : "fail"
              }
            >
              {marks?.result ?? "-"}
            </p>
          </div>

        </div>

      </div>

    </div>

  );
}

export default ResultCard;