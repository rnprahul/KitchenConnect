function DeleteItemModal({
  show,
  onClose,
  onConfirm,
  item,
}) {
  if (!show || !item) return null;

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
                <i className="bi bi-exclamation-triangle-fill text-danger fs-5"></i>
                <h5 className="modal-title fw-bold mb-0" style={{ color: "var(--text-main)" }}>
                  Delete Kitchen Item
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
                  <i className="bi bi-trash3-fill" style={{ fontSize: "2.2rem" }}></i>
                </div>

                <h4 className="fw-bold mb-2" style={{ color: "var(--text-main)" }}>
                  Remove from Pantry?
                </h4>

                <p className="text-muted mb-3" style={{ fontSize: "0.95rem" }}>
                  Are you sure you want to remove this item from your kitchen inventory?
                </p>

                <div
                  className="p-3 rounded-3 mb-3"
                  style={{
                    background: "var(--bg-main)",
                    border: "1px solid var(--border-card)",
                  }}
                >
                  <span className="fw-bold text-sage fs-5">
                    "{item.name}"
                  </span>
                </div>

                <small className="text-danger d-block" style={{ fontSize: "0.82rem" }}>
                  <i className="bi bi-info-circle me-1"></i>
                  This action is permanent and cannot be undone.
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
                onClick={() => onConfirm(item.id)}
              >
                <i className="bi bi-trash me-1"></i>
                Delete Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DeleteItemModal;