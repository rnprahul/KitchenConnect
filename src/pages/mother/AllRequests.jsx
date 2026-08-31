import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getRequestsByUser } from "../../services/requestService";

function AllRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadRequests = async () => {
      try {
        const data = await getRequestsByUser(user.name);
        setRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [user]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-4">
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(96, 165, 250, 0.3)" }}>
          <i className="bi bi-list-check text-primary"></i>
          <small className="text-primary fw-semibold" style={{ fontSize: "0.8rem" }}>
            All Shopping History
          </small>
        </div>

        <h2 className="fw-bold text-light mb-1">
          All Shopping Requests
        </h2>

        <p className="text-secondary mb-0" style={{ fontSize: "0.95rem" }}>
          View full archive of your requested kitchen ingredients and current fulfillment state.
        </p>
      </div>

      {/* Card */}
      <div className="card shadow-sm border-0">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cart3 text-success"></i>
            <h5 className="mb-0 fw-bold text-light" style={{ fontSize: "1.1rem" }}>
              Request History
            </h5>
          </div>
          <span className="badge bg-secondary rounded-pill">
            {requests.length} Requests Total
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
                Loading requests...
              </p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#94a3b8",
                }}
              >
                <i className="bi bi-cart-x fs-1"></i>
              </div>
              <h5 className="mt-2 text-light fw-bold">No Requests Found</h5>
              <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
                You have not submitted any shopping requests yet.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th width="60" className="text-center">#</th>
                    <th>Requested Item</th>
                    <th width="160">Status</th>
                    <th width="200">Requested Date</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request, index) => (
                    <tr key={request.id}>
                      <td className="text-center text-secondary fw-semibold">
                        {index + 1}
                      </td>

                      <td className="fw-semibold text-light">
                        <i className="bi bi-basket2 text-warning me-2"></i>
                        {request.itemName}
                      </td>

                      <td>
                        {request.status === "Pending" ? (
                          <span className="badge bg-warning text-dark px-3 py-2">
                            <i className="bi bi-hourglass-split me-1"></i>
                            Pending
                          </span>
                        ) : (
                          <span className="badge bg-success px-3 py-2">
                            <i className="bi bi-check2-circle me-1"></i>
                            Purchased
                          </span>
                        )}
                      </td>

                      <td className="text-secondary">
                        {request.requestedAt?.toDate
                          ? request.requestedAt.toDate().toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
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

export default AllRequests;