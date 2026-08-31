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
    setLoading(true);

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
      toast.success("Shopping request deleted successfully");
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
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(251, 191, 36, 0.3)" }}>
            <i className="bi bi-cart-fill text-warning"></i>
            <small className="text-warning fw-semibold" style={{ fontSize: "0.8rem" }}>
              Request Queue
            </small>
          </div>

          <h2 className="fw-bold text-light mb-1">
            Shopping Requests
          </h2>

          <p className="text-secondary mb-0" style={{ fontSize: "0.95rem" }}>
            Monitor and manage all shopping requests created by household members.
          </p>
        </div>
      </div>

      {/* Request Table */}
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