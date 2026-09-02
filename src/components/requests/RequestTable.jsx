import StatusBadge from "../common/StatusBadge";

function RequestTable({
  requests,
  loading,
  showDelete = false,
  showPurchase = false,
  onDelete,
  onPurchase,
}) {
  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div
            className="spinner-border text-success"
            role="status"
            style={{ width: "2.5rem", height: "2.5rem", color: "var(--color-sage) !important" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 mb-0 text-muted">
            Checking shopping requests...
          </p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="card border-0 shadow-sm text-center py-5">
        <div className="card-body">
          <div
            className="rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
            style={{
              background: "var(--color-amber-light)",
              color: "var(--color-amber)",
            }}
          >
            <i className="bi bi-cart-x fs-1"></i>
          </div>
          <h5 className="mt-2 fw-bold" style={{ color: "var(--text-main)" }}>No Shopping Requests Found</h5>
          <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
            Currently there are no active shopping requests in the queue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-cart-fill" style={{ color: "var(--color-amber)" }}></i>
          <h5 className="mb-0 fw-bold" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
            Shopping Requests
          </h5>
        </div>
        <span className="badge bg-secondary">
          {requests.length} Total
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="card-body p-0 d-none d-md-block">
        <div className="table-responsive border-0">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th width="60" className="text-center">#</th>
                <th>Item</th>
                <th>Requested By</th>
                <th width="140">Status</th>
                <th width="160" className="text-end pe-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request, index) => (
                <tr key={request.id}>
                  <td className="text-center text-muted fw-semibold">
                    {index + 1}
                  </td>

                  <td className="fw-semibold" style={{ color: "var(--text-main)" }}>
                    <i className="bi bi-basket2 me-2" style={{ color: "var(--color-amber)" }}></i>
                    {request.itemName}
                  </td>

                  <td>
                    <span className="badge bg-secondary">
                      {request.requestedBy}
                    </span>
                  </td>

                  <td>
                    <StatusBadge status={request.status} />
                  </td>

                  <td className="text-end pe-4">
                    <div className="d-inline-flex gap-2 justify-content-end">
                      {showPurchase && request.status === "Pending" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => onPurchase(request)}
                        >
                          <i className="bi bi-bag-check me-1"></i>
                          Bought
                        </button>
                      )}

                      {showDelete && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          title="Delete Request"
                          style={{ width: "36px", height: "36px", padding: 0 }}
                          onClick={() => onDelete(request)}
                        >
                          <i className="bi bi-trash3-fill" style={{ fontSize: "0.85rem" }}></i>
                        </button>
                      )}

                      {!showDelete && !showPurchase && (
                        <span className="text-muted">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View */}
      <div className="card-body p-3 d-md-none">
        <div className="d-flex flex-column gap-2">
          {requests.map((request, index) => (
            <div
              key={request.id}
              className="pantry-card p-3 rounded-3"
              style={{
                background: "var(--bg-main)",
                border: "1px solid var(--border-card)",
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <small className="text-muted fw-semibold d-block mb-1">#{index + 1}</small>
                  <h6 className="fw-bold mb-1" style={{ color: "var(--text-main)", fontSize: "1rem" }}>
                    <i className="bi bi-basket2 me-1" style={{ color: "var(--color-amber)" }}></i>
                    {request.itemName}
                  </h6>
                  <small className="text-muted">
                    Requested by <span className="badge bg-secondary py-0 px-2">{request.requestedBy}</span>
                  </small>
                </div>
                <StatusBadge status={request.status} size="sm" />
              </div>

              {(showDelete || (showPurchase && request.status === "Pending")) && (
                <div className="d-flex justify-content-end gap-2 mt-2 pt-2 border-top" style={{ borderColor: "var(--border-subtle)" }}>
                  {showPurchase && request.status === "Pending" && (
                    <button
                      className="btn btn-success btn-sm px-3"
                      onClick={() => onPurchase(request)}
                    >
                      <i className="bi bi-bag-check me-1"></i> Mark Bought
                    </button>
                  )}
                  {showDelete && (
                    <button
                      className="btn btn-outline-danger btn-sm px-3"
                      onClick={() => onDelete(request)}
                    >
                      <i className="bi bi-trash3-fill me-1"></i> Remove
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RequestTable;