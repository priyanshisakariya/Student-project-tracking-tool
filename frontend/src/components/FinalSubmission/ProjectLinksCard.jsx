import { FaLink, FaGithub, FaGlobe, FaVideo } from "react-icons/fa";

function ProjectLinksCard({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="submission-card">
      <h2 className="card-title">
        <FaLink className="card-icon" />
        Project Links & Repositories
      </h2>
      <p className="card-desc">
        Provide links where mentors and evaluators can inspect your code and test the live application.
      </p>

      <div className="form-group">
        <label>
          <FaGithub className="input-icon" />
          GitHub Repository URL <span className="req-star">*</span>
        </label>
        <input
          type="url"
          name="githubRepository"
          value={formData.githubRepository || ""}
          onChange={handleChange}
          placeholder="https://github.com/username/project-repo"
          required
        />
        <span className="field-hint">Required. Provide a public or accessible repository link.</span>
      </div>

      <div className="form-group">
        <label>
          <FaGlobe className="input-icon" />
          Live Deployed Project URL (Optional)
        </label>
        <input
          type="url"
          name="liveProjectUrl"
          value={formData.liveProjectUrl || ""}
          onChange={handleChange}
          placeholder="https://yourproject.vercel.app or https://yourdomain.com"
        />
        <span className="field-hint">Optional. Link to hosted demo or cloud deployment.</span>
      </div>

      <div className="form-group">
        <label>
          <FaVideo className="input-icon" />
          Demo Video URL (Optional)
        </label>
        <input
          type="url"
          name="demoVideoUrl"
          value={formData.demoVideoUrl || ""}
          onChange={handleChange}
          placeholder="https://youtube.com/watch?v=... or Google Drive link"
        />
        <span className="field-hint">Optional. Video walkthrough or project demonstration link.</span>
      </div>
    </div>
  );
}

export default ProjectLinksCard;