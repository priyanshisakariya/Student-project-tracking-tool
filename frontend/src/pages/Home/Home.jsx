import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Home.css";
import background from "../../assets/background.jpg";


function Home(){



return(

<>

<Header />

<section className="hero" style={{ backgroundImage: `url(${background})` }}>

  <div className="hero-left">

    <h1>
      One Platform for Students,
      Faculty, and Administrators
    </h1>

    <p>
      CampusProject is a centralized platform for managing the complete
      student project lifecycle. Students can submit project proposals,
      track weekly progress, upload final reports, receive faculty feedback,
      view project evaluation marks, generate reports, and stay informed
      with important notifications.
    </p>

    

  </div>

</section>

<Footer />
</>

);

}

export default Home;