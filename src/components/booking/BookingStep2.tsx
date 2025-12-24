import React from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../contexts/BookingContext";
import BookingSidebar from "./BookingSidebar";

const BookingStep2: React.FC = () => {
  const navigate = useNavigate();
  const { state, setPatientStatus } = useBooking();

  const handleStatusSelection = (status: "new" | "existing") => {
    setPatientStatus(status);
    navigate(`/booking/${state.dentistId}/step-3`);
  };

  const handleBack = () => {
    navigate(`/booking/${state.dentistId}/step-1`);
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
            <section>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                {state.appointmentFor === "myself"
                  ? `Have you attended ${
                      state.clinic?.name ?? "this clinic"
                    } before?`
                  : `Has the patient attended ${
                      state.clinic?.name ?? "this clinic"
                    } before?`}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleStatusSelection("new")}
                  className="p-5 md:p-6 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 group border-gray-200 hover:border-orange-500 hover:bg-white/80"
                >
                  {" "}
                  <span className="block font-semibold text-gray-900">
                    {state.appointmentFor === "myself"
                      ? "No, I'm new to this practice"
                      : "No, they're new to this practice"}
                  </span>
                </button>
                <button
                  onClick={() => handleStatusSelection("existing")}
                  className="p-5 md:p-6 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 group border-gray-200 hover:border-orange-500 hover:bg-white/80"
                >
                  <span className="block font-semibold text-gray-900">
                    {state.appointmentFor === "myself"
                      ? "Yes, I'm an existing patient"
                      : "Yes, they're an existing patient"}
                  </span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingStep2;
