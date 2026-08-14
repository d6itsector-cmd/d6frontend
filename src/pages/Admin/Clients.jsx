import { useEffect, useState } from "react";
import ClientTable from "../../components/Admin/Clients/ClientTable";
import ClientForm from "../../components/Admin/Clients/ClientForm";
import ClientServicesModal from "../../components/Admin/Clients/ClientServicesModal";
import api from "../../services/api";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [servicesClient, setServicesClient] = useState(null);

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

  return (
    <div className="clients-page">
      <div className="page-header">
        <div>
          <h1>Clients</h1>
          <p>Manage all client accounts. New accounts are created automatically at registration.</p>
        </div>
      </div>

      <ClientTable
        clients={clients}
        status={status}
        search={search}
        onSearchChange={setSearch}
        onEdit={setEditingUser}
        onToggleStatus={handleToggleStatus}
        onViewServices={setServicesClient}
      />

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
