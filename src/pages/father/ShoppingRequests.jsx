import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

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
    setLoading(true);

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
              background: "rgba(245, 158, 11, 0.12)",
              border: "1px solid rgba(251, 191, 36, 0.3)",
            }}
          >
            <i className="bi bi-cart-check-fill text-warning"></i>
            <small className="text-warning fw-semibold" style={{ fontSize: "0.8rem" }}>
              Active Shopping List
            </small>
          </div>

          <h2 className="fw-bold text-light mb-1">
            Pending Shopping Requests
          </h2>

          <p className="text-secondary mb-0" style={{ fontSize: "0.95rem" }}>
            List of grocery and kitchen items needed for the home. Mark items as completed as you buy them.
          </p>
        </div>

        <span className="badge bg-warning text-dark px-3 py-2 fs-6">
          <i className="bi bi-hourglass-split me-1"></i>
          {filteredRequests.length} {filteredRequests.length === 1 ? "Item" : "Items"} Remaining
        </span>
      </div>

      {/* Requests Table Card */}
      <div className="card shadow-sm border-0">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-bag-check-fill text-warning"></i>
            <h5 className="mb-0 fw-bold text-light" style={{ fontSize: "1.1rem" }}>
              Items to Purchase
            </h5>
          </div>
          <span className="badge bg-secondary rounded-pill">
            {filteredRequests.length} Pending
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
                Loading pending shopping list...
              </p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-5">
              <div
                className="rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
                style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(52, 211, 153, 0.25)",
                  color: "#34d399",
                }}
              >
                <i className="bi bi-check2-all fs-1"></i>
              </div>
              <h5 className="mt-2 text-light fw-bold">No Pending Shopping Requests!</h5>
              <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
                {search
                  ? "No requests match your search criteria."
                  : "All kitchen requests have been purchased and fulfilled."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
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
                      <td className="text-center text-secondary fw-semibold">
                        {index + 1}
                      </td>

                      <td className="fw-bold text-light">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="rounded-circle p-1 d-inline-flex"
                            style={{ background: "rgba(245, 158, 11, 0.15)" }}
                          >
                            <i className="bi bi-basket2-fill text-warning" style={{ fontSize: "0.9rem" }}></i>
                          </span>
                          <span>{request.itemName}</span>
                        </div>
                      </td>

                      <td>
                        <span className="badge bg-secondary rounded-pill">
                          <i className="bi bi-person-fill me-1"></i>
                          {request.requestedBy}
                        </span>
                      </td>

                      <td className="text-secondary">
                        {request.requestedAt?.toDate ? (
                          <>
                            <div className="text-light fw-semibold" style={{ fontSize: "0.88rem" }}>
                              {request.requestedAt.toDate().toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                            <small className="text-secondary" style={{ fontSize: "0.75rem" }}>
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
                        <span className="badge bg-warning text-dark">
                          <i className="bi bi-hourglass-split me-1"></i>
                          Pending
                        </span>
                      </td>

                      <td className="text-end pe-4">
                        <button
                          className="btn btn-success btn-sm px-3"
                          onClick={() => handlePurchaseCompleted(request)}
                        >
                          <i className="bi bi-check2-circle me-1"></i>
                          Purchase Completed
                        </button>
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

export default FatherShoppingRequests;
