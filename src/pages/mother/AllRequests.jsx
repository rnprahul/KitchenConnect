import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getRequestsByUser } from "../../services/requestService";
import StatusBadge from "../../components/common/StatusBadge";

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
        <div
          className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
          style={{
            background: "var(--color-sage-tint)",
            border: "1px solid var(--color-sage-border)",
          }}
        >
          <i className="bi bi-list-check text-sage"></i>
          <small className="fw-semibold text-sage" style={{ fontSize: "0.8rem" }}>
            Shopping Archive
          </small>
        </div>

        <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
          All Shopping Requests
        </h2>

        <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
          View the complete history of your requested kitchen ingredients and their purchase fulfillment.
        </p>
      </div>

      {/* Card */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cart3 text-sage"></i>
            <h5 className="mb-0 fw-bold" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
              Request History
            </h5>
          </div>
          <span className="badge bg-secondary">
            {requests.length} Requests Total
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
              Loading requests archive...
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-5">
            <div
              className="rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
              style={{
                background: "var(--color-sage-tint)",
                color: "var(--color-sage)",
              }}
            >
              <i className="bi bi-cart-x fs-1"></i>
            </div>
            <h5 className="mt-2 fw-bold" style={{ color: "var(--text-main)" }}>No Requests Found</h5>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
              You have not submitted any shopping requests yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="card-body p-0 d-none d-md-block">
              <div className="table-responsive border-0">
                <table className="table align-middle mb-0">
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
                        <td className="text-center text-muted fw-semibold">
                          {index + 1}
                        </td>

                        <td className="fw-semibold" style={{ color: "var(--text-main)" }}>
                          <i className="bi bi-basket2 me-2" style={{ color: "var(--color-amber)" }}></i>
                          {request.itemName}
                        </td>

                        <td>
                          <StatusBadge status={request.status} />
                        </td>

                        <td className="text-muted">
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
            </div>

            {/* Mobile Card List View */}
            <div className="card-body p-3 d-md-none">
              <div className="d-flex flex-column gap-2">
                {requests.map((request, index) => (
                  <div
                    key={request.id}
                    className="pantry-card p-3 rounded-3"
                    style={{
                      background: "var(--bg-main)",
                      border: "1px solid var(--border-card)",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <small className="text-muted fw-semibold d-block mb-1">#{index + 1}</small>
                        <h6 className="fw-bold mb-0" style={{ color: "var(--text-main)" }}>
                          <i className="bi bi-basket2 me-2" style={{ color: "var(--color-amber)" }}></i>
                          {request.itemName}
                        </h6>
                      </div>
                      <StatusBadge status={request.status} size="sm" />
                    </div>

                    <div className="text-muted pt-2 border-top d-flex justify-content-between align-items-center" style={{ borderColor: "var(--border-subtle)", fontSize: "0.8rem" }}>
                      <span>Requested:</span>
                      <span className="fw-medium">
                        {request.requestedAt?.toDate
                          ? request.requestedAt.toDate().toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
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

export default AllRequests;