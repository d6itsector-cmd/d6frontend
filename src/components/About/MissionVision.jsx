import "./MissionVision.css";
import missionImg from "../../assets/mission-vision.jpg";

import { FaBullseye, FaEye, FaGem } from "react-icons/fa";

const MissionVision = () => {
  return (
    <section className="missionVision">

      <div className="missionVision__container">

        {/* Left Image */}
        <div className="missionVision__image">
          <img src={missionImg} alt="Mission Vision" loading="lazy"/>
        </div>

        {/* Right Content */}
        <div className="missionVision__content">

          <span className="sectionBadge">
            OUR PURPOSE
          </span>

          <h2>
            Building Businesses
            <span> With Purpose</span>
          </h2>

          <p className="sectionDesc">
            We believe every successful business begins with a clear vision,
            innovative thinking, and a commitment to delivering value.
            Our mission and core values guide everything we create.
          </p>

          <div className="infoCard">

            <div className="iconBox">
              <FaBullseye />
            </div>

            <div>
              <h3>Our Mission</h3>

              <p>
                Empower businesses through innovative web development,
                digital marketing, and technology solutions that create
                measurable growth.
              </p>
            </div>

          </div>

          <div className="infoCard">

            <div className="iconBox">
              <FaEye />
            </div>

            <div>
              <h3>Our Vision</h3>

              <p>
                Become a trusted digital partner for startups and
                enterprises by delivering modern, scalable, and
                result-oriented solutions.
              </p>
            </div>

          </div>

          <div className="infoCard">

            <div className="iconBox">
              <FaGem />
            </div>

            <div>
              <h3>Core Values</h3>

              <p>
                Innovation • Transparency • Integrity • Quality •
                Customer Success • Continuous Improvement
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default MissionVision;