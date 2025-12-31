import React, { useState, useRef, useEffect } from "react";
import { useBooking } from "../../hooks/booking/useBookingContext";

interface BookingSidebarProps {
  currentStep?: number;
  onOpenBookingModal?: () => void;
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({ currentStep = 1, onOpenBookingModal }) => {
  const { state } = useBooking();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const mobileSidebarRef = useRef<HTMLDivElement>(null);

  const steps = [
    { number: 1, title: "Date & Time", description: "Schedule appointment" },
    { number: 2, title: "Patient Type", description: "New & Existing" },
    { number: 3, title: "Appointment Type", description: "Service type" },
    {
      number: 4,
      title: "Patient Details",
      description: "Personal information",
    },
    { number: 5, title: "Confirmation", description: "Review & confirm" },
  ];

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileSidebarRef.current &&
        !mobileSidebarRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.mobile-toggle-btn')
      ) {
        setIsMobileSidebarOpen(false);
      }
    };

    if (isMobileSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileSidebarOpen]);

  // Close mobile sidebar when step changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [currentStep]);

  return (
    <>
      {/* Desktop Sidebar (always rendered, hidden on mobile) */}
      <aside className="hidden lg:flex w-full lg:w-96 bg-gray-100 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 flex-col overflow-visible">
        <div className="sticky top-23">
          {/* Dentist Info Card */}
          {state.dentist && state.clinic && (
            <div className="relative mb-10 flex justify-center mt-10">
              {/* Card */}
              <div className="w-full max-w-sm bg-white shadow-md px-6 pt-16 pb-6 text-center border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {state.dentist.name}
                </h2>

                <p className="text-sm text-gray-700 mb-1">
                  at{" "}
                  <span className="font-semibold text-gray-800">
                    {state.clinic.name}
                  </span>
                </p>

                {state.selectedDate && state.selectedTime && (
                  <p className="text-sm text-gray-800">
                    on{" "}
                    <span className="font-semibold">
                      {new Date(state.selectedDate).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>{" "}
                    at <span className="font-semibold">{state.selectedTime}</span>
                  </p>
                )}
              </div>

              {/* Floating Avatar */}
              <div className="absolute -top-12 left-3/4 -translate-x-3/4">
                <img
                  src={state.dentist.image}
                  alt={state.dentist.name}
                  className="w-25 h-24 rounded-full object-cover border-2 border-gray-100 shadow-lg"
                />
              </div>
            </div>
          )}

          {/* Change Appointment Button */}
          {currentStep >= 1 && state.clinic && onOpenBookingModal && (
            <div className="border-t border-gray-200 mb-8 flex justify-center">
              <button
                onClick={onOpenBookingModal}
                className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Change Appointment
              </button>
            </div>
          )}

          {/* Progress Steps – Vertical */}
          <div className="w-full">
            <div className="relative space-y-6">
              {steps.map((step, index) => {
                const isCompleted = step.number < currentStep;
                const isCurrent = step.number === currentStep;

                return (
                  <div
                    key={step.number}
                    className="relative flex items-start gap-4"
                  >
                    {/* Left: Dot + Line */}
                    <div className="flex flex-col items-center">
                      {/* Circle */}
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isCompleted
                          ? "bg-gray-700 border-gray-700"
                          : isCurrent
                            ? "bg-white border-gray-700"
                            : "bg-gray-300 border-gray-300"
                          }`}
                      />

                      {/* Vertical line (except last) */}
                      {index !== steps.length - 1 && (
                        <div className="w-[2px] h-8 bg-gray-200 mt-1" />
                      )}
                    </div>

                    {/* Right: Text */}
                    <div>
                      <p
                        className={`text-sm font-semibold flex items-center gap-2 ${isCompleted
                          ? "text-orange-600"
                          : isCurrent
                            ? "text-gray-900"
                            : "text-gray-400"
                          }`}
                      >
                        {step.title}
                        {isCompleted && (
                          <span className="text-gray-700 text-sm">✓</span>
                        )}
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button (only visible on mobile) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="mobile-toggle-btn bg-gray-800 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-900 transition-colors"
          aria-label="Open booking details"
        >
          <i className="bi bi-info-lg text-xl"></i>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        ref={mobileSidebarRef}
        className={`lg:hidden fixed inset-y-0 left-0 w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <i className="bi bi-arrow-left text-lg"></i>
              <span className="font-medium">Back</span>
            </button>
            <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="bi bi-x-lg text-xl"></i>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Dentist Info Card - Mobile Version */}
            {state.dentist && state.clinic && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={state.dentist.image}
                    alt={state.dentist.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{state.dentist.name}</h3>
                    <p className="text-sm text-gray-600">at {state.clinic.name}</p>
                  </div>
                </div>
                
                {state.selectedDate && state.selectedTime && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-800 font-medium">
                      {new Date(state.selectedDate).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-gray-600">at {state.selectedTime}</p>
                  </div>
                )}
              </div>
            )}

            {/* Change Appointment Button */}
            {currentStep >= 1 && state.clinic && onOpenBookingModal && (
              <div className="mb-8">
                <button
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    onOpenBookingModal();
                  }}
                  className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Change Appointment
                </button>
              </div>
            )}

            {/* Progress Steps */}
            <div className="space-y-6">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Booking Steps
              </h4>
              {steps.map((step) => {
                const isCompleted = step.number < currentStep;
                const isCurrent = step.number === currentStep;

                return (
                  <div key={step.number} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${isCompleted
                        ? "bg-gray-700 border-gray-700 text-white"
                        : isCurrent
                          ? "bg-white border-gray-700 text-gray-700"
                          : "bg-gray-100 border-gray-300 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <i className="bi bi-check-lg text-sm"></i>
                      ) : (
                        <span className="font-semibold">{step.number}</span>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${isCompleted
                        ? "text-gray-900"
                        : isCurrent
                          ? "text-gray-900 font-semibold"
                          : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingSidebar;