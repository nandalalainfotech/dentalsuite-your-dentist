import React from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../contexts/BookingContext";
import BookingSidebar from "../../components/booking/BookingSidebar";

const BookingStep1: React.FC = () => {
    const navigate = useNavigate();
    const { state, setAppointmentFor } = useBooking();

    const handleSelection = (appointmentFor: "myself" | "someone-else") => {
        setAppointmentFor(appointmentFor);
        navigate(`/booking/${state.dentistId}/step-2`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* Left Sidebar */}
            <BookingSidebar currentStep={2} />

            {/* Main Content */}
            <main className="flex-1 bg-white p-4 md:p-10 lg:p-16 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    {/* Top Navigation */}
                    <nav className="flex justify-between items-center mb-10">
                        <button 
                            onClick={() => navigate(`/dentist/${state.dentistId}`)}
                            className="text-gray-500 hover:text-gray-800 text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5m7 7l-7-7 7-7" />
                            </svg>
                            Back to Profile
                        </button>
                    </nav>

                    <div className="space-y-10 animate-in fade-in duration-500">
                        <section>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                                Who is this appointment for?
                            </h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleSelection("myself")}
                                    className="p-5 md:p-6 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 group border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                                >
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors border-gray-300 group-hover:border-teal-400">
                                    </span>
                                    <div>
                                        <span className="block font-bold text-gray-900">Myself</span>
                                        <span className="text-xs text-gray-500">I am the patient</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleSelection("someone-else")}
                                    className="p-5 md:p-6 rounded-xl border-2 text-left flex items-center gap-4 transition-all duration-200 group border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                                >
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors border-gray-300 group-hover:border-teal-400">
                                    </span>
                                    <div>
                                        <span className="block font-bold text-gray-900">Someone else</span>
                                        <span className="text-xs text-gray-500">Booking for another</span>
                                    </div>
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookingStep1;