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
      categoryId: selectedItem.categoryId,
      categoryName: selectedItem.categoryName,
      requestedBy: "Mother",
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
                Create Shopping Request
              </h5>

              <button
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>

            </div>

            {/* Form */}

            <form onSubmit={handleSubmit}>

              <div className="modal-body">

                {availableItems.length === 0 ? (

                  <div className="alert alert-info mb-0">
                    No out-of-stock items available.
                  </div>

                ) : (

                  <>
                    <div className="mb-3">

                      <label className="form-label">
                        Select Kitchen Item
                      </label>

                      <select
                        className="form-select"
                        value={itemId}
                        onChange={(e) =>
                          setItemId(e.target.value)
                        }
                      >
                        <option value="">
                          Select Item
                        </option>

                        {availableItems.map((item) => (

                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name} ({item.categoryName})
                          </option>

                        ))}

                      </select>

                    </div>

                  </>

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
                  className="btn btn-success"
                  disabled={availableItems.length === 0}
                >
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