import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../../components/common/StatusBadge";
import QuantityCounter from "../../components/requests/QuantityCounter";
import DeleteRequestModal from "../../components/requests/DeleteRequestModal";
import { filterAndSortBySearch } from "../../utils/searchUtils";

import {
  subscribeToRequestsByUser,
  updateRequestQuantity,
  removePendingRequest,
} from "../../services/requestService";

function PendingRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToRequestsByUser(user.name, (data) => {
      const pending = data.filter((req) => req.status === "Pending");
      setRequests(pending);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleQuantityChange = async (request, newCount) => {
    try {
      await updateRequestQuantity(request, newCount);
      toast.info(`Updated count to ${newCount}`);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update count");
    }
  };

  const handleRemoveRequest = async (request) => {
    try {
      setShowDeleteModal(false);
      setSelectedRequest(null);
      await removePendingRequest(request);
      toast.success(`Removed "${request.itemName}" from pending requests.`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove request.");
    }
  };

  const filteredRequests = filterAndSortBySearch(requests, search, "itemName");

  return (
    <DashboardLayout search={search} setSearch={setSearch}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
            style={{
              background: "var(--color-amber-light)",
              border: "1px solid #fde68a",
            }}
          >
            <i className="bi bi-hourglass-split" style={{ color: "var(--color-amber)" }}></i>
            <small className="fw-semibold" style={{ fontSize: "0.8rem", color: "var(--color-amber)" }}>
              Pending Queue · Mother's Portal
            </small>
          </div>

          <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
            Pending Shopping Requests
          </h2>

          <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
            Adjust the quantity of needed products using the +/- controls or pick from the default numbers dropdown.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-success btn-sm px-3 py-2 d-inline-flex align-items-center gap-2"
            onClick={() => navigate("/mother/requests")}
          >
            <i className="bi bi-plus-circle"></i>
            <span>Add More Items</span>
          </button>
          <span className="badge bg-warning px-3 py-2 fs-6">
            {requests.length} {requests.length === 1 ? "Item" : "Items"} Pending
          </span>
        </div>
      </div>

      {/* Main Card */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cart-check-fill text-sage"></i>
            <h5 className="mb-0 fw-bold" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
              Waiting List ({filteredRequests.length})
            </h5>
          </div>
          <span className="badge bg-secondary">
            {filteredRequests.length} Total
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
              Loading pending requests...
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
              <i className="bi bi-cart-check fs-1"></i>
            </div>
            <h5 className="mt-2 fw-bold" style={{ color: "var(--text-main)" }}>
              {search ? "No Matching Pending Items Found" : "No Pending Requests Waiting"}
            </h5>
            <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
              {search
                ? "Try a different search keyword."
                : "Your shopping list queue is clear! Request items from your kitchen pantry."}
            </p>
            <button
              className="btn btn-success px-4"
              onClick={() => navigate("/mother/requests")}
            >
              <i className="bi bi-cart-plus me-1"></i>
              Browse Pantry to Request Items
            </button>
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
                      <th>Kitchen Item</th>
                      <th width="240" className="text-center">Quantity (Count)</th>
                      <th width="150" className="text-center">Status</th>
                      <th width="160" className="text-muted">Date Added</th>
                      <th width="120" className="text-end pe-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRequests.map((request, index) => (
                      <tr key={request.id}>
                        <td className="text-center text-muted fw-semibold">
                          {index + 1}
                        </td>

                        <td className="fw-semibold" style={{ color: "var(--text-main)" }}>
                          <i className="bi bi-basket2 me-2" style={{ color: "var(--color-amber)" }}></i>
                          <span>{request.itemName}</span>
                        </td>

                        {/* Quantity with + and - and down arrowmark dropdown */}
                        <td className="text-center">
                          <QuantityCounter
                            value={request.quantity || 1}
                            onChange={(newCount) =>
                              handleQuantityChange(request, newCount)
                            }
                          />
                        </td>

                        <td className="text-center">
                          <StatusBadge status={request.status} />
                        </td>

                        <td className="text-muted" style={{ fontSize: "0.85rem" }}>
                          {request.requestedAt?.toDate
                            ? request.requestedAt.toDate().toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                              })
                            : "—"}
                        </td>

                        <td className="text-end pe-4">
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDeleteModal(true);
                            }}
                            title="Remove from list"
                          >
                            <i className="bi bi-trash3 me-1"></i>
                            Remove
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
              <div className="d-flex flex-column gap-3">
                {filteredRequests.map((request, index) => (
                  <div
                    key={request.id}
                    className="pantry-card p-3 rounded-3"
                    style={{
                      background: "var(--bg-main)",
                      border: "1px solid var(--border-card)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <small className="text-muted fw-semibold d-block mb-1">
                          #{index + 1}
                        </small>
                        <h6
                          className="fw-bold mb-0"
                          style={{ color: "var(--text-main)", fontSize: "1.05rem" }}
                        >
                          <i className="bi bi-basket2 me-2" style={{ color: "var(--color-amber)" }}></i>
                          {request.itemName}
                        </h6>
                      </div>

                      <StatusBadge status={request.status} size="sm" />
                    </div>

                    {/* Quantity Row */}
                    <div className="my-3 py-2 px-3 rounded-3 bg-white border d-flex justify-content-between align-items-center" style={{ borderColor: "var(--border-card)" }}>
                      <span className="text-muted fw-semibold" style={{ fontSize: "0.85rem" }}>
                        Count:
                      </span>
                      <QuantityCounter
                        value={request.quantity || 1}
                        size="sm"
                        onChange={(newCount) =>
                          handleQuantityChange(request, newCount)
                        }
                      />
                    </div>

                    {/* Bottom Row */}
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: "var(--border-subtle)", fontSize: "0.8rem" }}>
                      <span className="text-muted">
                        Added:{" "}
                        {request.requestedAt?.toDate
                          ? request.requestedAt.toDate().toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })
                          : "—"}
                      </span>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm px-3 py-1"
                        style={{ fontSize: "0.8rem" }}
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDeleteModal(true);
                        }}
                      >
                        <i className="bi bi-trash3 me-1"></i> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete / Remove Modal */}
      <DeleteRequestModal
        show={showDeleteModal}
        request={selectedRequest}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleRemoveRequest}
      />
    </DashboardLayout>
  );
}

export default PendingRequests;
