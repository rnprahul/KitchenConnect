function PendingRequestModal({
  show,
  onClose,
  requests,
  showRequester = false,
}) {

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        background: "rgba(0,0,0,0.5)",
      }}
    >

      <div className="modal-dialog modal-lg modal-dialog-centered">

        <div className="modal-content">

          {/* Header */}

          <div className="modal-header">

            <h5 className="modal-title fw-bold text-warning">
              Pending Requests ({requests.length})
            </h5>

            <button
              className="btn-close"
              onClick={onClose}
            ></button>

          </div>


          {/* Body */}

          <div className="modal-body">


            {requests.length === 0 ? (

              <div className="text-center py-4">

                <i className="bi bi-cart-x fs-1 text-muted"></i>

                <p className="mt-3 text-muted">
                  No pending requests.
                </p>

              </div>

            ) : (

              <div className="table-responsive">

                <table className="table table-hover align-middle">

                  <thead className="table-light">

                    <tr>

                      <th>#</th>

                      <th>Item</th>

                      {showRequester && (
                        <th>
                          Requested By
                        </th>
                      )}

                    </tr>

                  </thead>


                  <tbody>

                    {requests.map((request, index) => (

                      <tr key={request.id}>

                        <td>
                          {index + 1}
                        </td>


                        <td className="fw-semibold">
                          {request.itemName}
                        </td>


                        {showRequester && (
                          <td>
                            {request.requestedBy}
                          </td>
                        )}

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>


          {/* Footer */}

          <div className="modal-footer">

            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>

          </div>


        </div>

      </div>

    </div>
  );
}

export default PendingRequestModal;