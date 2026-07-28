import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import DashboardLayout from "../../components/layout/DashboardLayout";

import {
  getTotalRequests,
  getPendingRequestsCount,
  getPurchasedRequestsCount,
  getRecentRequests,
} from "../../services/requestService";

import { getOutOfStockItems } from "../../services/itemService";

function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    purchased: 0,
    outOfStock: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        total,
        pending,
        purchased,
        outOfStock,
        recent,
      ] = await Promise.all([
        getTotalRequests(),
        getPendingRequestsCount(),
        getPurchasedRequestsCount(),
        getOutOfStockItems(),
        getRecentRequests(),
      ]);

      setStats({
        total,
        pending,
        purchased,
        outOfStock,
      });

      setRecentRequests(recent);

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

        <div className="col-md-3">

          <div className="card dashboard-card shadow-sm">

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

        <div className="col-md-3">

          <div className="card dashboard-card shadow-sm border-0">

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

        <div className="col-md-3">

          <div className="card dashboard-card shadow-sm">

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

        <div className="col-md-3">

          <div className="card dashboard-card shadow-sm">

            <div className="card-body">

              <h6 className="text-muted">
                Out of Stock
              </h6>

              <h2 className="fw-bold text-danger">
                {stats.outOfStock}
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

    </DashboardLayout>
  );
}

export default Dashboard;