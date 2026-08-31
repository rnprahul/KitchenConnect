import { useEffect, useState } from "react";

function RequestFormModal({
  show,
  onClose,
  onSave,
  items,
}) {
  const [itemId, setItemId] = useState("");

  useEffect(() => {
    if (show) {
      setItemId("");
    }
  }, [show]);

  if (!show) return null;

  const availableItems = items.filter(
    (item) => item.status === "Out of Stock"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemId) return;

    const selectedItem = availableItems.find(
      (item) => item.id === itemId
    );

    if (!selectedItem) return;

    onSave({
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      categoryId: selectedItem.categoryId || "",
      categoryName: selectedItem.categoryName || "",
      requestedBy: "Mother",
    });
  };

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
            <div className="modal-header bg-success text-white">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-cart-plus-fill text-success fs-5"></i>
                <h5 className="modal-title fw-bold text-light mb-0">
                  Create Shopping Request
                </h5>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {availableItems.length === 0 ? (
                  <div
                    className="p-4 text-center rounded-3"
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(96, 165, 250, 0.3)",
                      color: "#93c5fd",
                    }}
                  >
                    <i className="bi bi-check2-all fs-2 d-block mb-2 text-primary"></i>
                    <p className="mb-0 fw-semibold">
                      All kitchen items are currently in stock!
                    </p>
                    <small className="text-secondary">
                      No out-of-stock items require shopping.
                    </small>
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="form-label">
                      Select Kitchen Item <span className="text-danger">*</span>
                    </label>

                    <select
                      className="form-select"
                      value={itemId}
                      onChange={(e) => setItemId(e.target.value)}
                      required
                    >
                      <option value="">-- Choose an Out of Stock Item --</option>
                      {availableItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} {item.categoryName ? `(${item.categoryName})` : ""}
                        </option>
                      ))}
                    </select>
                    <small className="text-secondary mt-2 d-block" style={{ fontSize: "0.8rem" }}>
                      This item will be added to the pending requests queue for purchase.
                    </small>
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
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-success px-4"
                  disabled={availableItems.length === 0 || !itemId}
                >
                  <i className="bi bi-send-fill me-1"></i>
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default RequestFormModal;