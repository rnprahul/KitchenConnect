import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../../components/layout/DashboardLayout";

import { useAuth } from "../../context/AuthContext";

import { subscribeToItems, } from "../../services/itemService";

import {
  addRequest,
  subscribeToRequestsByUser,
} from "../../services/requestService";

function ShoppingRequests() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {

  if (!user) return;

  const unsubscribeItems =
    subscribeToItems((itemsData) => {
      setItems(itemsData);
    });

  const unsubscribeRequests =
    subscribeToRequestsByUser(
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

      toast.success("Request sent.");

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  const outOfStockItems = items.filter(
    (item) => item.status === "Out of Stock"
  );

  return (
    <DashboardLayout>

      <h2 className="mb-4 text-center text-md-start">
        Shopping Requests
      </h2>

      {/* Out of Stock Items */}

      <div className="card mb-4">

        <div className="card-header text-center text-md-start">
          <span className="fw-bold text-danger">
    Out of Stock Items
  </span>
        </div>

        <div className="card-body">
          <div className="table-responsive">

          <table className="table table-hover align-middle">

            <thead>

              <tr>
                <th>Item</th>
                <th></th>
              </tr>

            </thead>

            <tbody>

              {outOfStockItems.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center text-muted">
                    No items are out of stock.
                  </td>
                </tr>
              ) : (
                outOfStockItems.map((item) => (
                  <tr key={item.id}>

                    <td>{item.name}</td>

                    <td >
                      <>
  <button
    className="btn btn-primary btn-sm px-3"
    onClick={() => handleRequest(item)}
  >
    Request
  </button>

  {requests.some(
    (request) =>
      request.itemId === item.id &&
      request.status === "Pending"
  ) && (
    <small
      className="ms-2 text-muted"
      style={{ fontStyle: "italic" }}
    >
      (requested)
    </small>
  )}
</>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>
          </div>

        </div>

      </div>

      {/* My Requests */}

      <div className="card">
        <div className="table-responsive">

        <div className="card-header text-center text-md-start">
          <span className="fw-bold text-primary">
    My Requests
  </span>
        </div>

        <div className="card-body">

          <table className="table table-hover align-middle">

            <thead>

              <tr>
                <th>Item</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {requests.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center text-muted">
                    No requests yet.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id}>

                    <td>{request.itemName}</td>

                    <td>
                      {request.status === "Pending" ? (
                        <span className="badge bg-warning text-dark">
                          Pending
                        </span>
                      ) : (
                        <span className="badge bg-success">
                          Purchased
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

    </DashboardLayout>
  );
}

export default ShoppingRequests;