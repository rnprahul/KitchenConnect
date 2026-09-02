import { useState } from "react";

function ItemFormModal({
  show,
  onClose,
  onSave,
  item,
}) {
  const [name, setName] = useState(item?.name || "");
  const [prevItem, setPrevItem] = useState(item);

  if (item !== prevItem) {
    setPrevItem(item);
    setName(item?.name || "");
  }

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
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
                <i className="bi bi-basket2-fill text-sage fs-5"></i>
                <h5 className="modal-title fw-bold mb-0" style={{ color: "var(--text-main)" }}>
                  {item ? "Edit Kitchen Item" : "Add New Kitchen Item"}
                </h5>
              </div>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Body & Form */}
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Item Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Olive Oil, Basmati Rice, Milk"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    required
                  />
                  <small className="text-muted mt-1 d-block" style={{ fontSize: "0.8rem" }}>
                    Enter the name of the ingredient, grocery staple, or pantry item.
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
                  type="submit"
                  className="btn btn-success px-4"
                  disabled={!name.trim()}
                >
                  <i className="bi bi-check2-circle me-1"></i>
                  {item ? "Update Item" : "Save to Pantry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemFormModal;