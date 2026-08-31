function ItemTable({
  items,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">
          <div
            className="spinner-border text-success"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 mb-0 text-secondary">
            Loading kitchen inventory...
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card shadow-sm border-0 text-center py-5">
        <div className="card-body">
          <div
            className="rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#94a3b8",
            }}
          >
            <i className="bi bi-basket fs-1"></i>
          </div>
          <h5 className="mt-2 text-light fw-bold">No Kitchen Items Found</h5>
          <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
            Click "Add Item" to add your first kitchen ingredient or supply.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-grid-fill text-success"></i>
          <h5 className="mb-0 fw-bold text-light" style={{ fontSize: "1.1rem" }}>
            Kitchen Inventory
          </h5>
        </div>
        <span className="badge bg-secondary rounded-pill">
          {items.length} {items.length === 1 ? "Item" : "Items"} Total
        </span>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
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
                  <td className="text-center text-secondary fw-semibold">
                    {index + 1}
                  </td>

                  <td className="fw-semibold text-light">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="rounded-circle p-1 d-inline-flex"
                        style={{
                          background: item.status === "Available"
                            ? "rgba(16, 185, 129, 0.15)"
                            : "rgba(244, 63, 94, 0.15)",
                        }}
                      >
                        <i
                          className={`bi ${
                            item.status === "Available"
                              ? "bi-check-circle-fill text-success"
                              : "bi-exclamation-circle-fill text-danger"
                          }`}
                          style={{ fontSize: "0.85rem" }}
                        ></i>
                      </span>
                      <span>{item.name}</span>
                    </div>
                  </td>

                  <td>
                    {item.status === "Available" ? (
                      <span className="badge rounded-pill bg-success">
                        <i className="bi bi-check2 me-1"></i>
                        Available
                      </span>
                    ) : (
                      <span className="badge rounded-pill bg-danger">
                        <i className="bi bi-x me-1"></i>
                        Out of Stock
                      </span>
                    )}
                  </td>

                  <td className="text-end pe-4">
                    <div className="d-inline-flex gap-2">
                      <button
                        className="btn btn-primary btn-sm rounded-3"
                        title="Edit Item"
                        style={{ width: "36px", height: "36px", padding: 0 }}
                        onClick={() => onEdit(item)}
                      >
                        <i className="bi bi-pencil-fill" style={{ fontSize: "0.85rem" }}></i>
                      </button>

                      <button
                        className="btn btn-danger btn-sm rounded-3"
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
    </div>
  );
}

export default ItemTable;