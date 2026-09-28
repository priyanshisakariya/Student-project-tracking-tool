import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./About.css";
import background from "../../assets/background.jpg";
function About() {
  return (
    <>
      <Header />

      <section className="about" style={{ backgroundImage: `url(${background})` }}>

        <div className="about-container">

          <h1>About CampusProject</h1>

          <p className="intro">
            CampusProject is a web-based Student Project Tracking Tool designed
            to simplify and manage the complete academic project lifecycle.
            It provides a centralized platform where students, faculty members,
            and administrators can collaborate efficiently.
          </p>

          <div className="about-card">

            <h2>Our Mission</h2>

            <p>
              To make project management simple, transparent, and paperless by
              providing an easy-to-use platform for project submission,
              faculty review, progress tracking, evaluation, and reporting.
            </p>

          </div>

          <div className="about-card">

            <h2>What CampusProject Offers</h2>

            <ul>
              <li>Student, Faculty, and Admin Portals</li>
              <li>Online Project Proposal Submission</li>
              <li>Faculty Review and Approval Process</li>
              <li>Weekly Progress Tracking</li>
              <li>Faculty Comments and Feedback</li>
              <li>Final Report and Source Code Submission</li>
              <li>Project Evaluation Marks</li>
              <li>Project Status Reports</li>
              <li>Notifications and Announcements</li>
            </ul>

          </div>

          <div className="about-card">

            <h2>Why Choose CampusProject?</h2>

            <p>
              CampusProject eliminates manual paperwork, improves communication
              between students and faculty, tracks project progress in real
              time, and provides an organized dashboard for monitoring academic
              projects from beginning to completion.
            </p>

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default About;