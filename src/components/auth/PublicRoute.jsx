import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../common/Loader";

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until Firebase finishes checking
  if (loading) {
    return <Loader />;
  }

  // Already logged in
  if (user) {
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

  // Not logged in
  return children;
}

export default PublicRoute;