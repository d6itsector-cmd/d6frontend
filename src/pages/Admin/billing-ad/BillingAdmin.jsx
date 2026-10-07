import "../../../components/Billing/Billing.css";

import { NavLink, Outlet } from "react-router-dom";

import { useToasts } from "../../../components/Billing/useToasts";
import ToastStack from "../../../components/Billing/ToastStack";

// /admin/billing shell: tabs for custom plans/subscriptions, one-off payment
// requests and payment history. Child routes get `notify` via outlet context.
const TABS = [
  { to: "/admin/billing", label: "Plans & Subscriptions", end: true },
  { to: "/admin/billing/payment-requests", label: "One-off Payment Requests" },
  { to: "/admin/billing/payments", label: "Payment History" },
];

const BillingAdmin = () => {
  const { toasts, push, dismiss } = useToasts();

  return (
    <div className="bl-admin">
      <div className="bl-page-header">
        <div>
          <h1>Billing</h1>
          <p>Custom monthly plans, Stripe subscriptions and one-off payment links. Statuses update from Stripe automatically.</p>
        </div>
      </div>

      <nav className="bl-tabs" aria-label="Billing sections">
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => `bl-tab ${isActive ? "active" : ""}`}>
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet context={{ notify: push }} />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};

export default BillingAdmin;
