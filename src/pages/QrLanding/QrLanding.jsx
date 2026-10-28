import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBullhorn,
  FaCalendarAlt,
  FaCogs,
  FaEnvelope,
  FaPhoneAlt,
  FaSearch,
  FaShareAlt,
  FaGoogle,
  FaMailBulk,
  FaLaptopCode,
  FaMicrophoneAlt,
  FaGlassCheers,
  FaStore,
  FaRocket,
  FaServer,
  FaCode,
  FaChartLine,
  FaUserClock,
  FaCalendarCheck,
  FaUsers,
  FaFolderOpen,
  FaFingerprint,
  FaGlobe,
  FaInstagram,
} from "react-icons/fa";

import { useConsultation } from "../../context/ConsultationContext";
import logo from "../../assets/d6.png";
import "./QrLanding.css";

// Public landing page for visitors arriving from the printed D6 Global
// Services QR code (/qr). Deliberately open to everyone: a static QR code
// only encodes a URL, so any "scan-only" check (Referer, user-agent, a
// client-side flag) is trivially bypassed and can also reject real scans.
// The page is kept out of search results instead (noindex below).

const PHONE_DISPLAY = "+44 330 088 8586";
const PHONE_HREF = "tel:+443300888586";
const EMAIL = "d6globaluk@gmail.com";
const AURAWORK_URL = "https://aurawork.d6globalmedia.com/";

const INSTAGRAM_ACCOUNTS = [
  { label: "D6 Global Media", href: "https://www.instagram.com/d6_global_media_/" },
  { label: "D6 Global Services", href: "https://www.instagram.com/d6_global_services" },
];

const BRANCHES = [
  {
    id: "digital-marketing",
    icon: FaBullhorn,
    title: "Digital Marketing",
    summary: "Grow visibility, traffic and qualified leads online.",
    items: [
      { icon: FaSearch, label: "Search Engine Optimisation", to: "/services/seo" },
      { icon: FaShareAlt, label: "Social Media Marketing", to: "/services/social-media" },
      { icon: FaGoogle, label: "Google Ads", to: "/services/google-ads" },
      { icon: FaMailBulk, label: "Email Marketing", to: "/services/email-marketing" },
      { icon: FaLaptopCode, label: "Website Development", to: "/services/web-development" },
    ],
  },
  {
    id: "event-management",
    icon: FaCalendarAlt,
    title: "Event Management",
    summary: "Planned, promoted and delivered end to end.",
    items: [
      { icon: FaMicrophoneAlt, label: "Corporate Events & Conferences" },
      { icon: FaRocket, label: "Product Launches" },
      { icon: FaStore, label: "Exhibitions & Trade Shows" },
      { icon: FaGlassCheers, label: "Private & Celebration Events" },
    ],
  },
  {
    id: "business-technology",
    icon: FaCogs,
    title: "Business & Technology Solutions",
    summary: "Practical technology that makes your business run better.",
    items: [
      { icon: FaChartLine, label: "Business & IT Consulting" },
      { icon: FaCode, label: "Custom Software Development" },
      { icon: FaServer, label: "Cloud & Infrastructure" },
      { icon: FaCogs, label: "Process Automation" },
    ],
  },
];

const AURAWORK_FEATURES = [
  { icon: FaUserClock, title: "Attendance", text: "Clock-in records and working hours in one place." },
  { icon: FaCalendarCheck, title: "Leave", text: "Requests, approvals and balances without the paperwork." },
  { icon: FaUsers, title: "Employee records", text: "A single, organised profile for every team member." },
  { icon: FaFolderOpen, title: "Documents", text: "Store and share employee documents securely." },
  { icon: FaFingerprint, title: "Biometric ready", text: "Built to work with biometric attendance devices." },
];

const useNoIndex = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "D6 Global Services | Our Services";

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, follow";
    document.head.appendChild(meta);

    return () => {
      document.title = previousTitle;
      meta.remove();
    };
  }, []);
};

const QrLanding = () => {
  const { openConsultation } = useConsultation();
  useNoIndex();

  return (
    <div className="qr-page">

      <header className="qr-topbar">
        <div className="qr-shell qr-topbar-inner">
          <Link to="/" className="qr-brand" aria-label="D6 Global Services home">
            <img src={logo} alt="" width="40" height="40" />
            <span>D6 Global Services</span>
          </Link>
          <a href={PHONE_HREF} className="qr-topbar-call">
            <FaPhoneAlt aria-hidden="true" />
            <span>Call us</span>
          </a>
        </div>
      </header>

      <main>

        {/* ---------------- HERO ---------------- */}
        <section className="qr-hero">
          <div className="qr-shell qr-hero-inner">
            <span className="qr-eyebrow">Thanks for scanning</span>
            <h1>
              One partner for marketing, events
              <span> and business technology.</span>
            </h1>
            <p>
              D6 Global Services brings together digital marketing, event management,
              business and technology solutions, and our own workforce platform,
              AuraWork, so your business can grow from one trusted team.
            </p>
            <div className="qr-actions">
              <button type="button" className="qr-btn qr-btn--primary" onClick={openConsultation}>
                Get a free consultation
                <FaArrowRight aria-hidden="true" />
              </button>
              <a href="#services" className="qr-btn qr-btn--ghost">
                Explore our services
              </a>
            </div>
          </div>
        </section>

        {/* ---------------- SERVICE TREE ---------------- */}
        <section className="qr-section" id="services" aria-labelledby="qr-tree-title">
          <div className="qr-shell">
            <div className="qr-heading">
              <span className="qr-tag">What we do</span>
              <h2 id="qr-tree-title">Our service tree</h2>
              <p>Three specialist divisions and one product, all under D6 Global Services.</p>
            </div>

            <div className="qr-tree">
              <div className="qr-root">
                <img src={logo} alt="" width="44" height="44" />
                <div>
                  <strong>D6 Global Services</strong>
                  <span>Services &amp; products</span>
                </div>
              </div>

              <div className="qr-branches">
                {BRANCHES.map(({ id, icon: Icon, title, summary, items }) => (
                  <article key={id} className="qr-branch" aria-labelledby={`qr-${id}`}>
                    <div className="qr-branch-head">
                      <span className="qr-icon" aria-hidden="true"><Icon /></span>
                      <div>
                        <h3 id={`qr-${id}`}>{title}</h3>
                        <p>{summary}</p>
                      </div>
                    </div>

                    <ul className="qr-leaves">
                      {items.map(({ icon: LeafIcon, label, to }) => (
                        <li key={label}>
                          {to ? (
                            <Link to={to} className="qr-leaf qr-leaf--link">
                              <LeafIcon aria-hidden="true" />
                              <span>{label}</span>
                              <FaArrowRight className="qr-leaf-arrow" aria-hidden="true" />
                            </Link>
                          ) : (
                            <span className="qr-leaf">
                              <LeafIcon aria-hidden="true" />
                              <span>{label}</span>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}

                <a href="#aurawork" className="qr-branch qr-branch--product">
                  <div className="qr-branch-head">
                    <span className="qr-icon" aria-hidden="true"><FaFingerprint /></span>
                    <div>
                      <h3>AuraWork</h3>
                      <p>Our workforce management product.</p>
                    </div>
                  </div>
                  <span className="qr-branch-link">
                    See the product <FaArrowRight aria-hidden="true" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- AURAWORK ---------------- */}
        <section className="qr-section qr-section--product" id="aurawork" aria-labelledby="qr-aurawork-title">
          <div className="qr-shell qr-product">
            <div className="qr-product-copy">
              <span className="qr-tag qr-tag--light">Product showcase</span>
              <h2 id="qr-aurawork-title">AuraWork</h2>
              <p>
                Workforce management built by D6 Global. AuraWork keeps attendance,
                leave, employee records and documents together, so HR and managers
                spend less time on admin and more time on their people.
              </p>
              <div className="qr-product-actions">
                <button type="button" className="qr-btn qr-btn--light" onClick={openConsultation}>
                  Request a demo
                  <FaArrowRight aria-hidden="true" />
                </button>
                <a
                  href={AURAWORK_URL}
                  className="qr-btn qr-btn--ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit AuraWork
                  <FaArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>

            <ul className="qr-features">
              {AURAWORK_FEATURES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="qr-feature">
                  <span className="qr-icon qr-icon--dark" aria-hidden="true"><Icon /></span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- CONTACT ---------------- */}
        <section className="qr-section qr-section--contact" aria-labelledby="qr-contact-title">
          <div className="qr-shell">
            <div className="qr-heading">
              <span className="qr-tag">Talk to us</span>
              <h2 id="qr-contact-title">Let&apos;s start a conversation</h2>
              <p>Tell us what you need and the right team will get back to you.</p>
            </div>

            <div className="qr-contact-grid">
              <a href={PHONE_HREF} className="qr-contact-card">
                <span className="qr-icon" aria-hidden="true"><FaPhoneAlt /></span>
                <span className="qr-contact-label">Call</span>
                <strong>{PHONE_DISPLAY}</strong>
              </a>
              <a href={`mailto:${EMAIL}`} className="qr-contact-card">
                <span className="qr-icon" aria-hidden="true"><FaEnvelope /></span>
                <span className="qr-contact-label">Email</span>
                <strong className="qr-contact-email">
                  {EMAIL.split("@")[0]}@<wbr />{EMAIL.split("@")[1]}
                </strong>
              </a>
              <Link to="/" className="qr-contact-card">
                <span className="qr-icon" aria-hidden="true"><FaGlobe /></span>
                <span className="qr-contact-label">Website</span>
                <strong>Visit D6 Global Services</strong>
              </Link>
            </div>

            <div className="qr-social">
              <span className="qr-social-title">Follow us on Instagram</span>
              <ul className="qr-social-links">
                {INSTAGRAM_ACCOUNTS.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="qr-social-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} on Instagram (opens in a new tab)`}
                    >
                      <FaInstagram aria-hidden="true" />
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

      </main>

      <footer className="qr-footer">
        <div className="qr-shell">
          <p>&copy; {new Date().getFullYear()} D6 Global Services. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default QrLanding;
