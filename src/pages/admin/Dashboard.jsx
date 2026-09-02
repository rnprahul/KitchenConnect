import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

import { subscribeToItemsCount } from "../../services/itemService";
import {
  subscribeToDashboardStats,
  subscribeToRecentActivity,
  subscribeToRequests,
} from "../../services/requestService";

import PendingRequestModal from "../../components/dashboard/PendingRequestModal";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [itemsCount, setItemsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [purchasedCount, setPurchasedCount] = useState(0);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const unsubscribeItems = subscribeToItemsCount((count) => {
      setItemsCount(count);
    });

    const unsubscribeStats = subscribeToDashboardStats((stats) => {
      setPendingCount(stats.pending);
      setPurchasedCount(stats.purchased);
    });

    const unsubscribeRequests = subscribeToRequests((requests) => {
      const pending = requests.filter(
        (request) => request.status === "Pending"
      );
      setPendingRequests(pending);
    });

    const unsubscribeActivity = subscribeToRecentActivity((data) => {
      setActivities(data.slice(0, 5));
    });

    return () => {
      unsubscribeItems();
      unsubscribeStats();
      unsubscribeRequests();
      unsubscribeActivity();
    };
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <DashboardLayout>
      {/* Welcome Hero Banner */}
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
                  Kitchen Hub · Admin Mode
                </small>
              </div>

              <h1 className="fw-bold mb-2" style={{ fontSize: "1.85rem", color: "var(--text-main)" }}>
                Good day, {user?.name}! 🌿
              </h1>

              <p className="text-muted mb-0" style={{ fontSize: "0.98rem", maxWidth: "600px" }}>
                Here is your kitchen pantry status, pending shopping requests, and grocery audit trail.
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

      {/* Summary Statistics Cards */}
      <div className="row g-3 g-md-4 mb-4">
        {/* Kitchen Items Card */}
        <div className="col-lg-4 col-md-6">
          <div
            className="stat-card"
            onClick={() => navigate("/admin/items")}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted fw-semibold d-block mb-1" style={{ fontSize: "0.86rem" }}>
                  Pantry Inventory
                </span>
                <div className="stat-number">{itemsCount}</div>
                <small className="text-sage fw-semibold mt-1 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.82rem" }}>
                  <i className="bi bi-arrow-right-circle"></i> Manage pantry
                </small>
              </div>

              <div className="stat-icon-wrapper stat-icon-sage">
                <i className="bi bi-basket2-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests Card */}
        <div className="col-lg-4 col-md-6">
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
                  {pendingCount}
                </div>
                <small className="fw-semibold mt-1 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.82rem", color: "var(--color-amber)" }}>
                  <i className="bi bi-eye"></i> View shopping queue
                </small>
              </div>

              <div className="stat-icon-wrapper stat-icon-amber">
                <i className="bi bi-cart-check-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Purchases Card */}
        <div className="col-lg-4 col-md-6">
          <div
            className="stat-card"
            onClick={() => navigate("/admin/history")}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="text-muted fw-semibold d-block mb-1" style={{ fontSize: "0.86rem" }}>
                  Completed Purchases
                </span>
                <div className="stat-number" style={{ color: "var(--color-sage)" }}>
                  {purchasedCount}
                </div>
                <small className="text-muted fw-semibold mt-1 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.82rem" }}>
                  <i className="bi bi-clock-history"></i> View history log
                </small>
              </div>

              <div className="stat-icon-wrapper stat-icon-terracotta">
                <i className="bi bi-bag-check-fill fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-4">
        <div className="card-header d-flex align-items-center gap-2">
          <i className="bi bi-lightning-charge-fill" style={{ color: "var(--color-amber)" }}></i>
          <h5 className="fw-bold mb-0" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
            Kitchen Quick Actions
          </h5>
        </div>

        <div className="card-body p-3 p-md-4">
          <div className="row g-3">
            <div className="col-md-4">
              <button
                className="quick-action-tile tile-sage"
                onClick={() => navigate("/admin/items")}
              >
                <div className="tile-icon bg-sage-tint text-sage">
                  <i className="bi bi-plus-circle-fill"></i>
                </div>
                <span>Add / Manage Pantry Items</span>
              </button>
            </div>

            <div className="col-md-4">
              <button
                className="quick-action-tile tile-amber"
                onClick={() => navigate("/admin/requests")}
              >
                <div className="tile-icon bg-amber-tint text-amber" style={{ color: "var(--color-amber)" }}>
                  <i className="bi bi-cart-fill"></i>
                </div>
                <span>Review Shopping Requests</span>
              </button>
            </div>

            <div className="col-md-4">
              <button
                className="quick-action-tile tile-wood"
                onClick={() => navigate("/admin/history")}
              >
                <div className="tile-icon bg-terracotta-tint text-terracotta">
                  <i className="bi bi-clock-history"></i>
                </div>
                <span>Audit Purchase Records</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header d-flex align-items-center gap-2">
          <i className="bi bi-activity text-sage"></i>
          <h5 className="fw-bold mb-0" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
            Recent Kitchen Activity
          </h5>
        </div>

        <div className="card-body p-3 p-md-4">
          {activities.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2 text-subtle" style={{ color: "#a0aec0" }}></i>
              <p className="mb-0 text-muted">No recent kitchen activity found.</p>
            </div>
          ) : (
            <div className="list-group list-group-flush gap-2">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2"
                >
                  <div>
                    <div className="fw-semibold mb-1" style={{ color: "var(--text-main)" }}>
                      <span className="me-2">🛒</span>
                      <span className="text-muted">{activity.requestedBy}</span> requested{" "}
                      <strong className="text-sage">{activity.itemName}</strong>
                    </div>

                    <small className="text-muted" style={{ fontSize: "0.78rem" }}>
                      <i className="bi bi-clock me-1"></i>
                      {activity.requestedAt?.toDate
                        ? activity.requestedAt.toDate().toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : ""}
                    </small>
                  </div>

                  {activity.status === "Purchased" && (
                    <div className="text-md-end mt-2 mt-md-0">
                      <span className="badge bg-success mb-1">
                        <i className="bi bi-check2-circle me-1"></i>
                        Purchased by {activity.purchasedBy}
                      </span>
                      <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                        {activity.purchasedAt?.toDate
                          ? activity.purchasedAt.toDate().toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : ""}
                      </small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PendingRequestModal
        show={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        requests={pendingRequests}
        showRequester={true}
      />
    </DashboardLayout>
  );
}

export default Dashboard;