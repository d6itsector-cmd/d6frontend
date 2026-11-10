// Process.css is no longer used by this section, but it is kept loaded:
// its unscoped .process-card / .process-icon / .section-header rules leak
// into the About, Industries and service pages (which carry overrides for
// them), so dropping it would change those sections.
import "./Process.css";
import "./HowItWorks.css";

// Lucide icons, via react-icons (no extra dependency)
import {
  LuMessagesSquare,
  LuClipboardList,
  LuRocket,
  LuTrendingUp,
} from "react-icons/lu";

const steps = [
  {
    Icon: LuMessagesSquare,
    title: "Consultation",
    description:
      "We take time to understand your business goals, target audience and marketing requirements.",
  },
  {
    Icon: LuClipboardList,
    title: "Strategy Planning",
    description:
      "Our specialists create a customised digital marketing strategy built around your business.",
  },
  {
    Icon: LuRocket,
    title: "Execution",
    description:
      "We put your campaigns into action using the latest tools and proven marketing techniques.",
  },
  {
    Icon: LuTrendingUp,
    title: "Growth & Optimisation",
    description:
      "We continuously analyse, optimise and refine campaign performance to deliver better results.",
  },
];

const Process = () => {
  return (
    <section className="hiw" aria-labelledby="hiw-title">
      <div className="hiw-container">

        <header className="hiw-header">
          <span className="hiw-eyebrow">Our Process</span>

          <h2 id="hiw-title" className="hiw-title">
            How <span>D6 Global Services</span> Works
          </h2>

          <p className="hiw-subtitle">
            A clear, four-step approach that takes your business from the first
            conversation to sustainable, measurable digital growth.
          </p>
        </header>

        {/* Horizontal connected timeline on desktop, 2 x 2 on tablet,
            vertical timeline on mobile */}
        <ol className="hiw-steps">
          {steps.map(({ Icon, title, description }, index) => (
            <li className="hiw-step" key={title}>

              <span className="hiw-node" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <article className="hiw-card">
                <span className="hiw-icon" aria-hidden="true">
                  <Icon />
                </span>

                <h3>
                  <span className="hiw-visually-hidden">Step {index + 1}: </span>
                  {title}
                </h3>

                <p>{description}</p>
              </article>

            </li>
          ))}
        </ol>

      </div>
    </section>
  );
};

export default Process;
