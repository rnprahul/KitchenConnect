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
        className="modal fade show"
        style={{
          display: "block",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">

          <div className="modal-content">

            {/* Header */}

            <div className="modal-header bg-danger text-white">

              <h5 className="modal-title">
                Remove Shopping Request
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>

            </div>

            {/* Body */}

            <div className="modal-body">

              <div className="text-center">

                <i
                  className="bi bi-exclamation-triangle-fill text-danger"
                  style={{ fontSize: "60px" }}
                ></i>

                <h4 className="mt-3">
                  Are you sure?
                </h4>

                <p className="text-muted mb-0">
                  You are about to remove the shopping request for:
                </p>

                <h5 className="fw-bold mt-3">
                  "{request.itemName}"
                </h5>

                <p className="text-danger mt-3 mb-0">
                  The kitchen item will become available again.
                </p>

              </div>

            </div>

            {/* Footer */}

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={() => onConfirm(request)}
              >
                <i className="bi bi-trash me-2"></i>
                Remove
              </button>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default DeleteRequestModal;