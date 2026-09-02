import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PendingRequestModal from "../../components/dashboard/PendingRequestModal";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  subscribeToDashboardStats,
  subscribeToRecentActivity,
  getRequestsByUser,
} from "../../services/requestService";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    purchased: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribeStats = subscribeToDashboardStats((statsData) => {
      setStats({
        total: statsData.total,
        pending: statsData.pending,
        purchased: statsData.purchased,
      });
    });

    const unsubscribeRecent = subscribeToRecentActivity((data) => {
      setRecentRequests(data.slice(0, 5));
    });

    const loadPendingRequests = async () => {
      const userRequests = await getRequestsByUser(user.name);
      setPendingRequests(
        userRequests.filter((request) => request.status === "Pending")
      );
    };

    loadPendingRequests();

    return () => {
      unsubscribeStats();
      unsubscribeRecent();
    };
  }, [user]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
                  background: "var(--color-sage-tint)",
                  border: "1px solid var(--color-sage-border)",
                }}
              >
                <span className="rounded-circle bg-success pulse-sage d-inline-block" style={{ width: "8px", height: "8px", background: "var(--color-sage) !important" }} />
                <small className="fw-semibold text-sage" style={{ fontSize: "0.8rem" }}>
                  Mother's Kitchen Portal
                </small>
              </div>

              <h1 className="fw-bold mb-2" style={{ fontSize: "1.85rem", color: "var(--text-main)" }}>
                Welcome back, {user?.name}! 👩‍🍳
              </h1>

              <p className="text-muted mb-0" style={{ fontSize: "0.98rem", maxWidth: "600px" }}>
                Quickly request missing pantry ingredients and keep tabs on family shopping fulfillments.
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

      {/* Summary Stat Cards */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-md-4">
          <div
            className="stat-card"
            onClick={() => navigate("/mother/all-requests")}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted fw-semibold d-block mb-1" style={{ fontSize: "0.86rem" }}>
                  Total Requests
                </span>
                <div className="stat-number">{stats.total}</div>
                <small className="fw-semibold mt-1 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.82rem", color: "#2563eb" }}>
                  <i className="bi bi-list-check"></i> View full history
                </small>
              </div>
              <div className="stat-icon-wrapper stat-icon-blue">
                <i className="bi bi-cart3 fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="stat-card"
            onClick={() => setShowPendingModal(true)}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted fw-semibold d-block mb-1" style={{ fontSize: "0.86rem" }}>
                  Pending Requests
                </span>
                <div className="stat-number" style={{ color: "var(--color-amber)" }}>
                  {stats.pending}
                </div>
                <small className="fw-semibold mt-1 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.82rem", color: "var(--color-amber)" }}>
                  <i className="bi bi-clock"></i> View waiting list
                </small>
              </div>
              <div className="stat-icon-wrapper stat-icon-amber">
                <i className="bi bi-hourglass-split fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="stat-card"
            onClick={() => navigate("/mother/history")}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted fw-semibold d-block mb-1" style={{ fontSize: "0.86rem" }}>
                  Purchased Items
                </span>
                <div className="stat-number" style={{ color: "var(--color-sage)" }}>
                  {stats.purchased}
                </div>
                <small className="text-sage fw-semibold mt-1 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.82rem" }}>
                  <i className="bi bi-check2-all"></i> View completed
                </small>
              </div>
              <div className="stat-icon-wrapper stat-icon-sage">
                <i className="bi bi-bag-check fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shopping Requests */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cart-check-fill text-sage"></i>
            <h5 className="mb-0 fw-bold" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
              Recent Shopping Requests
            </h5>
          </div>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={() => navigate("/mother/requests")}
          >
            <i className="bi bi-plus-circle me-1"></i> New Request
          </button>
        </div>

        <div className="card-body p-0">
          {recentRequests.length === 0 ? (
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
              <h5 className="mt-2 fw-bold" style={{ color: "var(--text-main)" }}>No Requests Yet</h5>
              <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                Add out-of-stock items to your shopping list to get started.
              </p>
            </div>
          ) : (
            <div className="table-responsive border-0">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th width="160">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="fw-semibold" style={{ color: "var(--text-main)" }}>
                        <i className="bi bi-basket2 me-2" style={{ color: "var(--color-amber)" }}></i>
                        {request.itemName}
                      </td>

                      <td>
                        {request.status === "Pending" ? (
                          <span className="badge bg-warning">
                            <i className="bi bi-hourglass-split me-1"></i>
                            Pending
                          </span>
                        ) : (
                          <span className="badge bg-success">
                            <i className="bi bi-check2-circle me-1"></i>
                            Purchased
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <PendingRequestModal
        show={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        requests={pendingRequests}
      />
    </DashboardLayout>
  );
}

export default Dashboard;