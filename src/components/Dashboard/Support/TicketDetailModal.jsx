import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

import "./TicketModals.css";
import api from "../../../services/api";

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const TicketDetailModal = ({ ticketId, onClose }) => {
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!ticketId) return;

    let cancelled = false;
    setStatus("loading");

    api
      .get(`/support/${ticketId}`)
      .then((res) => {
        if (cancelled) return;
        setTicket(res.data.data.ticket);
        setReplies(res.data.data.replies || []);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [ticketId]);

  if (!ticketId) return null;

  const handleReply = async (e) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;

    setSending(true);
    try {
      const res = await api.post(`/support/${ticketId}/replies`, { message: draft.trim() });
      setReplies((prev) => [...prev, res.data.data]);
      setDraft("");
    } catch {
      // keep draft on failure
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ticket-modal-overlay" onClick={onClose}>

      <div className="ticket-modal ticket-detail" onClick={(e) => e.stopPropagation()}>

        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        {status === "loading" && <p className="ticket-modal-status">Loading ticket...</p>}

        {status === "error" && (
          <p className="ticket-modal-status">This ticket could not be found.</p>
        )}

        {status === "success" && ticket && (
          <>
            <span className={`status ${ticket.status}`}>{ticket.status}</span>

            <h2>{ticket.subject}</h2>

            <p className="ticket-description">{ticket.description}</p>

            <div className="ticket-replies">

              {replies.length === 0 && <p className="ticket-modal-status">No replies yet.</p>}

              {replies.map((reply) => (
                <div
                  key={reply._id}
                  className={`ticket-reply ${reply.authorRole === "client" ? "sent" : "received"}`}
                >
                  {reply.message}
                  <span className="reply-time">{formatDate(reply.createdAt)}</span>
                </div>
              ))}

            </div>

            <form className="ticket-reply-form" onSubmit={handleReply}>

              <input
                type="text"
                placeholder="Write a reply..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                disabled={sending}
              />

              <button type="submit" disabled={sending || !draft.trim()}>
                {sending ? "Sending..." : "Send"}
              </button>

            </form>
          </>
        )}

      </div>

    </div>
  );
};

export default TicketDetailModal;
