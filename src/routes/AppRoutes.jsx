import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

// ================= ADMIN =================
import AdminDashboard from "../pages/admin/Dashboard";
import KitchenItems from "../pages/admin/KitchenItems";
import ShoppingRequests from "../pages/admin/ShoppingRequests";
import PurchaseHistory from "../pages/admin/PurchaseHistory";

// ================= MOTHER =================
import MotherDashboard from "../pages/mother/Dashboard";
import MotherShoppingRequests from "../pages/mother/ShoppingRequests";
import MotherPurchaseHistory from "../pages/mother/PurchaseHistory";
import MotherAllRequests from "../pages/mother/AllRequests";

// ================= FATHER =================
import FatherDashboard from "../pages/father/Dashboard";

// ================= COMMON =================
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/items"
          element={
            <ProtectedRoute allowedRole="admin">
              <KitchenItems />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute allowedRole="admin">
              <ShoppingRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/history"
          element={
            <ProtectedRoute allowedRole="admin">
              <PurchaseHistory />
            </ProtectedRoute>
          }
        />

        {/* ================= MOTHER ================= */}

        <Route
          path="/mother"
          element={
            <ProtectedRoute allowedRole="mother">
              <MotherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mother/requests"
          element={
            <ProtectedRoute allowedRole="mother">
              <MotherShoppingRequests />
            </ProtectedRoute>
          }
        />

        <Route
  path="/mother/all-requests"
  element={
    <ProtectedRoute allowedRole="mother">
      <MotherAllRequests />
    </ProtectedRoute>
  }
/>

        <Route
          path="/mother/history"
          element={
            <ProtectedRoute allowedRole="mother">
              <MotherPurchaseHistory />
            </ProtectedRoute>
          }
        />

        {/* ================= FATHER ================= */}

        <Route
          path="/father"
          element={
            <ProtectedRoute allowedRole="father">
              <FatherDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;