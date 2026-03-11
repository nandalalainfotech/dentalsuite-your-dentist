import { Route, Routes, Navigate } from 'react-router-dom';
import { PracticeAuthProvider } from '../../hooks/usePracticeAuth';
import { PracticeUserProvider } from '../../context/PracticeUserContext';
import PracticeSignIn from '../../pages/practice/PracticeSignIn';
import PracticeSignUp from '../../pages/practice/PracticeSignUp';
import PracticeProtectedRoute from '../../components/practice/PracticeProtectedRoute';
import PracticeNavbar from '../../components/practice/PracticeNavbar';

// --- Import Layout ---
import PracticeDashboard from '../../pages/practice/PracticeDashboard';

// --- Import Views ---
import PracticeAppointmentsView from '../../pages/practice/PracticeOnlineBookings';
import PracticeDirectoryView from '../../pages/practice/PracticeDirectoryView';
import PracticeNewsFeeds from '../../pages/practice/PracticeNewsFeeds';
import PractiveViewProfile from '../../pages/practice/PractiveViewProfile';
import PracticeAppointmentType from '../../pages/practice/PracticeAppointmentType';
import PracticeBookingCalender from '../../pages/practice/PracticeBookingCalender';
import PracticeAnalyticsView from '../../pages/practice/PracticeAnalyticsView';
import PracticeInvoiceHistoryView from '../../pages/practice/PracticeInvoiceHistoryView';

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
            <Route index element={<Navigate to="directory" replace />} />

            <Route path="newsfeeds" element={<PracticeNewsFeeds />} />
            <Route path="view-profile" element={<PractiveViewProfile />} />
            <Route path="directory" element={<PracticeDirectoryView />} />
            <Route path="appointments" element={<PracticeAppointmentsView />} />
            <Route path="appointment-type" element={<PracticeAppointmentType />} />
            <Route path="booking-calendar" element={<PracticeBookingCalender />} />
            <Route path="analytics" element={<PracticeAnalyticsView />} />
            <Route path="invoice-history" element={<PracticeInvoiceHistoryView />} />
            
            {/* Fallback for unknown dashboard routes */}
            <Route path="*" element={<Navigate to="directory" replace />} />
          </Route>

          <Route path="forgot-password" element={<div>Forgot Password - Coming Soon</div>} />
        </Routes>
      </PracticeUserProvider>
    </PracticeAuthProvider>
  );
}

export default PracticeRoutes;