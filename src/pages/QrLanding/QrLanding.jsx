import { useEffect, useRef, useState } from "react";
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
  FaHandshake,
  FaLayerGroup,
  FaMicrochip,
  FaBolt,
  FaUserPlus,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { useConsultation } from "../../context/ConsultationContext";
import logo from "../../assets/d6.png";
import "./QrLanding.css";

// Public landing page for visitors arriving from the printed D6 Global
// Services QR code (/qr). Deliberately open to everyone: a static QR code
// only encodes a URL, so any "scan-only" check (Referer, user-agent, a
// client-side flag) is trivially bypassed and can also reject real scans.
// The page is kept out of search results instead (noindex below).
//
// Every claim on this page is one the site already makes elsewhere (the
// 24-hour reply comes from the consultation form). Do not add client counts,
// revenue or other figures unless they are real.

const PHONE_DISPLAY = "+44 7776 635958";
const PHONE_HREF = "tel:+447776635958";
const EMAIL = "d6globaluk@gmail.com";
const AURAWORK_URL = "https://aurawork.d6globalmedia.com/";
const REGISTER_PATH = "/register";

// Display serif for headings, loaded for this page only.
const DISPLAY_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap";
const THEME_COLOR = "#050B16";

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

const HIGHLIGHTS = [
  { icon: FaMapMarkerAlt, label: "UK-based team" },
  { icon: FaLayerGroup, label: "3 specialist divisions" },
  { icon: FaMicrochip, label: "Our own platform, AuraWork" },
  { icon: FaBolt, label: "Reply within 24 hours" },
];

const PILLARS = [
  {
    icon: FaHandshake,
    title: "One accountable partner",
    text: "Marketing, events and technology under one roof, with a single point of contact.",
  },
  {
    icon: FaLayerGroup,
    title: "Strategy through delivery",
    text: "We plan it, build it, run it and report on it, with no hand-offs between agencies.",
  },
  {
    icon: FaMicrochip,
    title: "Technology we build ourselves",
    text: "AuraWork is designed and built in-house, so we understand software from the inside.",
  },
  {
    icon: FaBolt,
    title: "A fast, direct response",
    text: "Every enquiry gets a reply from our team within 24 hours.",
  },
];

// Orbit nodes in the hero visual; `pos` is a CSS modifier for placement.
const ORBIT_NODES = [
  { pos: "a", icon: FaBullhorn, label: "Marketing" },
  { pos: "b", icon: FaCalendarAlt, label: "Events" },
  { pos: "c", icon: FaCogs, label: "Technology" },
  { pos: "d", icon: FaFingerprint, label: "AuraWork" },
];

const MARQUEE_ITEMS = BRANCHES.flatMap((branch) => branch.items.map((item) => item.label));

// Distance (px) from the top of a limb to where its branch joins the trunk.
// Must match --qr-joint in QrLanding.css.
const LIMB_JOINT = 90;

// The curved branch from the trunk to a card. Drawn left-to-right and
// mirrored in CSS for limbs on the left of the trunk.
const LimbCurve = () => (
  <svg className="qr-limb-curve" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 90 C 55 90, 45 52, 100 52" vectorEffect="non-scaling-stroke" />
  </svg>
);

const usePageHead = () => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "D6 Global Services | Our Services";

    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, follow";
    document.head.appendChild(robots);

    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = DISPLAY_FONT_HREF;
    document.head.appendChild(font);

    // Match the mobile browser chrome to the page's dark backdrop.
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const previousThemeColor = themeColor?.getAttribute("content");
    themeColor?.setAttribute("content", THEME_COLOR);

    return () => {
      document.title = previousTitle;
      robots.remove();
      font.remove();
      if (themeColor && previousThemeColor != null) {
        themeColor.setAttribute("content", previousThemeColor);
      }
    };
  }, []);
};

// Fades sections in as they scroll into view. Elements stay fully visible
// when IntersectionObserver is missing, and the CSS only hides them when the
// visitor has not asked for reduced motion.
const useReveal = (rootRef) => {
  useEffect(() => {
    const nodes = rootRef.current?.querySelectorAll(".qr-reveal") ?? [];

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [rootRef]);
};

// Grows the service tree with scroll: sets --qr-grow (0..1) on the tree for
// the trunk, and marks each limb `is-grown` once the trunk's tip (75% down
// the viewport) passes its joint. Scrolling back up retracts it. Writes to
// the DOM directly so scrolling never re-renders React.
const useTreeGrowth = (treeRef) => {
  useEffect(() => {
    const tree = treeRef.current;
    if (!tree) return undefined;

    const limbs = Array.from(tree.querySelectorAll("[data-grow-at]"));
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      const { top, height } = tree.getBoundingClientRect();
      const tip = reduceMotion
        ? height
        : Math.min(Math.max(window.innerHeight * 0.75 - top, 0), height);

      tree.style.setProperty("--qr-grow", height ? (tip / height).toFixed(4) : "1");
      limbs.forEach((limb) => {
        limb.classList.toggle("is-grown", tip >= limb.offsetTop + Number(limb.dataset.growAt));
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [treeRef]);
};

// True once the hero has scrolled out of view; drives the mobile action dock.
const usePastHero = (heroRef) => {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !("IntersectionObserver" in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting);
    });

    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroRef]);

  return pastHero;
};

const QrLanding = () => {
  const { openConsultation } = useConsultation();
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const treeRef = useRef(null);

  usePageHead();
  useReveal(pageRef);
  useTreeGrowth(treeRef);
  const pastHero = usePastHero(heroRef);

  return (
    <div className="qr-page" ref={pageRef}>

      <header className="qr-topbar">
        <div className="qr-shell qr-topbar-inner">
          <Link to="/" className="qr-brand" aria-label="D6 Global Services home">
            <img src={logo} alt="" width="40" height="40" />
            <span>D6 Global Services</span>
          </Link>
          <div className="qr-topbar-actions">
            <a href={PHONE_HREF} className="qr-topbar-call" aria-label={`Call us on ${PHONE_DISPLAY}`}>
              <FaPhoneAlt aria-hidden="true" />
            </a>
            <Link to={REGISTER_PATH} className="qr-btn qr-btn--gold qr-btn--sm">
              Register
            </Link>
          </div>
        </div>
      </header>

      <main>

        {/* ---------------- HERO ---------------- */}
        <section className="qr-hero" ref={heroRef}>
          <div className="qr-hero-backdrop" aria-hidden="true">
            <span className="qr-aurora qr-aurora--1" />
            <span className="qr-aurora qr-aurora--2" />
            <span className="qr-aurora qr-aurora--3" />
            <span className="qr-grid" />
          </div>

          <div className="qr-shell qr-hero-inner">
            <div className="qr-hero-copy">
              <span className="qr-eyebrow">
                <span className="qr-eyebrow-dot" aria-hidden="true" />
                Welcome. Thanks for scanning.
              </span>
              <h1>
                Growth, delivered by
                <em> one trusted partner.</em>
              </h1>
              <p className="qr-lead">
                Digital marketing, event management and business technology, plus
                AuraWork, our own workforce platform. One team, accountable for
                results from strategy to delivery.
              </p>
              <div className="qr-actions">
                <Link to={REGISTER_PATH} className="qr-btn qr-btn--gold qr-btn--lg">
                  <FaUserPlus aria-hidden="true" />
                  Register here
                </Link>
                <a href="#services" className="qr-btn qr-btn--glass qr-btn--lg">
                  Explore our services
                  <FaArrowRight aria-hidden="true" />
                </a>
              </div>

              <ul className="qr-highlights">
                {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                  <li key={label}>
                    <Icon aria-hidden="true" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="qr-orbit" aria-hidden="true">
              <span className="qr-orbit-ring qr-orbit-ring--outer" />
              <span className="qr-orbit-ring qr-orbit-ring--mid" />
              <span className="qr-orbit-ring qr-orbit-ring--inner" />
              <span className="qr-orbit-spinner qr-orbit-spinner--slow"><i /></span>
              <span className="qr-orbit-spinner qr-orbit-spinner--fast"><i /></span>
              <div className="qr-orbit-core">
                <img src={logo} alt="" width="96" height="96" />
              </div>
              {ORBIT_NODES.map(({ pos, icon: Icon, label }) => (
                <div key={pos} className={`qr-orbit-node qr-orbit-node--${pos}`}>
                  <span className="qr-orbit-node-icon"><Icon /></span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <a href="#services" className="qr-scroll-cue" aria-label="Scroll to our services">
            <span />
          </a>
        </section>

        {/* ---------------- CAPABILITY TICKER ---------------- */}
        <div className="qr-marquee" aria-hidden="true">
          <div className="qr-marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy}>
                {MARQUEE_ITEMS.map((label) => (
                  <li key={label}>{label}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        {/* ---------------- SERVICE ECOSYSTEM ---------------- */}
        <section className="qr-section" id="services" aria-labelledby="qr-tree-title">
          <div className="qr-shell">
            <div className="qr-heading qr-reveal">
              <span className="qr-tag">What we do</span>
              <h2 id="qr-tree-title">One group. <em>Every lever for growth.</em></h2>
              <p>Three specialist divisions and one product, all under D6 Global Services.</p>
            </div>

            {/* The trunk grows with scroll; each limb sprouts when the
                trunk reaches it (see useTreeGrowth). */}
            <div className="qr-tree" ref={treeRef}>
              <div className="qr-trunk" aria-hidden="true">
                <span className="qr-trunk-fill" />
                <span className="qr-trunk-tip" />
              </div>

              <div className="qr-root qr-reveal">
                <img src={logo} alt="" width="48" height="48" />
                <div>
                  <strong>D6 Global Services</strong>
                  <span>Services &amp; products</span>
                </div>
              </div>

              {BRANCHES.map(({ id, icon: Icon, title, summary, items }, index) => (
                <div
                  key={id}
                  className={`qr-limb qr-limb--${index % 2 === 0 ? "left" : "right"}`}
                  data-grow-at={LIMB_JOINT}
                >
                  <span className="qr-limb-node" aria-hidden="true" />
                  <LimbCurve />

                  <article className="qr-branch" aria-labelledby={`qr-${id}`}>
                    <span className="qr-branch-index" aria-hidden="true">0{index + 1}</span>
                    <div className="qr-branch-head">
                      <span className="qr-icon" aria-hidden="true"><Icon /></span>
                      <div>
                        <h3 id={`qr-${id}`}>{title}</h3>
                        <p>{summary}</p>
                      </div>
                    </div>

                    <ul className="qr-leaves">
                      {items.map(({ icon: LeafIcon, label, to }, leafIndex) => (
                        <li key={label} style={{ "--leaf-i": leafIndex }}>
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
                </div>
              ))}

              <div className="qr-limb qr-limb--crown" data-grow-at="0">
                <span className="qr-limb-node" aria-hidden="true" />
                <LimbCurve />

                <a href="#aurawork" className="qr-branch qr-branch--product">
                  <span className="qr-crown-burst" aria-hidden="true" />
                  <span className="qr-branch-index" aria-hidden="true">0{BRANCHES.length + 1}</span>
                  <div className="qr-branch-head">
                    <span className="qr-icon qr-icon--gold" aria-hidden="true"><FaFingerprint /></span>
                    <div>
                      <h3>AuraWork</h3>
                      <p>Our workforce management product, built in-house.</p>
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

        {/* ---------------- WHY D6 ---------------- */}
        <section className="qr-section qr-section--pillars" aria-labelledby="qr-why-title">
          <div className="qr-shell">
            <div className="qr-heading qr-reveal">
              <span className="qr-tag">Why D6</span>
              <h2 id="qr-why-title">Built for leaders who <em>value their time.</em></h2>
            </div>

            <ul className="qr-pillars">
              {PILLARS.map(({ icon: Icon, title, text }, index) => (
                <li
                  key={title}
                  className="qr-pillar qr-reveal"
                  style={{ "--qr-delay": `${index * 90}ms` }}
                >
                  <span className="qr-icon qr-icon--gold" aria-hidden="true"><Icon /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- AURAWORK ---------------- */}
        <section className="qr-section qr-section--product" id="aurawork" aria-labelledby="qr-aurawork-title">
          <div className="qr-shell qr-product">
            <div className="qr-product-copy qr-reveal">
              <span className="qr-tag">Product showcase</span>
              <h2 id="qr-aurawork-title">AuraWork</h2>
              <p>
                Workforce management built by D6 Global. AuraWork keeps attendance,
                leave, employee records and documents together, so HR and managers
                spend less time on admin and more time on their people.
              </p>

              <ul className="qr-features">
                {AURAWORK_FEATURES.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="qr-feature">
                    <span className="qr-icon" aria-hidden="true"><Icon /></span>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="qr-product-actions">
                <button type="button" className="qr-btn qr-btn--gold" onClick={openConsultation}>
                  Request a demo
                  <FaArrowRight aria-hidden="true" />
                </button>
                <a
                  href={AURAWORK_URL}
                  className="qr-btn qr-btn--glass"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit AuraWork
                  <FaArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>

            <figure className="qr-mockup qr-reveal" style={{ "--qr-delay": "120ms" }}>
              <div className="qr-mockup-window" aria-hidden="true">
                <div className="qr-mockup-bar">
                  <i /><i /><i />
                  <span>aurawork.d6globalmedia.com</span>
                </div>
                <div className="qr-mockup-body">
                  <div className="qr-mockup-side">
                    <span className="is-active"><FaChartLine /></span>
                    <span><FaUserClock /></span>
                    <span><FaCalendarCheck /></span>
                    <span><FaUsers /></span>
                    <span><FaFolderOpen /></span>
                  </div>
                  <div className="qr-mockup-main">
                    <div className="qr-mockup-title">
                      <strong>Today</strong>
                      <span>Team overview</span>
                    </div>
                    <div className="qr-mockup-kpis">
                      <div><span>Present</span><strong>42</strong></div>
                      <div><span>On leave</span><strong>3</strong></div>
                      <div><span>Requests</span><strong>5</strong></div>
                    </div>
                    <div className="qr-mockup-chart">
                      {[62, 78, 70, 88, 94, 81, 90].map((height, i) => (
                        <span key={i} style={{ "--h": `${height}%`, "--i": i }} />
                      ))}
                    </div>
                    <ul className="qr-mockup-rows">
                      <li><b>AM</b><span>Clocked in 08:52</span><em className="is-ok">On site</em></li>
                      <li><b>RK</b><span>Leave request</span><em className="is-wait">Pending</em></li>
                      <li><b>JS</b><span>Clocked in 09:04</span><em className="is-ok">On site</em></li>
                    </ul>
                  </div>
                </div>
              </div>
              <figcaption>Illustrative preview of the AuraWork dashboard</figcaption>
            </figure>
          </div>
        </section>

        {/* ---------------- REGISTER + CONTACT ---------------- */}
        <section className="qr-section qr-section--contact" aria-labelledby="qr-contact-title">
          <div className="qr-shell">
            <div className="qr-cta qr-reveal">
              <span className="qr-tag">Get started</span>
              <h2 id="qr-contact-title">Register with <em>D6 Global Services.</em></h2>
              <p>
                Create your account to start a project, follow its progress and
                speak directly with our team.
              </p>
              <div className="qr-actions qr-actions--center">
                <Link to={REGISTER_PATH} className="qr-btn qr-btn--gold qr-btn--lg">
                  <FaUserPlus aria-hidden="true" />
                  Register here
                </Link>
                <button type="button" className="qr-btn qr-btn--glass qr-btn--lg" onClick={openConsultation}>
                  Book a private consultation
                </button>
              </div>
            </div>

            <div className="qr-contact-grid">
              <a href={PHONE_HREF} className="qr-contact-card qr-reveal">
                <span className="qr-icon" aria-hidden="true"><FaPhoneAlt /></span>
                <span className="qr-contact-label">Call</span>
                <strong>{PHONE_DISPLAY}</strong>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="qr-contact-card qr-reveal"
                style={{ "--qr-delay": "90ms" }}
              >
                <span className="qr-icon" aria-hidden="true"><FaEnvelope /></span>
                <span className="qr-contact-label">Email</span>
                <strong className="qr-contact-email">
                  {EMAIL.split("@")[0]}@<wbr />{EMAIL.split("@")[1]}
                </strong>
              </a>
              <Link to="/" className="qr-contact-card qr-reveal" style={{ "--qr-delay": "180ms" }}>
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

      {/* Mobile action dock: appears once the hero's buttons are off screen. */}
      <div className={`qr-dock${pastHero ? " is-shown" : ""}`}>
        <a href={PHONE_HREF} className="qr-dock-call" aria-label={`Call us on ${PHONE_DISPLAY}`}>
          <FaPhoneAlt aria-hidden="true" />
        </a>
        <Link to={REGISTER_PATH} className="qr-btn qr-btn--gold qr-dock-register">
          <FaUserPlus aria-hidden="true" />
          Register here
        </Link>
      </div>

    </div>
  );
};

export default QrLanding;
