import { useEffect, useState } from "react";
import ContactRequestTable from "../../components/Admin/ContactRequests/ContactRequestTable";
import ContactRequestView from "../../components/Admin/ContactRequests/ContactRequestView";
import api from "../../services/api";

const ContactRequests = () => {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const loadRequests = () => {
    setStatus("loading");
    api
      .get("/admin/contacts", { params: { limit: 50, search: search || undefined } })
      .then((res) => {
        setRequests(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    const t = setTimeout(loadRequests, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (request) => {
    if (!window.confirm(`Delete the contact request from ${request.name}?`)) return;
    try {
      await api.delete(`/admin/contacts/${request._id}`);
      setRequests((prev) => prev.filter((r) => r._id !== request._id));
    } catch {
      window.alert("Unable to delete this contact request.");
    }
  };

  return (
    <div className="clients-page">
      <div className="page-header">
        <div>
          <h1>Contact Requests</h1>
          <p>Manage all contact enquiries received from your website.</p>
        </div>
      </div>

      <ContactRequestTable
        requests={requests}
        status={status}
        search={search}
        onSearchChange={setSearch}
        onView={setSelectedRequest}
        onDelete={handleDelete}
      />

      {selectedRequest && (
        <ContactRequestView
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default ContactRequests;
