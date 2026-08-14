import { useEffect, useState } from "react";
import "./Portfolio-admin.css";

import PortfolioTable from "../../../components/Admin/Portfolio/PortfolioTable";
import PortfolioForm from "../../../components/Admin/Portfolio/PortfolioForm";
import api from "../../../services/api";

const PortfolioAdmin = () => {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadItems = () => {
    setStatus("loading");
    api
      .get("/admin/portfolio", { params: { limit: 50, search: search || undefined } })
      .then((res) => {
        setItems(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    const t = setTimeout(loadItems, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete portfolio item "${item.title}"?`)) return;
    try {
      await api.delete(`/admin/portfolio/${item._id}`);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (err) {
      window.alert(err.response?.data?.message || "Unable to delete this portfolio item.");
    }
  };

  const handleSaved = (saved) => {
    setItems((prev) => {
      const exists = prev.some((i) => i._id === saved._id);
      return exists ? prev.map((i) => (i._id === saved._id ? saved : i)) : [saved, ...prev];
    });
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="portfolio-page">

      {/* Header */}
      <div className="portfolio-header">

        <div>
          <h1>Portfolio Management</h1>
          <p>
            Manage all portfolio projects for your website.
          </p>
        </div>

        <button
          className="add-portfolio-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Portfolio
        </button>

      </div>

      <PortfolioTable
        items={items}
        status={status}
        search={search}
        onSearchChange={setSearch}
        onEdit={setEditingItem}
        onDelete={handleDelete}
      />

      {showForm && (
        <PortfolioForm
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {editingItem && (
        <PortfolioForm
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={handleSaved}
        />
      )}

    </div>
  );
};

export default PortfolioAdmin;
