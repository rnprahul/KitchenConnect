import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { subscribeToItems } from "../../services/itemService";
import DeleteRequestModal from "../../components/requests/DeleteRequestModal";

import {
  addRequest,
  removePendingRequest,
  subscribeToRequestsByUser,
} from "../../services/requestService";

function ShoppingRequests() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribeItems = subscribeToItems((itemsData) => {
      setItems(itemsData);
    });

    const unsubscribeRequests = subscribeToRequestsByUser(
      user.name,
      (requestsData) => {
        setRequests(requestsData);
      }
    );

    return () => {
      unsubscribeItems();
      unsubscribeRequests();
    };
  }, [user]);

  const handleRequest = async (item) => {
    try {
      const exists = requests.find(
        (request) =>
          request.itemId === item.id &&
          request.status === "Pending"
      );

      if (exists) {
        toast.warning("Request already sent.");
        return;
      }

      await addRequest({
        itemId: item.id,
        itemName: item.name,
        requestedBy: user.name,
        requestedById: user.uid,
      });

      toast.success("Request added to shopping list.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  const handleRemoveRequest = async (request) => {
    try {
      await removePendingRequest(request);
      toast.success("Request removed successfully.");
      setShowDeleteModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove request.");
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout search={search} setSearch={setSearch}>
      {/* Header */}
      <div className="mb-4">
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(52, 211, 153, 0.3)" }}>
          <i className="bi bi-cart-plus-fill text-emerald"></i>
          <small className="text-emerald fw-semibold" style={{ fontSize: "0.8rem" }}>
            Shopping List Manager
          </small>
        </div>

        <h2 className="fw-bold text-light mb-1">
          Shopping Requests
        </h2>

        <p className="text-secondary mb-0" style={{ fontSize: "0.95rem" }}>
          Select pantry items to request from the grocery store and manage active shopping items.
        </p>
      </div>

      {/* Kitchen Items Section */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-basket2-fill text-success"></i>
            <h5 className="mb-0 fw-bold text-light" style={{ fontSize: "1.1rem" }}>
              Pantry Inventory List
            </h5>
          </div>
          <span className="badge bg-secondary rounded-pill">
            {filteredItems.length} Available Items
          </span>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Kitchen Item</th>
                  <th width="160" className="text-center">Status</th>
                  <th width="200" className="text-center pe-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-secondary py-5">
                      No matching kitchen items available.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold text-light">
                        <i className="bi bi-basket me-2 text-warning"></i>
                        {item.name}
                      </td>

                      <td className="text-center">
                        {item.status === "Available" ? (
                          <span className="badge bg-success rounded-pill">
                            <i className="bi bi-check2 me-1"></i>
                            Available
                          </span>
                        ) : (
                          <span className="badge bg-warning rounded-pill text-dark">
                            <i className="bi bi-clock me-1"></i>
                            Requested
                          </span>
                        )}
                      </td>

                      <td className="text-center pe-4">
                        {item.status === "Available" ? (
                          <button
                            className="btn btn-primary btn-sm px-3"
                            style={{ minWidth: "140px", whiteSpace: "nowrap" }}
                            onClick={() => handleRequest(item)}
                          >
                            <i className="bi bi-cart-plus me-1"></i>
                            Add to List
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm px-3"
                            style={{ minWidth: "140px", opacity: 0.6, whiteSpace: "nowrap" }}
                            disabled
                          >
                            <i className="bi bi-check2 me-1"></i>
                            Already Requested
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* My Requests Section */}
      <div className="card shadow-sm border-0">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-bookmark-check-fill text-primary"></i>
            <h5 className="mb-0 fw-bold text-light" style={{ fontSize: "1.1rem" }}>
              My Active Requests
            </h5>
          </div>
          <span className="badge bg-secondary rounded-pill">
            {requests.length} Requests
          </span>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Requested Item</th>
                  <th width="160" className="text-center">Status</th>
                  <th width="180" className="text-center pe-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-secondary py-5">
                      No active requests yet. Add items above to build your shopping list.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request.id}>
                      <td className="fw-semibold text-light">
                        <i className="bi bi-cart-check me-2 text-warning"></i>
                        {request.itemName}
                      </td>

                      <td className="text-center">
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

                      <td className="text-center pe-4">
                        {request.status === "Pending" ? (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowDeleteModal(true);
                            }}
                          >
                            <i className="bi bi-trash3 me-1"></i>
                            Remove
                          </button>
                        ) : (
                          <span className="badge bg-secondary">
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DeleteRequestModal
        show={showDeleteModal}
        request={selectedRequest}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleRemoveRequest}
      />
    </DashboardLayout>
  );
}

export default ShoppingRequests;