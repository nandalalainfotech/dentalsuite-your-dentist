import React from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../contexts/BookingContext";
import BookingSidebar from "../../components/booking/BookingSidebar";

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
            <main className="flex-1 bg-white p-4 md:p-10 lg:p-16 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    {/* Top Navigation */}
                    <nav className="flex justify-between items-center mb-10">
                        <button 
                            onClick={handleBack}
                            className="text-gray-500 hover:text-gray-800 text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5m7 7l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    </nav>

                    <div className="space-y-10 animate-in slide-in-from-top-4 duration-300">
                        <section>
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                                {state.appointmentFor === "myself"
                                    ? "Have you attended Melbourne Dentistry before?"
                                    : "Has the patient attended Melbourne Dentistry before?"}
                            </h2>

                            <div className="flex flex-col md:flex-row shadow-sm rounded-lg overflow-hidden">
                                <button
                                    onClick={() => handleStatusSelection("new")}
                                    className="flex-1 py-4 px-4 md:px-6 text-sm font-semibold border transition-all bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                >
                                    {state.appointmentFor === "myself" 
                                        ? "No, I'm new to this practice" 
                                        : "No, they're new to this practice"}
                                </button>
                                <button
                                    onClick={() => handleStatusSelection("existing")}
                                    className="flex-1 py-4 px-4 md:px-6 text-sm font-semibold border-t border-b border-r border-l md:border-l-0 transition-all bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                >
                                    {state.appointmentFor === "myself" 
                                        ? "Yes, I'm an existing patient" 
                                        : "Yes, they're an existing patient"}
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