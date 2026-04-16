import { Route, Routes, Navigate } from 'react-router-dom';
import { PracticeAuthProvider } from '../hooks/usePracticeAuth';
import { PracticeUserProvider } from '../context/PracticeUserContext';
import PracticeSignIn from '../pages/practice/auth/pages/PracticeSignIn';
import PracticeSignUp from '../pages/practice/auth/pages/PracticeSignUp';
import PracticeProtectedRoute from '../components/practice/PracticeProtectedRoute';
import PracticeNavbar from '../components/practice/PracticeNavbar';

// --- Import Layout ---
import PracticeDashboard from '../pages/practice/dashboard/pages/PracticeDashboard';

// --- Import Views ---
import PracticeDirectoryView from '../pages/practice/directory/pages/PracticeDirectoryView';
import PractiveViewProfile from '../pages/practice/dashboard/pages/PractiveViewProfile';
import PracticeAppointmentType from '../pages/practice/dashboard/pages/PracticeAppointmentType';
import PracticeBookingCalendar from '../pages/practice/dashboard/pages/PracticeBookingCalendar';
import PracticeAnalyticsView from '../pages/practice/dashboard/pages/PracticeAnalyticsView';
import PracticeInvoiceHistoryView from '../pages/practice/PracticeInvoiceHistoryView';
import PracticeOnlineBookings from '../pages/practice/dashboard/pages/PracticeOnlineBookings';
import PracticeSupport from '../pages/practice/support/components/PracticeSupport';
import PracticeUserAccount from '../pages/practice/useraccount/components/PracticeUserAccount';

function DashboardLayout() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <PracticeNavbar />
      <PracticeDashboard />
    </div>
  );
}

function PracticeRoutes() {
  return (
    <PracticeAuthProvider>
      <PracticeUserProvider>
        <Routes>
          <Route path="signin" element={<PracticeSignIn />} />
          <Route path="signup" element={<PracticeSignUp />} />

          {/* DASHBOARD ROUTES */}
          <Route
            path="dashboard"
            element={
              <PracticeProtectedRoute>
                <DashboardLayout />
              </PracticeProtectedRoute>
            }
          >
            {/* --- NESTED ROUTES (Rendered inside PracticeDashboard's Outlet) --- */}

            {/* Default: Redirect /practice/dashboard -> /practice/dashboard/appointments */}
            <Route index element={<Navigate to="view-profile" replace />} />

            <Route path="view-profile" element={<PractiveViewProfile />} />
            <Route path="directory" element={<PracticeDirectoryView />} />
            <Route path="appointments" element={<PracticeOnlineBookings />} />
            <Route path="appointment-type" element={<PracticeAppointmentType />} />
            <Route path="booking-calendar" element={<PracticeBookingCalendar />} />
            <Route path="analytics" element={<PracticeAnalyticsView />} />
            <Route path="invoice-history" element={<PracticeInvoiceHistoryView />} />
            <Route path="support" element={<PracticeSupport />} />
            <Route path="user-accounts" element={<PracticeUserAccount />} />

            {/* Fallback for unknown dashboard routes */}
            <Route path="*" element={<Navigate to="view-profile" replace />} />
          </Route>

          <Route path="forgot-password" element={<div>Forgot Password - Coming Soon</div>} />
        </Routes>
      </PracticeUserProvider>
    </PracticeAuthProvider>
  );
}

export default PracticeRoutes;