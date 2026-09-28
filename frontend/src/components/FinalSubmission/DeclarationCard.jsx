import { FaCheckCircle, FaPaperPlane, FaSave, FaShieldAlt } from "react-icons/fa";

function DeclarationCard({ formData, setFormData, handleSubmit, isSubmitted, submitting }) {
  const handleDeclaration = (e) => {
    setFormData((prev) => ({
      ...prev,
      declaration: e.target.checked,
    }));
  };

  return (
    <div className="submission-card declaration-card-wrap">
      <h2 className="card-title">
        <FaShieldAlt className="card-icon" />
        Student Declaration
      </h2>

      <div className="declaration-box">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="declaration"
            id="declarationCheckbox"
            checked={formData.declaration || false}
            onChange={handleDeclaration}
          />
          <span className="declaration-text">
            I hereby declare that this project, source code, and report represent my original work and have been completed in accordance with university guidelines. All information and documents submitted are complete, genuine, and accurate.
          </span>
        </label>
      </div>

      <div className="button-group">
        <button
          type="button"
          className="submit-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <span>Please wait...</span>
          ) : isSubmitted ? (
            <>
              <FaSave /> Update Final Submission
            </>
          ) : (
            <>
              <FaPaperPlane /> Submit Final Project
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default DeclarationCard;