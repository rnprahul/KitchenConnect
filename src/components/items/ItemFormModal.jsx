import { useEffect, useState } from "react";

function ItemFormModal({
  show,
  onClose,
  onSave,
  item,
}) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (item) {
  setName(item.name);
} else {
  setName("");
}
  }, [item, show]);

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
        <div className="modal-dialog">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">
                {item ? "Edit Kitchen Item" : "Add Kitchen Item"}
              </h5>

              <button
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div className="modal-body">

                {/* Item Name */}
                <div className="mb-3">
                  <label className="form-label">
                    Item Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter item name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
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
                  className="btn btn-success"
                >
                  {item ? "Update" : "Save"}
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