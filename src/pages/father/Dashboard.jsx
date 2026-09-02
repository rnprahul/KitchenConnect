import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

import {
  subscribeToRequests,
  subscribeToDashboardStats,
  markAsPurchased,
} from "../../services/requestService";

import { updateItemStatus } from "../../services/itemService";

function FatherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    purchased: 0,
  });

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const unsubscribeRequests = subscribeToRequests((data) => {
      const pending = data.filter((request) => request.status === "Pending");
      setRequests(pending);
      setLoading(false);
    });

    const unsubscribeStats = subscribeToDashboardStats((data) => {
      setStats({
        pending: data.pending,
        purchased: data.purchased,
      });
    });

    return () => {
      unsubscribeRequests();
      unsubscribeStats();
    };
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

  return (
    <DashboardLayout>
      {/* Welcome Hero Card */}
      <div className="dashboard-hero-card mb-4">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                style={{
                  background: "var(--color-amber-light)",
                  border: "1px solid #fde68a",
                }}
              >
                <span className="rounded-circle bg-warning d-inline-block" style={{ width: "8px", height: "8px" }} />
                <small className="fw-semibold" style={{ fontSize: "0.8rem", color: "var(--color-amber)" }}>
                  Father's Grocery Hub
                </small>
              </div>

              <h1 className="fw-bold mb-2" style={{ fontSize: "1.85rem", color: "var(--text-main)" }}>
                Ready to shop, {user?.name}? 🛒
              </h1>

              <p className="text-muted mb-0" style={{ fontSize: "0.98rem", maxWidth: "600px" }}>
                Review family shopping requests and mark off items as you buy them at the grocery store.
              </p>
            </div>

            <div
              className="text-md-end px-3 py-2 rounded-3"
              style={{
                background: "#ffffff",
                border: "1px solid var(--border-card)",
                boxShadow: "var(--shadow-xs)",
              }}
            >
              <small className="text-muted d-block" style={{ fontSize: "0.72rem", letterSpacing: "0.04em" }}>TODAY</small>
              <span className="fw-semibold text-main" style={{ fontSize: "0.92rem" }}>
                {today}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="row g-3 g-md-4 mb-4">
        {/* Pending Requests Stat Card */}
        <div className="col-md-6">
          <div
            className="stat-card"
            onClick={() => navigate("/father/requests")}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted fw-semibold d-block mb-1" style={{ fontSize: "0.86rem" }}>
                  Items To Buy
                </span>
                <div className="stat-number" style={{ color: "var(--color-amber)" }}>
                  {stats.pending}
                </div>
                <small className="fw-semibold mt-1 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.82rem", color: "var(--color-amber)" }}>
                  <i className="bi bi-arrow-right-circle"></i> Open shopping list
                </small>
              </div>
              <div className="stat-icon-wrapper stat-icon-amber">
                <i className="bi bi-cart-check-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase History Stat Card */}
        <div className="col-md-6">
          <div
            className="stat-card"
            onClick={() => navigate("/father/history")}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted fw-semibold d-block mb-1" style={{ fontSize: "0.86rem" }}>
                  Completed Purchases
                </span>
                <div className="stat-number" style={{ color: "var(--color-sage)" }}>
                  {stats.purchased}
                </div>
                <small className="text-sage fw-semibold mt-1 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.82rem" }}>
                  <i className="bi bi-clock-history"></i> View full history
                </small>
              </div>
              <div className="stat-icon-wrapper stat-icon-sage">
                <i className="bi bi-bag-check-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="card mb-4">
        <div className="card-header d-flex align-items-center gap-2">
          <i className="bi bi-lightning-charge-fill" style={{ color: "var(--color-amber)" }}></i>
          <h5 className="fw-bold mb-0" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
            Quick Shopping Actions
          </h5>
        </div>

        <div className="card-body p-3 p-md-4">
          <div className="row g-3">
            <div className="col-md-6">
              <button
                className="quick-action-tile tile-amber"
                onClick={() => navigate("/father/requests")}
              >
                <div className="tile-icon bg-amber-tint" style={{ color: "var(--color-amber)" }}>
                  <i className="bi bi-cart-check-fill"></i>
                </div>
                <span>Open Pending Shopping Checklist ({stats.pending})</span>
              </button>
            </div>

            <div className="col-md-6">
              <button
                className="quick-action-tile tile-sage"
                onClick={() => navigate("/father/history")}
              >
                <div className="tile-icon bg-sage-tint text-sage">
                  <i className="bi bi-clock-history"></i>
                </div>
                <span>View Full Purchase History ({stats.purchased})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Shopping Requests List */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cart-check-fill text-sage"></i>
            <h5 className="mb-0 fw-bold" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
              Active Shopping Checklist
            </h5>
          </div>
          <span className="badge bg-warning">
            {requests.length} Pending
          </span>
        </div>

        <div className="card-body p-0">
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
                Loading grocery list...
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
                <i className="bi bi-check2-all fs-1"></i>
              </div>
              <h5 className="mt-2 fw-bold" style={{ color: "var(--text-main)" }}>All Shopping Completed!</h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                There are no pending shopping items that need to be bought right now.
              </p>
            </div>
          ) : (
            <div className="table-responsive border-0">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th width="60" className="text-center">#</th>
                    <th>Item to Buy</th>
                    <th>Requested By</th>
                    <th width="140">Status</th>
                    <th width="200" className="text-end pe-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request, index) => (
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

                      <td>
                        <span className="badge bg-warning">
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
                          Mark Bought
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

export default FatherDashboard;