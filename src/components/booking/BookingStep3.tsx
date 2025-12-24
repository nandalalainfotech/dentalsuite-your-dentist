import React from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../contexts/BookingContext";
import BookingSidebar from "./BookingSidebar";

const BookingStep3: React.FC = () => {
  const navigate = useNavigate();
  const { state, setSelectedService } = useBooking();
  const appointmentTypes = state.dentist?.specialities ?? [];

  const handleServiceSelect = (service: string) => {
    setSelectedService(service);
    navigate(`/booking/${state.dentistId}/step-4`);
  };

  const handleBack = () => {
    navigate(`/booking/${state.dentistId}/step-2`);
  };

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
          </nav>

          <div className="space-y-10 animate-in slide-in-from-top-4 duration-300">
            <section className="pb-10">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                What type of appointment does the patient need?
              </h2>

              {appointmentTypes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[4px]">
                  {appointmentTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleServiceSelect(type)}
                      className="p-4 rounded-xl border-2 text-left text-sm font-semibold text-gray-700 group border-gray-200 hover:border-orange-500 hover:bg-white/80 hover:text-gray-800 transition-colors focus:outline-none focus:bg-white/80 min-h-[60px]"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No appointment types available for this dentist.
                </p>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingStep3;
