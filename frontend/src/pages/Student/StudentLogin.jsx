import { useState, useEffect } from "react";
import "./StudentLogin.css";
import { useNavigate } from "react-router-dom";
import background from "../../assets/background.jpg";
import { FaKey, FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { validateEmail, validatePassword, validateOtp } from "../../utils/validation";
import { saveStudentSession } from "../../utils/studentSession";

function StudentLogin() {
  const navigate = useNavigate();

  // Mode: "password" or "otp"
  const [loginMode, setLoginMode] = useState("password");

  // Password Login State
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  // OTP Login State
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: "", message: "" });

  // Validation States
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (alertInfo.message) setAlertInfo({ type: "", message: "" });

    if (touched[name]) {
      let err = "";
      if (name === "email") err = validateEmail(value);
      if (name === "password") err = validatePassword(value, 6);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handlePasswordBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    let err = "";
    if (name === "email") err = validateEmail(value);
    if (name === "password") err = validatePassword(value, 6);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  // Password Login Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setAlertInfo({ type: "", message: "" });

    const emailErr = validateEmail(login.email);
    const passErr = validatePassword(login.password, 6);

    setTouched({ email: true, password: true });
    setErrors({ email: emailErr, password: passErr });

    if (emailErr || passErr) {
      const firstField = emailErr ? "email" : "password";
      const el = document.querySelector(`[name="${firstField}"]`);
      if (el) el.focus();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8081/student/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });

      if (response.ok) {
        const data = await response.json();
        saveStudentSession(data);
        alert("Login Successful!");
        navigate("/student-portal");
      } else {
        const error = await response.text();
        setAlertInfo({ type: "error", message: error || "Invalid email or password." });
      }
    } catch (error) {
      console.error("Password Login Error:", error);
      setAlertInfo({ type: "error", message: "Server Error! Make sure the backend is running." });
    } finally {
      setLoading(false);
    }
  };

  // Send OTP Request
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();

    const emailErr = validateEmail(otpEmail);
    setTouched((prev) => ({ ...prev, otpEmail: true }));
    setErrors((prev) => ({ ...prev, otpEmail: emailErr }));

    if (emailErr) {
      const el = document.querySelector('[name="otpEmail"]');
      if (el) el.focus();
      return;
    }

    setLoading(true);
    setAlertInfo({ type: "", message: "" });

    try {
      const response = await fetch("http://localhost:8081/student/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: otpEmail.trim() }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (response.ok && data.success) {
        setOtpSent(true);
        setTimer(60);
        setAlertInfo({
          type: "success",
          message: "OTP sent to your Gmail inbox! Please check your email (and spam folder) on your phone or PC.",
        });
      } else {
        const errorMsg =
          data.message ||
          data.error ||
          (response.status === 405
            ? "Spring Boot is running old code. Please restart your Java application in terminal/IDE!"
            : "No student found with this email. Please check your registered email or register first.");
        setAlertInfo({
          type: "error",
          message: errorMsg,
        });
      }
    } catch (error) {
      console.error("OTP Send Error:", error);
      setAlertInfo({ type: "error", message: "Cannot connect to backend server. Make sure it is running on port 8081." });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP Request
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otpErr = validateOtp(otp);
    setTouched((prev) => ({ ...prev, otp: true }));
    setErrors((prev) => ({ ...prev, otp: otpErr }));

    if (otpErr) {
      const el = document.querySelector('[name="otp"]');
      if (el) el.focus();
      return;
    }

    setLoading(true);
    setAlertInfo({ type: "", message: "" });

    try {
      const response = await fetch("http://localhost:8081/student/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: otpEmail.trim(),
          otp: otp.trim(),
        }),
      });

      let studentData = null;
      try {
        studentData = await response.json();
      } catch {
        studentData = null;
      }

      if (response.ok && studentData) {
        saveStudentSession(studentData);
        alert("Login Successful with OTP!");
        navigate("/student-portal");
      } else {
        const errMsg = studentData?.message || studentData?.error || "Invalid or expired OTP. Please try again.";
        setAlertInfo({ type: "error", message: errMsg });
      }
    } catch (error) {
      console.error("OTP Verify Error:", error);
      setAlertInfo({ type: "error", message: "Server error during OTP verification." });
    } finally {
      setLoading(false);
    }
  };

  // Reset states when switching mode
  const switchToOtpMode = () => {
    setLoginMode("otp");
    setAlertInfo({ type: "", message: "" });
    setOtp("");
    setErrors({});
    setTouched({});
    setOtpSent(false);
    if (login.email) {
      setOtpEmail(login.email);
    }
  };

  const switchToPasswordMode = () => {
    setLoginMode("password");
    setAlertInfo({ type: "", message: "" });
    setErrors({});
    setTouched({});
  };

  return (
    <div
      className="student-login-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="student-login-card">
        <h2>{loginMode === "otp" ? "Login with OTP" : "Welcome Back!"}</h2>

        <p className="subtitle">
          {loginMode === "otp"
            ? "Access your portal using a 6-digit One-Time Password sent to your email"
            : "Login to access your Project Tracking Portal"}
        </p>

        {/* Dynamic Alert Banner */}
        {alertInfo.message && (
          <div className={`login-alert ${alertInfo.type}`} role="alert">
            {alertInfo.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
            <span>{alertInfo.message}</span>
          </div>
        )}

        {/* ================= PASSWORD LOGIN FORM ================= */}
        {loginMode === "password" ? (
          <form onSubmit={handlePasswordSubmit} noValidate>
            <div className="form-field-group">
              <label htmlFor="student-email">Email</label>
              <input
                id="student-email"
                type="email"
                name="email"
                placeholder="Enter Email ID"
                value={login.email}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                className={touched.email && errors.email ? "input-error" : ""}
                required
              />
              {touched.email && errors.email && (
                <span className="field-error" id="email-error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-field-group">
              <label htmlFor="student-password">Password</label>
              <input
                id="student-password"
                type="password"
                name="password"
                placeholder="Enter Password"
                value={login.password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                className={touched.password && errors.password ? "input-error" : ""}
                required
              />
              {touched.password && errors.password && (
                <span className="field-error" id="password-error">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="login-options">
              <label className="remember">
                <input type="checkbox" />
                Remember Me
              </label>

              <span className="forgot-password" onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </span>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          /* ================= OTP LOGIN FORM ================= */
          <div className="otp-login-section">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} noValidate>
                <div className="form-field-group">
                  <label htmlFor="otpEmail">Registered Email</label>
                  <input
                    id="otpEmail"
                    type="email"
                    name="otpEmail"
                    placeholder="Enter your registered email"
                    value={otpEmail}
                    onChange={(e) => {
                      setOtpEmail(e.target.value);
                      if (touched.otpEmail) {
                        setErrors((prev) => ({ ...prev, otpEmail: validateEmail(e.target.value) }));
                      }
                    }}
                    onBlur={(e) => {
                      setTouched((prev) => ({ ...prev, otpEmail: true }));
                      setErrors((prev) => ({ ...prev, otpEmail: validateEmail(e.target.value) }));
                    }}
                    className={touched.otpEmail && errors.otpEmail ? "input-error" : ""}
                    required
                  />
                  {touched.otpEmail && errors.otpEmail && (
                    <span className="field-error" id="otpEmail-error">
                      {errors.otpEmail}
                    </span>
                  )}
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} noValidate>
                <div className="otp-email-display">
                  <div className="otp-email-text">
                    <span>OTP sent to: <strong>{otpEmail}</strong></span>
                    <small className="otp-sub-hint">Please check your Gmail inbox (or spam folder) on your phone or PC</small>
                  </div>
                  <button
                    type="button"
                    className="change-email-btn"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setAlertInfo({ type: "", message: "" });
                      setErrors({});
                      setTouched({});
                    }}
                  >
                    Change
                  </button>
                </div>

                <div className="form-field-group">
                  <label htmlFor="otp">Enter 6-Digit OTP</label>
                  <input
                    id="otp"
                    type="text"
                    name="otp"
                    maxLength={6}
                    className={`otp-input ${touched.otp && errors.otp ? "input-error" : ""}`}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => {
                      const cleanOtp = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtp(cleanOtp);
                      if (touched.otp) {
                        setErrors((prev) => ({ ...prev, otp: validateOtp(cleanOtp) }));
                      }
                    }}
                    onBlur={(e) => {
                      setTouched((prev) => ({ ...prev, otp: true }));
                      setErrors((prev) => ({ ...prev, otp: validateOtp(e.target.value) }));
                    }}
                    autoFocus
                    required
                  />
                  {touched.otp && errors.otp && (
                    <span className="field-error" id="otp-error">
                      {errors.otp}
                    </span>
                  )}
                </div>

                <div className="resend-row">
                  {timer > 0 ? (
                    <span className="resend-timer">Resend OTP in {timer}s</span>
                  ) : (
                    <button
                      type="button"
                      className="resend-btn"
                      onClick={handleSendOtp}
                      disabled={loading}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* Toggle between Password Login and OTP Login */}
        {loginMode === "password" ? (
          <button type="button" className="otp-toggle-btn" onClick={switchToOtpMode}>
            <FaKey size={16} />
            Login with OTP
          </button>
        ) : (
          <button type="button" className="otp-toggle-btn" onClick={switchToPasswordMode}>
            <FaLock size={16} />
            Login with Password
          </button>
        )}

        <p className="register-link">
          Don't have an account?
          <span onClick={() => navigate("/student-register")}> Register</span>
        </p>
      </div>
    </div>
  );
}

export default StudentLogin;
