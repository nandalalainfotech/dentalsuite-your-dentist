import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../hooks/booking/useBookingContext";
import { useBookingDataLoader } from "../../hooks/booking/useBookingDataLoader";
import BookingSidebar from "./BookingSidebar";
import BookingModal from "./BookingModal";

const BookingStep6: React.FC = () => {
  const navigate = useNavigate();
  const { state, resetBooking } = useBooking();
  const { loading, hasData } = useBookingDataLoader();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleConfirm = () => {
    // Here you would typically make an API call to save the booking
    // Navigate to success page first, then reset booking
    navigate("/booking/success");
    // Reset booking after navigation
    setTimeout(() => {
      resetBooking();
    }, 100);
  };

  const handleBack = () => {
    navigate(`/booking/${state.dentistId}/step-4`);
  };

  const handleEditStep = (stepNumber: number) => {
    navigate(`/booking/${state.dentistId}/step-${stepNumber}`);
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
      <BookingSidebar currentStep={5} onOpenBookingModal={() => setShowBookingModal(true)} />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-10 lg:p-16 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
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
            <div className="max-w-4xl mx-auto animate__animated animate__slideInUp animate__faster">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <p className="text-gray-500">
                    Please review your appointment details before confirming.
                  </p>
                </div>

                {/* Appointment Summary Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Appointment Details
                  </h2>

                  <div className="space-y-4">
                    {/* Dentist & Clinic Info */}
                    {state.dentist && state.clinic && (
                      <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                        <img
                          src={state.dentist.image}
                          alt={state.dentist.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {state.dentist.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {state.dentist.qualification}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {state.clinic.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {state.clinic.address}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Date</p>
                        <p className="font-medium text-gray-900">
                          {state.selectedDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Time</p>
                        <p className="font-medium text-gray-900">
                          {state.selectedTime}
                        </p>
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="pb-4 border-b border-gray-100">
                      <p className="text-sm text-gray-500 mb-1">Service</p>
                      <p className="font-medium text-gray-900">
                        {state.selectedService}
                      </p>
                    </div>

                    {/* Patient Info */}
                    {state.personalDetails && (
                      <div className="pb-4 border-b border-gray-100">
                        <p className="text-sm text-gray-500 mb-2">
                          Patient Information
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Name: </span>
                            <span className="font-medium text-gray-900">
                              {state.personalDetails.firstName}{" "}
                              {state.personalDetails.lastName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Email: </span>
                            <span className="font-medium text-gray-900">
                              {state.personalDetails.email}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Phone: </span>
                            <span className="font-medium text-gray-900">
                              {state.personalDetails.phone}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">DOB: </span>
                            <span className="font-medium text-gray-900">
                              {state.personalDetails.dateOfBirth}
                            </span>
                          </div>
                        </div>
                        {state.personalDetails.reason && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-500 mb-1">
                              Additional Notes
                            </p>
                            <p className="text-sm text-gray-700">
                              {state.personalDetails.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Appointment Type */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Appointment Type
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                          {state.appointmentFor === "myself"
                            ? "Myself"
                            : "Someone else"}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700">
                          {state.patientStatus === "new"
                            ? "New Patient"
                            : "Existing Patient"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Options */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-3">
                    Need to make changes?
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => handleEditStep(1)}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium underline"
                    >
                      Edit Appointment Type
                    </button>
                    <button
                      onClick={() => handleEditStep(3)}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium underline"
                    >
                      Edit Service
                    </button>
                    <button
                      onClick={() => handleEditStep(4)}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium underline"
                    >
                      Edit Personal Details
                    </button>
                  </div>
                </div>

                {/* Important Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Important Information
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Please arrive 10 minutes early for your appointment</li>
                    <li>
                      • Bring your ID and insurance information if applicable
                    </li>
                    <li>
                      • Cancellations must be made at least 24 hours in advance
                    </li>
                    <li>• You will receive a confirmation email shortly</li>
                  </ul>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirm}
                  className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors focus:outline-none"
                >
                  Confirm Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {state.clinic && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          clinic={state.clinic}
          selectedDentistId={state.dentistId || undefined}
        />
      )}
    </div>
  );
};

export default BookingStep6;
