import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({ children, search, setSearch }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="d-flex position-relative" style={{ minHeight: "100vh" }}>
      {/* Ambient Glow Background Mesh */}
      <div className="ambient-glow-mesh">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div
        className="flex-grow-1 d-flex flex-column position-relative"
        style={{
          minHeight: "100vh",
          minWidth: 0,
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          zIndex: 1,
        }}
      >
        {/* Glass Navbar */}
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          search={search}
          setSearch={setSearch}
        />

        {/* Page Content */}
        <main
          className="container-fluid px-2 py-3 px-sm-3 px-md-4 px-xl-5 py-md-4 flex-grow-1 page-fade-in"
          style={{
            maxWidth: "1600px",
            margin: "0 auto",
            width: "100%",
            minWidth: 0,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;