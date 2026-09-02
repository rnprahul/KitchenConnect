import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import auth from "../../firebase/auth";
import { useAuth } from "../../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import logo from "../../assets/images/logo.png";

import {
  subscribeToNotificationCount,
  subscribeToNotifications,
  clearNotifications,
} from "../../services/notificationService";

function Navbar({
  search = "",
  setSearch = null,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
          height: "68px",
          position: "sticky",
          top: 0,
          zIndex: 1030,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border-card)",
          boxShadow: "0 2px 10px rgba(30, 41, 34, 0.03)",
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center flex-nowrap p-0">
          {/* Left Side: Brand Logo & Title (Moved to far left, no hamburger on mobile) */}
          <div
            onClick={handleLogoClick}
            title="Go to Kitchen Dashboard"
            style={{ cursor: "pointer" }}
            className="d-flex align-items-center gap-2 flex-shrink-0"
          >
            <div
              className="d-flex align-items-center justify-content-center rounded-circle p-1"
              style={{
                width: "36px",
                height: "36px",
                background: "var(--color-sage-tint)",
                border: "1px solid var(--color-sage-border)",
              }}
            >
              <img
                src={logo}
                alt="Logo"
                style={{ width: "22px", height: "22px", objectFit: "contain" }}
              />
            </div>

            <div className="d-flex flex-column">
              <h5
                className="mb-0 fw-bold"
                style={{
                  letterSpacing: "-0.02em",
                  fontSize: "1.15rem",
                  color: "var(--text-main)",
                  lineHeight: 1.15,
                }}
              >
                Kitchen<span className="text-sage">Connect</span>
              </h5>
              <small className="text-muted d-none d-sm-block text-capitalize" style={{ fontSize: "0.7rem" }}>
                {user?.role} Portal
              </small>
            </div>
          </div>

          {/* Search Bar (Desktop Center) */}
          {setSearch && (
            <div
              className="d-none d-md-block flex-grow-1"
              style={{
                maxWidth: "380px",
                margin: "0 24px",
              }}
            >
              <div className="position-relative">
                <i
                  className="bi bi-search position-absolute text-muted"
                  style={{
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "0.86rem",
                  }}
                ></i>
                <input
                  type="text"
                  className="form-control ps-5"
                  placeholder="Search pantry items & requests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    borderRadius: "var(--radius-full)",
                    height: "40px",
                    fontSize: "0.88rem",
                    backgroundColor: "var(--bg-main) !important",
                  }}
                />
              </div>
            </div>
          )}

          {/* Right Side Controls: Search, Notification, Profile */}
          <div className="d-flex align-items-center gap-2 gap-sm-3 ms-auto">
            {/* Mobile Search Button */}
            {setSearch && (
              <button
                type="button"
                className="btn btn-light rounded-circle d-md-none d-flex align-items-center justify-content-center"
                title="Search"
                style={{ width: "38px", height: "38px", padding: 0 }}
                onClick={() => {
                  setShowMobileSearch(!showMobileSearch);
                  setShowNotifications(false);
                  setShowProfileMenu(false);
                }}
              >
                <i className="bi bi-search text-muted" style={{ fontSize: "0.95rem" }}></i>
              </button>
            )}

            {/* Notification Bell Button */}
            <div className="position-relative">
              <button
                type="button"
                className="btn btn-light rounded-circle position-relative d-flex align-items-center justify-content-center"
                title="Notifications"
                style={{ width: "38px", height: "38px", padding: 0 }}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
              >
                <i className="bi bi-bell text-muted" style={{ fontSize: "1.05rem" }}></i>
                {notificationCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "0.64rem", padding: "0.25rem 0.45rem" }}
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

            {/* Mobile Profile Icon Button (with dropdown for Logout) */}
            <div className="position-relative d-md-none">
              <button
                type="button"
                className="btn rounded-circle text-white fw-bold d-flex align-items-center justify-content-center p-0"
                style={{
                  width: "38px",
                  height: "38px",
                  background: "var(--color-sage)",
                  fontSize: "14px",
                  boxShadow: "0 2px 6px rgba(56, 94, 69, 0.25)",
                }}
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                title="Account Menu"
              >
                {user?.name?.charAt(0).toUpperCase()}
              </button>

              {/* Mobile Profile Dropdown Popup */}
              {showProfileMenu && (
                <div
                  className="dropdown-menu dropdown-menu-end show p-3 shadow-lg"
                  style={{
                    width: "230px",
                    right: 0,
                    left: "auto",
                    marginTop: "10px",
                    background: "#ffffff",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-floating)",
                    zIndex: 1050,
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: "var(--border-subtle)" }}>
                    <div
                      className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold flex-shrink-0"
                      style={{
                        width: "36px",
                        height: "36px",
                        background: "var(--color-sage)",
                        fontSize: "14px",
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden" style={{ lineHeight: 1.2 }}>
                      <div className="fw-semibold text-truncate" style={{ fontSize: "0.88rem", color: "var(--text-main)" }}>
                        {user?.name}
                      </div>
                      <small className="text-muted text-capitalize" style={{ fontSize: "0.72rem" }}>
                        {user?.role} Portal
                      </small>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-danger btn-sm w-100"
                    onClick={handleLogout}
                    style={{ borderRadius: "var(--radius-md)" }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Desktop User Pill & Logout Button */}
            <div
              className="d-none d-md-flex align-items-center gap-2 px-3 py-1 rounded-pill"
              style={{
                background: "var(--bg-main)",
                border: "1px solid var(--border-card)",
              }}
            >
              <div
                className="rounded-circle d-flex justify-content-center align-items-center text-white fw-bold"
                style={{
                  width: "28px",
                  height: "28px",
                  background: "var(--color-sage)",
                  fontSize: "13px",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-start" style={{ lineHeight: 1.2 }}>
                <div className="fw-semibold text-main" style={{ fontSize: "0.84rem" }}>
                  {user?.name}
                </div>
                <small className="text-muted text-capitalize" style={{ fontSize: "0.7rem" }}>
                  {user?.role}
                </small>
              </div>
            </div>

            <button
              className="btn btn-outline-danger d-none d-md-inline-flex"
              style={{ height: "38px", padding: "0 0.9rem", fontSize: "0.86rem" }}
              onClick={handleLogout}
              title="Sign Out"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span className="ms-1">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Search Input Dropdown */}
      {setSearch && showMobileSearch && (
        <div
          className="d-md-none p-3 border-bottom shadow-sm"
          style={{
            position: "sticky",
            top: "68px",
            zIndex: 1029,
            background: "#ffffff",
            borderBottom: "1px solid var(--border-card)",
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
              placeholder="Search pantry items & requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;