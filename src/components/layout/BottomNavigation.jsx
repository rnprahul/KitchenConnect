import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function BottomNavigation() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const adminNav = [
    { name: "Home", path: "/admin", icon: "bi-grid-fill", exact: true },
    { name: "Pantry", path: "/admin/items", icon: "bi-basket2-fill" },
    { name: "Requests", path: "/admin/requests", icon: "bi-cart-fill" },
    { name: "History", path: "/admin/history", icon: "bi-clock-history" },
  ];

  const motherNav = [
    { name: "Home", path: "/mother", icon: "bi-grid-fill", exact: true },
    { name: "Request", path: "/mother/requests", icon: "bi-cart-plus-fill" },
    { name: "Total", path: "/mother/all-requests", icon: "bi-list-check" },
    { name: "History", path: "/mother/history", icon: "bi-clock-history" },
  ];

  const fatherNav = [
    { name: "Home", path: "/father", icon: "bi-grid-fill", exact: true },
    { name: "Shopping", path: "/father/requests", icon: "bi-cart-check-fill" },
    { name: "Purchases", path: "/father/history", icon: "bi-clock-history" },
  ];

  let items = [];
  if (role === "admin") items = adminNav;
  else if (role === "mother") items = motherNav;
  else if (role === "father") items = fatherNav;

  if (items.length === 0) return null;

  return (
    <nav
      className="d-lg-none position-fixed bottom-0 start-0 w-100 mobile-bottom-nav"
      style={{
        zIndex: 1040,
        padding: "0 12px 10px 12px",
        pointerEvents: "none",
      }}
    >
      <div
        className="d-flex justify-content-around align-items-center py-2 px-3 mx-auto"
        style={{
          maxWidth: "500px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRadius: "24px",
          border: "1px solid var(--border-card)",
          boxShadow: "0 10px 30px rgba(30, 41, 34, 0.12), 0 2px 8px rgba(30, 41, 34, 0.06)",
          pointerEvents: "auto",
        }}
      >
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `d-flex flex-column align-items-center text-decoration-none py-1 px-3 rounded-4 transition-all ${
                isActive ? "active-tab" : "text-muted"
              }`
            }
            style={({ isActive }) => ({
              color: isActive ? "var(--color-sage)" : "#718096",
              fontWeight: isActive ? "700" : "500",
              fontSize: "0.74rem",
              minWidth: "60px",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              background: isActive ? "var(--color-sage-tint)" : "transparent",
            })}
          >
            <i
              className={`bi ${item.icon} mb-1`}
              style={{
                fontSize: "1.25rem",
                lineHeight: 1,
              }}
            ></i>
            <span style={{ letterSpacing: "0.01em" }}>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNavigation;
