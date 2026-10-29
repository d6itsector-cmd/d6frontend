import { useEffect, useState } from "react";
import ClientTable from "../../components/Admin/Clients/ClientTable";
import ClientForm from "../../components/Admin/Clients/ClientForm";
import AddClientForm from "../../components/Admin/Clients/AddClientForm";
import ClientServicesModal from "../../components/Admin/Clients/ClientServicesModal";
import ConfirmationModal from "../../components/Billing/ConfirmationModal";
import "../../components/Billing/Billing.css";
import api from "../../services/api";

const clientName = (client) => client.displayName || client.email;

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [servicesClient, setServicesClient] = useState(null);
  const [adding, setAdding] = useState(false);
  // { client, busy, error } while the resend confirmation is open.
  const [resending, setResending] = useState(null);

  // Delete flow: { client, check: null | { deletable, reason, dependencies },
  // checking, busy, error }. The server decides whether the client can be
  // deleted (no projects/services/billing/financial history); the dialog
  // only explains that decision.
  const [deleting, setDeleting] = useState(null);
  // tone "warning": the action succeeded but its email didn't go out as expected
  const [notice, setNotice] = useState({ text: "", tone: "success" });
  const showNotice = (text, tone = "success") => setNotice({ text, tone });

  useEffect(() => {
    if (!notice.text) return undefined;
    const t = setTimeout(() => setNotice({ text: "", tone: "success" }), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  const loadClients = () => {
    setStatus("loading");
    api
      .get("/admin/users", { params: { role: "client", limit: 50, search: search || undefined } })
      .then((res) => {
        setClients(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    const t = setTimeout(loadClients, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleToggleStatus = async (client) => {
    const nextStatus = client.status === "active" ? "disabled" : "active";
    if (!window.confirm(`${nextStatus === "disabled" ? "Disable" : "Re-activate"} ${client.displayName || client.email}?`)) return;

    try {
      const res = await api.put(`/admin/users/${client._id}`, { status: nextStatus });
      setClients((prev) => prev.map((c) => (c._id === client._id ? res.data.data : c)));
    } catch (err) {
      window.alert(err.response?.data?.message || "Unable to update this account.");
    }
  };

  const openDelete = async (client) => {
    showNotice("");
    setDeleting({ client, check: null, checking: true, busy: false, error: "" });
    try {
      const res = await api.get(`/admin/users/${client._id}/deletion-check`);
      setDeleting((prev) => (prev?.client._id === client._id ? { ...prev, check: res.data.data, checking: false } : prev));
    } catch (err) {
      setDeleting((prev) =>
        prev?.client._id === client._id
          ? { ...prev, checking: false, error: err.response?.data?.message || "Couldn't check this client's records." }
          : prev
      );
    }
  };

  const closeDelete = () => setDeleting((prev) => (prev?.busy ? prev : null));

  const confirmDelete = async () => {
    const { client } = deleting;
    setDeleting((prev) => ({ ...prev, busy: true, error: "" }));
    try {
      const res = await api.delete(`/admin/users/${client._id}/permanent`);
      setDeleting(null);
      showNotice(res.data?.message || `${clientName(client)} was permanently deleted.`);
      loadClients();
    } catch (err) {
      const data = err.response?.data;
      setDeleting((prev) => ({
        ...prev,
        busy: false,
        // 409: history appeared since the check -- show the up-to-date list.
        check: data?.data?.dependencies ? data.data : prev.check,
        error: data?.message || "Unable to delete this client. Please try again.",
      }));
    }
  };

  // Archival alternative offered when the client has history.
  const disableInstead = async () => {
    const { client } = deleting;
    setDeleting((prev) => ({ ...prev, busy: true, error: "" }));
    try {
      const res = await api.put(`/admin/users/${client._id}`, { status: "disabled" });
      setClients((prev) => prev.map((c) => (c._id === client._id ? res.data.data : c)));
      setDeleting(null);
      showNotice(`${clientName(client)} was disabled. Their history is kept and they can no longer sign in.`);
    } catch (err) {
      setDeleting((prev) => ({
        ...prev,
        busy: false,
        error: err.response?.data?.message || "Unable to disable this account.",
      }));
    }
  };

  const closeResend = () => setResending((prev) => (prev?.busy ? prev : null));

  const confirmResend = async () => {
    const { client, busy } = resending;
    if (busy) return; // ignore repeated clicks while sending
    setResending((prev) => ({ ...prev, busy: true, error: "" }));
    try {
      const res = await api.post(`/admin/users/${client._id}/resend-set-password`);
      setResending(null);
      showNotice(res.data?.message || `A new set-password email was sent to ${client.email}.`);
    } catch (err) {
      setResending((prev) => ({
        ...prev,
        busy: false,
        error: err.response?.data?.message || "Unable to send the set-password email. Please try again.",
      }));
    }
  };

  const renderDeleteDialog = () => {
    if (!deleting) return null;
    const { client, check, checking, busy, error } = deleting;
    const name = clientName(client);

    if (checking || !check) {
      return (
        <ConfirmationModal
          title="Delete client"
          message={checking ? `Checking ${name}'s records...` : undefined}
          confirmLabel={checking ? "Delete permanently" : "Close"}
          cancelLabel="Close"
          danger
          busy={checking}
          error={error}
          onConfirm={closeDelete}
          onClose={closeDelete}
        />
      );
    }

    if (check.deletable) {
      return (
        <ConfirmationModal
          title={`Delete ${name}?`}
          message={`This permanently removes ${name}${client.displayName ? ` (${client.email})` : ""} and their notifications. This can't be undone.`}
          confirmLabel="Delete permanently"
          cancelLabel="Cancel"
          danger
          busy={busy}
          error={error}
          onConfirm={confirmDelete}
          onClose={closeDelete}
        />
      );
    }

    const alreadyDisabled = client.status === "disabled";
    return (
      <ConfirmationModal
        title={`${name} can't be deleted`}
        message={`${name} has history that must be kept, so the account can't be permanently deleted:`}
        confirmLabel={alreadyDisabled ? "Close" : "Disable account instead"}
        cancelLabel={alreadyDisabled ? "Back" : "Cancel"}
        busy={busy}
        error={error}
        onConfirm={alreadyDisabled ? closeDelete : disableInstead}
        onClose={closeDelete}
      >
        <ul className="client-delete-list">
          {check.dependencies.map((d) => (
            <li key={d.key}>
              {d.key === "stripeCustomer" ? "A Stripe billing account" : `${d.count} ${d.label}`}
            </li>
          ))}
        </ul>
        <p className="bl-confirm-message">
          {alreadyDisabled
            ? "The account is already disabled: they can't sign in and their history is kept."
            : "Disabling keeps all of this history and stops them from signing in."}
        </p>
      </ConfirmationModal>
    );
  };

  return (
    <div className="clients-page">
      <div className="page-header">
        <div>
          <h1>Clients</h1>
          <p>Manage all client accounts. New accounts are created automatically at registration.</p>
        </div>

        <button type="button" className="add-btn" onClick={() => setAdding(true)}>
          + Add Client
        </button>
      </div>

      {notice.text && (
        <p className={`bl-alert bl-alert--${notice.tone}`} role="status">
          {notice.text}
        </p>
      )}

      <ClientTable
        clients={clients}
        status={status}
        search={search}
        onSearchChange={setSearch}
        onEdit={setEditingUser}
        onToggleStatus={handleToggleStatus}
        onViewServices={setServicesClient}
        onDelete={openDelete}
        onResendSetPassword={(client) => {
          showNotice("");
          setResending({ client, busy: false, error: "" });
        }}
      />

      {renderDeleteDialog()}

      {resending && (
        <ConfirmationModal
          title="Resend set-password email?"
          message={`Send ${clientName(resending.client)} a new secure link to set their password? It goes to ${resending.client.email}. Their account, role and data don't change.`}
          confirmLabel="Send email"
          cancelLabel="Cancel"
          busy={resending.busy}
          error={resending.error}
          onConfirm={confirmResend}
          onClose={closeResend}
        />
      )}

      {adding && (
        <AddClientForm
          onClose={() => setAdding(false)}
          onCreated={(result) => {
            setAdding(false);
            showNotice(
              result?.message || "Client added.",
              result?.emailSent === false || result?.warning ? "warning" : "success"
            );
            loadClients();
          }}
        />
      )}

      {servicesClient && (
        <ClientServicesModal
          client={servicesClient}
          onClose={() => setServicesClient(null)}
        />
      )}

      {editingUser && (
        <ClientForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={(updated) => {
            setClients((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default Clients;
