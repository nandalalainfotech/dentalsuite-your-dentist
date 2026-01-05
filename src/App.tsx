import './App.css'
import Navbar from './components/layout/Navbar'
import AppRoutes from './routes/AppRoutes'
import { BookingProvider } from './hooks/booking/useBookingContext'
import { FilterProvider } from './hooks/filters/useFilters'
import { AuthProvider } from './hooks/useAuth'

function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <BookingProvider>
          <Navbar />
          <AppRoutes />
        </BookingProvider>
      </FilterProvider>
    </AuthProvider>

  )
}
export default App
