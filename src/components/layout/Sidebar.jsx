import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();

  const role = user?.role?.toLowerCase();

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "bi-grid-1x2-fill",
    },
    {
      name: "Kitchen Items",
      path: "/admin/items",
      icon: "bi-basket-fill",
    },
    {
      name: "Shopping Requests",
      path: "/admin/requests",
      icon: "bi-cart-fill",
    },
    {
      name: "Purchase History",
      path: "/admin/history",
      icon: "bi-clock-history",
    },
  ];

  const motherMenu = [
    {
      name: "Dashboard",
      path: "/mother",
      icon: "bi-grid-1x2-fill",
    },
    {
      name: "Shopping Requests",
      path: "/mother/requests",
      icon: "bi-cart-fill",
    },
    {
      name: "Purchase History",
      path: "/mother/history",
      icon: "bi-clock-history",
    },
  ];

  const fatherMenu = [
    {
      name: "Dashboard",
      path: "/father",
      icon: "bi-grid-1x2-fill",
    },
    {
      name: "Pending Requests",
      path: "/father/requests",
      icon: "bi-cart-check-fill",
    },
    {
      name: "Purchase History",
      path: "/father/history",
      icon: "bi-clock-history",
    },
  ];

  let menu = [];

  if (role === "admin") {
    menu = adminMenu;
  } else if (role === "mother") {
    menu = motherMenu;
  } else if (role === "father") {
    menu = fatherMenu;
  }

  return (
    <>
      {/* Dark Frosted Overlay (Mobile Only) */}
      {sidebarOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: "rgba(3, 7, 12, 0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 1040,
            transition: "all 0.3s ease",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Glassmorphic Sidebar */}
      <aside
        className={`glass-sidebar d-flex flex-column p-3 ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        {/* Sidebar Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 px-2 pt-2">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center"
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)",
                border: "1px solid rgba(52, 211, 153, 0.4)",
                color: "#34d399",
              }}
            >
              <i className="bi bi-egg-fried fs-5"></i>
            </div>
            <div>
              <h5
                className="mb-0 fw-bold text-light"
                style={{
                  letterSpacing: "-0.02em",
                }}
              >
                Kitchen<span className="text-emerald">Connect</span>
              </h5>
            </div>
          </div>

          <button
            className="btn btn-sm btn-light d-lg-none rounded-circle"
            style={{ width: "32px", height: "32px", padding: 0 }}
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Section Label */}
        <div className="px-3 mb-2">
          <small
            className="text-uppercase fw-bold text-muted"
            style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}
          >
            Main Navigation
          </small>
        </div>

        {/* Navigation List */}
        <ul className="nav flex-column gap-2 mb-auto px-1">
          {menu.map((item) => (
            <li className="nav-item" key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === `/${role}`}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 ${
                    isActive ? "glass-nav-active" : "glass-nav-inactive"
                  }`
                }
                style={({ isActive }) => ({
                  transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  fontSize: "0.92rem",
                  fontWeight: isActive ? "600" : "500",
                  color: isActive ? "#ffffff" : "#94a3b8",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.12) 100%)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(52, 211, 153, 0.4)"
                    : "1px solid transparent",
                  boxShadow: isActive
                    ? "0 4px 20px rgba(16, 185, 129, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.15)"
                    : "none",
                })}
              >
                <i
                  className={`bi ${item.icon} fs-5`}
                  style={{
                    color: "inherit",
                  }}
                ></i>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Bottom Profile Chip */}
        <div
          className="p-3 rounded-4 mt-auto"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold"
              style={{
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                boxShadow: "0 0 12px rgba(16, 185, 129, 0.35)",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden" style={{ lineHeight: 1.2 }}>
              <div className="fw-semibold text-truncate text-light" style={{ fontSize: "0.9rem" }}>
                {user?.name}
              </div>
              <small className="text-secondary text-capitalize" style={{ fontSize: "0.75rem" }}>
                {user?.role} Mode
              </small>
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop Spacer */}
      <div
        className="d-none d-lg-block"
        style={{
          width: "270px",
          flexShrink: 0,
        }}
      />
    </>
  );
}

export default Sidebar;