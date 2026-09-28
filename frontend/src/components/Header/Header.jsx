import "./Header.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo1.jpeg";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserShield,
} from "react-icons/fa";
function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="CampusProject Logo" />

        <h2>CampusProject</h2>
      </div>

      <nav className="navbar">
        <a href="/">Home</a>
        <Link to="/about">About Us</Link>
        <Link to="/services">Services</Link>
      </nav>

      <div className="auth-buttons">

  <div className="login-dropdown">

    <button className="login-btn">
      Login ▾
    </button>

    <div className="dropdown-menu">

  <Link to="/student-login">
    <FaUserGraduate className="dropdown-icon" />
    Student Portal
  </Link>

  <Link to="/faculty-login">
    <FaChalkboardTeacher className="dropdown-icon" />
    Faculty Portal
  </Link>

  <Link to="/admin-login">
    <FaUserShield className="dropdown-icon" />
    Admin Portal
  </Link>

</div>
  </div>

  <button
    className="register-btn"
    onClick={() => navigate("/register")}
  >
    Register
  </button>

</div>
    </header>
  );
}

export default Header;