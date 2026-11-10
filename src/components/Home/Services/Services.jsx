import { FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";

import ExploreLink from "../../ServiceLanding/ExploreLink";
// Same eight services, in the same order, as the /services page.
import { services } from "../../../data/servicesCatalog";

import "./Services.css";

const Services = () => {
  return (
    <section id="services" className="services">

      <div className="services-container">

        {/* Heading */}

        <div className="services-heading">
          <span>OUR SERVICES</span>

          <h2>
            Business &amp; Digital
            <br />
            Solutions That Grow
          </h2>

          <p>
            From custom branded products and AI automation to websites
            and digital marketing, we help UK businesses work smarter,
            reach more customers and grow.
          </p>
        </div>


        {/* Services Grid */}

        <div className="services-grid">

          {services.map((service) => {
            const { Icon } = service;

            return (
              <div
                className="service-card"
                key={service.id}
              >

                {/* Icon */}

                <div className="service-icon" aria-hidden="true">
                  <Icon />
                </div>


                {/* Title */}

                <h3>
                  {service.title}
                </h3>


                {/* Description */}

                <p>
                  {service.summary}
                </p>


                {/* Explore Service: internal page, or AuraWork in a new tab */}

                <ExploreLink
                  service={service}
                  className="learn-more"
                >
                  <span>Explore Service</span>
                  <span className="svl-visually-hidden">: {service.title}</span>

                  {service.external ? <FaExternalLinkAlt aria-hidden="true" /> : <FaArrowRight aria-hidden="true" />}
                </ExploreLink>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
};

export default Services;