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
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">
          <div
            className="spinner-border text-success"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 mb-0 text-secondary">
            Loading requests...
          </p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="card shadow-sm border-0 text-center py-5">
        <div className="card-body">
          <div
            className="rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#94a3b8",
            }}
          >
            <i className="bi bi-cart-x fs-1"></i>
          </div>
          <h5 className="mt-2 text-light fw-bold">No Shopping Requests Found</h5>
          <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
            Currently there are no active shopping requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-cart-fill text-warning"></i>
          <h5 className="mb-0 fw-bold text-light" style={{ fontSize: "1.1rem" }}>
            Shopping Requests
          </h5>
        </div>
        <span className="badge bg-secondary rounded-pill">
          {requests.length} Total
        </span>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
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
                  <td className="text-center text-secondary fw-semibold">
                    {index + 1}
                  </td>

                  <td className="fw-semibold text-light">
                    <i className="bi bi-basket2 me-2 text-warning"></i>
                    {request.itemName}
                  </td>

                  <td className="text-light">
                    <span className="badge bg-secondary rounded-pill">
                      {request.requestedBy}
                    </span>
                  </td>

                  <td>
                    {request.status === "Pending" ? (
                      <span className="badge bg-warning text-dark">
                        <i className="bi bi-hourglass-split me-1"></i>
                        Pending
                      </span>
                    ) : (
                      <span className="badge bg-success">
                        <i className="bi bi-check2-circle me-1"></i>
                        Purchased
                      </span>
                    )}
                  </td>

                  <td className="text-end pe-4">
                    <div className="d-inline-flex gap-2 justify-content-end">
                      {showPurchase && request.status === "Pending" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => onPurchase(request)}
                        >
                          <i className="bi bi-bag-check me-1"></i>
                          Purchased
                        </button>
                      )}

                      {showDelete && (
                        <button
                          className="btn btn-danger btn-sm rounded-3"
                          title="Delete Request"
                          style={{ width: "36px", height: "36px", padding: 0 }}
                          onClick={() => onDelete(request)}
                        >
                          <i className="bi bi-trash3-fill" style={{ fontSize: "0.85rem" }}></i>
                        </button>
                      )}

                      {!showDelete && !showPurchase && (
                        <span className="text-secondary">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RequestTable;