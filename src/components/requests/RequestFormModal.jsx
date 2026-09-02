import { useState } from "react";

function RequestFormModal({
  show,
  onClose,
  onSave,
  items,
}) {
  const [itemId, setItemId] = useState("");

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
            <div className="modal-header bg-success">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-cart-plus-fill text-sage fs-5"></i>
                <h5 className="modal-title fw-bold mb-0" style={{ color: "var(--text-main)" }}>
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
                      background: "var(--color-sage-tint)",
                      border: "1px solid var(--color-sage-border)",
                      color: "var(--color-sage-dark)",
                    }}
                  >
                    <i className="bi bi-check2-all fs-2 d-block mb-2 text-sage"></i>
                    <p className="mb-0 fw-semibold">
                      All kitchen items are currently in stock!
                    </p>
                    <small className="text-muted">
                      No out-of-stock pantry items require grocery shopping.
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
                    <small className="text-muted mt-2 d-block" style={{ fontSize: "0.8rem" }}>
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