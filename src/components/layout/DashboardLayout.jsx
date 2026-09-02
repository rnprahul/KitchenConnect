import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BottomNavigation from "./BottomNavigation";

function DashboardLayout({ children, search, setSearch }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="d-flex position-relative" style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)" }}>
      {/* Ambient background mesh */}
      <div className="kitchen-ambient-mesh" />

      {/* Desktop/Tablet Sidebar */}
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
        {/* Top Navbar */}
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          search={search}
          setSearch={setSearch}
        />

        {/* Page Content Container with Mobile Bottom Nav Padding */}
        <main
          className="container-fluid px-3 py-3 px-sm-4 px-md-4 px-xl-5 py-md-4 flex-grow-1 page-fade-in"
          style={{
            maxWidth: "1500px",
            margin: "0 auto",
            width: "100%",
            minWidth: 0,
            paddingBottom: "96px", // Ensure mobile bottom nav doesn't cover content
          }}
        >
          {children}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <BottomNavigation />
    </div>
  );
}

export default DashboardLayout;