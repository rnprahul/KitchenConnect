import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../components/common/StatusBadge";

import {
  subscribeToRequests,
  markAsPurchased,
} from "../../services/requestService";

import { updateItemStatus } from "../../services/itemService";

function FatherShoppingRequests() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToRequests((data) => {
      const pending = data.filter((request) => request.status === "Pending");
      setRequests(pending);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePurchaseCompleted = async (request) => {
    try {
      await markAsPurchased(request.id, user.name);
      await updateItemStatus(request.itemId, "Available");

      toast.success(`"${request.itemName}" marked as purchased!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete purchase.");
    }
  };

  const filteredRequests = requests.filter(
    (request) =>
      request.itemName.toLowerCase().includes(search.toLowerCase()) ||
      (request.requestedBy &&
        request.requestedBy.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <DashboardLayout search={search} setSearch={setSearch}>
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
            style={{
              background: "var(--color-amber-light)",
              border: "1px solid #fde68a",
            }}
          >
            <i className="bi bi-cart-check-fill" style={{ color: "var(--color-amber)" }}></i>
            <small className="fw-semibold" style={{ fontSize: "0.8rem", color: "var(--color-amber)" }}>
              Active Shopping List
            </small>
          </div>

          <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
            Pending Shopping Requests
          </h2>

          <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
            List of grocery items needed for the home pantry. Mark items as bought as you shop.
          </p>
        </div>

        <span className="badge bg-warning px-3 py-2 fs-6">
          <i className="bi bi-hourglass-split me-1"></i>
          {filteredRequests.length} {filteredRequests.length === 1 ? "Item" : "Items"} Remaining
        </span>
      </div>

      {/* Requests Card */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-bag-check-fill" style={{ color: "var(--color-amber)" }}></i>
            <h5 className="mb-0 fw-bold" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
              Items to Purchase
            </h5>
          </div>
          <span className="badge bg-secondary">
            {filteredRequests.length} Pending
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
              Loading grocery checklist...
            </p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-5">
            <div
              className="rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
              style={{
                background: "var(--color-sage-tint)",
                color: "var(--color-sage)",
              }}
            >
              <i className="bi bi-check2-all fs-1"></i>
            </div>
            <h5 className="mt-2 fw-bold" style={{ color: "var(--text-main)" }}>No Pending Shopping Requests!</h5>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
              {search
                ? "No requests match your search criteria."
                : "All kitchen requests have been purchased and fulfilled."}
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
                      <th>Item Name</th>
                      <th>Requested By</th>
                      <th width="180">Date Requested</th>
                      <th width="140">Status</th>
                      <th width="200" className="text-end pe-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRequests.map((request, index) => (
                      <tr key={request.id}>
                        <td className="text-center text-muted fw-semibold">
                          {index + 1}
                        </td>

                        <td className="fw-bold" style={{ color: "var(--text-main)" }}>
                          <div className="d-flex align-items-center gap-2">
                            <span
                              className="rounded-circle p-1 d-inline-flex"
                              style={{ background: "var(--color-amber-light)", color: "var(--color-amber)" }}
                            >
                              <i className="bi bi-basket2-fill" style={{ fontSize: "0.9rem" }}></i>
                            </span>
                            <span>{request.itemName}</span>
                          </div>
                        </td>

                        <td>
                          <span className="badge bg-secondary">
                            <i className="bi bi-person-fill me-1"></i>
                            {request.requestedBy}
                          </span>
                        </td>

                        <td className="text-muted">
                          {request.requestedAt?.toDate ? (
                            <>
                              <div className="fw-medium text-main" style={{ fontSize: "0.86rem" }}>
                                {request.requestedAt.toDate().toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                              <small className="text-muted" style={{ fontSize: "0.74rem" }}>
                                {request.requestedAt.toDate().toLocaleTimeString("en-IN", {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </small>
                            </>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td>
                          <StatusBadge status={request.status} />
                        </td>

                        <td className="text-end pe-4">
                          <button
                            className="btn btn-success btn-sm px-3"
                            onClick={() => handlePurchaseCompleted(request)}
                          >
                            <i className="bi bi-check2-circle me-1"></i>
                            Mark Bought
                          </button>
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
                {filteredRequests.map((request, index) => (
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
                        <h6 className="fw-bold mb-1" style={{ color: "var(--text-main)", fontSize: "1.05rem" }}>
                          <i className="bi bi-basket2-fill me-2" style={{ color: "var(--color-amber)" }}></i>
                          {request.itemName}
                        </h6>
                        <small className="text-muted">
                          For: <span className="badge bg-secondary py-0 px-2">{request.requestedBy}</span>
                        </small>
                      </div>
                      <StatusBadge status={request.status} size="sm" />
                    </div>

                    <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center" style={{ borderColor: "var(--border-subtle)" }}>
                      <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {request.requestedAt?.toDate
                          ? request.requestedAt.toDate().toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })
                          : ""}
                      </small>
                      <button
                        className="btn btn-success btn-sm px-3"
                        onClick={() => handlePurchaseCompleted(request)}
                      >
                        <i className="bi bi-check2-circle me-1"></i> Mark Bought
                      </button>
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

export default FatherShoppingRequests;
