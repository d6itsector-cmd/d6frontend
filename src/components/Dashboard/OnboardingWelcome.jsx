import "./OnboardingWelcome.css";

import { FaComments } from "react-icons/fa";

// Shown only when the client genuinely has nothing yet (0 services, 0
// projects, 0 documents, 0 reports -- computed by Dashboard.jsx from the
// real dashboard summary). Communicates the real onboarding lifecycle
// instead of leaving the client looking at a broken/empty page.
const OnboardingWelcome = ({ setActivePage }) => (
  <section className="onboarding-welcome">
    <h2>Welcome to D6 Global</h2>

    <p>
      Your services will appear here once our team has completed your onboarding.
    </p>

    <ol className="onboarding-steps">
      <li>Account created</li>
      <li>Consultation</li>
      <li>Services selected</li>
      <li>Our team enables your services</li>
      <li>Services appear in this dashboard</li>
      <li>Work begins</li>
    </ol>

    <p className="onboarding-help">Need help getting started?</p>

    <button onClick={() => setActivePage("support")}>
      <FaComments />
      Contact D6 Global
    </button>
  </section>
);

export default OnboardingWelcome;
