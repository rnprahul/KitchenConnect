import StatusBadge from "../common/StatusBadge";

function ItemTable({
  items,
  loading,
  onEdit,
  onDelete,
  onAddNew,
}) {
  if (loading) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div
            className="spinner-border text-success"
            role="status"
            style={{ width: "2.5rem", height: "2.5rem", color: "var(--color-sage) !important" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 mb-0 text-muted">
            Checking pantry inventory...
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card border-0 shadow-sm text-center py-5">
        <div className="card-body">
          <div
            className="rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
            style={{
              background: "var(--color-sage-tint)",
              color: "var(--color-sage)",
            }}
          >
            <i className="bi bi-basket fs-1"></i>
          </div>
          <h5 className="mt-2 fw-bold" style={{ color: "var(--text-main)" }}>Your Pantry is Looking Empty</h5>
          <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
            No kitchen items found. Start by adding ingredients, staples, or supplies.
          </p>
          {onAddNew && (
            <button className="btn btn-success" onClick={onAddNew}>
              <i className="bi bi-plus-lg me-1"></i>
              Add First Item
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-grid-fill text-sage"></i>
          <h5 className="mb-0 fw-bold" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
            Pantry Inventory
          </h5>
        </div>
        <span className="badge bg-secondary">
          {items.length} {items.length === 1 ? "Item" : "Items"} Total
        </span>
      </div>

      {/* Desktop Table View */}
      <div className="card-body p-0 d-none d-md-block">
        <div className="table-responsive border-0">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th width="70" className="text-center">#</th>
                <th>Item Name</th>
                <th width="180">Status</th>
                <th width="150" className="text-end pe-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td className="text-center text-muted fw-semibold">
                    {index + 1}
                  </td>

                  <td className="fw-semibold" style={{ color: "var(--text-main)" }}>
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="rounded-circle p-1 d-inline-flex"
                        style={{
                          background: item.status === "Available"
                            ? "var(--status-in-stock-bg)"
                            : "var(--status-out-of-stock-bg)",
                          color: item.status === "Available"
                            ? "var(--status-in-stock-text)"
                            : "var(--status-out-of-stock-text)",
                        }}
                      >
                        <i
                          className={`bi ${
                            item.status === "Available"
                              ? "bi-check-circle-fill"
                              : "bi-exclamation-circle-fill"
                          }`}
                          style={{ fontSize: "0.85rem" }}
                        ></i>
                      </span>
                      <span>{item.name}</span>
                    </div>
                  </td>

                  <td>
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="text-end pe-4">
                    <div className="d-inline-flex gap-2">
                      <button
                        className="btn btn-secondary btn-sm"
                        title="Edit Item"
                        style={{ width: "36px", height: "36px", padding: 0 }}
                        onClick={() => onEdit(item)}
                      >
                        <i className="bi bi-pencil-fill" style={{ fontSize: "0.85rem" }}></i>
                      </button>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Delete Item"
                        style={{ width: "36px", height: "36px", padding: 0 }}
                        onClick={() => onDelete(item)}
                      >
                        <i className="bi bi-trash3-fill" style={{ fontSize: "0.85rem" }}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View */}
      <div className="card-body p-3 d-md-none">
        <div className="d-flex flex-column gap-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="pantry-card p-3 rounded-3"
              style={{
                background: "var(--bg-main)",
                border: "1px solid var(--border-card)",
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <small className="text-muted fw-semibold d-block mb-1">#{index + 1}</small>
                  <h6 className="fw-bold mb-0" style={{ color: "var(--text-main)", fontSize: "1rem" }}>
                    {item.name}
                  </h6>
                </div>
                <StatusBadge status={item.status} size="sm" />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-2 pt-2 border-top" style={{ borderColor: "var(--border-subtle)" }}>
                <button
                  className="btn btn-secondary btn-sm px-3"
                  onClick={() => onEdit(item)}
                >
                  <i className="bi bi-pencil-fill me-1"></i> Edit
                </button>
                <button
                  className="btn btn-outline-danger btn-sm px-3"
                  onClick={() => onDelete(item)}
                >
                  <i className="bi bi-trash3-fill me-1"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItemTable;