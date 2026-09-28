import { useState } from "react";
import "./FacultyLogin.css";
import { useNavigate } from "react-router-dom";
import { validatePhone, validateRequired } from "../../utils/validation";

function FacultyLogin() {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState({
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    if (name === "phoneNumber") {
      return validatePhone(value);
    }
    if (name === "password") {
      return validateRequired(value, "Password");
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "phoneNumber") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFaculty((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (serverError) setServerError("");

    if (touched[name]) {
      const fieldError = validateField(name, updatedValue);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const validateAll = () => {
    const newErrors = {};
    const newTouched = {};

    Object.keys(faculty).forEach((key) => {
      newTouched[key] = true;
      const errorMsg = validateField(key, faculty[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorKey}"]`);
      if (element) element.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/api/faculty/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(faculty),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("faculty", JSON.stringify(data));
        alert("Login Successful!");
        navigate("/faculty-portal");
      } else {
        const error = await response.text();
        setServerError(error || "Invalid phone number or password.");
      }
    } catch (error) {
      console.error("Server Error:", error);
      setServerError("Unable to connect to server! Ensure backend is running on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Faculty Login</h2>

      <form onSubmit={handleSubmit} noValidate>
        {serverError && (
          <div className="server-error-banner" role="alert">
            <span>⚠️ {serverError}</span>
          </div>
        )}

        <div className="form-field-group">
          <label htmlFor="phoneNumber">
            Phone Number{" "}
            <span className="char-count">({faculty.phoneNumber.length}/10)</span>
          </label>
          <input
            id="phoneNumber"
            type="tel"
            name="phoneNumber"
            placeholder="Enter 10-digit Phone Number"
            value={faculty.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={10}
            className={touched.phoneNumber && errors.phoneNumber ? "input-error" : ""}
            required
          />
          {touched.phoneNumber && errors.phoneNumber && (
            <span className="field-error" id="phoneNumber-error">
              {errors.phoneNumber}
            </span>
          )}
        </div>

        <div className="form-field-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter Password"
            value={faculty.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.password && errors.password ? "input-error" : ""}
            required
          />
          {touched.password && errors.password && (
            <span className="field-error" id="password-error">
              {errors.password}
            </span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="register-link">
          Don't Have an Account?
          <span onClick={() => navigate("/faculty-register")}> Register</span>
        </p>
      </form>
    </div>
  );
}

export default FacultyLogin;