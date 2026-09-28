import { useState } from "react";
import "./StudentRegister.css";
import { useNavigate } from "react-router-dom";
import background from "../../assets/background.jpg";
import {
  validateEmail,
  validatePhone,
  validateFullName,
  validatePassword,
  validateEnrollmentNo,
  validateRequired,
} from "../../utils/validation";

function StudentRegister() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    fullName: "",
    password: "",
    email: "",
    mobileNo: "",
    department: "",
    sem: "",
    academicYear: "",
    enrollmentNo: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return validateFullName(value);
      case "password":
        return validatePassword(value, 6);
      case "email":
        return validateEmail(value);
      case "mobileNo":
        return validatePhone(value);
      case "department":
        return validateRequired(value, "Department");
      case "sem":
        return validateRequired(value, "Semester");
      case "academicYear":
        return validateRequired(value, "Academic Year");
      case "enrollmentNo":
        return validateEnrollmentNo(value);
      default:
        return "";
    }
  };

  // Handle change with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // For mobile number: allow only numbers and max 10 characters
    if (name === "mobileNo") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setStudent((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    // Clear server error when user makes edits
    if (serverError) setServerError("");

    // Validate if the field was already touched
    if (touched[name]) {
      const fieldError = validateField(name, updatedValue);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  // Handle blur to trigger validation when user leaves field
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

  // Validate all fields
  const validateAll = () => {
    const newErrors = {};
    const newTouched = {};

    Object.keys(student).forEach((key) => {
      newTouched[key] = true;
      const errorMsg = validateField(key, student[key]);
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
      // Find first field with error and focus it
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.focus();
      }
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/student/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        alert("Registration Successful!");
        navigate("/student-login");
      } else {
        const errorMsg =
          data?.message ||
          data?.error ||
          "Registration Failed! Please check if your Email ID or Enrollment Number is already registered.";
        setServerError(errorMsg);

        // Highlight email or enrollment if mentioned in error
        if (errorMsg.toLowerCase().includes("email")) {
          setErrors((prev) => ({
            ...prev,
            email: "This Email ID is already registered.",
          }));
          setTouched((prev) => ({ ...prev, email: true }));
        } else if (errorMsg.toLowerCase().includes("enrollment")) {
          setErrors((prev) => ({
            ...prev,
            enrollmentNo: "This Enrollment Number is already registered.",
          }));
          setTouched((prev) => ({ ...prev, enrollmentNo: true }));
        }
      }
    } catch (error) {
      console.error("Network / Server error:", error);
      setServerError("Server Error! Please ensure the backend server is running on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <h2>Student Registration</h2>

      <form onSubmit={handleSubmit} noValidate>
        {serverError && (
          <div className="server-error-banner" role="alert">
            <span>⚠️ {serverError}</span>
          </div>
        )}

        {/* FULL NAME */}
        <div className="form-field-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            placeholder="Enter Full Name"
            value={student.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.fullName && errors.fullName ? "input-error" : ""}
            required
          />
          {touched.fullName && errors.fullName && (
            <span className="field-error" id="fullName-error">
              {errors.fullName}
            </span>
          )}
        </div>

        {/* PASSWORD */}
        <div className="form-field-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter Password (min. 6 characters)"
            value={student.password}
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

        {/* EMAIL ID */}
        <div className="form-field-group">
          <label htmlFor="email">Email ID</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter Email ID (e.g. name@domain.com)"
            value={student.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.email && errors.email ? "input-error" : ""}
            required
          />
          {touched.email && errors.email && (
            <span className="field-error" id="email-error">
              {errors.email}
            </span>
          )}
        </div>

        {/* MOBILE NUMBER */}
        <div className="form-field-group">
          <label htmlFor="mobileNo">
            Mobile Number{" "}
            <span className="char-count">({student.mobileNo.length}/10)</span>
          </label>
          <input
            id="mobileNo"
            type="tel"
            name="mobileNo"
            placeholder="Enter 10-digit Mobile Number"
            value={student.mobileNo}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={10}
            className={touched.mobileNo && errors.mobileNo ? "input-error" : ""}
            required
          />
          {touched.mobileNo && errors.mobileNo && (
            <span className="field-error" id="mobileNo-error">
              {errors.mobileNo}
            </span>
          )}
        </div>

        {/* DEPARTMENT */}
        <div className="form-field-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={student.department}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.department && errors.department ? "input-error" : ""}
            required
          >
            <option value="">Select Department</option>
            <option value="MCA">MCA</option>
            <option value="BCA">BCA</option>
            <option value="Computer Science">Computer Science</option>
            <option value="IT">IT</option>
          </select>
          {touched.department && errors.department && (
            <span className="field-error" id="department-error">
              {errors.department}
            </span>
          )}
        </div>

        {/* SEMESTER */}
        <div className="form-field-group">
          <label htmlFor="sem">Semester</label>
          <select
            id="sem"
            name="sem"
            value={student.sem}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.sem && errors.sem ? "input-error" : ""}
            required
          >
            <option value="">Select Semester</option>
            <option value="Sem 1">Sem 1</option>
            <option value="Sem 2">Sem 2</option>
            <option value="Sem 3">Sem 3</option>
            <option value="Sem 4">Sem 4</option>
          </select>
          {touched.sem && errors.sem && (
            <span className="field-error" id="sem-error">
              {errors.sem}
            </span>
          )}
        </div>

        {/* ACADEMIC YEAR */}
        <div className="form-field-group">
          <label htmlFor="academicYear">Academic Year</label>
          <select
            id="academicYear"
            name="academicYear"
            value={student.academicYear}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.academicYear && errors.academicYear ? "input-error" : ""}
            required
          >
            <option value="">Select Academic Year</option>
            <option value="2023-2025">2023-2025</option>
            <option value="2024-2026">2024-2026</option>
            <option value="2025-2027">2025-2027</option>
            <option value="2026-2028">2026-2028</option>
            <option value="2027-2029">2027-2029</option>
          </select>
          {touched.academicYear && errors.academicYear && (
            <span className="field-error" id="academicYear-error">
              {errors.academicYear}
            </span>
          )}
        </div>

        {/* ENROLLMENT NUMBER */}
        <div className="form-field-group">
          <label htmlFor="enrollmentNo">Enrollment Number</label>
          <input
            id="enrollmentNo"
            type="text"
            name="enrollmentNo"
            placeholder="Enter Enrollment Number"
            value={student.enrollmentNo}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.enrollmentNo && errors.enrollmentNo ? "input-error" : ""}
            required
          />
          {touched.enrollmentNo && errors.enrollmentNo && (
            <span className="field-error" id="enrollmentNo-error">
              {errors.enrollmentNo}
            </span>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="login-link">
          Already Have an Account?
          <span onClick={() => navigate("/student-login")}> Login</span>
        </p>
      </form>
    </div>
  );
}

export default StudentRegister;
