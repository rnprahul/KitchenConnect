import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();

  const role = user?.role?.toLowerCase();

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "bi-speedometer2",
    },
    {
      name: "Kitchen Items",
      path: "/admin/items",
      icon: "bi-basket",
    },
    {
      name: "Shopping Requests",
      path: "/admin/requests",
      icon: "bi-cart",
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
      icon: "bi-speedometer2",
    },
    {
      name: "Shopping Requests",
      path: "/mother/requests",
      icon: "bi-cart",
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
      icon: "bi-speedometer2",
    },
    {
      name: "Pending Requests",
      path: "/father/requests",
      icon: "bi-cart-check",
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
      {/* Dark Overlay (Mobile Only) */}

      {sidebarOpen && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: "rgba(0,0,0,0.5)",
            zIndex: 1040,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}

      <div
        className="bg-dark text-white p-3"
        style={{
  width: "250px",
  minHeight: "100vh",

  position: "fixed",
  top: 0,

  left:
    window.innerWidth >= 992
      ? "0"
      : sidebarOpen
      ? "0"
      : "-260px",

  transition: "0.3s",

  zIndex: 1050,
}}
      >

        {/* Mobile Close Button */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h4 className="mb-0">
            KitchenConnect
          </h4>

          <button
            className="btn btn-sm btn-light d-lg-none"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>

        </div>

        <ul className="nav flex-column">

          {menu.map((item) => (

            <li
              className="nav-item mb-2"
              key={item.path}
            >

              <NavLink
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "active bg-success text-white rounded"
                      : "text-white"
                  }`
                }
              >
                <i className={`bi ${item.icon} me-2`}></i>

                {item.name}

              </NavLink>

            </li>

          ))}

        </ul>

      </div>

      {/* Desktop Spacer */}

      <div
        className="d-none d-lg-block"
        style={{
          width: "250px",
        }}
      />

    </>
  );
}

export default Sidebar;