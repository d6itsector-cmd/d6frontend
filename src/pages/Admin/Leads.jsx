import { useEffect, useState } from "react";
import LeadTable from "../../components/Admin/Leads/LeadTable";
import api from "../../services/api";

// NOTE: There is no dedicated Lead model in this system. Leads and Contact
// Requests both read/write the same Contact collection (the app's only
// generic inbound-inquiry model) -- see the Phase 8H completion report.
// The original mock UI here had an "Add Lead" manual-creation flow and
// fields (company/service/source as free-choice selects) that don't match
// the real Contact schema; that creation flow has been removed since every
// real lead originates from the public contact form, never from an admin
// manually typing one in.
const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");

  const loadLeads = () => {
    setStatus("loading");
    api
      .get("/admin/leads", { params: { limit: 50, search: search || undefined } })
      .then((res) => {
        setLeads(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    const t = setTimeout(loadLeads, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleStatusChange = async (lead, newStatus) => {
    try {
      const res = await api.put(`/admin/leads/${lead._id}`, { status: newStatus });
      setLeads((prev) => prev.map((l) => (l._id === lead._id ? res.data.data : l)));
    } catch {
      window.alert("Unable to update lead status.");
    }
  };

  const handleDelete = async (lead) => {
    if (!window.confirm(`Delete the lead from ${lead.name}?`)) return;
    try {
      await api.delete(`/admin/leads/${lead._id}`);
      setLeads((prev) => prev.filter((l) => l._id !== lead._id));
    } catch {
      window.alert("Unable to delete this lead.");
    }
  };

  return (
    <div className="leads-page">
      <div className="page-header">
        <div>
          <h1>Leads</h1>
          <p>Inbound inquiries from your website's contact form.</p>
        </div>
      </div>

      <LeadTable
        leads={leads}
        status={status}
        search={search}
        onSearchChange={setSearch}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Leads;
