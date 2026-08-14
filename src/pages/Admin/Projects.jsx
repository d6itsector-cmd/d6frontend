import { useEffect, useState } from "react";
import ProjectTable from "../../components/Admin/Projects/ProjectTable";
import ProjectForm from "../../components/Admin/Projects/ProjectForm";
import api from "../../services/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const loadProjects = () => {
    setStatus("loading");
    api
      .get("/admin/projects", { params: { limit: 50, search: search || undefined } })
      .then((res) => {
        setProjects(res.data?.data || []);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(() => {
    const t = setTimeout(loadProjects, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (project) => {
    if (!window.confirm(`Delete project "${project.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/projects/${project._id}`);
      setProjects((prev) => prev.filter((p) => p._id !== project._id));
    } catch (err) {
      window.alert(err.response?.data?.message || "Unable to delete this project.");
    }
  };

  const handleSaved = (saved) => {
    setProjects((prev) => {
      const exists = prev.some((p) => p._id === saved._id);
      return exists ? prev.map((p) => (p._id === saved._id ? saved : p)) : [saved, ...prev];
    });
    setShowForm(false);
    setEditingProject(null);
  };

  return (
    <div className="projects-page">

      <div className="page-header">

        <div>
          <h1>Projects</h1>
          <p>Manage all your projects.</p>
        </div>

        <button
          className="add-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Project
        </button>

      </div>

      <ProjectTable
        projects={projects}
        status={status}
        search={search}
        onSearchChange={setSearch}
        onEdit={setEditingProject}
        onDelete={handleDelete}
      />

      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {editingProject && (
        <ProjectForm
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSaved={handleSaved}
        />
      )}

    </div>
  );
};

export default Projects;
