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

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

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
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const dashboardTitle = () => {
    switch (user?.role) {
      case "admin":
        return "Admin Dashboard";

      case "mother":
        return "Mother Dashboard";

      case "father":
        return "Father Dashboard";

      default:
        return "Dashboard";
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
    <nav
      className="navbar navbar-expand-lg bg-white shadow-sm px-2 px-lg-4"
      style={{ height: "75px" }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center flex-nowrap">

        {/* Left Side */}
        <div className="d-flex align-items-center">

          {/* Mobile Menu Button */}
          <button
  className="btn btn-outline-success me-2 d-lg-none"
  style={{
    padding: window.innerWidth < 768 ? "8px 10px" : "",
  }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="bi bi-list fs-4"></i>
          </button>

          <div>
            <h4
  className="mb-0 fw-bold text-success"
  style={{
    fontSize: window.innerWidth < 768 ? "1.15rem" : "1.5rem",
    whiteSpace: "nowrap",
  }}
>
  KitchenConnect
</h4>

            <small className="text-muted d-none d-md-block">
              {dashboardTitle()}
            </small>
          </div>

        </div>

        {/* Right Side */}
        <div
  className="d-flex align-items-center"
  style={{
    gap: window.innerWidth < 768 ? "6px" : "12px",
    flexShrink: 0,
  }}
>

          {/* Notification */}
          <div className="position-relative me-3">

            <button
              className="btn btn-light position-relative"
              title="Notifications"
              onClick={() =>
                setShowNotifications(!showNotifications)
              }
            >
              <i className="bi bi-bell fs-5"></i>

              {notificationCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
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

          {/* User */}
          <div className="text-end me-3 d-none d-md-block">
            <div className="fw-semibold">
              {user?.name}
            </div>

            <small className="text-muted text-capitalize">
              {user?.role}
            </small>
          </div>

          {/* Avatar */}
          <div
            className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center me-3"
            style={{
              width: window.innerWidth < 768 ? "38px" : "45px",
              height: window.innerWidth < 768 ? "38px" : "45px",
              fontWeight: "bold",
              fontSize: window.innerWidth < 768 ? "16px" : "18px",
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {/* Logout */}
          <button
  className="btn btn-outline-danger"
  style={{
    padding: window.innerWidth < 768 ? "6px 10px" : "",
  }}
  onClick={handleLogout}
>
            <i className="bi bi-box-arrow-right"></i>

            <span className="ms-2 d-none d-md-inline">
              Logout
            </span>
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;