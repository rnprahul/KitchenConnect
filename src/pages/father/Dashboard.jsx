import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

import {
  getRequests,
  markAsPurchased,
} from "../../services/requestService";

import {
  updateItemStatus,
} from "../../services/itemService";

function FatherDashboard() {
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const loadRequests = async () => {
    try {
      setLoading(true);

      const data = await getRequests();

      const pendingRequests = data.filter(
        (request) => request.status === "Pending"
      );

      setRequests(pendingRequests);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handlePurchaseCompleted = async (request) => {
    try {
      await markAsPurchased(request.id, user.name);

      await updateItemStatus(
        request.itemId,
        "Available"
      );

      toast.success("Purchase completed successfully!");

      loadRequests();
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete purchase.");
    }
  };

  return (
    <DashboardLayout>

      {/* Welcome Card */}

      <div className="card dashboard-card shadow-sm mb-4">
        <div className="card-body">

          <h2 className="fw-bold text-success mb-2">
            Welcome, {user?.name}! 👋
          </h2>

          <p className="text-muted mb-1">
            Complete pending shopping requests and keep the kitchen updated.
          </p>

          <small className="text-secondary">
            Today: {today}
          </small>

        </div>
      </div>

      <h3 className="fw-bold mb-4">
        Pending Shopping Requests
      </h3>

      <div className="card dashboard-card shadow-sm border-0">

        <div className="card-body">

          {loading ? (
            <div className="text-center py-5">
              Loading...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No pending shopping requests.
            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Requested By</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {requests.map((request, index) => (
                    <tr key={request.id}>

                      <td>{index + 1}</td>

                      <td>{request.itemName}</td>

                      <td>{request.requestedBy}</td>

                      <td>
                        <span className="badge bg-warning text-dark">
                          Pending
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            handlePurchaseCompleted(request)
                          }
                        >
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