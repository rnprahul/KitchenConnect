function NotificationDropdown({
  notifications,
  show,
  onClear,
}) {
  if (!show) return null;

  return (
    <div
      className="dropdown-menu dropdown-menu-end show shadow"
      style={{
        width: "340px",
        maxHeight: "400px",
        overflowY: "auto",
        right: 0,
        left: "auto",
        marginTop: "10px",
      }}
    >
      <h6 className="dropdown-header fw-bold">
        Notifications
      </h6>

      <hr className="dropdown-divider" />

      {notifications.length === 0 ? (
        <div className="px-3 py-2 text-muted text-center">
          No notifications.
        </div>
      ) : (
        <>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="dropdown-item-text border-bottom py-2"
            >
              <div className="fw-semibold">
                {notification.icon}{" "}
                {notification.title}
              </div>

              <small className="text-muted">
                {notification.createdAt?.toDate
                  ? notification.createdAt
                      .toDate()
                      .toLocaleString()
                  : ""}
              </small>
            </div>
          ))}

          <div className="p-2">
            <button
              className="btn btn-outline-danger btn-sm w-100"
              onClick={onClear}
            >
              <i className="bi bi-trash me-2"></i>
              Clear All
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationDropdown;