function StatusBadge({ status, size = "normal" }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  if (normalized === "available" || normalized === "in stock") {
    return (
      <span className={`badge bg-success ${size === "sm" ? "py-1 px-2" : ""}`}>
        <i className="bi bi-check2-circle me-1"></i>
        Available
      </span>
    );
  }

  if (normalized === "out of stock") {
    return (
      <span className={`badge bg-danger ${size === "sm" ? "py-1 px-2" : ""}`}>
        <i className="bi bi-exclamation-circle me-1"></i>
        Out of Stock
      </span>
    );
  }

  if (normalized === "pending") {
    return (
      <span className={`badge bg-warning ${size === "sm" ? "py-1 px-2" : ""}`}>
        <i className="bi bi-hourglass-split me-1"></i>
        Pending
      </span>
    );
  }

  if (normalized === "purchased") {
    return (
      <span className={`badge bg-success ${size === "sm" ? "py-1 px-2" : ""}`}>
        <i className="bi bi-bag-check-fill me-1"></i>
        Purchased
      </span>
    );
  }

  return (
    <span className={`badge bg-secondary ${size === "sm" ? "py-1 px-2" : ""}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
