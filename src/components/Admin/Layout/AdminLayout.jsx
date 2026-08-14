import { useState } from "react";
import { Outlet } from "react-router-dom";

import "./AdminLayout.css";

import Sidebar from "./Sidebar";
import Topbar from "../Topbar/Topbar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">

      {/* Sidebar */}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}

      <main className="admin-main">

        {/* Top Navigation */}

        <Topbar onMenuClick={() => setSidebarOpen((open) => !open)} />

        {/* Dynamic Page Content */}

        <section className="admin-content">

          <Outlet />

        </section>

      </main>

    </div>
  );
};

export default AdminLayout;
