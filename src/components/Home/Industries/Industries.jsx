// Industries.css is no longer used by this section, but it is kept loaded:
// its unscoped .industry-card / .industry-icon / .section-header rules
// leak into the /industries page and other sections, so dropping it would
// change them.
import "./Industries.css";
import "./IndustriesSection.css";

// Lucide icons, via react-icons (no extra dependency)
import {
  LuLaptopMinimal,
  LuHeartPulse,
  LuShoppingCart,
  LuHouse,
  LuGraduationCap,
  LuUtensils,
  LuBriefcaseBusiness,
  LuPlaneTakeoff,
} from "react-icons/lu";

const industries = [
  {
    Icon: LuLaptopMinimal,
    title: "IT & Software",
    desc: "Helping technology companies build a strong, credible digital presence.",
  },
  {
    Icon: LuHeartPulse,
    title: "Healthcare",
    desc: "Marketing solutions for clinics, hospitals and healthcare providers.",
  },
  {
    Icon: LuShoppingCart,
    title: "E-Commerce",
    desc: "Drive more sales and improve your online store's visibility.",
  },
  {
    Icon: LuHouse,
    title: "Real Estate",
    desc: "Generate quality leads for estate agents and property businesses.",
  },
  {
    Icon: LuGraduationCap,
    title: "Education",
    desc: "Promote schools, colleges and online learning platforms.",
  },
  {
    Icon: LuUtensils,
    title: "Restaurants",
    desc: "Grow your restaurant brand and fill more tables with digital marketing.",
  },
  {
    Icon: LuBriefcaseBusiness,
    title: "Corporate",
    desc: "Professional marketing solutions for established corporate businesses.",
  },
  {
    Icon: LuPlaneTakeoff,
    title: "Travel & Tourism",
    desc: "Increase bookings and reach more travellers online.",
  },
];

const Industries = () => {
  return (
    <section className="ind" aria-labelledby="ind-title">
      <div className="ind-container">

        <header className="ind-header">
          <span className="ind-eyebrow">Industries We Serve</span>

          <h2 id="ind-title" className="ind-title">
            Helping Businesses Across
            <span> Multiple Industries</span>
          </h2>

          <p className="ind-subtitle">
            We deliver customised digital marketing solutions tailored to the
            unique goals and challenges of every industry.
          </p>
        </header>

        <ul className="ind-grid">
          {industries.map(({ Icon, title, desc }) => (
            <li className="ind-card" key={title}>

              <span className="ind-icon" aria-hidden="true">
                <Icon />
              </span>

              <h3>{title}</h3>

              <p>{desc}</p>

            </li>
          ))}
        </ul>

      </div>
    </section>
  );
};

export default Industries;
