import "./OurStory.css";
import storyImg from "../../assets/Ourstory.png";
import { FaBullseye, FaRocket, FaHandshake } from "react-icons/fa";

const OurStory = () => {
  return (
    <section className="ourStory">

      <div className="ourStory__container">

        <div className="ourStory__image">
          <img src={storyImg} alt="Our Story" loading="lazy"/>
        </div>

        <div className="ourStory__content">

          <span className="storyBadge">OUR STORY</span>

          <h2>
            Turning Ideas Into
            <span> Digital Success</span>
          </h2>

          <p>
            We started with a simple vision—to help businesses establish
            a strong online presence through modern technology and
            creative digital solutions.
          </p>

          <p>
            Today, we partner with startups, entrepreneurs, and growing
            brands to create high-performing websites, improve online
            visibility, and drive measurable business growth.
          </p>

          <div className="storyFeatures">

            <div className="featureCard">
              <FaRocket />
              <div>
                <h4>Innovation</h4>
                <p>Creative ideas with modern technology.</p>
              </div>
            </div>

            <div className="featureCard">
              <FaBullseye />
              <div>
                <h4>Our Mission</h4>
                <p>Deliver measurable digital growth.</p>
              </div>
            </div>

            <div className="featureCard">
              <FaHandshake />
              <div>
                <h4>Partnership</h4>
                <p>Building long-term client relationships.</p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default OurStory;