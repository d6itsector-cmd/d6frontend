import { FaCheck } from "react-icons/fa";

import ExploreLink from "../ServiceLanding/ExploreLink";
// The eight services, their order, images and links live in one place.
import { services } from "../../data/servicesCatalog";

import "./ServicesList.css";

const ServicesList = () => {
  return (
    <div className="svc-page">

      {/* Page heading */}

      <header className="svc-intro">
        <div className="svc-intro-inner">
          <span className="svc-badge">OUR SERVICES</span>

          <h1>
            Business &amp; Digital Services for
            <span> Growing UK Businesses</span>
          </h1>

          <p>
            From personalised custom products and AI automation to websites,
            advertising and SEO, explore the services we offer to help your
            business work smarter, attract more customers and grow.
          </p>

          <nav className="svc-jump" aria-label="Services on this page">
            {services.map(({ id, title, Icon }) => (
              <a key={id} href={`#${id}`}>
                <Icon aria-hidden="true" />
                {title}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* One row per service; image side alternates */}

      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`svc-section ${index % 2 ? "svc-section--alt" : ""}`}
          aria-labelledby={`svc-title-${index}`}
        >
          <div className="svc-row">

            <div className="svc-text">
              <div className="svc-heading">
                <span className="svc-icon" aria-hidden="true">
                  <service.Icon />
                </span>

                <div>
                  <span className="svc-eyebrow">{service.eyebrow}</span>
                  <h2 id={`svc-title-${index}`}>{service.title}</h2>
                </div>
              </div>

              <p className="svc-description">{service.description}</p>

              <ul className="svc-features" aria-label={`${service.title} includes`}>
                {service.features.map((feature) => (
                  <li key={feature}>
                    <FaCheck aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="svc-actions">
                <ExploreLink service={service} className="svc-btn svc-btn--primary">
                  Explore Service
                  <span className="svl-visually-hidden">: {service.title}</span>
                  <span aria-hidden="true">{service.external ? "↗" : "→"}</span>
                </ExploreLink>
              </div>
            </div>

            <div
              className={`svc-media ${service.contain ? "svc-media--contain" : ""}`}
            >
              <img
                src={service.image}
                alt={service.imageAlt}
                loading={index < 2 ? "eager" : "lazy"}
              />
            </div>

          </div>
        </section>
      ))}

    </div>
  );
};

export default ServicesList;
