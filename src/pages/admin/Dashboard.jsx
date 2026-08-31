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
      {/* Welcome Hero Card */}
      <div className="card dashboard-card mb-4 position-relative overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
                <span className="rounded-circle bg-success pulse-emerald d-inline-block" style={{ width: "8px", height: "8px" }} />
                <small className="text-emerald fw-semibold" style={{ fontSize: "0.8rem" }}>
                  Admin Control Center
                </small>
              </div>

              <h1 className="fw-bold text-light mb-2" style={{ fontSize: "2rem" }}>
                Welcome back, {user?.name}! 👋
              </h1>

              <p className="text-secondary mb-0" style={{ fontSize: "1rem", maxWidth: "600px" }}>
                Manage kitchen inventory, monitor pending shopping requests, and track grocery history.
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

      {/* Statistics Cards */}
      <div className="row g-4 mb-4">
        {/* Kitchen Items Card */}
        <div className="col-lg-4 col-md-6">
          <div
            className="card dashboard-card h-100"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/items")}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: "0.88rem" }}>
                    Total Kitchen Items
                  </span>
                  <h2 className="fw-bold text-light mb-0">{itemsCount}</h2>
                  <small className="text-emerald mt-2 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.8rem" }}>
                    <i className="bi bi-arrow-right-circle"></i> View inventory
                  </small>
                </div>

                <div className="icon-box bg-success text-white">
                  <i className="bi bi-basket2-fill fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests Card */}
        <div className="col-lg-4 col-md-6">
          <div
            className="card dashboard-card h-100"
            style={{ cursor: "pointer" }}
            onClick={() => setShowPendingModal(true)}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: "0.88rem" }}>
                    Pending Requests
                  </span>
                  <h2 className="fw-bold text-warning mb-0">{pendingCount}</h2>
                  <small className="text-warning mt-2 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.8rem" }}>
                    <i className="bi bi-eye"></i> View pending list
                  </small>
                </div>

                <div className="icon-box bg-warning text-white">
                  <i className="bi bi-cart-check-fill fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchased Items Card */}
        <div className="col-lg-4 col-md-6">
          <div
            className="card dashboard-card h-100"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/history")}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: "0.88rem" }}>
                    Completed Purchases
                  </span>
                  <h2 className="fw-bold text-light mb-0">{purchasedCount}</h2>
                  <small className="text-secondary mt-2 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.8rem" }}>
                    <i className="bi bi-clock-history"></i> View full history
                  </small>
                </div>

                <div className="icon-box bg-danger text-white">
                  <i className="bi bi-check-circle-fill fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card dashboard-card mb-4">
        <div className="card-header d-flex align-items-center gap-2">
          <i className="bi bi-lightning-charge-fill text-warning"></i>
          <h5 className="fw-bold text-light mb-0" style={{ fontSize: "1.1rem" }}>
            Quick Management Actions
          </h5>
        </div>

        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <button
                className="quick-action-btn btn-emerald"
                onClick={() => navigate("/admin/items")}
              >
                <i className="bi bi-plus-circle-fill fs-5"></i>
                <span>Add / Manage Kitchen Items</span>
              </button>
            </div>

            <div className="col-md-4">
              <button
                className="quick-action-btn btn-amber"
                onClick={() => navigate("/admin/requests")}
              >
                <i className="bi bi-cart-fill fs-5"></i>
                <span>Shopping Requests List</span>
              </button>
            </div>

            <div className="col-md-4">
              <button
                className="quick-action-btn btn-blue"
                onClick={() => navigate("/admin/history")}
              >
                <i className="bi bi-clock-history fs-5"></i>
                <span>View Purchase History</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card dashboard-card">
        <div className="card-header d-flex align-items-center gap-2">
          <i className="bi bi-activity text-success"></i>
          <h5 className="fw-bold text-light mb-0" style={{ fontSize: "1.1rem" }}>
            Recent Activity Feed
          </h5>
        </div>

        <div className="card-body p-4">
          {activities.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-2 d-block mb-2 text-secondary"></i>
              <p className="mb-0 text-secondary">No recent activity found.</p>
            </div>
          ) : (
            <div className="list-group list-group-flush gap-2">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2"
                >
                  <div>
                    <div className="fw-semibold text-light mb-1">
                      <span className="me-2">🛒</span>
                      <span className="text-secondary">{activity.requestedBy}</span> requested{" "}
                      <strong className="text-emerald">{activity.itemName}</strong>
                    </div>

                    <small className="text-secondary" style={{ fontSize: "0.78rem" }}>
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
                      <small className="text-secondary d-block" style={{ fontSize: "0.75rem" }}>
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