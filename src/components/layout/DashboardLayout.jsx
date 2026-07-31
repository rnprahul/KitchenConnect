import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function DashboardLayout({
  children,
  search,
  setSearch,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="d-flex">

      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        {/* Navbar */}
        <Navbar
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  search={search}
  setSearch={setSearch}
/>

        {/* Page Content */}
        <div
  className="container-fluid p-4"
  style={{
    paddingTop: "24px",
  }}
>
          {children}
        </div>
      </div>

    </div>
  );
}

export default DashboardLayout;