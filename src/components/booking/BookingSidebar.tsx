import React, { useEffect } from "react";
import { useBooking } from "../../contexts/BookingContext";

interface BookingSidebarProps {
    currentStep?: number;
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({ currentStep = 1 }) => {
    const { state } = useBooking();

    const steps = [
        { number: 1, title: "Date & Time", description: "Schedule appointment" },
        { number: 2, title: "Appointment Type", description: "Who & what service" },
        { number: 3, title: "Patient Details", description: "Personal information" },
        { number: 4, title: "Confirmation", description: "Review & confirm" }
    ];

    useEffect(() => {
        console.log("vishwa==============>",);
    });

    return (
        <aside className="w-full lg:w-80 bg-white p-6 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col">
            {/* Dentist Info */}
            {state.dentist && state.clinic && (
                <div className="text-center mb-6">
                    <img
                        src={state.dentist.image}
                        alt={state.dentist.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-gray-100 shadow-sm"
                    />
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{state.dentist.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">{state.dentist.qualification}</p>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Clinic</p>
                        <p className="font-semibold text-gray-900 text-sm">{state.clinic.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{state.clinic.address}</p>
                    </div>
                </div>
            )}

            {/* Progress Steps */}
            <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Booking Progress</p>
                <div className="space-y-3">
                    {steps.map((step) => {
                        const isCompleted = step.number < currentStep;
                        const isCurrent = step.number === currentStep;

                        return (
                            <div
                                key={step.number}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isCurrent
                                    ? 'bg-teal-50 border border-teal-200'
                                    : isCompleted
                                        ? 'bg-green-50 border border-green-100'
                                        : 'bg-gray-50 border border-gray-100'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${isCompleted
                                    ? 'bg-green-600 text-white'
                                    : isCurrent
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-gray-300 text-gray-600'
                                    }`}>
                                    {isCompleted ? '✓' : step.number}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-gray-500">{step.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Selection Summary
            {(state.appointmentFor || state.patientStatus || state.selectedService || state.selectedDate) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Your Selection</p>
                    <ul className="space-y-3 text-sm">
                        {state.appointmentFor && (
                            <li className="flex items-center gap-2 text-gray-700">
                                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                For: <span className="font-medium">{state.appointmentFor === "myself" ? "Myself" : "Someone else"}</span>
                            </li>
                        )}
                        {state.patientStatus && (
                            <li className="flex items-center gap-2 text-gray-700">
                                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                Status: <span className="font-medium">{state.patientStatus === "new" ? "New Patient" : "Existing"}</span>
                            </li>
                        )}
                        {state.selectedService && (
                            <li className="flex items-center gap-2 text-gray-700">
                                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                Service: <span className="font-medium">{state.selectedService}</span>
                            </li>
                        )}
                        {state.selectedDate && (
                            <li className="flex items-center gap-2 text-gray-700">
                                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                Date: <span className="font-medium">{state.selectedDate}</span>
                            </li>
                        )}
                        {state.selectedTime && (
                            <li className="flex items-center gap-2 text-gray-700">
                                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                Time: <span className="font-medium">{state.selectedTime}</span>
                            </li>
                        )}
                    </ul>
                </div>
            )} */}
        </aside>
    );
};

export default BookingSidebar;