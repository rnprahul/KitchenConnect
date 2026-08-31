import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import auth from "../../firebase/auth";
import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";

import {
  subscribeToNotificationCount,
  subscribeToNotifications,
  clearNotifications,
} from "../../services/notificationService";

function Navbar({
  sidebarOpen,
  setSidebarOpen,
  search = "",
  setSearch = null,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Notification Badge Count
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToNotificationCount(
      user.role,
      (count) => {
        setNotificationCount(count);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Notification Dropdown Data
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToNotifications(
      user.role,
      (data) => {
        setNotifications(data);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const dashboardTitle = () => {
    switch (user?.role) {
      case "admin":
        return "Admin Portal";
      case "mother":
        return "Mother Portal";
      case "father":
        return "Father Portal";
      default:
        return "Dashboard";
    }
  };

  const handleLogoClick = () => {
    switch (user?.role) {
      case "admin":
        navigate("/admin");
        break;
      case "mother":
        navigate("/mother");
        break;
      case "father":
        navigate("/father");
        break;
      default:
        navigate("/");
    }
  };

  const handleClearNotifications = async () => {
    try {
      await clearNotifications(user.role);
      setShowNotifications(false);
    } catch (error) {
      console.error("Clear Notification Error:", error);
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg px-3 px-lg-4"
        style={{
          height: "80px",
          position: "sticky",
          top: 0,
          zIndex: 1030,
          background: "rgba(10, 19, 28, 0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 10px 30px 0 rgba(0, 0, 0, 0.3)",
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center flex-nowrap p-0">
          {/* Left Side */}
          <div className="d-flex align-items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              className="btn btn-outline-success d-lg-none p-2 rounded-3"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Menu"
              style={{ width: "42px", height: "42px" }}
            >
              <i className="bi bi-list fs-4"></i>
            </button>

            {/* Brand Logo & Title */}
            <div
              onClick={handleLogoClick}
              title="Go to Dashboard"
              style={{ cursor: "pointer" }}
              className="d-flex flex-column"
            >
              <div className="d-flex align-items-center gap-2">
                <span
                  className="d-inline-block rounded-circle bg-success pulse-emerald"
                  style={{ width: "9px", height: "9px" }}
                />
                <h4
                  className="mb-0 fw-bold text-light"
                  style={{
                    letterSpacing: "-0.02em",
                    fontSize: "1.35rem",
                  }}
                >
                  Kitchen<span className="text-emerald">Connect</span>
                </h4>
              </div>
              <small className="text-secondary d-none d-md-block" style={{ fontSize: "0.78rem" }}>
                {dashboardTitle()}
              </small>
            </div>
          </div>

          {/* Search Bar */}
          {setSearch && (
            <div
              className="d-none d-md-block"
              style={{
                width: "360px",
                margin: "0 20px",
              }}
            >
              <div className="position-relative">
                <i
                  className="bi bi-search position-absolute text-muted"
                  style={{
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "0.9rem",
                  }}
                ></i>
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search kitchen items & requests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    borderRadius: "999px",
                    height: "44px",
                    fontSize: "0.9rem",
                  }}
                />
              </div>
            </div>
          )}

          {/* Right Side Controls */}
          <div className="d-flex align-items-center gap-2 gap-md-3">
            {/* Mobile Search Toggle */}
            {setSearch && (
              <button
                className="btn btn-light d-md-none rounded-circle"
                title="Search"
                style={{ width: "42px", height: "42px", padding: 0 }}
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                <i className="bi bi-search"></i>
              </button>
            )}

            {/* Notification Trigger */}
            <div className="position-relative">
              <button
                className="btn btn-light rounded-circle position-relative"
                title="Notifications"
                style={{ width: "42px", height: "42px", padding: 0 }}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <i className="bi bi-bell fs-5 text-light"></i>
                {notificationCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.7rem", padding: "0.35rem 0.55rem" }}
                  >
                    {notificationCount}
                  </span>
                )}
              </button>

              <NotificationDropdown
                notifications={notifications}
                show={showNotifications}
                onClear={handleClearNotifications}
              />
            </div>

            {/* User Pill Info */}
            <div
              className="d-none d-md-flex align-items-center gap-2 px-3 py-1 rounded-pill"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <div
                className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold"
                style={{
                  width: "32px",
                  height: "32px",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  boxShadow: "0 0 10px rgba(16, 185, 129, 0.4)",
                  fontSize: "14px",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-start" style={{ lineHeight: 1.2 }}>
                <div className="fw-semibold text-light" style={{ fontSize: "0.85rem" }}>
                  {user?.name}
                </div>
                <small className="text-secondary text-capitalize" style={{ fontSize: "0.72rem" }}>
                  {user?.role}
                </small>
              </div>
            </div>

            {/* Logout Button */}
            <button
              className="btn btn-outline-danger"
              style={{ height: "42px", padding: "0 1rem" }}
              onClick={handleLogout}
              title="Sign Out"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span className="ms-1 d-none d-md-inline" style={{ fontSize: "0.88rem" }}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Search Dropdown */}
      {setSearch && showMobileSearch && (
        <div
          className="d-md-none p-3 border-bottom shadow-lg"
          style={{
            position: "sticky",
            top: "80px",
            zIndex: 1029,
            background: "rgba(10, 19, 28, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Search kitchen items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      )}
    </>
  );
}

export default Navbar;