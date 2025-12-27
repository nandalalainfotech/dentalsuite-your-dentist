import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../hooks/booking/useBookingContext";
import { useBookingDataLoader } from "../../hooks/booking/useBookingDataLoader";
import BookingSidebar from "./BookingSidebar";
import EmergencyModal from "../emergency/EmergencyModal";


const BookingStep1: React.FC = () => {
  const navigate = useNavigate();
  const { state, setAppointmentFor } = useBooking();
  const { loading, hasData } = useBookingDataLoader();
  const [referrer, setReferrer] = useState<string>("");

  const handleSelection = (appointmentFor: "myself" | "someone-else") => {
    setAppointmentFor(appointmentFor);
    navigate(`/booking/${state.dentistId}/step-2`);
  };

  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    const storedReferrer = sessionStorage.getItem('bookingReferrer');
    if (storedReferrer) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReferrer(storedReferrer);
    } else if (document.referrer) {
      setReferrer(document.referrer);
    }
  }, []);

  const handleBack = () => {
    const dentistId = state.dentistId;

    console.log('BookingStep1 handleBack - referrer:', referrer);
    if (referrer) {
      if (referrer.includes('/clinicprofile/')) {
        navigate(referrer);
        sessionStorage.removeItem('bookingReferrer');
        return;
      } else if (referrer.includes('/dentist/')) {
        navigate(referrer);
        sessionStorage.removeItem('bookingReferrer');
        return;
      }
    }
    if (dentistId) {
      navigate(`/dentist/${dentistId}`);
    } else {
      navigate("/");
    }
  };

  if (loading || !hasData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-100 border-t-orange-600 mx-auto"></div>
          <p className="text-gray-500 font-medium animate-pulse">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Sidebar */}
      <BookingSidebar currentStep={2} />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-10 lg:p-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Top Navigation */}
          <nav className="flex items-center justify-between border-b border-gray-200 pb-3 mb-10">
            {/* Back */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
            >
              <i className="bi bi-arrow-left text-base"></i>
              Back
            </button>

            <button
              onClick={() => setShowEmergency(true)}
              className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              <i className="bi bi-exclamation-triangle-fill text-base"></i>
              Is this an emergency?
            </button>
          </nav>
          <div className="max-w-4xl mx-auto animate__animated animate__slideInUp animate__faster">
            <div className="space-y-10 animate-in fade-in duration-500">
              <section>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Who is this appointment for?
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSelection("myself")}
                    className="p-5 md:p-6 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 group border-gray-200 hover:border-orange-500 hover:bg-white/80"
                  >
                    <div>
                      <span className="block font-semibold text-gray-900">
                        For Myself
                      </span>
                      <span className="text-xs text-gray-500">
                        I am the patient
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelection("someone-else")}
                    className="p-5 md:p-6 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 group border-gray-200 hover:border-orange-500 hover:bg-white/80"
                  >
                    <div>
                      <span className="block font-semibold text-gray-900">
                        Someone else
                      </span>
                      <span className="text-xs text-gray-500">
                        Booking for family member or others
                      </span>
                    </div>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <EmergencyModal
        open={showEmergency}
        onClose={() => setShowEmergency(false)}
      />

    </div>
  );
};

export default BookingStep1;
