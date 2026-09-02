import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";

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
      name: "Kitchen Pantry",
      path: "/admin/items",
      icon: "bi-basket2-fill",
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
      name: "Kitchen Dashboard",
      path: "/mother",
      icon: "bi-grid-1x2-fill",
    },
    {
      name: "Request Items",
      path: "/mother/requests",
      icon: "bi-cart-plus-fill",
    },
    {
      name: "All Requests",
      path: "/mother/all-requests",
      icon: "bi-list-check",
    },
    {
      name: "Purchase Log",
      path: "/mother/history",
      icon: "bi-clock-history",
    },
  ];

  const fatherMenu = [
    {
      name: "Shopping Home",
      path: "/father",
      icon: "bi-grid-1x2-fill",
    },
    {
      name: "Items to Buy",
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
  if (role === "admin") menu = adminMenu;
  else if (role === "mother") menu = motherMenu;
  else if (role === "father") menu = fatherMenu;

  return (
    <>
      {/* Backdrop (Mobile Only) */}
      {sidebarOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: "rgba(30, 41, 34, 0.45)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            zIndex: 1040,
            transition: "all 0.25s ease",
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`glass-sidebar d-flex flex-column p-3 ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="d-flex justify-content-between align-items-center mb-4 px-2 pt-2">
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center p-1"
              style={{
                width: "38px",
                height: "38px",
                background: "var(--color-sage-tint)",
                border: "1px solid var(--color-sage-border)",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ width: "24px", height: "24px", objectFit: "contain" }}
              />
            </div>
            <div>
              <h5
                className="mb-0 fw-bold"
                style={{
                  letterSpacing: "-0.02em",
                  fontSize: "1.15rem",
                  color: "var(--text-main)",
                }}
              >
                Kitchen<span className="text-sage">Connect</span>
              </h5>
              <small className="text-muted d-block" style={{ fontSize: "0.72rem" }}>
                Smart Pantry & Grocery
              </small>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-light d-lg-none rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "36px", height: "36px", padding: 0 }}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Navigation Menu"
          >
            <i className="bi bi-x-lg fs-6"></i>
          </button>
        </div>

        {/* Navigation Category Label */}
        <div className="px-3 mb-2">
          <small
            className="text-uppercase fw-bold text-muted"
            style={{ fontSize: "0.68rem", letterSpacing: "0.08em" }}
          >
            Kitchen Navigation
          </small>
        </div>

        {/* Navigation List */}
        <ul className="nav flex-column gap-1 mb-auto px-1">
          {menu.map((item) => (
            <li className="nav-item" key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === `/${role}`}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none ${
                    isActive ? "kitchen-nav-active" : "kitchen-nav-inactive"
                  }`
                }
                style={({ isActive }) => ({
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  fontSize: "0.9rem",
                  fontWeight: isActive ? "600" : "500",
                  color: isActive ? "var(--color-sage)" : "var(--text-muted)",
                  background: isActive ? "var(--color-sage-tint)" : "transparent",
                  border: isActive
                    ? "1px solid var(--color-sage-border)"
                    : "1px solid transparent",
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

        {/* User Card at bottom of sidebar */}
        <div
          className="p-3 rounded-3 mt-auto"
          style={{
            background: "var(--bg-main)",
            border: "1px solid var(--border-card)",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold"
              style={{
                width: "36px",
                height: "36px",
                background: "var(--color-sage)",
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden" style={{ lineHeight: 1.2 }}>
              <div className="fw-semibold text-truncate" style={{ fontSize: "0.86rem", color: "var(--text-main)" }}>
                {user?.name}
              </div>
              <small className="text-muted text-capitalize" style={{ fontSize: "0.72rem" }}>
                {user?.role} Portal
              </small>
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop Space Placeholder */}
      <div
        className="d-none d-lg-block"
        style={{
          width: "260px",
          flexShrink: 0,
        }}
      />
    </>
  );
}

export default Sidebar;