import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { subscribeToPurchaseHistory } from "../../services/requestService";

function PurchaseHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPurchaseHistory((data) => {
      setHistory(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
            style={{
              background: "var(--color-sage-tint)",
              border: "1px solid var(--color-sage-border)",
            }}
          >
            <i className="bi bi-clock-history text-sage"></i>
            <small className="fw-semibold text-sage" style={{ fontSize: "0.8rem" }}>
              Completed Purchases
            </small>
          </div>

          <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
            Purchase History
          </h2>

          <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
            Complete audit log of all fulfilled kitchen grocery shopping requests.
          </p>
        </div>
      </div>

      {/* History Card */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-receipt text-sage"></i>
            <h5 className="mb-0 fw-bold" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
              Completed Log
            </h5>
          </div>
          <span className="badge bg-secondary">
            {history.length} Total Purchased
          </span>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-success"
              role="status"
              style={{ width: "2.5rem", height: "2.5rem", color: "var(--color-sage) !important" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted mb-0">
              Loading Purchase History...
            </p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-5">
            <div
              className="rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
              style={{
                background: "var(--color-sage-tint)",
                color: "var(--color-sage)",
              }}
            >
              <i className="bi bi-clock-history fs-1"></i>
            </div>
            <h5 className="mt-2 fw-bold" style={{ color: "var(--text-main)" }}>No Purchases Yet</h5>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
              Completed purchases will appear here as soon as items are bought.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="card-body p-0 d-none d-md-block">
              <div className="table-responsive border-0">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th width="60" className="text-center">#</th>
                      <th width="220">Date & Time</th>
                      <th>Item Purchased</th>
                      <th>Requested By</th>
                      <th>Purchased By</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((purchase, index) => (
                      <tr key={purchase.id}>
                        <td className="text-center text-muted fw-semibold">
                          {index + 1}
                        </td>

                        <td>
                          {purchase.purchasedAt?.toDate ? (
                            <>
                              <div className="fw-medium text-main" style={{ fontSize: "0.88rem" }}>
                                {purchase.purchasedAt.toDate().toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <small className="text-muted" style={{ fontSize: "0.76rem" }}>
                                {purchase.purchasedAt.toDate().toLocaleTimeString("en-IN", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </small>
                            </>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="rounded-circle p-1 d-inline-flex"
                              style={{ background: "var(--color-sage-tint)", color: "var(--color-sage)" }}
                            >
                              <i className="bi bi-check2-circle" style={{ fontSize: "0.9rem" }}></i>
                            </span>
                            <strong style={{ color: "var(--text-main)" }}>
                              {purchase.itemName}
                            </strong>
                          </div>
                        </td>

                        <td>
                          <span className="badge bg-secondary">
                            {purchase.requestedBy}
                          </span>
                        </td>

                        <td>
                          <span className="badge bg-success">
                            <i className="bi bi-person-check me-1"></i>
                            {purchase.purchasedBy}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card List */}
            <div className="card-body p-3 d-md-none">
              <div className="d-flex flex-column gap-2">
                {history.map((purchase, index) => (
                  <div
                    key={purchase.id}
                    className="pantry-card p-3 rounded-3"
                    style={{
                      background: "var(--bg-main)",
                      border: "1px solid var(--border-card)",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <small className="text-muted fw-semibold d-block mb-1">#{index + 1}</small>
                        <h6 className="fw-bold mb-0" style={{ color: "var(--text-main)", fontSize: "1.05rem" }}>
                          {purchase.itemName}
                        </h6>
                      </div>
                      <span className="badge bg-success" style={{ fontSize: "0.72rem" }}>
                        <i className="bi bi-check2 me-1"></i> Bought
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center text-muted pt-2 border-top" style={{ borderColor: "var(--border-subtle)", fontSize: "0.8rem" }}>
                      <span>Req: <strong>{purchase.requestedBy}</strong></span>
                      <span>By: <strong className="text-sage">{purchase.purchasedBy}</strong></span>
                      <span>
                        {purchase.purchasedAt?.toDate
                          ? purchase.purchasedAt.toDate().toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default PurchaseHistory;