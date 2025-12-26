import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../contexts/BookingContext";
import BookingSidebar from "./BookingSidebar";
import EmergencyModal from "../EmergencyModal";


const BookingStep1: React.FC = () => {
  const navigate = useNavigate();
  const { state, setAppointmentFor } = useBooking();

  const handleSelection = (appointmentFor: "myself" | "someone-else") => {
    setAppointmentFor(appointmentFor);
    navigate(`/booking/${state.dentistId}/step-2`);
  };

  const [showEmergency, setShowEmergency] = useState(false);

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
              onClick={() => navigate(`/dentist/${state.dentistId}`)}
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
