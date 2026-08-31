function PendingRequestModal({
  show,
  onClose,
  requests,
  showRequester = false,
}) {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1060 }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header border-bottom" style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-clock-fill text-warning fs-5"></i>
                <h5 className="modal-title fw-bold text-light mb-0">
                  Pending Shopping Requests ({requests.length})
                </h5>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-4">
              {requests.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-cart-check fs-1 text-success d-block mb-3"></i>
                  <h5 className="text-light fw-bold">All Caught Up!</h5>
                  <p className="text-secondary mb-0">
                    There are no pending shopping requests waiting for purchase.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th width="60">#</th>
                        <th>Kitchen Item</th>
                        {showRequester && <th>Requested By</th>}
                        <th width="120">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request, index) => (
                        <tr key={request.id}>
                          <td className="text-secondary fw-semibold">{index + 1}</td>
                          <td className="fw-semibold text-light">
                            <i className="bi bi-basket me-2 text-warning"></i>
                            {request.itemName}
                          </td>
                          {showRequester && (
                            <td className="text-secondary">{request.requestedBy}</td>
                          )}
                          <td>
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-hourglass-split me-1"></i>
                              Pending
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PendingRequestModal;