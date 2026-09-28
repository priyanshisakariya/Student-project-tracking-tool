import { useEffect, useState } from "react";

import ProjectDetailsCard from "../../components/Marks/ProjectDetailsCard";
import MarksTableCard from "../../components/Marks/MarksTableCard";
import FeedbackCard from "../../components/Marks/FeedbackCard";
import ResultCard from "../../components/Marks/ResultCard";

import "./Marks.css";

function Marks() {

  const [projectDetails, setProjectDetails] = useState({
    projectTitle: "",
    guideName: "",
    submissionDate: "",
    status: "",
  });

  const [marks, setMarks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const student = JSON.parse(localStorage.getItem("student")) || JSON.parse(localStorage.getItem("user")) || {};
        const studentId = student.id || student.Id || student.studentId || localStorage.getItem("studentId");

        if (!studentId) {
          console.log("Student ID not found in localStorage");
          setLoading(false);
          return;
        }

        console.log("Student ID:", studentId);

        // --------------------------------
        // 1. FETCH PROJECT / PROPOSAL
        // --------------------------------
        try {
          const proposalResponse = await fetch(
            `http://localhost:8081/proposal/student/${studentId}`
          );

          if (proposalResponse.ok) {
            const proposalData = await proposalResponse.json();
            console.log("Proposal Data:", proposalData);
            setProjectDetails({
              projectTitle: proposalData.projectTitle || "Project Evaluation",
              guideName: proposalData.guideName || "Not Assigned",
              submissionDate: proposalData.submissionDate || "Completed",
              status: proposalData.status || "Submitted",
            });
          } else {
            setProjectDetails((prev) => ({
              ...prev,
              projectTitle: student.projectTitle || "Project Evaluation",
              guideName: "Faculty Mentor",
              status: "Submitted",
            }));
          }
        } catch (propErr) {
          console.warn("Proposal fetch non-fatal error:", propErr);
        }

        // --------------------------------
        // 2. FETCH STUDENT MARKS
        // --------------------------------
        try {
          const marksResponse = await fetch(
            `http://localhost:8081/api/student/marks/${studentId}`
          );

          if (marksResponse.ok) {
            const marksData = await marksResponse.json();
            console.log("Marks Data:", marksData);
            setMarks(marksData);
          } else {
            console.log("Marks not published yet (status:", marksResponse.status, ")");
            setMarks(null);
          }
        } catch (marksErr) {
          console.warn("Marks fetch non-fatal error:", marksErr);
          setMarks(null);
        }

      } catch (error) {
        console.error("Error fetching marks/project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  if (loading) {
    return (
      <div className="marks-container">
        <h1 className="page-title">
          My Marks
        </h1>

        <p>
          Loading marks...
        </p>
      </div>
    );
  }


  return (

    <div className="marks-container">

      <h1 className="page-title">
        My Marks
      </h1>

      <p className="page-subtitle">
        View your project evaluation, faculty feedback, and final result.
      </p>


      {/* PROJECT DETAILS */}

      <ProjectDetailsCard
        projectDetails={projectDetails}
      />


      {/* MARKS */}

      {marks ? (

        <>

          <MarksTableCard
            marks={marks}
          />

          <FeedbackCard
            marks={marks}
          />

          <ResultCard
            marks={marks}
          />

        </>

      ) : (

        <div className="no-marks">
          <p>
            Marks have not been published yet.
          </p>
        </div>

      )}

    </div>

  );
}

export default Marks;





// import { useEffect, useState } from "react";

// import ProjectDetailsCard from "../../components/Marks/ProjectDetailsCard";
// import MarksTableCard from "../../components/Marks/MarksTableCard";
// import FeedbackCard from "../../components/Marks/FeedbackCard";
// import ResultCard from "../../components/Marks/ResultCard";

// import "./Marks.css";

// function Marks() {

//   const [projectDetails, setProjectDetails] = useState({
//     projectTitle: "",
//     guideName: "",
//     submissionDate: "",
//     status: "",
//   });

//   useEffect(() => {

//     const fetchProjectDetails = async () => {

//       try {

//         const student = JSON.parse(
//           localStorage.getItem("student")
//         );

//         if (!student) {
//           console.log("Student not found in localStorage");
//           return;
//         }

//         const studentId = student.id || student.Id;

//         console.log("Student ID:", studentId);

//         const response = await fetch(
//           `http://localhost:8081/api/student/${studentId}`
//         );

//         const data = await response.json();

//         console.log("Proposal Data:", data);

//         if (!response.ok) {
//           console.error("Failed to fetch proposal:", data);
//           return;
//         }

//         setProjectDetails({
//           projectTitle: data.projectTitle || "",
//           guideName: data.guideName || "",
//           submissionDate: data.submissionDate || "",
//           status: "Submitted",
//         });

//       } catch (error) {

//         console.error(
//           "Error fetching project details:",
//           error
//         );

//       }

//     };

//     fetchProjectDetails();

//   }, []);

//   return (
//     <div className="marks-container">

//       <h1 className="page-title">
//         My Marks
//       </h1>

//       <p className="page-subtitle">
//         View your project evaluation, faculty feedback, and final result.
//       </p>

//       <ProjectDetailsCard
//         projectDetails={projectDetails}
//       />

//       <MarksTableCard />

//       <FeedbackCard />

//       <ResultCard />

//     </div>
//   );
// }

// export default Marks;