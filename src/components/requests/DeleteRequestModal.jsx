function DeleteRequestModal({
  show,
  onClose,
  onConfirm,
  request,
}) {
  if (!show || !request) return null;

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
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header bg-danger">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-cart-x-fill text-danger fs-5"></i>
                <h5 className="modal-title fw-bold mb-0" style={{ color: "var(--text-main)" }}>
                  Remove Shopping Request
                </h5>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body py-4">
              <div className="text-center">
                <div
                  className="rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
                  style={{
                    background: "var(--status-out-of-stock-bg)",
                    border: "1px solid var(--status-out-of-stock-border)",
                    color: "var(--status-out-of-stock-text)",
                  }}
                >
                  <i className="bi bi-cart-dash-fill" style={{ fontSize: "2.2rem" }}></i>
                </div>

                <h4 className="fw-bold mb-2" style={{ color: "var(--text-main)" }}>
                  Remove from Shopping List?
                </h4>

                <p className="text-muted mb-3" style={{ fontSize: "0.95rem" }}>
                  You are about to cancel the shopping request for:
                </p>

                <div
                  className="p-3 rounded-3 mb-3"
                  style={{
                    background: "var(--bg-main)",
                    border: "1px solid var(--border-card)",
                  }}
                >
                  <span className="fw-bold fs-5" style={{ color: "var(--color-amber)" }}>
                    "{request.itemName}"
                  </span>
                </div>

                <small className="text-muted d-block" style={{ fontSize: "0.82rem" }}>
                  This request will be removed from the pending shopping list.
                </small>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger px-4"
                onClick={() => onConfirm(request)}
              >
                <i className="bi bi-trash me-1"></i>
                Remove Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteRequestModal;