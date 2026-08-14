import { useEffect, useRef, useState } from "react";
import "./Messages.css";

import {
  FaPaperPlane,
  FaCircle,
} from "react-icons/fa";

import api from "../../../services/api";

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bodyRef = useRef(null);

  const loadMessages = () => {
    setStatus("loading");
    api
      .get("/messages", { params: { limit: 50 } })
      .then((res) => {
        setMessages(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;

    setSending(true);
    try {
      const res = await api.post("/messages", { message: draft.trim() });
      setMessages((prev) => [res.data.data, ...prev]);
      setDraft("");
    } catch {
      // Keep the draft so the client doesn't lose what they typed.
    } finally {
      setSending(false);
    }
  };

  // API returns newest-first; the chat window reads top-to-bottom oldest-first.
  const conversation = [...messages].reverse();
  const latest = messages[0];
  const unreadCount = messages.filter((m) => m.senderRole === "admin" && !m.readByClient).length;

  return (
    <div className="messages">

      {/* Sidebar -- one real client<->agency thread, not fabricated contacts */}

      <div className="chat-list">

        <div className="chat-user active">

          <div className="avatar">DV</div>

          <div className="chat-info">

            <h4>D6 Global Media Team</h4>

            <p>{latest ? latest.message : "No messages yet"}</p>

          </div>

          {unreadCount > 0 ? (
            <span className="unread-badge">{unreadCount}</span>
          ) : (
            <FaCircle className="online" />
          )}

        </div>

      </div>

      {/* Chat Window */}

      <div className="chat-window">

        <div className="chat-header">

          <h2>D6 Global Media Team</h2>

          <span>Your project &amp; support contact</span>

        </div>

        <div className="chat-body" ref={bodyRef}>

          {status === "loading" && <p className="chat-status">Loading messages...</p>}

          {status === "error" && (
            <p className="chat-status">We couldn't load your messages right now.</p>
          )}

          {status === "success" && conversation.length === 0 && (
            <p className="chat-status">No messages yet. Send the first one below.</p>
          )}

          {status === "success" &&
            conversation.map((m) => (
              <div
                key={m._id}
                className={`message ${m.senderRole === "client" ? "sent" : "received"}`}
              >
                {m.message}
                <span className="message-time">{formatTime(m.createdAt)}</span>
              </div>
            ))}

        </div>

        <form className="chat-input" onSubmit={handleSend}>

          <input
            type="text"
            placeholder="Type your message..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={sending}
          />

          <button type="submit" disabled={sending || !draft.trim()}>

            <FaPaperPlane />

          </button>

        </form>

      </div>

    </div>
  );
};

export default Messages;
