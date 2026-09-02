import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { subscribeToItems } from "../../services/itemService";
import DeleteRequestModal from "../../components/requests/DeleteRequestModal";
import StatusBadge from "../../components/common/StatusBadge";

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
        toast.warning("Request already added to list.");
        return;
      }

      await addRequest({
        itemId: item.id,
        itemName: item.name,
        requestedBy: user.name,
        requestedById: user.uid,
      });

      toast.success(`Added "${item.name}" to shopping list!`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  const handleRemoveRequest = async (request) => {
    try {
      await removePendingRequest(request);
      toast.success("Request removed from list.");
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

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending"
  );

  return (
    <DashboardLayout search={search} setSearch={setSearch}>
      {/* Header */}
      <div className="mb-4">
        <div
          className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
          style={{
            background: "var(--color-sage-tint)",
            border: "1px solid var(--color-sage-border)",
          }}
        >
          <i className="bi bi-cart-plus-fill text-sage"></i>
          <small className="fw-semibold text-sage" style={{ fontSize: "0.8rem" }}>
            Shopping List Manager
          </small>
        </div>

        <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
          Shopping Requests
        </h2>

        <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
          Select pantry items to request from the grocery store and manage your active shopping list.
        </p>
      </div>

      {/* Section 1: Kitchen Items to Request */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-basket2-fill text-sage"></i>
            <h5 className="mb-0 fw-bold" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
              Pantry Inventory Items
            </h5>
          </div>
          <span className="badge bg-secondary">
            {filteredItems.length} Items in Pantry
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="card-body p-0 d-none d-md-block">
          <div className="table-responsive border-0">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Kitchen Item</th>
                  <th width="200" className="text-end pe-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center text-muted py-5">
                      No matching pantry items found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td className="fw-semibold" style={{ color: "var(--text-main)" }}>
                        <i className="bi bi-basket me-2" style={{ color: "var(--color-amber)" }}></i>
                        {item.name}
                      </td>

                      <td className="text-end pe-4">
                        {item.status === "Available" ? (
                          <button
                            className="btn btn-success btn-sm px-3"
                            style={{ minWidth: "135px", whiteSpace: "nowrap" }}
                            onClick={() => handleRequest(item)}
                          >
                            <i className="bi bi-cart-plus me-1"></i>
                            Add to List
                          </button>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm px-3"
                            style={{ minWidth: "135px", opacity: 0.7, whiteSpace: "nowrap" }}
                            disabled
                          >
                            <i className="bi bi-check2 me-1"></i>
                            Requested
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

        {/* Mobile Card List View */}
        <div className="card-body p-3 d-md-none">
          {filteredItems.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No matching pantry items found.
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="pantry-card p-3 rounded-3"
                  style={{
                    background: "var(--bg-main)",
                    border: "1px solid var(--border-card)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0" style={{ color: "var(--text-main)", fontSize: "1.05rem" }}>
                      <i className="bi bi-basket me-2" style={{ color: "var(--color-amber)" }}></i>
                      {item.name}
                    </h6>
                  </div>

                  <div className="mt-2 pt-2 border-top d-flex justify-content-end" style={{ borderColor: "var(--border-subtle)" }}>
                    {item.status === "Available" ? (
                      <button
                        className="btn btn-success btn-sm px-3 w-100"
                        onClick={() => handleRequest(item)}
                      >
                        <i className="bi bi-cart-plus me-1"></i>
                        Add to Shopping List
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm px-3 w-100"
                        disabled
                        style={{ opacity: 0.7 }}
                      >
                        <i className="bi bi-check2 me-1"></i>
                        Already on Shopping List
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: My Active Requests (Pending Only) */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cart-check-fill" style={{ color: "var(--color-amber)" }}></i>
            <h5 className="mb-0 fw-bold" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
              My Active Requests
            </h5>
          </div>
          <span className="badge bg-warning">
            {pendingRequests.length} Pending
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="card-body p-0 d-none d-md-block">
          <div className="table-responsive border-0">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Requested Item</th>
                  <th width="160" className="text-center">Status</th>
                  <th width="180" className="text-end pe-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted py-5">
                      No active pending requests right now. Add items above to build your shopping list.
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="fw-semibold" style={{ color: "var(--text-main)" }}>
                        <i className="bi bi-cart-check me-2" style={{ color: "var(--color-amber)" }}></i>
                        {request.itemName}
                      </td>

                      <td className="text-center">
                        <StatusBadge status={request.status} />
                      </td>

                      <td className="text-end pe-4">
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card List View */}
        <div className="card-body p-3 d-md-none">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No active pending requests. Add items above to build your shopping list.
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="pantry-card p-3 rounded-3"
                  style={{
                    background: "var(--bg-main)",
                    border: "1px solid var(--border-card)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0" style={{ color: "var(--text-main)" }}>
                      <i className="bi bi-cart-check me-2" style={{ color: "var(--color-amber)" }}></i>
                      {request.itemName}
                    </h6>
                    <StatusBadge status={request.status} size="sm" />
                  </div>

                  <div className="mt-2 pt-2 border-top d-flex justify-content-end" style={{ borderColor: "var(--border-subtle)" }}>
                    <button
                      className="btn btn-outline-danger btn-sm px-3 w-100"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowDeleteModal(true);
                      }}
                    >
                      <i className="bi bi-trash3 me-1"></i> Remove from List
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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