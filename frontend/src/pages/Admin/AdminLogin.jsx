import "./AdminLogin.css";
import bg from "../../assets/background.jpg";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUserShield, FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import { validateRequired } from "../../utils/validation";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    if (name === "name") {
      if (!value || !value.trim()) return "Please enter admin username / ID.";
      if (value.trim().length < 3) return "Username must be at least 3 characters.";
    }
    if (name === "password") {
      return validateRequired(value, "Password");
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");

    if (touched[name]) {
      const err = validateField(name, value);
      setFieldErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const err = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nameErr = validateField("name", formData.name);
    const passErr = validateField("password", formData.password);

    setTouched({ name: true, password: true });
    setFieldErrors({ name: nameErr, password: passErr });

    if (nameErr || passErr) {
      const firstField = nameErr ? "admin-name" : "admin-password";
      const el = document.getElementById(firstField);
      if (el) el.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          password: formData.password,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        const adminData = {
          name: data.name || formData.name.trim(),
          id: data.id,
        };

        localStorage.setItem("admin", JSON.stringify(adminData));
        if (data.token) {
          localStorage.setItem("adminToken", data.token);
        }

        navigate("/admin-dashboard");
        return;
      }

      if (response.status === 401) {
        setError(
          typeof data === "string"
            ? data
            : data.message || "Invalid username or password."
        );
        return;
      }

      setError(
        typeof data === "string"
          ? data
          : data.message || "Login failed. Please check credentials."
      );
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Unable to connect to backend server. Make sure it is running on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-login-wrapper"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(30, 58, 138, 0.82)), url(${bg})`,
      }}
    >
      <div className="admin-login-card">
        <Link to="/" className="back-home-link">
          <FaArrowLeft /> Back to Home
        </Link>

        <div className="admin-login-header">
          <div className="admin-icon-circle">
            <FaUserShield />
          </div>
          <h2>Admin Portal</h2>
          <p className="subtitle">Sign in to manage projects, students, and mentors</p>
        </div>

        {error && <div className="admin-login-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          {/* USERNAME */}
          <div className="admin-input-group">
            <label htmlFor="admin-name">Username / Admin ID</label>
            <div className="input-with-icon">
              <FaUser className="field-icon" />
              <input
                id="admin-name"
                type="text"
                name="name"
                placeholder="e.g. admin"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="username"
                disabled={loading}
                className={touched.name && fieldErrors.name ? "admin-input-error" : ""}
                required
              />
            </div>
            {touched.name && fieldErrors.name && (
              <span className="field-error">{fieldErrors.name}</span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="admin-input-group">
            <label htmlFor="admin-password">Password</label>
            <div className="input-with-icon">
              <FaLock className="field-icon" />
              <input
                id="admin-password"
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="current-password"
                disabled={loading}
                className={touched.password && fieldErrors.password ? "admin-input-error" : ""}
                required
              />
            </div>
            {touched.password && fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </div>

          <div className="admin-form-options">
            <Link to="/forgot-password" className="admin-forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;