import { useEffect, useRef, useState } from "react";
import "./AdminMessages.css";

import { FaPaperPlane, FaCircle } from "react-icons/fa";

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

// Admin side of the same conversation the client sees in Dashboard ->
// Messages: one thread per client, picked from the list on the left.
const AdminMessages = () => {
  const [clients, setClients] = useState([]);
  const [clientsStatus, setClientsStatus] = useState("loading");
  const [selectedClient, setSelectedClient] = useState(null);

  const [messages, setMessages] = useState([]);
  const [threadStatus, setThreadStatus] = useState("idle"); // idle | loading | success | error
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    api
      .get("/admin/users", { params: { role: "client", status: "active", limit: 100 } })
      .then((res) => {
        const list = res.data?.data || [];
        setClients(list);
        setClientsStatus("success");
        if (list.length > 0) setSelectedClient(list[0]);
      })
      .catch(() => setClientsStatus("error"));
  }, []);

  const loadThread = (clientId) => {
    setThreadStatus("loading");
    api
      .get("/admin/messages", { params: { client: clientId, limit: 50 } })
      .then((res) => {
        setMessages(res.data?.data || []);
        setThreadStatus("success");
      })
      .catch(() => setThreadStatus("error"));
  };

  useEffect(() => {
    if (selectedClient) loadThread(selectedClient._id);
  }, [selectedClient]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!draft.trim() || sending || !selectedClient) return;

    setSending(true);
    try {
      const res = await api.post("/admin/messages", {
        client: selectedClient._id,
        message: draft.trim(),
      });
      setMessages((prev) => [res.data.data, ...prev]);
      setDraft("");
    } catch {
      // Keep the draft so the reply isn't lost.
    } finally {
      setSending(false);
    }
  };

  const initials = (client) =>
    (client.displayName || client.email || "?")
      .trim()
      .slice(0, 2)
      .toUpperCase();

  // API returns newest-first; the chat window reads top-to-bottom oldest-first.
  const conversation = [...messages].reverse();

  return (
    <div className="admin-messages">

      <div className="chat-list">
        {clientsStatus === "loading" && <p className="chat-status">Loading clients...</p>}
        {clientsStatus === "error" && <p className="chat-status">Couldn't load clients.</p>}
        {clientsStatus === "success" && clients.length === 0 && (
          <p className="chat-status">No active clients yet.</p>
        )}

        {clients.map((client) => (
          <div
            key={client._id}
            className={`chat-user ${selectedClient?._id === client._id ? "active" : ""}`}
            onClick={() => setSelectedClient(client)}
          >
            <div className="avatar">{initials(client)}</div>

            <div className="chat-info">
              <h4>{client.displayName || client.email}</h4>
              <p>{client.email}</p>
            </div>

            <FaCircle className="online" />
          </div>
        ))}
      </div>

      <div className="chat-window">
        {!selectedClient ? (
          <div className="chat-body">
            <p className="chat-status">Select a client to view the conversation.</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <h2>{selectedClient.displayName || selectedClient.email}</h2>
              <span>{selectedClient.email}</span>
            </div>

            <div className="chat-body" ref={bodyRef}>
              {threadStatus === "loading" && <p className="chat-status">Loading messages...</p>}
              {threadStatus === "error" && (
                <p className="chat-status">We couldn't load this conversation right now.</p>
              )}
              {threadStatus === "success" && conversation.length === 0 && (
                <p className="chat-status">No messages yet. Send the first one below.</p>
              )}

              {threadStatus === "success" &&
                conversation.map((m) => (
                  <div
                    key={m._id}
                    className={`message ${m.senderRole === "admin" ? "sent" : "received"}`}
                  >
                    {m.message}
                    <span className="message-time">{formatTime(m.createdAt)}</span>
                  </div>
                ))}
            </div>

            <form className="chat-input" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type your reply..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                disabled={sending}
              />

              <button type="submit" disabled={sending || !draft.trim()}>
                <FaPaperPlane />
              </button>
            </form>
          </>
        )}
      </div>

    </div>
  );
};

export default AdminMessages;
