import { Routes, Route } from "react-router-dom";
import Clients from "../pages/superadmin/pages/Clients";
import SuperAdminDashboard from "../pages/superadmin/pages/SuperAdminDashboard";
import RoleProtectedRoute from "./RoleProtectedRoute";
import Usersettings from "../pages/superadmin/pages/Usersettings";

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
      </Route>
    </Routes>
  );
}