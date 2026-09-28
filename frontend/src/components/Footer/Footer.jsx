import "./Footer.css";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-section">
          <h2>CampusProject</h2>

          <p>
            One Platform for Students, Faculty, and Administrators.
          </p>

          <p>
            Simplifying student project management from proposal
            submission to final evaluation.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <a href="#">Home</a>
          <a href="#">About Us</a>
          <a href="#">Services</a>
        </div>

        <div className="footer-section">
          <h3>Project Modules</h3>

          <p>Student Portal</p>
          <p>Faculty Portal</p>
          <p>Admin Portal</p>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>

          <p>
    <FaEnvelope className="contact-icon" />
    info@svgu.ac.in
  </p>

  <p>
    <FaPhoneAlt className="contact-icon" />
    079-26926568
  </p>

  <p>
    <FaPhoneAlt className="contact-icon" />
    079-26926429
  </p>

  <p>
    <FaMapMarkerAlt className="contact-icon" />
    Ahmedabad, Gujarat, India
  </p>
        </div>

      </div>

      <hr />

      <div className="copyright">
        © 2026 CampusProject | All Rights Reserved.
      </div>

    </footer>
  );
}

export default Footer;