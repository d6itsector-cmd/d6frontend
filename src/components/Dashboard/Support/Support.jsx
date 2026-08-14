import { useEffect, useState } from "react";
import "./Support.css";

import {
  FaEnvelope,
  FaPlus,
  FaArrowRight,
} from "react-icons/fa";

import api from "../../../services/api";
import CreateTicketModal from "./CreateTicketModal";
import TicketDetailModal from "./TicketDetailModal";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [showCreate, setShowCreate] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState(null);

  const loadTickets = () => {
    setStatus("loading");
    api
      .get("/support", { params: { limit: 20 } })
      .then((res) => {
        setTickets(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const openCount = tickets.filter((t) => t.status === "open" || t.status === "in-progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;

  return (
    <div className="support">

      {/* Header */}

      <div className="support-header">

        <div>

          <h1>Support Center</h1>

          <p>
            Need help? Contact our team or raise a support ticket.
          </p>

        </div>

        <button className="create-ticket" onClick={() => setShowCreate(true)}>

          <FaPlus />

          Create Ticket

        </button>

      </div>

      {/* Contact Cards */}

      <div className="support-cards">

        <div className="support-card">

          <div className="support-icon">
            <FaEnvelope />
          </div>

          <h3>Email</h3>

          <p>
            <a href="mailto:notifications@d6globalmedia.com">
              notifications@d6globalmedia.com
            </a>
          </p>

        </div>

      </div>

      {/* Ticket Section */}

      <div className="ticket-table">

        <div className="ticket-title">

          <h2>Recent Support Tickets</h2>

        </div>

        {status === "loading" && <p className="ticket-status-msg">Loading tickets...</p>}

        {status === "error" && (
          <p className="ticket-status-msg">We couldn't load your tickets right now.</p>
        )}

        {status === "success" && tickets.length === 0 && (
          <p className="ticket-status-msg">You haven't raised any support tickets yet.</p>
        )}

        {status === "success" && tickets.length > 0 && (
          <table>

            <thead>

              <tr>

                <th>Ticket</th>

                <th>Status</th>

                <th>Date</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {tickets.map((ticket) => (

                <tr key={ticket._id}>

                  <td>{ticket.subject}</td>

                  <td>

                    <span className={`status ${ticket.status}`}>

                      {ticket.status}

                    </span>

                  </td>

                  <td>{formatDate(ticket.createdAt)}</td>

                  <td>

                    <button className="view-btn" onClick={() => setActiveTicketId(ticket._id)}>

                      View

                      <FaArrowRight />

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        )}

      </div>

      {/* ===========================
          SUPPORT STATS
      =========================== */}

      <div className="support-stats">

        <div className="stat-card">

          <h2>{openCount}</h2>

          <p>Open Tickets</p>

        </div>

        <div className="stat-card">

          <h2>{resolvedCount}</h2>

          <p>Resolved Tickets</p>

        </div>

      </div>

      {/* ===========================
          FAQ
      =========================== */}

      <div className="faq-section">

        <h2>Frequently Asked Questions</h2>

        <div className="faq-item">

          <h4>How long does it take to complete my website?</h4>

          <p>
            Most business websites are completed within 2–4 weeks depending on
            the project scope.
          </p>

        </div>

        <div className="faq-item">

          <h4>How often will I receive reports?</h4>

          <p>
            You will receive detailed SEO, Google Ads, and website reports every
            month through this client portal.
          </p>

        </div>

        <div className="faq-item">

          <h4>Can I request design revisions?</h4>

          <p>
            Yes. You can raise a support ticket or message your project manager
            directly from the dashboard.
          </p>

        </div>

      </div>

      {/* ===========================
          BOOK MEETING
      =========================== */}

      <div className="meeting-card">

        <div>

          <h2>Need a Project Discussion?</h2>

          <p>
            Schedule a meeting with your project manager to discuss your
            website, SEO, or marketing campaign.
          </p>

        </div>

        <button className="meeting-btn">

          Book Meeting

        </button>

      </div>

      <CreateTicketModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(ticket) => {
          setShowCreate(false);
          setTickets((prev) => [ticket, ...prev]);
        }}
      />

      <TicketDetailModal
        ticketId={activeTicketId}
        onClose={() => setActiveTicketId(null)}
      />

    </div>
  );
};

export default Support;
