import './App.css'
import Navbar from './components/layout/Navbar'
import AppRoutes from './routes/AppRoutes'
import { BookingProvider } from './hooks/booking/useBookingContext'
import { FilterProvider } from './hooks/filters/useFilters'
import { AuthProvider } from './hooks/useAuth'
import { useLocation } from 'react-router-dom'

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/list-your-practice'];
  const isPracticeRoute = location.pathname.startsWith('/practice');
  const booking = location.pathname.startsWith('/bookings')
  const shouldHideNavbar = booking || isPracticeRoute || hideNavbarRoutes.includes(location.pathname);
  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </FilterProvider>
    </AuthProvider>
  )
}
export default App
