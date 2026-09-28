import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Services.css";
import background from "../../assets/background.jpg";

import {
  FaFileUpload,
  FaUserGraduate,
  FaChartLine,
  FaFolderOpen,
  FaClipboardCheck,
  FaBell,
} from "react-icons/fa";

function Services() {
  return (
    <>
      <Header />

      <section
        className="services"
        style={{ backgroundImage: `url(${background})` }}
      >

        <div className="services-container">

          <h1>Our Services</h1>

          <p className="services-intro">
            CampusProject provides a complete platform for managing student
            academic projects from proposal submission to final evaluation.
          </p>

          <div className="service-cards">

            {/* Project Proposal */}
            <div className="service-card">
              <FaFileUpload className="service-icon" />
              <h2>Project Proposal Submission</h2>
              <p>
                Students can submit project titles, domains, technology stack,
                descriptions, and proposal documents online.
              </p>
            </div>

            {/* Faculty Review */}
            <div className="service-card">
              <FaUserGraduate className="service-icon" />
              <h2>Faculty Review</h2>
              <p>
                Faculty members review proposals, approve or reject submissions,
                and provide comments for improvements.
              </p>
            </div>

            {/* Weekly Progress */}
            <div className="service-card">
              <FaChartLine className="service-icon" />
              <h2>Weekly Progress Tracking</h2>
              <p>
                Students submit weekly progress updates while faculty monitor
                development and provide regular feedback.
              </p>
            </div>

            {/* Final Submission */}
            <div className="service-card">
              <FaFolderOpen className="service-icon" />
              <h2>Final Project Submission</h2>
              <p>
                Upload final project reports and submit source code links for
                evaluation.
              </p>
            </div>

            {/* Evaluation */}
            <div className="service-card">
              <FaClipboardCheck className="service-icon" />
              <h2>Project Evaluation</h2>
              <p>
                Students can view project marks, faculty feedback, approval
                status, and evaluation reports.
              </p>
            </div>

            {/* Notifications */}
            <div className="service-card">
              <FaBell className="service-icon" />
              <h2>Notifications & Reports</h2>
              <p>
                Receive important announcements, viva schedules, project
                deadlines, marks notifications, and project status updates.
              </p>
            </div>

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Services;