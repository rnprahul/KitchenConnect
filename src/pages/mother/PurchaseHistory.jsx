import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { subscribeToPurchaseHistory } from "../../services/requestService";

function PurchaseHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

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
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
            <i className="bi bi-clock-history text-emerald"></i>
            <small className="text-emerald fw-semibold" style={{ fontSize: "0.8rem" }}>
              Fulfillment Archive
            </small>
          </div>

          <h2 className="fw-bold text-light mb-1">
            Purchase History
          </h2>

          <p className="text-secondary mb-0" style={{ fontSize: "0.95rem" }}>
            View completed kitchen purchases bought for your shopping requests.
          </p>
        </div>
      </div>

      {/* Purchase History Table Card */}
      <div className="card shadow-sm border-0">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-receipt text-success"></i>
            <h5 className="mb-0 fw-bold text-light" style={{ fontSize: "1.1rem" }}>
              Purchased Items Log
            </h5>
          </div>
          <span className="badge bg-secondary rounded-pill">
            {history.length} Total Purchased
          </span>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-success"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-secondary mb-0">
                Loading Purchase History...
              </p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#94a3b8",
                }}
              >
                <i className="bi bi-clock-history fs-1"></i>
              </div>
              <h5 className="mt-2 text-light fw-bold">No Purchases Yet</h5>
              <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
                Purchased kitchen items will be recorded here automatically.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th width="60" className="text-center">#</th>
                    <th width="220">Date & Time</th>
                    <th>Item Purchased</th>
                    <th>Purchased By</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((purchase, index) => (
                    <tr key={purchase.id}>
                      <td className="text-center text-secondary fw-semibold">
                        {index + 1}
                      </td>

                      <td>
                        {purchase.purchasedAt?.toDate ? (
                          <>
                            <div className="text-light fw-semibold">
                              {purchase.purchasedAt.toDate().toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <small className="text-secondary" style={{ fontSize: "0.78rem" }}>
                              {purchase.purchasedAt.toDate().toLocaleTimeString("en-IN", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </small>
                          </>
                        ) : (
                          <span className="text-secondary">—</span>
                        )}
                      </td>

                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="rounded-circle p-1 d-inline-flex"
                            style={{ background: "rgba(16, 185, 129, 0.15)" }}
                          >
                            <i className="bi bi-check2-circle text-success" style={{ fontSize: "0.9rem" }}></i>
                          </span>
                          <strong className="text-light">
                            {purchase.itemName}
                          </strong>
                        </div>
                      </td>

                      <td>
                        <span className="badge bg-success rounded-pill">
                          <i className="bi bi-person-check me-1"></i>
                          {purchase.purchasedBy}
                        </span>
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