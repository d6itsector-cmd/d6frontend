import { useEffect, useState } from "react";
import ConsultationTable from "../../components/Admin/ConsultationRequests/ConsultationTable";
import ConsultationView from "../../components/Admin/ConsultationRequests/ConsultationView";
import api from "../../services/api";

const ConsultationRequests = () => {
  const [consultations, setConsultations] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const loadConsultations = () => {
    setStatus("loading");
    api
      .get("/admin/consultations", { params: { limit: 50, search: search || undefined } })
      .then((res) => {
        setConsultations(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    const t = setTimeout(loadConsultations, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleStatusChange = async (consultation, newStatus) => {
    try {
      const res = await api.put(`/admin/consultations/${consultation._id}`, { status: newStatus });
      setConsultations((prev) => prev.map((c) => (c._id === consultation._id ? res.data.data : c)));
    } catch {
      window.alert("Unable to update consultation status.");
    }
  };

  const handleDelete = async (consultation) => {
    if (!window.confirm(`Delete the consultation request from ${consultation.name}?`)) return;
    try {
      await api.delete(`/admin/consultations/${consultation._id}`);
      setConsultations((prev) => prev.filter((c) => c._id !== consultation._id));
    } catch {
      window.alert("Unable to delete this consultation request.");
    }
  };

  return (
    <div className="clients-page">
      <div className="page-header">
        <div>
          <h1>Consultation Requests</h1>
          <p>Manage consultation bookings.</p>
        </div>
      </div>

      <ConsultationTable
        consultations={consultations}
        status={status}
        search={search}
        onSearchChange={setSearch}
        onView={setSelectedConsultation}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      {selectedConsultation && (
        <ConsultationView
          consultation={selectedConsultation}
          onClose={() => setSelectedConsultation(null)}
        />
      )}
    </div>
  );
};

export default ConsultationRequests;
