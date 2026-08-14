import { useEffect, useState } from "react";
import "./Services.css";

import ServiceTable from "../../../components/Admin/Services-admin/ServiceTable";
import ServiceForm from "../../../components/Admin/Services-admin/ServiceForm";
import api from "../../../services/api";

const Services = () => {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const loadServices = () => {
    setStatus("loading");
    api
      .get("/admin/services", { params: { limit: 50, search: search || undefined } })
      .then((res) => {
        setServices(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    const t = setTimeout(loadServices, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (service) => {
    if (!window.confirm(`Delete service "${service.title}"?`)) return;
    try {
      await api.delete(`/admin/services/${service._id}`);
      setServices((prev) => prev.filter((s) => s._id !== service._id));
    } catch (err) {
      window.alert(err.response?.data?.message || "Unable to delete this service.");
    }
  };

  const handleSaved = (saved) => {
    setServices((prev) => {
      const exists = prev.some((s) => s._id === saved._id);
      return exists ? prev.map((s) => (s._id === saved._id ? saved : s)) : [saved, ...prev];
    });
    setShowForm(false);
    setEditingService(null);
  };

  return (
    <div className="services-page">

      <div className="services-header">

        <div>
          <h1>Services</h1>
          <p>Manage all services offered by D6 Global Media.</p>
        </div>

        <button
          className="add-service-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Service
        </button>

      </div>

      <ServiceTable
        services={services}
        status={status}
        search={search}
        onSearchChange={setSearch}
        onEdit={setEditingService}
        onDelete={handleDelete}
      />

      {showForm && (
        <ServiceForm
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {editingService && (
        <ServiceForm
          service={editingService}
          onClose={() => setEditingService(null)}
          onSaved={handleSaved}
        />
      )}

    </div>
  );
};

export default Services;
