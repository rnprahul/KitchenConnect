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
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="mt-3 mb-0">
            Loading items...
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">

          <i className="bi bi-basket fs-1 text-muted"></i>

          <h5 className="mt-3">
            No Kitchen Items Found
          </h5>

          <p className="text-muted">
            Click "Add Item" to create your first kitchen item.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">

      <div className="card-header bg-white">
        <h5 className="mb-0">
          Kitchen Items
        </h5>
      </div>

      <div className="card-body">

        <div className="table-responsive">

          <table className="table table-hover align-middle">

            <thead className="table-light">

              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Status</th>
                <th width="160">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {items.map((item, index) => (

                <tr key={item.id}>

                  <td>{index + 1}</td>

                  <td>{item.name}</td>

                  <td>
  {item.status === "Available" ? (
    <span className="badge rounded-pill bg-success px-3 py-2">
      <i className="bi bi-check-circle-fill me-1"></i>
      Available
    </span>
  ) : (
    <span className="badge rounded-pill bg-danger px-3 py-2">
      <i className="bi bi-x-circle-fill me-1"></i>
      Out of Stock
    </span>
  )}
</td>

                  <td>

                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => onEdit(item)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(item)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>

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