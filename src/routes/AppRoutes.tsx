import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ClinicProfile from '../pages/ClinicProfile'
import DentistProfile from '../pages/DentistProfile'
import BookingPage from '../pages/BookingPage'





function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/clinicprofile/:id" element={<ClinicProfile />} />
                <Route path="/dentist/:id" element={<DentistProfile />} />
                <Route path="/booking/:id" element={<BookingPage />} />
            </Routes>
        </>
    )
}
export default App