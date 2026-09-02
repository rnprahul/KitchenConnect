import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";

import RequestTable from "../../components/requests/RequestTable";
import DeleteRequestModal from "../../components/requests/DeleteRequestModal";

import {
  subscribeToRequests,
  deleteRequest,
} from "../../services/requestService";

function ShoppingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Load Requests
  useEffect(() => {
    const unsubscribe = subscribeToRequests((data) => {
      setRequests(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Delete Request
  const handleDeleteClick = (request) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRequest(id);
      toast.success("Shopping request removed successfully");
      setShowDeleteModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
            style={{
              background: "var(--color-amber-light)",
              border: "1px solid #fde68a",
            }}
          >
            <i className="bi bi-cart-fill" style={{ color: "var(--color-amber)" }}></i>
            <small className="fw-semibold" style={{ fontSize: "0.8rem", color: "var(--color-amber)" }}>
              Shopping Queue
            </small>
          </div>

          <h2 className="fw-bold mb-1" style={{ color: "var(--text-main)" }}>
            Shopping Requests
          </h2>

          <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
            Monitor and manage all household shopping requests submitted for grocery runs.
          </p>
        </div>
      </div>

      {/* Request Table / Cards */}
      <RequestTable
        requests={requests}
        loading={loading}
        showDelete={true}
        onDelete={handleDeleteClick}
      />

      {/* Delete Modal */}
      <DeleteRequestModal
        show={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedRequest(null);
        }}
        onConfirm={() => selectedRequest && handleDelete(selectedRequest.id)}
        request={selectedRequest}
      />
    </DashboardLayout>
  );
}

export default ShoppingRequests;