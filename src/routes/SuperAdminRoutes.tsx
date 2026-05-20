import { Routes, Route } from "react-router-dom";
import Clients from "../pages/superadmin/pages/Clients";
import SuperAdminDashboard from "../pages/superadmin/pages/SuperAdminDashboard";
import RoleProtectedRoute from "./RoleProtectedRoute";
import Usersettings from "../pages/superadmin/pages/Usersettings";
import SuperAdminSupport from "../pages/superadmin/pages/SuperAdminSupport";
import AllServices from "../pages/superadmin/pages/AllServices";
import SuperadminInvoiceDispute from "../pages/superadmin/pages/SuperadminInvoiceDispute";
import PaymentSettings from "../pages/superadmin/pages/PaymentSettings";

export default function SuperAdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <RoleProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <SuperAdminDashboard />
          </RoleProtectedRoute>
        }
      >
        {/* Default page when opening /superadmin */}
        <Route index element={<Clients />} />

        {/* Sidebar route */}
        <Route path="clients" element={<Clients />} />
        <Route path="usersettings" element={<Usersettings />} />
        <Route path="support" element={<SuperAdminSupport />} />
        <Route path="allservices" element={<AllServices />} />
        <Route path="invoice-dispute" element={<SuperadminInvoiceDispute />} />
        <Route path="payment-settings" element={<PaymentSettings />} />
      </Route>
    </Routes>
  );
}