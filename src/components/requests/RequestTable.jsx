function RequestTable({
  requests,
  loading,
  showDelete = false,
  showPurchase = false,
  onDelete,
  onPurchase,
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
            Loading requests...
          </p>

        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">

          <i
            className="bi bi-cart-x fs-1 text-muted"
          ></i>

          <h5 className="mt-3">
            No Shopping Requests Found
          </h5>

          <p className="text-muted">
            No requests available.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm border-0">

      <div className="card-header bg-white">
        <h5 className="mb-0">
          Shopping Requests
        </h5>
      </div>

      <div className="card-body">

        <div className="table-responsive">

          <table className="table table-hover align-middle">

            <thead className="table-light">

              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Category</th>
                <th>Requested By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {requests.map((request, index) => (

                <tr key={request.id}>

                  <td>{index + 1}</td>

                  <td>{request.itemName}</td>

                  <td>{request.categoryName}</td>

                  <td>{request.requestedBy}</td>

                  <td>

                    {request.status === "Pending" ? (
                      <span className="badge bg-warning text-dark">
                        Pending
                      </span>
                    ) : (
                      <span className="badge bg-success">
                        Purchased
                      </span>
                    )}

                  </td>

                  <td>

                    {showPurchase &&
                      request.status === "Pending" && (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => onPurchase(request)}
                        >
                          <i className="bi bi-check-circle me-1"></i>
                          Purchased
                        </button>
                      )}

                    {showDelete && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(request)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}

                    {!showDelete &&
                      !showPurchase && (
                        <span className="text-muted">
                          —
                        </span>
                      )}

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

export default RequestTable;