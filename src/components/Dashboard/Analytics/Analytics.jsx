import { useState } from "react";
import "../../Billing/Billing.css";
import "./Analytics.css";

import {
  FaProjectDiagram,
  FaChartLine,
  FaHeadset,
  FaCheckCircle,
  FaPoundSign,
  FaSyncAlt,
  FaExclamationTriangle,
  FaFileInvoice,
  FaPlayCircle,
  FaPauseCircle,
  FaBriefcase,
} from "react-icons/fa";

import api from "../../../services/api";
import { getMyPlans, getMyBillingAnalytics } from "../../../services/billingApi";
import { formatGBP, formatDate, planState } from "../../../utils/billingFormat";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import { useRefreshOnReturn } from "../../Billing/useRefreshOnReturn";
import { LoadingState, ErrorState, EmptyState } from "../../Billing/StateViews";
import StatusBadge from "../../Billing/StatusBadge";

// Same windows as the backend's RANGE_TO_DAYS (GET /api/analytics?range=).
const RANGE_OPTIONS = [
  { value: "30d", label: "Last 30 Days", days: 30 },
  { value: "90d", label: "Last 90 Days", days: 90 },
  { value: "6m", label: "Last 6 Months", days: 180 },
  { value: "12m", label: "Last 12 Months", days: 365 },
];

const STATUS_LABELS = {
  pending: "Pending",
  planning: "Planning",
  active: "Active",
  "on-hold": "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
  open: "Open",
  "in-progress": "In Progress",
  "waiting-client": "Waiting on You",
  resolved: "Resolved",
  closed: "Closed",
};

const ACTIVITY_METRICS = [
  { key: "projectsByMonth", label: "Projects", unit: "projects started" },
  { key: "reportsByMonth", label: "Reports", unit: "reports delivered" },
  { key: "documentsByMonth", label: "Documents", unit: "documents shared" },
  { key: "supportByMonth", label: "Support", unit: "tickets raised" },
];

const OPEN_TICKET_STATUSES = ["open", "in-progress", "waiting-client"];

const sinceFor = (range) => {
  const days = (RANGE_OPTIONS.find((r) => r.value === range) || RANGE_OPTIONS[1]).days;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
};

// "YYYY-MM" for every month from `since` to now, so months with no activity
// show as zero instead of being skipped. The backend groups by UTC month.
const monthKeysSince = (since) => {
  const keys = [];
  const now = new Date();
  let y = since.getUTCFullYear();
  let m = since.getUTCMonth();
  while (y < now.getUTCFullYear() || (y === now.getUTCFullYear() && m <= now.getUTCMonth())) {
    keys.push(`${y}-${String(m + 1).padStart(2, "0")}`);
    m += 1;
    if (m === 12) {
      m = 0;
      y += 1;
    }
  }
  return keys;
};

const monthFormat = (key, options) => {
  const [year, month] = key.split("-");
  return new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toLocaleDateString("en-GB", {
    ...options,
    timeZone: "UTC",
  });
};
const monthShort = (key) => monthFormat(key, { month: "short" });
const monthLong = (key) => monthFormat(key, { month: "long", year: "numeric" });
// "Oct 2026" -- the Reports Over Time axis label.
const monthLabel = (key) => monthFormat(key, { month: "short", year: "numeric" });

const loadAnalytics = async (range) => {
  const res = await api.get("/analytics", { params: { range } });
  return res.data?.data || null;
};

/**
 * Single-series monthly bar chart. Every month in the window is shown (zeros
 * included); each bar has a hover/focus tooltip and the peak month is labelled.
 */
const MonthlyBarChart = ({ rows, formatValue, caption }) => {
  const max = Math.max(0, ...rows.map((r) => r.value));
  const peakIndex = max > 0 ? rows.findIndex((r) => r.value === max) : -1;

  return (
    <figure className="an-chart">
      <div className="an-chart-plot">
        {rows.map((row, i) => (
          <div
            key={row.key}
            className="an-chart-col"
            tabIndex={0}
            aria-label={`${monthLong(row.key)}: ${formatValue(row.value)}`}
          >
            <span className="an-chart-tip" aria-hidden="true">
              <strong>{formatValue(row.value)}</strong>
              {monthLong(row.key)}
            </span>
            {i === peakIndex && (
              <span className="an-chart-peak" aria-hidden="true">
                {formatValue(row.value)}
              </span>
            )}
            <div className="an-chart-bar" style={{ height: max ? `${(row.value / max) * 100}%` : 0 }} />
          </div>
        ))}
      </div>
      <div className="an-chart-axis" aria-hidden="true">
        {rows.map((row) => (
          <span key={row.key}>{monthShort(row.key)}</span>
        ))}
      </div>
      <figcaption className="an-sr-only">
        <table>
          <caption>{caption}</caption>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th scope="row">{monthLong(row.key)}</th>
                <td>{formatValue(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
};

const KpiCard = ({ icon, label, value, hint }) => (
  <div className="analytics-card">
    <div className="analytics-icon">{icon}</div>
    <div className="analytics-content">
      <span>{label}</span>
      <h2>{value}</h2>
      {hint && <small className="an-kpi-hint">{hint}</small>}
    </div>
  </div>
);

const StatusBars = ({ rows, emptyMessage }) => {
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  if (!rows.length) return <p className="analytics-status-msg">{emptyMessage}</p>;

  return rows.map((row) => (
    <div className="source" key={row.status}>
      <span>{STATUS_LABELS[row.status] || row.status}</span>
      <div className="source-bar">
        <div style={{ width: `${total ? Math.round((row.count / total) * 100) : 0}%` }}></div>
      </div>
      <strong>{row.count}</strong>
    </div>
  ));
};

const SubscriptionTable = ({ status, plans, onRetry }) => {
  if (status === "loading") return <LoadingState message="Loading your plans..." />;
  if (status === "error") return <ErrorState message="We couldn't load your plans right now." onRetry={onRetry} />;
  if (!plans.length) return <p className="analytics-status-msg">You don't have a plan yet.</p>;

  return (
    <div className="an-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Current Period</th>
            <th>Next Payment</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan._id}>
              <td>{plan.name}</td>
              <td>
                <StatusBadge kind="state" value={planState(plan)} />
              </td>
              <td>{formatGBP(plan.amountPence)} / month</td>
              <td>
                {plan.billing?.currentPeriodStart
                  ? `${formatDate(plan.billing.currentPeriodStart)} – ${formatDate(plan.billing.currentPeriodEnd)}`
                  : "—"}
              </td>
              <td>{plan.billing?.cancelAtPeriodEnd ? "Ends at period end" : formatDate(plan.billing?.nextPaymentDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Totals come from GET /api/analytics/billing (aggregated server-side for the
// signed-in client); the plan table reuses GET /api/my-plan.
const BillingSection = ({ range }) => {
  const summary = useBillingQuery(() => getMyBillingAnalytics(range), range);
  const plansQuery = useBillingQuery(getMyPlans);

  if (summary.status === "loading") return <LoadingState message="Loading billing analytics..." />;
  if (summary.status === "error" || !summary.data) {
    return <ErrorState message="We couldn't load your billing data right now." onRetry={summary.reload} />;
  }

  const { payments, subscriptions, outstandingRequests } = summary.data;
  const plans = plansQuery.data || [];

  const hasBilling =
    payments.paidCount + payments.failedCount + subscriptions.activeCount + outstandingRequests.count > 0;
  if (!hasBilling && plansQuery.status === "success" && plans.length === 0) {
    return (
      <EmptyState
        title="No billing activity yet"
        message="Once you have a plan or make a payment, your billing summary will appear here."
      />
    );
  }

  const paymentRows = payments.monthly.map((m) => ({ key: m.month, value: m.amountPence }));

  return (
    <>
      <div className="analytics-cards">
        <KpiCard
          icon={<FaPoundSign />}
          label="Paid in Period"
          value={formatGBP(payments.paidTotalPence)}
          hint={`${payments.paidCount} successful payment${payments.paidCount === 1 ? "" : "s"}`}
        />
        <KpiCard
          icon={<FaSyncAlt />}
          label="Active Subscriptions"
          value={subscriptions.activeCount}
          hint={
            subscriptions.activeCount
              ? `${formatGBP(subscriptions.monthlyRecurringPence)} / month${
                  subscriptions.nextBillingDate ? ` · next ${formatDate(subscriptions.nextBillingDate)}` : ""
                }`
              : "No subscription running"
          }
        />
        <KpiCard
          icon={<FaFileInvoice />}
          label="Outstanding Requests"
          value={formatGBP(outstandingRequests.amountPence)}
          hint={`${outstandingRequests.count} awaiting payment`}
        />
        <KpiCard
          icon={<FaExclamationTriangle />}
          label="Failed Payments"
          value={payments.failedCount}
          hint="Failed or needing action in period"
        />
      </div>

      <div className="traffic-card">
        <div className="traffic-title">
          <h2>Payments Over Time</h2>
          <span>Successful payments per month (GBP)</span>
        </div>
        {payments.paidCount === 0 ? (
          <p className="analytics-status-msg">No successful payments in this period.</p>
        ) : (
          <MonthlyBarChart rows={paymentRows} formatValue={formatGBP} caption="Successful payments per month" />
        )}
      </div>

      <div className="campaign-card">
        <h2>Subscription Status</h2>
        <SubscriptionTable status={plansQuery.status} plans={plans} onRetry={plansQuery.reload} />
      </div>
    </>
  );
};

// ---------- Project & Service analytics ----------
// Portfolio snapshot from the same /analytics response: counts come from the
// backend helper shared with the dashboard summary, so they always match
// the KPI cards, My Projects and My Services. Not limited to the period.

const STATUS_TONES = {
  pending: "info",
  planning: "info",
  active: "success",
  "on-hold": "warning",
  completed: "muted",
  cancelled: "danger",
};

const BILLING_TYPE_LABELS = {
  "one-off": "One-off",
  monthly: "Monthly",
  quarterly: "Quarterly",
  annual: "Annual",
};

const StatusPill = ({ status }) => (
  <span className={`bl-badge bl-badge--${STATUS_TONES[status] || "muted"}`}>{STATUS_LABELS[status] || status}</span>
);

const ShowingNote = ({ shown, total, noun }) =>
  total > shown ? (
    <p className="an-table-note">
      Showing the {shown} most recent of {total} {noun}.
    </p>
  ) : null;

const ProjectAnalyticsSection = ({ analytics }) => {
  const { status, data, reload } = analytics;
  if (status === "loading" && !data) return <LoadingState message="Loading project analytics..." />;
  if (status === "error" || !data) {
    return <ErrorState message="We couldn't load your project analytics right now." onRetry={reload} />;
  }

  const { counts, items } = data.projects || { counts: {}, items: [] };

  return (
    <>
      <div className="analytics-cards">
        <KpiCard icon={<FaProjectDiagram />} label="Total Projects" value={counts.total ?? 0} />
        <KpiCard icon={<FaPlayCircle />} label="Active Projects" value={counts.active ?? 0} />
        <KpiCard icon={<FaCheckCircle />} label="Completed Projects" value={counts.completed ?? 0} />
        <KpiCard icon={<FaPauseCircle />} label="On-Hold Projects" value={counts.onHold ?? 0} />
      </div>

      <div className="campaign-card">
        <h2>Your Projects</h2>
        {items.length === 0 ? (
          <EmptyState title="No projects yet" message="Projects your account team sets up for you will appear here." />
        ) : (
          <>
            <div className="bl-table-wrap">
              <table className="bl-table an-portfolio-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Start</th>
                    <th>Due</th>
                    <th>Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p._id}>
                      <td data-label="Project">
                        <strong>{p.name}</strong>
                      </td>
                      <td data-label="Status">
                        <StatusPill status={p.status} />
                      </td>
                      <td data-label="Progress">
                        <span className="an-progress">
                          <span className="an-progress-track" aria-hidden="true">
                            <span className="an-progress-fill" style={{ width: `${p.progress ?? 0}%` }} />
                          </span>
                          <span>{p.progress ?? 0}%</span>
                        </span>
                      </td>
                      <td data-label="Start">{formatDate(p.startDate)}</td>
                      <td data-label="Due">{formatDate(p.dueDate)}</td>
                      <td data-label="Budget">{formatGBP(p.budgetPence)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ShowingNote shown={items.length} total={counts.total ?? 0} noun="projects" />
          </>
        )}
      </div>
    </>
  );
};

const ServiceAnalyticsSection = ({ analytics }) => {
  const { status, data, reload } = analytics;
  if (status === "loading" && !data) return <LoadingState message="Loading service analytics..." />;
  if (status === "error" || !data) {
    return <ErrorState message="We couldn't load your service analytics right now." onRetry={reload} />;
  }

  const { counts, items } = data.services || { counts: {}, items: [] };

  return (
    <>
      <div className="analytics-cards">
        <KpiCard icon={<FaBriefcase />} label="Total Services" value={counts.total ?? 0} />
        <KpiCard icon={<FaPlayCircle />} label="Active Services" value={counts.active ?? 0} />
        <KpiCard icon={<FaCheckCircle />} label="Completed Services" value={counts.completed ?? 0} />
        <KpiCard icon={<FaPauseCircle />} label="On-Hold Services" value={counts.onHold ?? 0} />
      </div>

      {items.length === 0 ? (
        <div className="campaign-card">
          <h2>Your Services</h2>
          <EmptyState title="No services yet" message="Services assigned to you by your account team will appear here." />
        </div>
      ) : (
        <div className="an-grid an-grid--services">
          <div className="campaign-card">
            <h2>Your Services</h2>
            <div className="bl-table-wrap">
              <table className="bl-table an-portfolio-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Agreed Price</th>
                    <th>Billing</th>
                    <th>Start</th>
                    <th>End</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((a) => (
                    <tr key={a._id}>
                      <td data-label="Service">
                        <strong>{a.service?.title || "Service"}</strong>
                      </td>
                      <td data-label="Status">
                        <StatusPill status={a.status} />
                      </td>
                      <td data-label="Agreed Price">{formatGBP(a.agreedPricePence)}</td>
                      <td data-label="Billing">{BILLING_TYPE_LABELS[a.billingType] || "—"}</td>
                      <td data-label="Start">{formatDate(a.startDate)}</td>
                      <td data-label="End">{formatDate(a.targetDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ShowingNote shown={items.length} total={counts.total ?? 0} noun="services" />
          </div>

          <div className="traffic-sources">
            <h2>Service Status</h2>
            <StatusBars rows={data.serviceStatus || []} emptyMessage="No services have been assigned to you yet." />
          </div>
        </div>
      )}
    </>
  );
};

// The single /analytics request is made once in Analytics and shared with
// the Project, Service and Activity sections (no duplicate calls).
const ActivitySection = ({ range, analytics }) => {
  const { status, data, reload } = analytics;
  const [metric, setMetric] = useState(ACTIVITY_METRICS[0].key);

  if (status === "loading" && !data) return <LoadingState message="Loading project analytics..." />;
  if (status === "error" || !data) {
    return <ErrorState message="We couldn't load your project analytics right now." onRetry={reload} />;
  }

  const openTickets = (data.supportStatus || [])
    .filter((s) => OPEN_TICKET_STATUSES.includes(s.status))
    .reduce((sum, s) => sum + s.count, 0);

  const activeMetric = ACTIVITY_METRICS.find((m) => m.key === metric);
  const counts = new Map((data[metric] || []).map((r) => [r.month, r.count]));
  const activityRows = monthKeysSince(sinceFor(range)).map((key) => ({ key, value: counts.get(key) || 0 }));
  const hasActivity = activityRows.some((r) => r.value > 0);

  // Reports Over Time reuses reportsByMonth from the same /analytics response.
  const reportsByMonth = data.reportsByMonth || [];
  const maxMonthCount = Math.max(1, ...reportsByMonth.map((r) => r.count));

  return (
    <>
      <div className="analytics-cards">
        <KpiCard icon={<FaProjectDiagram />} label="Projects Started" value={data.projectProgress.totalProjects} />
        <KpiCard icon={<FaChartLine />} label="Average Progress" value={`${data.projectProgress.averageProgress}%`} />
        <KpiCard icon={<FaCheckCircle />} label="Completed Projects" value={data.projectProgress.completedProjects} />
        <KpiCard icon={<FaHeadset />} label="Open Support Tickets" value={openTickets} />
      </div>

      <div className="traffic-card">
        <div className="traffic-title an-title-row">
          <div>
            <h2>Monthly Activity</h2>
            <span>Number of {activeMetric.unit} per month</span>
          </div>
          <div className="an-segmented" role="group" aria-label="Activity type">
            {ACTIVITY_METRICS.map((m) => (
              <button
                key={m.key}
                type="button"
                className={m.key === metric ? "active" : ""}
                aria-pressed={m.key === metric}
                onClick={() => setMetric(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        {hasActivity ? (
          <MonthlyBarChart rows={activityRows} formatValue={String} caption={`${activeMetric.label} per month`} />
        ) : (
          <p className="analytics-status-msg">No {activeMetric.unit} in this period.</p>
        )}
      </div>

      <div className="traffic-card">
        <div className="traffic-title">
          <h2>Reports Over Time</h2>
          <span>Reports delivered per month</span>
        </div>

        {reportsByMonth.length === 0 ? (
          <p className="analytics-status-msg">No reports have been generated in this period yet.</p>
        ) : (
          <>
            <div className="traffic-chart">
              {reportsByMonth.map((row) => (
                <div
                  key={row.month}
                  className="bar"
                  style={{ height: `${Math.max(6, (row.count / maxMonthCount) * 100)}%` }}
                  title={`${monthLabel(row.month)}: ${row.count}`}
                ></div>
              ))}
            </div>

            <div className="analytics-bar-labels">
              {reportsByMonth.map((row) => (
                <span key={row.month}>{monthLabel(row.month)}</span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="an-grid">
        <div className="traffic-sources">
          <h2>Project Status</h2>
          <StatusBars rows={data.projectStatus || []} emptyMessage="You don't have any projects in this period yet." />
        </div>

        <div className="traffic-sources">
          <h2>Support Tickets</h2>
          <StatusBars rows={data.supportStatus || []} emptyMessage="No support tickets in this period." />
        </div>
      </div>
    </>
  );
};

const Analytics = () => {
  const [range, setRange] = useState("90d");
  const analytics = useBillingQuery(() => loadAnalytics(range), range);
  // Re-read when the client returns to the tab, so admin changes to projects
  // and services show up without a manual refresh. Sections keep showing the
  // current data while that background request runs.
  useRefreshOnReturn(analytics.reload);

  return (
    <div className="analytics">
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>Your billing, subscriptions and project activity at a glance.</p>
        </div>

        <select value={range} onChange={(e) => setRange(e.target.value)} aria-label="Time period">
          {RANGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <section className="an-section" aria-labelledby="an-billing-heading">
        <h2 id="an-billing-heading" className="an-section-title">
          Billing &amp; Payments
        </h2>
        <BillingSection range={range} />
      </section>

      <section className="an-section" aria-labelledby="an-projects-heading">
        <h2 id="an-projects-heading" className="an-section-title">
          Project Analytics
        </h2>
        <p className="an-section-note">All your projects, whatever the selected period.</p>
        <ProjectAnalyticsSection analytics={analytics} />
      </section>

      <section className="an-section" aria-labelledby="an-services-heading">
        <h2 id="an-services-heading" className="an-section-title">
          Service Analytics
        </h2>
        <p className="an-section-note">All your assigned services, whatever the selected period.</p>
        <ServiceAnalyticsSection analytics={analytics} />
      </section>

      <section className="an-section" aria-labelledby="an-activity-heading">
        <h2 id="an-activity-heading" className="an-section-title">
          Projects &amp; Activity
        </h2>
        <ActivitySection range={range} analytics={analytics} />
      </section>
    </div>
  );
};

export default Analytics;
