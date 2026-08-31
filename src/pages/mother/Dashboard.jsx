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

  return (
    <DashboardLayout>
      {/* Welcome Hero */}
      <div className="card dashboard-card mb-4 position-relative overflow-hidden">
        <div className="card-body p-4 p-md-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
            <span className="rounded-circle bg-success pulse-emerald d-inline-block" style={{ width: "8px", height: "8px" }} />
            <small className="text-emerald fw-semibold" style={{ fontSize: "0.8rem" }}>
              Mother's Kitchen Portal
            </small>
          </div>

          <h1 className="fw-bold text-light mb-2" style={{ fontSize: "2rem" }}>
            Welcome back, {user?.name}! 👋
          </h1>

          <p className="text-secondary mb-0" style={{ fontSize: "1rem" }}>
            Quickly check pantry stock and request essential ingredients for the kitchen.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div
            className="card dashboard-card h-100"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/mother/all-requests")}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: "0.88rem" }}>
                    Total Requests
                  </span>
                  <h2 className="fw-bold text-light mb-0">{stats.total}</h2>
                  <small className="text-primary mt-2 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.8rem" }}>
                    <i className="bi bi-list-check"></i> View all requests
                  </small>
                </div>
                <div className="icon-box bg-primary text-white">
                  <i className="bi bi-cart3 fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
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
                  <h2 className="fw-bold text-warning mb-0">{stats.pending}</h2>
                  <small className="text-warning mt-2 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.8rem" }}>
                    <i className="bi bi-clock"></i> View pending list
                  </small>
                </div>
                <div className="icon-box bg-warning text-white">
                  <i className="bi bi-hourglass-split fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card dashboard-card h-100"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/mother/history")}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: "0.88rem" }}>
                    Purchased
                  </span>
                  <h2 className="fw-bold text-emerald mb-0">{stats.purchased}</h2>
                  <small className="text-emerald mt-2 d-inline-flex align-items-center gap-1" style={{ fontSize: "0.8rem" }}>
                    <i className="bi bi-check2-all"></i> View history
                  </small>
                </div>
                <div className="icon-box bg-success text-white">
                  <i className="bi bi-bag-check fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shopping Requests */}
      <div className="card shadow-sm border-0">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cart-check-fill text-success"></i>
            <h5 className="mb-0 fw-bold text-light" style={{ fontSize: "1.1rem" }}>
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
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#94a3b8",
                }}
              >
                <i className="bi bi-cart-x fs-1"></i>
              </div>
              <h5 className="mt-2 text-light fw-bold">No Requests Yet</h5>
              <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
                Add out-of-stock items to your shopping list to get started.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th width="160">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="fw-semibold text-light">
                        <i className="bi bi-basket2 me-2 text-warning"></i>
                        {request.itemName}
                      </td>

                      <td>
                        {request.status === "Pending" ? (
                          <span className="badge bg-warning rounded-pill text-dark">
                            <i className="bi bi-hourglass-split me-1"></i>
                            Pending
                          </span>
                        ) : (
                          <span className="badge bg-success rounded-pill">
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