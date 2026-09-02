function NotificationDropdown({ notifications, show, onClear }) {
  if (!show) return null;

  return (
    <div className="dropdown-menu dropdown-menu-end show p-0 shadow-lg kitchen-notification-dropdown">
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center px-3 py-2.5 border-bottom position-sticky top-0"
        style={{ borderColor: "var(--border-subtle)", background: "#faf8f5", zIndex: 2 }}
      >
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-bell-fill text-amber fs-6" style={{ color: "var(--color-amber)" }}></i>
          <h6 className="mb-0 fw-bold" style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>
            Kitchen Activity
          </h6>
        </div>
        {notifications.length > 0 && (
          <span className="badge bg-warning" style={{ fontSize: "0.68rem" }}>
            {notifications.length} New
          </span>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="px-3 py-4 text-center text-muted">
          <i className="bi bi-bell-slash fs-2 d-block mb-2 text-subtle" style={{ color: "#a0aec0" }}></i>
          <p className="mb-0" style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            No new kitchen notifications.
          </p>
        </div>
      ) : (
        <div className="p-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-2.5 mb-1.5 rounded-3"
              style={{
                background: "var(--bg-main)",
                border: "1px solid var(--border-card)",
                transition: "all 0.15s ease",
              }}
            >
              <div
                className="fw-semibold mb-1"
                style={{
                  fontSize: "0.84rem",
                  color: "var(--text-main)",
                  lineHeight: 1.3,
                  wordBreak: "break-word",
                }}
              >
                {notification.icon} {notification.title}
              </div>

              <small className="text-muted d-block" style={{ fontSize: "0.72rem" }}>
                {notification.createdAt?.toDate
                  ? notification.createdAt.toDate().toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : ""}
              </small>
            </div>
          ))}

          <div className="pt-2 px-1 pb-1">
            <button
              className="btn btn-outline-danger btn-sm w-100"
              onClick={onClear}
              style={{ borderRadius: "var(--radius-md)", fontSize: "0.82rem", padding: "0.45rem" }}
            >
              <i className="bi bi-trash3 me-1"></i>
              Clear All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;