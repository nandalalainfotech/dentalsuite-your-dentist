import './App.css'
import Navbar from './components/layout/Navbar'
import AppRoutes from './routes/AppRoutes'
import { BookingProvider } from './hooks/booking/useBookingContext'
import { FilterProvider } from './hooks/filters/useFilters'

function App() {
  return (
    <FilterProvider>
      <BookingProvider>
        <Navbar />
        <AppRoutes />
      </BookingProvider>
    </FilterProvider>

  )
}
export default App
