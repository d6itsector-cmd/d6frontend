import { useEffect } from "react";

import { AURAWORK_URL } from "../../data/servicesCatalog";
import usePageMeta from "../../hooks/usePageMeta";
import "../../components/ServiceLanding/ServiceLanding.css";

// /services/employee-management has no page of its own: Employee Management
// is the live AuraWork product, so anyone arriving at this URL directly
// (typed, bookmarked, shared) is sent straight there. The service cards
// link to AuraWork in a new tab and never route here.
const EmployeeManagementRedirect = () => {
  usePageMeta({
    title: "Employee Management Software UK | AuraWork | D6 Global Services",
    description:
      "AuraWork by D6 Global: employee management software for UK teams covering attendance, leave, employee records and documents.",
  });

  useEffect(() => {
    window.location.replace(AURAWORK_URL);
  }, []);

  return (
    <section className="svl-hero">
      <div className="svl-container">
        <h1>Employee Management with AuraWork</h1>
        <p className="svl-lead">
          Taking you to AuraWork, our employee management platform. If nothing
          happens, <a href={AURAWORK_URL}>continue to AuraWork</a>.
        </p>
      </div>
    </section>
  );
};

export default EmployeeManagementRedirect;
