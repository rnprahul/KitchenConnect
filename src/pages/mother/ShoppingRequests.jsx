import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  subscribeToItems,
  updateItemStatus,
} from "../../services/itemService";
import DeleteRequestModal from "../../components/requests/DeleteRequestModal";
import StatusBadge from "../../components/common/StatusBadge";
import QuantityCounter from "../../components/requests/QuantityCounter";
import { filterAndSortBySearch } from "../../utils/searchUtils";

import {
  addRequest,
  removePendingRequest,
  subscribeToRequestsByUser,
  updateRequestQuantity,
} from "../../services/requestService";

function ShoppingRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending"
  );

  // Active request check: an item is actively requested if there is an active Pending request for it
  const isItemRequested = (item) => {
    return pendingRequests.some((request) => request.itemId === item.id);
  };

  // Auto-heal items that were left stuck as "Requested" in the database when no pending request exists
  useEffect(() => {
    if (!user || !items.length) return;

    const staleItems = items.filter((item) => {
      if (item.status !== "Requested") return false;
      const hasPending = requests.some(
        (r) => r.itemId === item.id && r.status === "Pending"
      );
      return !hasPending;
    });

    if (staleItems.length > 0) {
      staleItems.forEach((staleItem) => {
        updateItemStatus(staleItem.id, "Available").catch((err) => {
          console.warn(`Could not sync item status for ${staleItem.name}:`, err);
        });
      });
    }
  }, [items, requests, user]);

  // Immediate add with default count 1 (no modal popup)
  const handleRequest = async (item) => {
    try {
      const exists = pendingRequests.some(
        (request) => request.itemId === item.id
      );

      if (exists) {
        toast.warning("Request already added to list.");
        return;
      }

      await addRequest({
        itemId: item.id,
        itemName: item.name,
        quantity: 1,
        requestedBy: user.name,
        requestedById: user.uid,
      });

      toast.success(`Added "${item.name}" to shopping list!`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  const handleQuantityChange = async (request, newCount) => {
    try {
      await updateRequestQuantity(request, newCount);
      toast.info(`Updated count to ${newCount}`);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update count");
    }
  };

  const handleRemoveRequest = async (request) => {
    try {
      setShowDeleteModal(false);
      setSelectedRequest(null);
      await removePendingRequest(request);
      toast.success("Request removed from list.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove request.");
    }
  };

  // Prefix-prioritized search: items starting with the search query appear at the top
  const filteredItems = filterAndSortBySearch(items, search, "name");

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
          Select pantry items to request from the grocery store. Manage quantities in the Pending Requests section.
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
                        {!isItemRequested(item) ? (
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
              {filteredItems.map((item) => {
                const isRequested = isItemRequested(item);
                return (
                  <div
                    key={item.id}
                    className="px-3 py-2 rounded-3 d-flex flex-row justify-content-between align-items-center"
                    style={{
                      background: "var(--bg-main)",
                      border: "1px solid var(--border-card)",
                      minHeight: "50px",
                      width: "100%",
                      boxShadow: "var(--shadow-xs)",
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 me-2 overflow-hidden text-start">
                      <i
                        className="bi bi-basket"
                        style={{ color: "var(--color-amber)", fontSize: "1rem", flexShrink: 0 }}
                      ></i>
                      <span
                        className="fw-semibold text-truncate"
                        style={{ color: "var(--text-main)", fontSize: "0.95rem" }}
                      >
                        {item.name}
                      </span>
                    </div>

                    <div className="flex-shrink-0 ms-2">
                      {!isRequested ? (
                        <button
                          type="button"
                          className="btn btn-success btn-sm rounded-circle d-flex align-items-center justify-content-center p-0"
                          style={{
                            width: "36px",
                            height: "36px",
                            minWidth: "36px",
                            flexShrink: 0,
                          }}
                          onClick={() => handleRequest(item)}
                          aria-label={`Add ${item.name} to shopping list`}
                          title={`Add ${item.name} to shopping list`}
                        >
                          <i className="bi bi-plus-lg" style={{ fontSize: "1.1rem" }}></i>
                        </button>
                      ) : (
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "36px",
                            height: "36px",
                            minWidth: "36px",
                            flexShrink: 0,
                            background: "var(--border-subtle)",
                            color: "var(--text-muted)",
                          }}
                          aria-label={`${item.name} already requested`}
                          title={`${item.name} already requested`}
                          role="status"
                        >
                          <i className="bi bi-check-lg" style={{ fontSize: "1.2rem", fontWeight: "bold" }}></i>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: My Active Requests (Pending Only) */}
      <div className="card mb-4 mb-lg-0">
        <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-cart-check-fill" style={{ color: "var(--color-amber)" }}></i>
            <h5 className="mb-0 fw-bold" style={{ fontSize: "1.05rem", color: "var(--text-main)" }}>
              My Active Requests
            </h5>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-success btn-sm px-2 py-1 d-inline-flex align-items-center gap-1"
              style={{ fontSize: "0.8rem" }}
              onClick={() => navigate("/mother/pending-requests")}
            >
              <span>Open Pending Page</span>
              <i className="bi bi-arrow-right"></i>
            </button>
            <span className="badge bg-warning">
              {pendingRequests.length} Pending
            </span>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="card-body p-0 d-none d-md-block">
          <div className="table-responsive border-0">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Requested Item</th>
                  <th width="240" className="text-center">Count</th>
                  <th width="150" className="text-center">Status</th>
                  <th width="140" className="text-end pe-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {pendingRequests.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-5">
                      No active pending requests right now. Add items above to build your shopping list.
                    </td>
                  </tr>
                ) : (
                  pendingRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="fw-semibold" style={{ color: "var(--text-main)" }}>
                        <i className="bi bi-cart-check me-2" style={{ color: "var(--color-amber)" }}></i>
                        <span>{request.itemName}</span>
                      </td>

                      <td className="text-center">
                        <QuantityCounter
                          value={request.quantity || 1}
                          onChange={(newCount) =>
                            handleQuantityChange(request, newCount)
                          }
                        />
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
        <div className="card-body p-3 pb-3 pb-sm-4 d-md-none">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No active pending requests. Add items above to build your shopping list.
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="px-3 py-2 rounded-3 d-flex flex-column gap-2"
                  style={{
                    background: "var(--bg-main)",
                    border: "1px solid var(--border-card)",
                    boxShadow: "var(--shadow-xs)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-1 overflow-hidden text-start">
                      <i
                        className="bi bi-cart-check"
                        style={{ color: "var(--color-amber)", fontSize: "1rem", flexShrink: 0 }}
                      ></i>
                      <span
                        className="fw-semibold text-truncate"
                        style={{ color: "var(--text-main)", fontSize: "0.95rem" }}
                      >
                        {request.itemName}
                      </span>
                    </div>

                    <StatusBadge status={request.status} size="sm" />
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: "var(--border-subtle)" }}>
                    <QuantityCounter
                      value={request.quantity || 1}
                      size="sm"
                      onChange={(newCount) =>
                        handleQuantityChange(request, newCount)
                      }
                    />

                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm px-2 py-1 d-flex align-items-center gap-1"
                      style={{ fontSize: "0.8rem" }}
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowDeleteModal(true);
                      }}
                      aria-label={`Remove ${request.itemName}`}
                    >
                      <i className="bi bi-trash3"></i>
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete / Remove Modal */}
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
