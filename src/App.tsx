import './App.css'
import Navbar from './components/layout/Navbar'
import AppRoutes from './routes/AppRoutes'
import { BookingProvider } from './contexts/BookingContext'
import { FilterProvider } from './contexts/FilterContext'

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
