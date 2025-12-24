import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ClinicProfile from '../pages/ClinicProfile'
import DentistProfile from '../pages/DentistProfile'
import BookingPage from '../pages/BookingPage'
import BookingStep1 from '../pages/booking/BookingStep1'
import BookingStep2 from '../pages/booking/BookingStep2'
import BookingStep3 from '../pages/booking/BookingStep3'
import BookingStep4 from '../pages/booking/BookingStep4'
import BookingStep5 from '../pages/booking/BookingStep5'
import BookingStep6 from '../pages/booking/BookingStep6'
import BookingSuccess from '../pages/booking/BookingSuccess'





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
                <Route path="/booking/:id/step-1" element={<BookingStep1 />} />
                <Route path="/booking/:id/step-2" element={<BookingStep2 />} />
                <Route path="/booking/:id/step-3" element={<BookingStep3 />} />
                <Route path="/booking/:id/step-4" element={<BookingStep4 />} />
                <Route path="/booking/:id/step-5" element={<BookingStep5 />} />
                <Route path="/booking/:id/step-6" element={<BookingStep6 />} />
                <Route path="/booking/success" element={<BookingSuccess />} />
            </Routes>
        </>
    )
}
export default App