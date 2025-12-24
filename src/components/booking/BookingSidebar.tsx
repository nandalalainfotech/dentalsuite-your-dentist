import React from "react";
import { useBooking } from "../../contexts/BookingContext";

interface BookingSidebarProps {
  currentStep?: number;
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({ currentStep = 1 }) => {
  const { state } = useBooking();

  const steps = [
    { number: 1, title: "Date & Time", description: "Schedule appointment" },
    { number: 2, title: "Appointment Type", description: "Who & what service" },
    {
      number: 3,
      title: "Patient Details",
      description: "Personal information",
    },
    { number: 4, title: "Confirmation", description: "Review & confirm" },
  ];

  return (
    <aside className="w-full lg:w-96 bg-gray-100 p-6 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col overflow-visible">
      <div className="sticky top-23">
        {/*  Dentist Info Card */}
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
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isCompleted
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
                      className={`text-sm font-semibold flex items-center gap-2 ${
                        isCompleted
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
  );
};

export default BookingSidebar;
