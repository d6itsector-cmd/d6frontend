import "./AboutHero.css";
import aboutHero from "../../assets/about.jpg";
import { FaArrowRight } from "react-icons/fa";
import { useContact } from "../../context/ContactContext";

const AboutHero = () => {

  const { openContact } = useContact();

  return (
    <section className="aboutHero">
      <div className="aboutHero__container">

        {/* Left Content */}
        <div className="aboutHero__content">

          <span className="aboutHero__badge">
            🚀 About Our Startup
          </span>

          <h1>
            Building Digital
            <span> Experiences </span>
            That Inspire Growth
          </h1>

          <p>
            We empower startups and businesses with innovative web
            development, digital marketing, branding, and SEO
            solutions that help them grow, attract customers,
            and achieve long-term success in the digital world.
          </p>

          <div className="aboutHero__buttons">

            <a href="/#services" className="primaryBtn">
              Explore Services
              <FaArrowRight />
            </a>

            <button
              className="secondaryBtn"
              onClick={openContact}
            >
              Contact Us
            </button>

          </div>

          <div className="aboutHero__stats">

            <div className="statCard">
              <h2>100+</h2>
              <p>Happy Clients</p>
            </div>

            <div className="statCard">
              <h2>150+</h2>
              <p>Projects Delivered</p>
            </div>

            <div className="statCard">
              <h2>98%</h2>
              <p>Client Satisfaction</p>
            </div>

          </div>

        </div>

        {/* Right Image */}
        <div className="aboutHero__image">

          <img
            src={aboutHero}
            alt="About Us"
            loading="lazy"
          />

          <div className="floatingCard topCard">
            🚀 Startup Focused
          </div>

          <div className="floatingCard bottomCard">
            ⭐ Trusted Partner
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutHero;