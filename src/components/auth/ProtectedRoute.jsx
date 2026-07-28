import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  // Wait until Firebase checks the login state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4>Loading...</h4>
      </div>
    );
  }

  // User not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // User logged in but wrong role
  if (user.role !== allowedRole) {
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;

      case "mother":
        return <Navigate to="/mother" replace />;

      case "father":
        return <Navigate to="/father" replace />;

      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;