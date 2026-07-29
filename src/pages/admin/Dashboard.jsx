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


  return () => {
    unsubscribeItems();
    unsubscribeStats();
    unsubscribeRequests();
  };

}, []);

  const [activities, setActivities] = useState([]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
  const unsubscribe = subscribeToRecentActivity((data) => {
    setActivities(data.slice(0, 5));
  });

  return () => unsubscribe();
}, []);

  return (
    <DashboardLayout>

      {/* Welcome Card */}

      <div className="card dashboard-card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="fw-bold text-success mb-2">
            Welcome, {user?.name}! 👋
          </h2>

          <p className="text-muted mb-1">
            Manage your kitchen items and shopping requests from one place.
          </p>

          <small className="text-secondary">
            Today: {today}
          </small>
        </div>
      </div>

      {/* Statistics */}

      <div className="row g-4 mb-4">

        <div className="col-lg-4 col-md-6">
          <div
  className="card dashboard-card shadow-sm h-100"
  style={{ cursor:"pointer" }}
  onClick={() => navigate("/admin/items")}
>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted">Kitchen Items</h6>
                  <h2 className="fw-bold mb-0">{itemsCount}</h2>
                </div>

                <div className="icon-box bg-success text-white">
                  <i className="bi bi-basket2 fs-4"></i>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div
  className="card dashboard-card shadow-sm h-100"
  style={{ cursor:"pointer" }}
  onClick={() => setShowPendingModal(true)}
>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <h6 className="text-muted">
                    Pending Requests
                  </h6>

                  <h2 className="fw-bold mb-0">
                    {pendingCount}
                  </h2>
                </div>

                <div className="icon-box bg-warning text-white">
                  <i className="bi bi-cart-check fs-4"></i>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div
  className="card dashboard-card shadow-sm h-100"
  style={{ cursor:"pointer" }}
  onClick={() => navigate("/admin/history")}
>
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center">

                <div>
                  <h6 className="text-muted">
                    Purchases
                  </h6>

                  <h2 className="fw-bold mb-0">
                    {purchasedCount}
                  </h2>
                </div>

                <div className="icon-box bg-danger text-white">
                  <i className="bi bi-clock-history fs-4"></i>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions */}

      <div className="card dashboard-card shadow-sm mb-4">

        <div className="card-header bg-white border-0">
          <h5 className="fw-bold mb-0">
            Quick Actions
          </h5>
        </div>

        <div className="card-body">

          <div className="row g-3">

            <div className="col-md-4">
              <button
                className="btn btn-primary w-100 py-3"
                onClick={() => navigate("/admin/items")}
              >
                <i className="bi bi-basket2 me-2"></i>
                Add Kitchen Item
              </button>
            </div>

            <div className="col-md-4">
              <button
                className="btn btn-warning text-white w-100 py-3"
                onClick={() => navigate("/admin/requests")}
              >
                <i className="bi bi-cart-check me-2"></i>
                Shopping Requests
              </button>
            </div>

            <div className="col-md-4">
              <button
                className="btn btn-secondary w-100 py-3"
                onClick={() => navigate("/admin/history")}
              >
                <i className="bi bi-clock-history me-2"></i>
                Purchase History
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Recent Activity */}

      <div className="card dashboard-card shadow-sm">

        <div className="card-header bg-white border-0">
          <h5 className="fw-bold mb-0">
            Recent Activity
          </h5>
        </div>

        <div className="card-body">

          {activities.length === 0 ? (

            <div className="text-center py-5 text-muted">
              No activity found.
            </div>

          ) : (

            <div className="list-group list-group-flush">

              {activities.map((activity) => (

                <div
                  key={activity.id}
                  className="list-group-item"
                >

                  <div className="fw-semibold">

                    🛒 {activity.requestedBy} requested{" "}
                    <strong>{activity.itemName}</strong>

                  </div>

                  <small className="text-muted">

                    {activity.requestedAt?.toDate
                      ? activity.requestedAt
                          .toDate()
                          .toLocaleString()
                      : ""}

                  </small>

                  {activity.status === "Purchased" && (

                    <>

                      <hr />

                      <div className="fw-semibold text-success">

                        ✅ {activity.purchasedBy} purchased{" "}
                        <strong>{activity.itemName}</strong>

                      </div>

                      <small className="text-muted">

                        {activity.purchasedAt?.toDate
                          ? activity.purchasedAt
                              .toDate()
                              .toLocaleString()
                          : ""}

                      </small>

                    </>

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