import DashboardLayout from "../../components/layout/DashboardLayout";

function PurchaseHistory() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Purchase History</h2>
          <p className="text-muted mb-0">
            View all your completed shopping requests.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">

          <i
            className="bi bi-clock-history text-success"
            style={{ fontSize: "70px" }}
          ></i>

          <h3 className="mt-4 fw-bold">
            Purchase History
          </h3>

          <p className="text-muted mt-3 mb-4">
            This page will display all the items that have been purchased
            for your kitchen.
          </p>

          <div className="alert alert-info">
            🚧 This feature is under development.
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default PurchaseHistory;