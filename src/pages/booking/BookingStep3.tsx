import React from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../../contexts/BookingContext";
import BookingSidebar from "../../components/booking/BookingSidebar";

const APPOINTMENT_TYPES = [
    "Consultation",
    "Emergency",
    "Check-up and Airflow Clean",
    "Wisdom Tooth Problems",
    "Root Canal Consultation",
    "Invisalign",
    "Oral Cancer Screening",
    "Tooth Recontouring / Veneers",
    "Halitosis/Mouth Odour",
    "Dental implant Consultation",
    "Gum Problems/ Sensitivity",
    "Sports Mouth Guard",
    "Not Sure / Other"
];

const BookingStep3: React.FC = () => {
    const navigate = useNavigate();
    const { state, setSelectedService } = useBooking();

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
            <main className="flex-1 bg-white p-4 md:p-10 lg:p-16 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
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
                        <section className="pb-10">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">
                                What type of appointment does the patient need?
                            </h2>

                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-200">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px]">
                                    {APPOINTMENT_TYPES.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => handleServiceSelect(type)}
                                            className="bg-white p-4 text-left text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-800 transition-colors focus:outline-none focus:bg-teal-50 min-h-[60px]"
                                        >
                                            {type}
                                        </button>
                                    ))}
                                    {APPOINTMENT_TYPES.length % 3 !== 0 && (
                                        Array.from({ length: 3 - (APPOINTMENT_TYPES.length % 3) }).map((_, index) => (
                                            <div key={`filler-${index}`} className="bg-white hidden sm:block"></div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BookingStep3;