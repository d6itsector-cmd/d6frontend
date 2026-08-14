import "./WhySEO.css";
import seoImage from "../../../assets/whyseo.jpg";

import {
  FaSearch,
  FaChartLine,
  FaBullseye,
  FaUsers,
} from "react-icons/fa";

const WhySEO = () => {
  return (
    <section className="why-seo">
      <div className="why-seo-container">

        {/* LEFT */}

        <div className="why-left">
          <img src={seoImage} alt="SEO Services" />
        </div>

        {/* RIGHT */}

        <div className="why-right">

          <span className="section-tag">
            Why Choose SEO?
          </span>

          <h2>
            Why Your Business Needs
            <span> SEO</span>
          </h2>

          <p className="section-desc">
            In today's digital landscape, customers rely on search engines to
            discover products and services. A well-planned SEO strategy helps
            your business rank higher, attract qualified traffic, and generate
            consistent leads while building long-term credibility.
          </p>

          <div className="why-grid">

            <div className="why-card">
              <FaSearch className="card-icon" />

              <div>
                <h3>Higher Visibility</h3>
                <p>
                  Improve your search rankings and make your business easier to
                  discover online.
                </p>
              </div>
            </div>

            <div className="why-card">
              <FaChartLine className="card-icon" />

              <div>
                <h3>Organic Growth</h3>
                <p>
                  Generate sustainable traffic without depending only on paid
                  advertising.
                </p>
              </div>
            </div>

            <div className="why-card">
              <FaBullseye className="card-icon" />

              <div>
                <h3>Qualified Leads</h3>
                <p>
                  Reach customers actively searching for your products and
                  services.
                </p>
              </div>
            </div>

            <div className="why-card">
              <FaUsers className="card-icon" />

              <div>
                <h3>Brand Authority</h3>
                <p>
                  Build trust, strengthen your brand, and become an industry
                  leader.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhySEO;