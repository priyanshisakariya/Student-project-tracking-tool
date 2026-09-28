import "./ForgotPassword.css";
import bg from "../../assets/background.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePassword, validateRequired } from "../../utils/validation";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value, allData = formData) => {
    switch (name) {
      case "name":
        if (!value || !value.trim()) return "Please enter admin username / name.";
        if (value.trim().length < 3) return "Name must be at least 3 characters.";
        return "";
      case "newPassword":
        return validatePassword(value, 6);
      case "confirmPassword":
        if (!value) return "Please confirm your new password.";
        if (value !== allData.newPassword) return "Passwords do not match.";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...formData,
      [name]: value,
    };

    setFormData(updated);
    setError("");
    setMessage("");

    if (touched[name]) {
      const err = validateField(name, value, updated);
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }

    // If newPassword changes, re-validate confirmPassword if touched
    if (name === "newPassword" && touched.confirmPassword) {
      const confirmErr = validateField("confirmPassword", updated.confirmPassword, updated);
      setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmErr }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value, formData);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const nameErr = validateField("name", formData.name);
    const passErr = validateField("newPassword", formData.newPassword);
    const confErr = validateField("confirmPassword", formData.confirmPassword);

    setTouched({ name: true, newPassword: true, confirmPassword: true });
    setFieldErrors({ name: nameErr, newPassword: passErr, confirmPassword: confErr });

    if (nameErr || passErr || confErr) {
      const firstKey = nameErr ? "name" : passErr ? "newPassword" : "confirmPassword";
      const el = document.getElementById(firstKey);
      if (el) el.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8081/api/admin/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            newPassword: formData.newPassword,
          }),
        }
      );

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        setMessage(
          typeof data === "string"
            ? data
            : data.message || "Password reset successfully! Redirecting to login..."
        );

        setFormData({
          name: "",
          newPassword: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/admin-login");
        }, 2000);

        return;
      }

      if (response.status === 404) {
        setError(
          typeof data === "string"
            ? data
            : data.message || "Admin username not found."
        );
        return;
      }

      setError(
        typeof data === "string"
          ? data
          : data.message || "Unable to reset password."
      );
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Unable to connect to server. Please make sure the backend is running on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/admin-login");
  };

  return (
    <div
      className="forgot-password-container"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="forgot-password-card">
        {/* HEADER */}
        <div className="forgot-password-header">
          <div className="lock-icon">🔐</div>
          <h2>Forgot Password?</h2>
          <p>Reset your admin account password</p>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && <div className="success-message" role="status">{message}</div>}

        {/* ERROR MESSAGE */}
        {error && <div className="error-message" role="alert">{error}</div>}

        {/* FORM */}
        <form onSubmit={handleSubmit} noValidate>
          {/* ADMIN NAME */}
          <div className="forgot-field-group">
            <label htmlFor="name">Admin Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your admin name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="username"
              disabled={loading}
              className={touched.name && fieldErrors.name ? "input-error" : ""}
              required
            />
            {touched.name && fieldErrors.name && (
              <span className="field-error">{fieldErrors.name}</span>
            )}
          </div>

          {/* NEW PASSWORD */}
          <div className="forgot-field-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Enter new password (min. 6 chars)"
              value={formData.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              disabled={loading}
              className={touched.newPassword && fieldErrors.newPassword ? "input-error" : ""}
              required
            />
            {touched.newPassword && fieldErrors.newPassword && (
              <span className="field-error">{fieldErrors.newPassword}</span>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="forgot-field-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              disabled={loading}
              className={touched.confirmPassword && fieldErrors.confirmPassword ? "input-error" : ""}
              required
            />
            {touched.confirmPassword && fieldErrors.confirmPassword && (
              <span className="field-error">{fieldErrors.confirmPassword}</span>
            )}
          </div>

          {/* RESET BUTTON */}
          <button
            type="submit"
            className="reset-button"
            disabled={loading}
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        {/* BACK TO LOGIN */}
        <div className="back-to-login">
          <button
            type="button"
            onClick={handleBackToLogin}
            disabled={loading}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;