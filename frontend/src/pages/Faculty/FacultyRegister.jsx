import { useState } from "react";
import "./FacultyRegister.css";
import { useNavigate } from "react-router-dom";
import {
  validateFullName,
  validatePhone,
  validateRequired,
} from "../../utils/validation";

function FacultyRegister() {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState({
    facultyName: "",
    phoneNumber: "",
    department: "",
    designation: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "facultyName":
        return validateFullName(value);
      case "phoneNumber":
        return validatePhone(value);
      case "department":
        return validateRequired(value, "Department");
      case "designation":
        return validateRequired(value, "Designation");
      default:
        return "";
    }
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
      const response = await fetch("http://localhost:8081/api/faculty/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(faculty),
      });

      if (response.ok) {
        alert("Registration Successful!");
        navigate("/faculty-login");
      } else {
        const errorMessage = await response.text();
        setServerError(errorMessage || "Registration failed. Please try again.");

        if (errorMessage.toLowerCase().includes("phone")) {
          setErrors((prev) => ({
            ...prev,
            phoneNumber: "This phone number is already registered.",
          }));
          setTouched((prev) => ({ ...prev, phoneNumber: true }));
        }
      }
    } catch (error) {
      console.error("Server Error:", error);
      setServerError("Unable to connect to server! Ensure backend is running on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Faculty Registration</h2>

      <form onSubmit={handleSubmit} noValidate>
        {serverError && (
          <div className="server-error-banner" role="alert">
            <span>⚠️ {serverError}</span>
          </div>
        )}

        <div className="form-field-group">
          <label htmlFor="facultyName">Name</label>
          <input
            id="facultyName"
            type="text"
            name="facultyName"
            placeholder="Enter Full Name"
            value={faculty.facultyName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.facultyName && errors.facultyName ? "input-error" : ""}
            required
          />
          {touched.facultyName && errors.facultyName && (
            <span className="field-error" id="facultyName-error">
              {errors.facultyName}
            </span>
          )}
        </div>

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
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={faculty.department}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.department && errors.department ? "input-error" : ""}
            required
          >
            <option value="">Select Department</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="Computer Science">Computer Science</option>
            <option value="IT">IT</option>
          </select>
          {touched.department && errors.department && (
            <span className="field-error" id="department-error">
              {errors.department}
            </span>
          )}
        </div>

        <div className="form-field-group">
          <label htmlFor="designation">Designation</label>
          <select
            id="designation"
            name="designation"
            value={faculty.designation}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.designation && errors.designation ? "input-error" : ""}
            required
          >
            <option value="">Select Designation</option>
            <option value="Professor">Professor</option>
            <option value="Assistant Professor">Assistant Professor</option>
          </select>
          {touched.designation && errors.designation && (
            <span className="field-error" id="designation-error">
              {errors.designation}
            </span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        <p className="login-link">
          Already Have an Account?
          <span onClick={() => navigate("/faculty-login")}> Login</span>
        </p>
      </form>
    </div>
  );
}

export default FacultyRegister;