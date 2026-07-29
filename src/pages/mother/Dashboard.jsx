import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PendingRequestModal from "../../components/dashboard/PendingRequestModal";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getTotalRequests,
  getPendingRequestsCount,
  getPurchasedRequestsCount,
  getRecentRequests,
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

  if(user){
    loadDashboard();
  }

}, [user]);

  const loadDashboard = async () => {
    try {
      const [
  total,
  pending,
  purchased,
  recent,
] = await Promise.all([
  getTotalRequests(),
  getPendingRequestsCount(),
  getPurchasedRequestsCount(),
  getRecentRequests(),
]);

      setStats({
        total,
        pending,
        purchased,
      });

      setRecentRequests(recent);

      const userRequests = await getRequestsByUser(user.name);

setPendingRequests(
  userRequests.filter(
    (request) => request.status === "Pending"
  )
);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardLayout>

      {/* Welcome */}

      <div className="card shadow-sm dashboard-card mb-4">
        <div className="card-body">

          <h2 className="fw-bold text-success">
            Welcome, {user?.name} 👋
          </h2>

          <p className="text-muted mb-0">
            Manage your kitchen shopping requests.
          </p>

        </div>
      </div>

      {/* Statistics */}

      <div className="row g-4 mb-4">

        <div className="col-md-4">

          <div
  className="card dashboard-card shadow-sm"
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/mother/all-requests")}
>

            <div className="card-body">

              <h6 className="text-muted">
                Total Requests
              </h6>

              <h2 className="fw-bold">
                {stats.total}
              </h2>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div
  className="card dashboard-card shadow-sm border-0"
  style={{ cursor: "pointer" }}
  onClick={() => setShowPendingModal(true)}
>

            <div className="card-body">

              <h6 className="text-muted">
                Pending
              </h6>

              <h2 className="fw-bold text-warning">
                {stats.pending}
              </h2>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div
  className="card dashboard-card shadow-sm"
  style={{ cursor: "pointer" }}
  onClick={() => navigate("/mother/history")}
  >

            <div className="card-body">

              <h6 className="text-muted">
                Purchased
              </h6>

              <h2 className="fw-bold text-success">
                {stats.purchased}
              </h2>

            </div>

          </div>

        </div>


      </div>

      {/* Recent Requests */}

      <div className="card shadow-sm dashboard-card">

        <div className="card-header bg-white">

          <h5 className="mb-0">
            Recent Shopping Requests
          </h5>

        </div>

        <div className="card-body">

          {recentRequests.length === 0 ? (

            <div className="text-center py-5">

              <i className="bi bi-cart-x fs-1 text-muted"></i>

              <h5 className="mt-3">
                No Requests Yet
              </h5>

            </div>

          ) : (

            <table className="table">

              <thead>

                <tr>

                  <th>Item</th>

                  <th>Status</th>

                </tr>

              </thead>

              <tbody>

                {recentRequests.map((request) => (

                  <tr key={request.id}>

                    <td>{request.itemName}</td>

                    <td>

                      {request.status === "Pending" ? (

                        <span className="badge bg-warning rounded-pill text-dark px-3 py-2">
                          Pending
                        </span>

                      ) : (

                        <span className="badge bg-success rounded-pill px-3 py-2">
                          Purchased
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

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