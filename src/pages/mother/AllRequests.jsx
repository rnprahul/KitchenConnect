import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

import { getRequestsByUser } from "../../services/requestService";


function AllRequests() {

  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    if (!user) return;

    const loadRequests = async () => {

      try {

        const data = await getRequestsByUser(
          user.name
        );

        setRequests(data);

      } catch(error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };


    loadRequests();

  }, [user]);


  return (

    <DashboardLayout>


      {/* Header */}

      <div className="mb-4">

        <h2 className="fw-bold">
          All Shopping Requests
        </h2>

        <p className="text-muted mb-0">
          View all your requested kitchen items and their status.
        </p>

      </div>



      {/* Card */}

      <div className="card shadow-sm border-0">

        <div className="card-body">


          {loading ? (

            <div className="text-center py-5">

              <div className="spinner-border text-success">
              </div>

              <p className="mt-3">
                Loading requests...
              </p>

            </div>


          ) : requests.length === 0 ? (


            <div className="text-center py-5">

              <i className="bi bi-cart-x fs-1 text-muted"></i>

              <h5 className="mt-3">
                No Requests Found
              </h5>

            </div>


          ) : (


            <div className="table-responsive">

              <table className="table table-hover align-middle">


                <thead className="table-light">

                  <tr>

                    <th>#</th>

                    <th>Item</th>

                    <th>Status</th>

                    <th>Requested Date</th>

                  </tr>

                </thead>


                <tbody>


                {requests.map((request,index)=>(


                  <tr key={request.id}>


                    <td>
                      {index + 1}
                    </td>


                    <td className="fw-semibold">

                      <i className="bi bi-cart-check text-success me-2"></i>

                      {request.itemName}

                    </td>


                    <td>

                      {request.status === "Pending" ? (

                        <span className="badge bg-warning text-dark px-3 py-2">
                          Pending
                        </span>

                      ) : (

                        <span className="badge bg-success px-3 py-2">
                          Purchased
                        </span>

                      )}

                    </td>


                    <td>

                      {request.requestedAt?.toDate ? (

                        request.requestedAt
                        .toDate()
                        .toLocaleDateString(
                          "en-IN",
                          {
                            day:"2-digit",
                            month:"short",
                            year:"numeric"
                          }
                        )

                      ) : (

                        "-"

                      )}

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


export default AllRequests;