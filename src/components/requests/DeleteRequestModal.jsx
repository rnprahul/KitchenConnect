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
            <div className="modal-header bg-danger text-white">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-cart-x-fill text-danger fs-5"></i>
                <h5 className="modal-title fw-bold text-light mb-0">
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
                    background: "rgba(244, 63, 94, 0.12)",
                    border: "1px solid rgba(251, 113, 133, 0.3)",
                    color: "#fb7185",
                  }}
                >
                  <i className="bi bi-cart-dash-fill" style={{ fontSize: "2.5rem" }}></i>
                </div>

                <h4 className="fw-bold text-light mb-2">
                  Remove from List?
                </h4>

                <p className="text-secondary mb-3" style={{ fontSize: "0.95rem" }}>
                  You are about to cancel the shopping request for:
                </p>

                <div
                  className="p-3 rounded-3 mb-3"
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <span className="fw-bold text-warning fs-5">
                    "{request.itemName}"
                  </span>
                </div>

                <small className="text-secondary d-block" style={{ fontSize: "0.82rem" }}>
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