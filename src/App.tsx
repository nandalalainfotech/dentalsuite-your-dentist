import './App.css'
import Navbar from './components/layout/Navbar'
import AppRoutes from './routes/AppRoutes'
import { BookingProvider } from './contexts/BookingContext'

function App() {
  return (
    <BookingProvider>
      <Navbar />
      <AppRoutes />
    </BookingProvider>
   
  )
}
export default App
