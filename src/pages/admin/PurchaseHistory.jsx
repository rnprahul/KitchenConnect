import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { subscribeToPurchaseHistory } from "../../services/requestService";

function PurchaseHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setLoading(true);

  const unsubscribe = subscribeToPurchaseHistory(
    (data) => {
      setHistory(data);
      setLoading(false);
    }
  );

  return () => unsubscribe();
}, []);

  return (
    <DashboardLayout>

      {/* Header */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold">
            Purchase History
          </h2>

          <p className="text-muted mb-0">
            View all completed purchases.
          </p>
        </div>

      </div>

      {/* History Table */}

      <div className="card shadow-sm border-0">

        <div className="card-body">

          {loading ? (

            <div className="text-center py-5">

              <div
                className="spinner-border text-success"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="mt-3">
                Loading Purchase History...
              </p>

            </div>

          ) : history.length === 0 ? (

            <div className="text-center py-5">

              <i className="bi bi-clock-history fs-1 text-muted"></i>

              <h5 className="mt-3">
                No Purchases Yet
              </h5>

              <p className="text-muted">
                Completed purchases will appear here.
              </p>

            </div>

          ) : (

            <div className="table-responsive shadow-sm rounded">

              <table className="table table-striped table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>

                    <th>#</th>

                    <th>Date</th>

                    <th>Item</th>

                    <th>Requested By</th>

                    <th>Purchased By</th>

                  </tr>

                </thead>

                <tbody>

                  {history.map((purchase, index) => (

                    <tr key={purchase.id}>

                      <td>{index + 1}</td>

                      <td>
  {purchase.purchasedAt?.toDate ? (
    <>
      <div>
        {purchase.purchasedAt
          .toDate()
          .toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
      </div>

      <small className="text-muted">
        {purchase.purchasedAt
          .toDate()
          .toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
      </small>
    </>
  ) : (
    "-"
  )}
</td>

                      <td>

  <span className="text-success me-2">
    <i className="bi bi-check-circle-fill"></i>
  </span>

  <strong>
    {purchase.itemName}
  </strong>

</td>

                      <td>
                        {purchase.requestedBy}
                      </td>

                      <td>
                        {purchase.purchasedBy}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default PurchaseHistory;