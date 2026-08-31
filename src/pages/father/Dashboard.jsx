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
    setLoading(true);

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
      {/* Welcome Hero */}
      <div className="card dashboard-card mb-4 position-relative overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                style={{
                  background: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                }}
              >
                <span className="rounded-circle bg-warning d-inline-block" style={{ width: "8px", height: "8px" }} />
                <small className="text-warning fw-semibold" style={{ fontSize: "0.8rem" }}>
                  Father's Shopping Portal
                </small>
              </div>

              <h1 className="fw-bold text-light mb-2" style={{ fontSize: "2rem" }}>
                Welcome, {user?.name}! 🛒
              </h1>

              <p className="text-secondary mb-0" style={{ fontSize: "1rem", maxWidth: "600px" }}>
                Review household grocery shopping requests and mark items as bought as you shop.
              </p>
            </div>

            <div className="text-md-end px-3 py-2 rounded-3" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <small className="text-secondary d-block" style={{ fontSize: "0.75rem" }}>TODAY</small>
              <span className="fw-semibold text-light" style={{ fontSize: "0.95rem" }}>
                {today}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="row g-4 mb-4">
        {/* Pending Requests Stat Card */}
        <div className="col-md-6">
          <div
            className="card dashboard-card h-100"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/father/requests")}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: "0.88rem" }}>
                    Pending Shopping List
                  </span>
                  <h2 className="fw-bold text-warning mb-0">{stats.pending}</h2>
                  <small className="text-warning mt-2 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.8rem" }}>
                    <i className="bi bi-arrow-right-circle"></i> Open shopping list
                  </small>
                </div>
                <div className="icon-box bg-warning text-white">
                  <i className="bi bi-cart-check-fill fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase History Stat Card */}
        <div className="col-md-6">
          <div
            className="card dashboard-card h-100"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/father/history")}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: "0.88rem" }}>
                    Completed Purchases
                  </span>
                  <h2 className="fw-bold text-emerald mb-0">{stats.purchased}</h2>
                  <small className="text-emerald mt-2 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.8rem" }}>
                    <i className="bi bi-clock-history"></i> View purchase history
                  </small>
                </div>
                <div className="icon-box bg-success text-white">
                  <i className="bi bi-bag-check-fill fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="card dashboard-card mb-4">
        <div className="card-header d-flex align-items-center gap-2">
          <i className="bi bi-lightning-charge-fill text-warning"></i>
          <h5 className="fw-bold text-light mb-0" style={{ fontSize: "1.1rem" }}>
            Shopping Navigation
          </h5>
        </div>

        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <button
                className="quick-action-btn btn-amber"
                onClick={() => navigate("/father/requests")}
              >
                <i className="bi bi-cart-check-fill fs-5"></i>
                <span>Open Pending Shopping Requests ({stats.pending})</span>
              </button>
            </div>

            <div className="col-md-6">
              <button
                className="quick-action-btn btn-emerald"
                onClick={() => navigate("/father/history")}
              >
                <i className="bi bi-clock-history fs-5"></i>
                <span>View Full Purchase History ({stats.purchased})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Shopping Requests Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cart-check-fill text-warning"></i>
            <h5 className="mb-0 fw-bold text-light" style={{ fontSize: "1.1rem" }}>
              Active Pending Items
            </h5>
          </div>
          <span className="badge bg-warning text-dark rounded-pill">
            {requests.length} Pending
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
                Loading shopping queue...
              </p>
            </div>
          ) : requests.length === 0 ? (
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
              <h5 className="mt-2 text-light fw-bold">All Shopping Completed!</h5>
              <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
                There are no pending shopping items that need to be bought right now.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
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

export default FatherDashboard;