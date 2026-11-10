// Building blocks for the data-driven service landing pages
// (/services/custom-products, its product pages, /services/ai-automation),
// plus the FAQ and related-services sections that the five older service
// pages also use. Everything is styled by ServiceLanding.css under the
// svl- prefix, so none of the many unscoped class names elsewhere in the
// single CSS bundle (.service-card, .faq-item, .primary-btn, ...) leak in.

import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaCheckCircle, FaPlus, FaMinus } from "react-icons/fa";

import ExploreLink from "./ExploreLink";
import { services } from "../../data/servicesCatalog";

import "./ServiceLanding.css";

/* ---------- Buttons (internal link, anchor or action) ---------- */

export const SvlButton = ({ to, href, onClick, variant = "primary", children, ...rest }) => {
  const className = `svl-btn svl-btn--${variant}`;

  if (to) {
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

/* ---------- Section header: tag, h2, intro ---------- */

export const SectionHeader = ({ tag, title, highlight, intro, id, align = "center" }) => (
  <header className={`svl-header svl-header--${align}`}>
    {tag && <span className="svl-tag">{tag}</span>}
    <h2 id={id}>
      {title}
      {highlight && <span> {highlight}</span>}
    </h2>
    {intro && <p>{intro}</p>}
  </header>
);

/* ---------- Hero ---------- */

export const ServiceHero = ({
  badge,
  title,
  highlight,
  titleAfter,
  lead,
  actions,
  points = [],
  image,
  imageAlt,
  breadcrumbs = [],
}) => (
  <section className="svl-hero" aria-labelledby="svl-hero-title">
    <div className="svl-container svl-hero-grid">
      <div className="svl-hero-text">
        {breadcrumbs.length > 0 && (
          <nav className="svl-breadcrumbs" aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((crumb) => (
                <li key={crumb.label}>
                  {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {badge && <span className="svl-tag">{badge}</span>}

        <h1 id="svl-hero-title">
          {title}
          {highlight && <span> {highlight}</span>}
          {titleAfter && ` ${titleAfter}`}
        </h1>

        <p className="svl-lead">{lead}</p>

        {actions && <div className="svl-actions">{actions}</div>}

        {points.length > 0 && (
          <ul className="svl-checklist">
            {points.map((point) => (
              <li key={point}>
                <FaCheckCircle aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        )}
      </div>

      {image && (
        <div className="svl-hero-media">
          <img src={image} alt={imageAlt} width="1200" height="900" fetchPriority="high" />
        </div>
      )}
    </div>
  </section>
);

/* ---------- Generic section wrapper ---------- */

export const SvlSection = ({ id, alt = false, labelledBy, children }) => (
  <section
    id={id}
    className={`svl-section ${alt ? "svl-section--alt" : ""}`}
    aria-labelledby={labelledBy}
  >
    <div className="svl-container">{children}</div>
  </section>
);

/* ---------- Introduction: text + "at a glance" panel ---------- */

export const ServiceIntro = ({ tag, title, highlight, paragraphs = [], glanceTitle, glance = [] }) => (
  <SvlSection labelledBy="svl-intro-title">
    <div className="svl-intro-grid">
      <div>
        <SectionHeader tag={tag} title={title} highlight={highlight} id="svl-intro-title" align="left" />
        {paragraphs.map((text) => (
          <p className="svl-body" key={text.slice(0, 32)}>{text}</p>
        ))}
      </div>

      {glance.length > 0 && (
        <aside className="svl-glance" aria-label={glanceTitle}>
          <h3>{glanceTitle}</h3>
          <dl>
            {glance.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      )}
    </div>
  </SvlSection>
);

/* ---------- Icon cards (features, benefits, why us) ---------- */

export const CardGrid = ({ items, columns = 3 }) => (
  <ul className={`svl-cards svl-cards--${columns}`}>
    {items.map(({ Icon, title, text }) => (
      <li className="svl-card" key={title}>
        {Icon && (
          <span className="svl-card-icon" aria-hidden="true">
            <Icon />
          </span>
        )}
        <h3>{title}</h3>
        <p>{text}</p>
      </li>
    ))}
  </ul>
);

/* ---------- Numbered process ---------- */

export const ProcessSteps = ({ steps }) => (
  <ol className="svl-steps">
    {steps.map((step, index) => (
      <li className="svl-step" key={step.title}>
        <span className="svl-step-number" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </li>
    ))}
  </ol>
);

/* ---------- FAQ accordion ---------- */

export const ServiceFAQ = ({ items, title = "Frequently Asked", highlight = "Questions", intro, alt = false }) => {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return (
    <SvlSection alt={alt} labelledBy={`${baseId}-title`}>
      <SectionHeader tag="FAQS" title={title} highlight={highlight} intro={intro} id={`${baseId}-title`} />

      <div className="svl-faq">
        {items.map((item, index) => {
          const isOpen = open === index;
          const panelId = `${baseId}-panel-${index}`;
          const buttonId = `${baseId}-button-${index}`;

          return (
            <div className={`svl-faq-item ${isOpen ? "is-open" : ""}`} key={item.question}>
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : index)}
                >
                  <span>{item.question}</span>
                  {isOpen ? <FaMinus aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </SvlSection>
  );
};

/* ---------- Related services (internal linking) ---------- */

export const RelatedServices = ({ currentId, ids, title = "Explore Related", highlight = "Services", alt = false }) => {
  const list = (ids ? ids.map((id) => services.find((s) => s.id === id)) : services)
    .filter((service) => service && service.id !== currentId)
    .slice(0, 3);

  return (
    <SvlSection alt={alt} labelledBy="svl-related-title">
      <SectionHeader
        tag="MORE FROM D6"
        title={title}
        highlight={highlight}
        intro="Many of our UK clients combine services for a joined-up approach. These work particularly well alongside this one."
        id="svl-related-title"
      />

      <ul className="svl-related">
        {list.map((service) => {
          const { Icon } = service;
          return (
            <li key={service.id} className="svl-related-card">
              <span className="svl-card-icon" aria-hidden="true">
                <Icon />
              </span>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <ExploreLink service={service} className="svl-text-link">
                Explore Service <FaArrowRight aria-hidden="true" />
              </ExploreLink>
            </li>
          );
        })}
      </ul>
    </SvlSection>
  );
};
