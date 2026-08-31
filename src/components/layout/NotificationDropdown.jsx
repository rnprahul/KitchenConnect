function NotificationDropdown({ notifications, show, onClear }) {
  if (!show) return null;

  return (
    <div
      className="dropdown-menu dropdown-menu-end show p-0 shadow-lg"
      style={{
        width: "360px",
        maxHeight: "440px",
        overflowY: "auto",
        right: 0,
        left: "auto",
        marginTop: "12px",
        background: "rgba(13, 24, 34, 0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: "20px",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center px-3 py-3 border-bottom" style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-bell-fill text-warning"></i>
          <h6 className="mb-0 fw-bold text-light" style={{ fontSize: "0.95rem" }}>
            Notifications
          </h6>
        </div>
        {notifications.length > 0 && (
          <span className="badge bg-warning rounded-pill" style={{ fontSize: "0.72rem" }}>
            {notifications.length} New
          </span>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="px-4 py-5 text-center text-muted">
          <i className="bi bi-bell-slash fs-2 d-block mb-2 text-secondary"></i>
          <p className="mb-0" style={{ fontSize: "0.9rem" }}>No notifications right now.</p>
        </div>
      ) : (
        <div className="p-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-3 mb-2 rounded-3"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                transition: "all 0.2s ease",
              }}
            >
              <div className="fw-semibold text-light mb-1" style={{ fontSize: "0.9rem" }}>
                {notification.icon} {notification.title}
              </div>

              <small className="text-secondary" style={{ fontSize: "0.75rem" }}>
                {notification.createdAt?.toDate
                  ? notification.createdAt.toDate().toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : ""}
              </small>
            </div>
          ))}

          <div className="pt-2">
            <button
              className="btn btn-outline-danger btn-sm w-100"
              onClick={onClear}
              style={{ borderRadius: "10px" }}
            >
              <i className="bi bi-trash me-2"></i>
              Clear All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;